import { InputError } from './errors.js'

const has = (object, key) => Object.hasOwn(object, key)
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0

function parentScope(location) {
  const index = location.lastIndexOf('/node_modules/')
  return index < 0 ? '' : location.slice(0, index)
}

function candidate(scope, name) {
  return `${scope ? `${scope}/` : ''}node_modules/${name}`
}

function isProjectLocation(location) {
  return !location.startsWith('node_modules/') && !location.includes('/node_modules/')
}

function normalizeLocation(value) {
  return value.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, '')
}

function patternRegExp(pattern) {
  const segments = normalizeLocation(pattern).split('/')
  const source = segments.map((segment, index) => {
    const last = index === segments.length - 1
    if (segment === '**') return last ? '(?:[^/]+/)*[^/]+' : '(?:[^/]+/)*'
    const body = [...segment].map(character =>
      character === '*' ? '[^/]*' : character === '?' ? '[^/]' : character.replace(/[.+^${}()|[\]\\]/g, '\\$&')).join('')
    return last ? body : `${body}/`
  }).join('')
  return new RegExp(`^${source}$`)
}

export function workspacePatterns(manifest, root) {
  for (const source of [manifest, root]) {
    if (!has(source, 'workspaces')) continue
    const value = source.workspaces
    const patterns = Array.isArray(value) ? value : value?.packages
    return Array.isArray(patterns) ? patterns.filter(pattern => typeof pattern === 'string' && pattern !== '') : []
  }
  return null
}

function workspaceLocations(records, patterns) {
  const include = patterns.filter(pattern => !pattern.startsWith('!')).map(patternRegExp)
  const exclude = patterns.filter(pattern => pattern.startsWith('!')).map(pattern => patternRegExp(pattern.slice(1)))
  return new Set([...records.keys()].filter(location =>
    location !== '' &&
    isProjectLocation(location) &&
    include.some(expression => expression.test(location)) &&
    !exclude.some(expression => expression.test(location))))
}

function findTarget(records, requester, name, peer, isProject) {
  let scope = peer && !isProject(requester) ? parentScope(requester) : requester
  while (true) {
    const location = candidate(scope, name)
    if (records.has(location)) return location
    if (!scope) return null
    scope = parentScope(scope)
  }
}

function installationName(location) {
  const marker = '/node_modules/'
  const index = location.lastIndexOf(marker)
  return index < 0 ? location.slice('node_modules/'.length) : location.slice(index + marker.length)
}

function aliasName(spec) {
  if (!spec.startsWith('npm:')) return null
  const value = spec.slice(4)
  const match = /^(?:(@[^/@\s]+\/[^/@\s]+)|([^/@\s]+))(?:@[^@\s]+)?$/.exec(value)
  return match ? match[1] ?? match[2] : null
}

function declarations(record, includeDev) {
  const result = []
  const optional = record.optionalDependencies ?? {}

  for (const [name, spec] of Object.entries(record.dependencies ?? {})) {
    if (!has(optional, name)) result.push({ name, spec, role: 'prod', optional: false })
  }
  for (const [name, spec] of Object.entries(optional)) {
    result.push({ name, spec, role: 'optional', optional: true })
  }
  for (const [name, spec] of Object.entries(record.peerDependencies ?? {})) {
    result.push({
      name,
      spec,
      role: 'peer',
      optional: record.peerDependenciesMeta?.[name]?.optional === true,
    })
  }
  if (includeDev) {
    for (const [name, spec] of Object.entries(record.devDependencies ?? {})) {
      result.push({ name, spec, role: 'dev', optional: false })
    }
  }

  return result.sort((a, b) =>
    compare(a.name, b.name) || compare(a.role, b.role) || compare(a.spec, b.spec))
}

function missingKey(parent, name, role) {
  return `\0missing:${JSON.stringify([parent, name, role])}`
}

function makeDiagnostic(code, severity, message, location = '', name = '', role = '') {
  return { code, severity, message, location, name, role }
}

function locationLabel(location) {
  return location || '(root)'
}

export function buildGraph({ manifest, lockfile, root }, { includeDev = false, workspaces = true, workspace } = {}) {
  const records = new Map(Object.entries(lockfile.packages))
  const nodes = new Map()
  const edges = []
  const incoming = new Map()
  const outgoing = new Map()
  const diagnostics = []
  const excludedBoundaries = []
  const patterns = workspacePatterns(manifest, root)
  const workspaceSet = workspaces && patterns ? workspaceLocations(records, patterns) : new Set()
  const projectRecords = workspaces
    ? [...records.keys()].filter(location => location !== '' && isProjectLocation(location) && !workspaceSet.has(location))
    : [...records.keys()].filter(location => location !== '' && !location.startsWith('node_modules/'))
  const isProject = location => location === '' || workspaceSet.has(location)
  const workspaceTarget = location => {
    const record = records.get(location)
    if (record.link !== true || typeof record.resolved !== 'string') return null
    const resolved = normalizeLocation(record.resolved)
    return workspaceSet.has(resolved) ? resolved : null
  }
  const workspaceNames = new Map()
  for (const location of [...records.keys()].sort(compare)) {
    const target = workspaceTarget(location)
    if (target !== null && !workspaceNames.has(target)) workspaceNames.set(target, installationName(location))
  }
  const workspaceNode = location => {
    const record = records.get(location)
    const name = record.name || workspaceNames.get(location) || location
    return {
      key: location,
      kind: 'workspace',
      location,
      installationName: name,
      actualName: name,
      version: record.version || null,
    }
  }

  let startKey = ''
  if (workspace !== undefined) {
    if (!workspaces) throw new InputError('--workspace cannot be combined with --no-workspaces')
    const normalized = normalizeLocation(workspace)
    const matches = [...workspaceSet].filter(location =>
      location === normalized || workspaceNode(location).actualName === workspace).sort(compare)
    if (matches.length !== 1) {
      throw new InputError(matches.length
        ? `Workspace ${JSON.stringify(workspace)} is ambiguous: ${matches.join(', ')}`
        : `No workspace named ${JSON.stringify(workspace)}`)
    }
    startKey = matches[0]
  }

  const rootNode = startKey !== '' ? workspaceNode(startKey) : {
    key: '',
    kind: 'root',
    location: '',
    installationName: manifest.name || root.name || 'root project',
    actualName: manifest.name || root.name || 'root project',
    version: root.version || manifest.version || null,
  }

  nodes.set(startKey, rootNode)
  incoming.set(startKey, [])
  outgoing.set(startKey, [])

  if (workspaces) {
    if (projectRecords.length) {
      diagnostics.push(makeDiagnostic(
        'local-project-excluded',
        'warning',
        `${projectRecords.length} non-node_modules project records are not workspaces and are excluded.`,
      ))
    }
  } else if (patterns !== null) {
    diagnostics.push(makeDiagnostic(
      'workspace-excluded',
      'warning',
      `Workspace projects and links are excluded; ${projectRecords.length} non-node_modules project records are not traversed.`,
    ))
  } else if (projectRecords.length) {
    diagnostics.push(makeDiagnostic(
      'local-project-excluded',
      'warning',
      `${projectRecords.length} non-node_modules project records are excluded and not traversed.`,
    ))
  }

  if (has(manifest, 'overrides')) {
    diagnostics.push(makeDiagnostic(
      'overrides-present',
      'warning',
      'Root overrides are present; edge specifications are original declarations, not computed effective overrides.',
    ))
  }

  if (!rootNode.version) {
    diagnostics.push(startKey === ''
      ? makeDiagnostic('root-version-missing', 'warning', 'The root project version is not recorded.')
      : makeDiagnostic('workspace-version-missing', 'warning', `Workspace ${startKey} has no recorded version.`, startKey, rootNode.installationName))
  }

  const addWorkspace = location => {
    const node = workspaceNode(location)
    nodes.set(location, node)
    incoming.set(location, [])
    outgoing.set(location, [])
    if (!node.version) {
      diagnostics.push(makeDiagnostic(
        'workspace-version-missing',
        'warning',
        `Workspace ${location} has no recorded version.`,
        location,
        node.installationName,
      ))
    }
    return node
  }

  // npm installs every workspace's devDependencies, so --include-dev from the
  // root starts traversal at every workspace without synthetic root edges.
  const entryKeys = [startKey]
  if (includeDev && workspace === undefined) {
    for (const location of [...workspaceSet].sort(compare)) {
      addWorkspace(location)
      entryKeys.push(location)
    }
  }

  const queue = [...entryKeys]
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const source = queue[cursor]
    const record = source === '' ? manifest : records.get(source)

    for (const dependency of declarations(record, isProject(source) && includeDev)) {
      const { name, spec, role, optional } = dependency
      const found = findTarget(records, source, name, role === 'peer', isProject)
      const target = found === null ? null : workspaceTarget(found) ?? found

      if (target !== null && records.get(target).link === true) {
        excludedBoundaries.push({ source, name, spec, role, location: target })
        diagnostics.push(makeDiagnostic(
          'link-excluded',
          'warning',
          `${locationLabel(source)} declares ${name} (${role}: ${spec}), but ${target} is an excluded workspace or local link.`,
          source,
          name,
          role,
        ))
        continue
      }

      let targetKey = target
      if (target === null) {
        targetKey = missingKey(source, name, role)
        const privateLocation = role === 'peer' && !isProject(source) ? candidate(source, name) : null
        const privatePeer = privateLocation !== null && records.has(privateLocation)
        nodes.set(targetKey, {
          key: targetKey,
          kind: 'placeholder',
          location: null,
          parent: source,
          installationName: name,
          actualName: null,
          version: null,
          role,
          optional,
          status: privatePeer || !optional ? 'unresolved' : 'not recorded (optional)',
        })
        incoming.set(targetKey, [])
        outgoing.set(targetKey, [])

        if (privatePeer) {
          diagnostics.push(makeDiagnostic(
            'peer-private-placement',
            'error',
            `${locationLabel(source)} requires peer ${name} (${spec}); only the unsupported private candidate ${privateLocation} is recorded.`,
            source,
            name,
            role,
          ))
        } else {
          const description = role === 'peer' && optional ? 'optional peer' : role
          diagnostics.push(makeDiagnostic(
            optional ? 'optional-not-recorded' : 'dependency-unresolved',
            optional ? 'warning' : 'error',
            `${locationLabel(source)} declares ${description} dependency ${name} (${spec}), but no eligible package is recorded.`,
            source,
            name,
            role,
          ))
        }
      } else {
        const packageRecord = records.get(target)
        if (!nodes.has(target) && workspaceSet.has(target)) {
          addWorkspace(target)
          queue.push(target)
        } else if (!nodes.has(target)) {
          const node = {
            key: target,
            kind: 'package',
            location: target,
            installationName: installationName(target),
            recordedName: packageRecord.name || null,
            actualName: packageRecord.name || null,
            version: packageRecord.version || null,
            aliasRequested: false,
            aliasNames: new Set(),
            ambiguousAlias: false,
          }
          nodes.set(target, node)
          incoming.set(target, [])
          outgoing.set(target, [])
          queue.push(target)
          if (!node.version) {
            diagnostics.push(makeDiagnostic(
              'version-missing',
              'error',
              `${target} has no recorded selected version.`,
              target,
              node.installationName,
            ))
          }
        }

        const node = nodes.get(target)
        if (spec.startsWith('npm:') && node.kind === 'package') {
          node.aliasRequested = true
          const actualName = aliasName(spec)
          if (actualName) node.aliasNames.add(actualName)
          else node.ambiguousAlias = true
        }
      }

      const edge = { source, target: targetKey, name, spec, role, optional }
      edges.push(edge)
      outgoing.get(source).push(edge)
      incoming.get(targetKey).push(edge)
    }
  }

  for (const node of nodes.values()) {
    if (node.kind !== 'package') continue
    if (!node.recordedName) {
      if (!node.aliasRequested) {
        node.actualName = node.installationName
      } else if (!node.ambiguousAlias && node.aliasNames.size === 1) {
        node.actualName = [...node.aliasNames][0]
      } else {
        node.actualName = null
        diagnostics.push(makeDiagnostic(
          'alias-name-missing',
          'warning',
          `${node.location} is an alias whose actual package name is not recorded unambiguously.`,
          node.location,
          node.installationName,
        ))
      }
    }
    delete node.aliasNames
    delete node.ambiguousAlias
  }

  diagnostics.sort((a, b) =>
    compare(a.code, b.code) ||
    compare(a.location, b.location) ||
    compare(a.name, b.name) ||
    compare(a.role, b.role) ||
    compare(a.message, b.message))

  return {
    root: rootNode,
    entryKeys,
    lockfileVersion: lockfile.lockfileVersion,
    includeDev,
    nodes,
    edges,
    incoming,
    outgoing,
    diagnostics,
    excludedBoundaries,
    excludedProjectRecords: projectRecords.length,
    workspaces: workspaces && patterns !== null
      ? {
          declared: workspaceSet.size,
          reached: [...nodes.values()].filter(node => node.kind === 'workspace').length,
          entryPoints: entryKeys.length - 1,
        }
      : null,
    workspacesExcluded: !workspaces && patterns !== null,
    exitCode: diagnostics.some(diagnostic => diagnostic.severity === 'error') ? 2 : 0,
  }
}
