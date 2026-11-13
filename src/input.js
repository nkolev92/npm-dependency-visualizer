import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { InputError } from './errors.js'

const dependencyFields = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
]

const has = (object, key) => Object.hasOwn(object, key)
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0

function requireObject(value, label) {
  if (!isObject(value)) {
    throw new InputError(`${label} must be an object`)
  }
}

function validateRecord(record, label) {
  requireObject(record, label)

  for (const field of ['name', 'version']) {
    if (has(record, field) && typeof record[field] !== 'string') {
      throw new InputError(`${label}.${field} must be a string`)
    }
  }

  if (has(record, 'link') && typeof record.link !== 'boolean') {
    throw new InputError(`${label}.link must be a boolean`)
  }

  for (const field of dependencyFields) {
    if (!has(record, field)) continue
    requireObject(record[field], `${label}.${field}`)
    for (const [name, spec] of Object.entries(record[field])) {
      if (!name || typeof spec !== 'string') {
        throw new InputError(`${label}.${field} must map nonempty names to string specifications`)
      }
    }
  }

  if (has(record, 'peerDependenciesMeta')) {
    requireObject(record.peerDependenciesMeta, `${label}.peerDependenciesMeta`)
    for (const [name, meta] of Object.entries(record.peerDependenciesMeta)) {
      requireObject(meta, `${label}.peerDependenciesMeta[${JSON.stringify(name)}]`)
      if (has(meta, 'optional') && typeof meta.optional !== 'boolean') {
        throw new InputError(`${label}.peerDependenciesMeta[${JSON.stringify(name)}].optional must be a boolean`)
      }
    }
  }
}

function effectiveDependencies(record) {
  const optional = record.optionalDependencies ?? {}
  return Object.fromEntries(
    Object.entries(record.dependencies ?? {}).filter(([name]) => !has(optional, name)),
  )
}

function compareRootDeclarations(manifest, lockedRoot) {
  const fields = [...dependencyFields, 'peerDependenciesMeta']
  const differences = []

  for (const field of fields) {
    const actual = field === 'dependencies' ? effectiveDependencies(manifest) : manifest[field] ?? {}
    const locked = field === 'dependencies' ? effectiveDependencies(lockedRoot) : lockedRoot[field] ?? {}
    const names = [...new Set([...Object.keys(actual), ...Object.keys(locked)])].sort(compare)

    for (const name of names) {
      if (!has(actual, name) || !has(locked, name) || !isDeepStrictEqual(actual[name], locked[name])) {
        const describe = (map) => has(map, name) ? JSON.stringify(map[name]) : '(absent)'
        differences.push(
          `${field}[${JSON.stringify(name)}]: package.json ${describe(actual)}, package-lock.json ${describe(locked)}`,
        )
      }
    }
  }

  if (differences.length) {
    throw new InputError(`Root dependency declarations differ:\n${differences.join('\n')}`)
  }
}

export function validateInputs(manifest, lockfile) {
  validateRecord(manifest, 'package.json')
  requireObject(lockfile, 'package-lock.json')

  if (lockfile.lockfileVersion !== 2 && lockfile.lockfileVersion !== 3) {
    throw new InputError(
      `Unsupported lockfileVersion ${JSON.stringify(lockfile.lockfileVersion) ?? '(missing)'}; use a version 2 or 3 package-lock.json`,
    )
  }

  requireObject(lockfile.packages, 'package-lock.json.packages')
  if (!has(lockfile.packages, '')) {
    throw new InputError('package-lock.json.packages must contain the root entry ""')
  }

  for (const [location, record] of Object.entries(lockfile.packages)) {
    validateRecord(record, `package-lock.json.packages[${JSON.stringify(location)}]`)
  }

  if (has(manifest, 'overrides')) requireObject(manifest.overrides, 'package.json.overrides')
  compareRootDeclarations(manifest, lockfile.packages[''])
  return { manifest, lockfile, root: lockfile.packages[''] }
}

async function readJson(path, filename) {
  let contents
  try {
    contents = await readFile(path, 'utf8')
  } catch (error) {
    throw new InputError(`Cannot read ${filename}: ${error.message}`)
  }

  try {
    return JSON.parse(contents)
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error
    throw new InputError(`Cannot parse ${filename}: ${error.message}`)
  }
}

export async function readInputs(directory) {
  const inputPaths = [join(directory, 'package.json'), join(directory, 'package-lock.json')]
  const [manifest, lockfile] = await Promise.all([
    readJson(inputPaths[0], 'package.json'),
    readJson(inputPaths[1], 'package-lock.json'),
  ])
  return { ...validateInputs(manifest, lockfile), inputPaths }
}
