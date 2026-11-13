import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { copyFile, link, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { complexDirectory, npmCliDirectory } from '../test-support/fixtures.js'

const cli = fileURLToPath(new URL('../cli.js', import.meta.url))
const offlineGuard = fileURLToPath(new URL('../test-support/offline-guard.js', import.meta.url))

function run(args, options = {}) {
  const nodeArgs = options.offline ? ['--import', pathToFileURL(offlineGuard).href, cli, ...args] : [cli, ...args]
  return spawnSync(process.execPath, nodeArgs, {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    cwd: options.cwd,
    env: options.env ?? process.env,
  })
}

async function temporaryDirectory(t) {
  const directory = await mkdtemp(join(tmpdir(), 'npm-dependency-visualizer-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  return directory
}

async function copyInputs(from, to) {
  for (const filename of ['package.json', 'package-lock.json']) {
    await copyFile(join(from, filename), join(to, filename))
  }
}

async function writeInputs(directory, manifest, packages = {}, version = 3) {
  const root = structuredClone(manifest)
  delete root.overrides
  await writeFile(join(directory, 'package.json'), JSON.stringify(manifest))
  await writeFile(join(directory, 'package-lock.json'), JSON.stringify({
    lockfileVersion: version,
    packages: { '': root, ...packages },
  }))
}

function reverseKeys(value) {
  if (Array.isArray(value)) return value.map(reverseKeys)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value).reverse().map(([key, child]) => [key, reverseKeys(child)]))
}

test('default CLI emits Markdown to stdout and diagnostics separately', () => {
  const result = run([complexDirectory])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /^# Dependency graph: sample-project\n/)
  assert.match(result.stdout, /Displayed: 16 nodes, 20 relationships/)
  assert.match(result.stdout, /```mermaid\n/)
  assert.match(result.stderr, /warning \[optional-not-recorded\]/)
  assert.match(result.stderr, /warning \[overrides-present\]/)
  assert.doesNotMatch(result.stdout, /warning \[optional-not-recorded\]/)
  assert.equal(result.stdout.includes('\r'), false)
  assert.equal(result.stdout.endsWith('\n'), true)
})

test('output is always Markdown, including development roles', () => {
  const markdown = run([complexDirectory, '--include-dev', '--focus', 'shared'])
  assert.equal(markdown.status, 0)
  assert.match(markdown.stdout, /^# Dependency graph:/)
  assert.match(markdown.stdout, /Filters: focus shared/)
  assert.match(markdown.stdout, /```mermaid\nflowchart LR\n/)
  const removed = run([complexDirectory, '--format', 'mermaid'])
  assert.equal(removed.status, 1)
  assert.equal(removed.stdout, '')
  assert.match(removed.stderr, /format/)

  const full = run([complexDirectory, '--include-dev'])
  assert.match(full.stdout, /Displayed: 18 nodes, 23 relationships/)
  assert.match(full.stdout, /dev: both @ \^1\.0\.0/)
})

test('equivalent JSON key orders produce byte-identical output', async t => {
  const directory = await temporaryDirectory(t)
  for (const filename of ['package.json', 'package-lock.json']) {
    const original = JSON.parse(await readFile(join(complexDirectory, filename), 'utf8'))
    await writeFile(join(directory, filename), JSON.stringify(reverseKeys(original), null, 2))
  }
  const original = run([complexDirectory])
  const reordered = run([directory])
  const repeated = run([directory])
  assert.equal(original.status, 0)
  assert.equal(reordered.status, 0)
  assert.equal(original.stdout, reordered.stdout)
  assert.equal(reordered.stdout, repeated.stdout)
  assert.equal(original.stderr, reordered.stderr)
  for (const mode of ['highlight', 'filter']) {
    const args = ['--focus', 'shared', '--focus-mode', mode]
    assert.equal(run([complexDirectory, ...args]).stdout, run([directory, ...args]).stdout)
  }
})

test('npm/cli focus preserves the whole graph unless filter mode or depth is requested', () => {
  const full = run([npmCliDirectory])
  assert.equal(full.status, 0)
  assert.match(full.stdout, /Displayed: 149 nodes, 359 relationships/)
  assert.match(full.stdout, /Omitted by filters: 0 nodes, 0 relationships/)
  assert.match(full.stdout, /Workspaces: included; reached 12 of 16 workspace projects\./)
  assert.match(full.stdout, /\[\["@npmcli\/arborist@10\.0\.4 \(workspace\)"\]\]/)
  assert.doesNotMatch(full.stderr, /workspace-excluded/)

  const excluded = run([npmCliDirectory, '--no-workspaces'])
  assert.equal(excluded.status, 0)
  assert.match(excluded.stdout, /Displayed: 125 nodes, 255 relationships/)
  assert.match(excluded.stderr, /workspace-excluded/)
  assert.match(excluded.stderr, /@npmcli\/arborist/)

  const arborist = run([npmCliDirectory, '--workspace', '@npmcli/arborist'])
  assert.equal(arborist.status, 0)
  assert.match(arborist.stdout, /# Dependency graph: &#64;npmcli\/arborist/)
  assert.match(arborist.stdout, /Start node: workspace &#64;npmcli\/arborist at workspaces\/arborist\./)
  assert.equal(run([npmCliDirectory, '--workspace', 'nope']).status, 1)
  assert.equal(run([npmCliDirectory, '--workspace', 'docs', '--no-workspaces']).status, 1)
  assert.doesNotMatch(full.stdout, /[A-Za-z]:[\\/]/)

  const focused = run([npmCliDirectory, '--focus', 'glob'])
  assert.equal(focused.status, 0)
  assert.match(focused.stdout, /Displayed: 149 nodes, 359 relationships/)
  assert.match(focused.stdout, /Omitted by filters: 0 nodes, 0 relationships/)
  assert.match(focused.stdout, /Focus mode: highlight; matching instances: 1/)
  assert.match(focused.stdout, /glob@13\.0\.6/)
  assert.match(focused.stdout, /class n\d+ focusMatch/)
  assert.match(focused.stdout, /linkStyle [\d,]+ stroke:/)
  assert.equal(run([npmCliDirectory, '--focus', 'glob', '--focus-mode', 'highlight']).stdout, focused.stdout)

  const limited = run([npmCliDirectory, '--focus', 'glob', '--depth', '2'])
  assert.equal(limited.status, 0)
  assert.match(limited.stdout, /Filters: focus glob; depth 2/)
  assert.match(limited.stdout, /Omitted by filters: [1-9]\d* nodes/)

  const filtered = run([npmCliDirectory, '--focus', 'glob', '--focus-mode', 'filter', '--depth', '2'])
  assert.equal(filtered.status, 0)
  assert.match(filtered.stdout, /Focus mode: filter/)
  assert.match(filtered.stdout, /Displayed: 26 nodes, 68 relationships/)
  const filteredWithoutWorkspaces = run([npmCliDirectory, '--no-workspaces', '--focus', 'glob', '--focus-mode', 'filter', '--depth', '2'])
  assert.match(filteredWithoutWorkspaces.stdout, /Displayed: 14 nodes, 29 relationships/)
})

test('invalid arguments, malformed input, unsupported versions, and unmatched focus fail without a report', async t => {
  for (const args of [
    [complexDirectory, '--depth', '-1'],
    [complexDirectory, '--depth', '1.5'],
    [complexDirectory, '--focus', 'not-here'],
    [complexDirectory, '--focus', 'shared', '--focus-mode', 'invalid'],
    [complexDirectory, '--focus', 'shared', '--focus-mode', ''],
    [complexDirectory, '--focus-mode', 'filter'],
    [complexDirectory, '--focus-mode', 'highlight'],
    [complexDirectory, '--unknown'],
  ]) {
    const result = run(args)
    assert.equal(result.status, 1, args.join(' '))
    assert.equal(result.stdout, '')
    assert.match(result.stderr, /error:/)
  }

  const directory = await temporaryDirectory(t)
  let result = run([directory])
  assert.equal(result.status, 1)
  assert.equal(result.stdout, '')
  assert.match(result.stderr, /Cannot read package/)

  await writeFile(join(directory, 'package.json'), '{')
  await writeFile(join(directory, 'package-lock.json'), '{}')
  result = run([directory])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Cannot parse package\.json/)

  await writeInputs(directory, { name: 'empty', version: '1' }, {}, 1)
  result = run([directory])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Unsupported lockfileVersion 1/)

  await writeInputs(directory, { name: 'empty', version: '1', dependencies: { dep: '^1' } })
  const lockfile = JSON.parse(await readFile(join(directory, 'package-lock.json'), 'utf8'))
  lockfile.packages[''].dependencies.dep = '^2'
  await writeFile(join(directory, 'package-lock.json'), JSON.stringify(lockfile))
  result = run([directory])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /dependencies\["dep"\]/)
})

test('dependency-free projects generate a root-only graph', async t => {
  const directory = await temporaryDirectory(t)
  await writeInputs(directory, { name: 'empty', version: '1.0.0' })
  const result = run([directory])
  assert.equal(result.status, 0)
  assert.equal(result.stderr, '')
  assert.match(result.stdout, /Displayed: 1 nodes, 0 relationships/)
  assert.match(result.stdout, /empty@1\.0\.0/)
})

test('offline execution ignores node_modules and leaves inputs and npm cache unchanged', async t => {
  const directory = await temporaryDirectory(t)
  await copyInputs(complexDirectory, directory)
  const files = ['package.json', 'package-lock.json']
  const before = await Promise.all(files.map(name => readFile(join(directory, name))))
  const cache = join(directory, 'isolated-cache')
  const env = { ...process.env, npm_config_cache: cache }
  const baseline = run([directory], { env, offline: true })
  assert.equal(baseline.status, 0, baseline.stderr)

  await mkdir(join(directory, 'node_modules', 'unrelated'), { recursive: true })
  await writeFile(join(directory, 'node_modules', 'unrelated', 'package.json'), '{"name":"unrelated"}')
  await mkdir(join(directory, 'unrelated-workspace'))
  await writeFile(join(directory, 'unrelated-workspace', 'package.json'), '{"name":"workspace"}')
  const withLocalFiles = run([directory], { env, offline: true })
  assert.equal(withLocalFiles.status, 0, withLocalFiles.stderr)
  assert.equal(withLocalFiles.stdout, baseline.stdout)
  assert.equal(withLocalFiles.stderr, baseline.stderr)
  for (let index = 0; index < files.length; index++) {
    assert.deepEqual(await readFile(join(directory, files[index])), before[index])
  }
  assert.equal((await readdir(directory)).includes('isolated-cache'), false)
})

test('output replacement protects inputs, hard links, existing files, and temporary files', async t => {
  const directory = await temporaryDirectory(t)
  await copyInputs(complexDirectory, directory)
  const manifestPath = join(directory, 'package.json')
  const lockfilePath = join(directory, 'package-lock.json')
  const manifestBefore = await readFile(manifestPath)
  const lockfileBefore = await readFile(lockfilePath)
  const output = join(directory, 'report.md')
  await writeFile(output, 'prior report')

  let result = run([directory, '--output', output, '--focus', 'not-here'])
  assert.equal(result.status, 1)
  assert.equal(await readFile(output, 'utf8'), 'prior report')

  for (const input of [manifestPath, lockfilePath]) {
    result = run([directory, '--output', input])
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Output must not overwrite/)
  }
  const alias = join(directory, 'hardlink.json')
  await link(manifestPath, alias)
  result = run([directory, '--output', alias])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Output must not overwrite/)
  assert.deepEqual(await readFile(manifestPath), manifestBefore)
  assert.deepEqual(await readFile(lockfilePath), lockfileBefore)

  const outputDirectory = join(directory, 'output-directory')
  await mkdir(outputDirectory)
  result = run([directory, '--output', outputDirectory])
  assert.equal(result.status, 1)
  assert.deepEqual(await readdir(outputDirectory), [])
  assert.equal((await readdir(directory)).some(name => name.startsWith('.output-directory.') && name.endsWith('.tmp')), false)

  result = run([directory, '--output', output])
  assert.equal(result.status, 0)
  assert.equal(result.stdout, '')
  assert.match(await readFile(output, 'utf8'), /^# Dependency graph: sample-project/)
  assert.deepEqual(await readFile(manifestPath), manifestBefore)
  assert.deepEqual(await readFile(lockfilePath), lockfileBefore)
})

test('output paths resolving through a symlink cannot overwrite an input', async t => {
  const directory = await temporaryDirectory(t)
  await copyInputs(complexDirectory, directory)
  const manifest = join(directory, 'package.json')
  const alias = join(directory, 'alias.json')
  try {
    await symlink(manifest, alias, 'file')
  } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EACCES' || error.code === 'ENOTSUP') {
      t.skip(`File symlinks are unavailable: ${error.code}`)
      return
    }
    throw error
  }
  const before = await readFile(manifest)
  const result = run([directory, '--output', alias])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Output must not overwrite/)
  assert.deepEqual(await readFile(manifest), before)
})

test('diagnostic reports replace output files and retain errors outside the filtered view', async t => {
  const directory = await temporaryDirectory(t)
  await writeInputs(directory, { name: 'broken', version: '1', dependencies: { missing: '^1' } })
  const output = join(directory, 'report.md')
  await writeFile(output, 'old')
  const result = run([directory, '--depth', '0', '--output', output])
  assert.equal(result.status, 2)
  assert.equal(result.stdout, '')
  assert.match(result.stderr, /error \[dependency-unresolved\]/)
  const report = await readFile(output, 'utf8')
  assert.match(report, /Displayed: 1 nodes, 0 relationships/)
  assert.match(report, /dependency-unresolved/)
  assert.doesNotMatch(report, /^old$/)
})

test('a closed stdout pipe produces an output error and exit code 1', async () => {
  const child = spawn(process.execPath, [cli, npmCliDirectory, '--include-dev'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let stderr = ''
  child.stderr.setEncoding('utf8')
  child.stderr.on('data', chunk => { stderr += chunk })
  child.stdout.destroy()
  const status = await new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('close', resolve)
  })
  assert.equal(status, 1, stderr)
  assert.match(stderr, /error:.*(?:EPIPE|write)/i)
})

test('help and version work without project input files', async t => {
  const directory = await temporaryDirectory(t)
  const help = run(['--help'], { cwd: directory })
  assert.equal(help.status, 0)
  assert.match(help.stdout, /--focus <name>/)
  assert.match(help.stdout, /--focus-mode <mode>/)
  const version = run(['--version'], { cwd: directory })
  assert.equal(version.status, 0)
  assert.match(version.stdout, /^\d+\.\d+\.\d+\n$/)
})
