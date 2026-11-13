import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildGraph } from '../src/graph.js'
import { readInputs, validateInputs } from '../src/input.js'
import { renderReport } from '../src/render.js'
import { selectView } from '../src/select.js'
import { complexDirectory, edge, makeInputs, npmCliDirectory } from '../test-support/fixtures.js'

const complex = () => readInputs(complexDirectory)
const locations = view => new Set(view.nodes.map(node => node.key))

test('resolves hoisted and nested instances without confusing location and dependency edges', async () => {
  const graph = buildGraph(await complex())
  assert.equal(graph.exitCode, 0)
  assert.equal(graph.nodes.size, 16)
  assert.equal(graph.edges.length, 20)
  assert.equal(edge(graph, 'node_modules/a', 'shared', 'prod').target, 'node_modules/a/node_modules/shared')
  assert.equal(edge(graph, 'node_modules/a', 'shared', 'peer').target, 'node_modules/shared')
  assert.equal(edge(graph, 'node_modules/b', 'shared', 'prod').target, 'node_modules/shared')
  assert.equal(edge(graph, 'node_modules/a/node_modules/deep', 'shared', 'prod').target, 'node_modules/a/node_modules/shared')
  assert.equal(edge(graph, 'node_modules/a/node_modules/shared', 'hoisted', 'prod').target, 'node_modules/hoisted')
  assert.equal(edge(graph, '', 'hoisted', 'prod'), undefined)
  assert.equal(edge(graph, 'node_modules/cycle', 'a', 'prod').target, 'node_modules/a')

  const markdown = renderReport(selectView(graph))
  assert.match(markdown, /shared@1\.2\.0 #91;node_modules\/a\/node_modules\/shared#93;/)
  assert.match(markdown, /shared@1\.2\.0 #91;node_modules\/shared#93;/)
  assert.match(markdown, /prod: shared @ \^1\.0\.0/)
  assert.match(markdown, /peer: shared @ \^1\.0\.0/)
})

test('includes root dev edges only when requested and keeps shared prod dependencies', async () => {
  const input = await complex()
  const production = buildGraph(input)
  const withDev = buildGraph(input, { includeDev: true })
  assert.equal(production.nodes.has('node_modules/both'), true)
  assert.equal(edge(production, '', 'both', 'prod').spec, '^1.0.0')
  assert.equal(edge(production, '', 'both', 'dev'), undefined)
  assert.equal(production.nodes.has('node_modules/dev'), false)
  assert.equal(withDev.nodes.size, 18)
  assert.equal(withDev.edges.length, 23)
  assert.equal(edge(withDev, '', 'both', 'dev').target, 'node_modules/both')
  assert.equal(edge(withDev, '', 'dev', 'dev').target, 'node_modules/dev')
  assert.equal(edge(withDev, 'node_modules/dev', 'dev-child', 'prod').target, 'node_modules/dev-child')
  assert.equal(withDev.nodes.has('node_modules/transitive-dev'), false)
})

test('preserves optional, peer, alias, scoped, git, and tarball declarations', async () => {
  const graph = buildGraph(await complex())
  assert.equal(edge(graph, '', 'opt', 'prod'), undefined)
  assert.equal(edge(graph, '', 'opt', 'optional').spec, '~2.0.0')
  assert.equal(graph.nodes.get(edge(graph, '', 'absent-opt', 'optional').target).status, 'not recorded (optional)')
  assert.equal(graph.nodes.get(edge(graph, '', 'maybe-peer', 'peer').target).status, 'not recorded (optional)')
  assert.equal(edge(graph, 'node_modules/a', 'host', 'peer').target, 'node_modules/host')
  assert.equal(graph.nodes.get('node_modules/alias').actualName, 'real-lib')
  assert.equal(edge(graph, '', 'alias', 'prod').spec, 'npm:real-lib@^3.0.0')
  assert.equal(edge(graph, '', '@scope/tool', 'prod').spec, 'git+https://example.invalid/tool.git#v2')
  assert.equal(edge(graph, '', 'remote', 'prod').spec, 'https://example.invalid/remote.tgz')
  assert.equal(graph.diagnostics.filter(item => item.code === 'optional-not-recorded').length, 2)

  const report = renderReport(selectView(graph))
  assert.match(report, /alias \(package real-lib\)@3\.4\.0/)
  assert.match(report, /Root overrides are present/)
  assert.match(report, /optional peer: maybe-peer @ \^1\.0\.0/)
})

test('infers an unambiguous alias name without inventing unknown names', () => {
  const input = makeInputs(
    { name: 'root', version: '1', dependencies: { alias: 'npm:@scope/real@^3', unknown: 'npm:bad alias' } },
    { 'node_modules/alias': { version: '3.2.0' }, 'node_modules/unknown': { version: '1.0.0' } },
  )
  const graph = buildGraph(input)
  assert.equal(graph.nodes.get('node_modules/alias').actualName, '@scope/real')
  assert.equal(graph.nodes.get('node_modules/unknown').actualName, null)
  assert.equal(graph.diagnostics.some(item => item.code === 'alias-name-missing'), true)
  assert.match(renderReport(selectView(graph)), /unknown \(package name not recorded\)@1\.0\.0/)
})

test('focus highlights every match and ancestor path while preserving unrelated branches', async () => {
  const graph = buildGraph(await complex())
  const view = selectView(graph, { focus: 'shared' })
  assert.equal(view.matchCount, 2)
  assert.equal(view.focusMode, 'highlight')
  assert.deepEqual(view.nodes, [...graph.nodes.values()])
  assert.deepEqual(view.edges, graph.edges)
  assert.deepEqual(view.matchedNodes, new Set([
    'node_modules/a/node_modules/shared',
    'node_modules/shared',
  ]))
  assert.deepEqual(view.focusNodes, new Set([
    '',
    'node_modules/a',
    'node_modules/b',
    'node_modules/cycle',
    'node_modules/a/node_modules/deep',
    'node_modules/a/node_modules/shared',
    'node_modules/shared',
  ]))
  assert.equal(view.omittedNodes, 0)
  assert.equal(view.omittedEdges, 0)
  assert.equal(view.focusEdges.has(edge(graph, 'node_modules/cycle', 'a', 'prod')), true)
  assert.equal(view.focusEdges.has(edge(graph, 'node_modules/a', 'shared', 'prod')), true)
  assert.equal(view.focusEdges.has(edge(graph, 'node_modules/a', 'shared', 'peer')), true)
  assert.equal(view.focusEdges.has(edge(graph, 'node_modules/a/node_modules/shared', 'hoisted', 'prod')), false)
  assert.equal(view.focusEdges.has(edge(graph, '', 'alias', 'prod')), false)
  assert.throws(() => selectView(graph, { focus: 'no-such-package' }), /No reachable dependency/)
})

test('filter mode keeps matches and ancestor context, not unrelated descendants', async () => {
  const graph = buildGraph(await complex())
  const highlighted = selectView(graph, { focus: 'shared' })
  const view = selectView(graph, { focus: 'shared', focusMode: 'filter' })
  assert.equal(view.focusMode, 'filter')
  assert.deepEqual(locations(view), highlighted.focusNodes)
  assert.deepEqual(view.matchedNodes, highlighted.matchedNodes)
  assert.deepEqual(new Set(view.edges), highlighted.focusEdges)
  assert.equal(locations(view).has('node_modules/hoisted'), false)
  assert.equal(view.omittedNodes, graph.nodes.size - view.nodes.length)
  assert.equal(view.omittedEdges, graph.edges.length - view.edges.length)
  assert.throws(() => selectView(graph, { focus: 'no-such-package' }), /No reachable dependency/)
})

test('depth uses shortest graph distance after focus and reports hidden matches', async () => {
  const graph = buildGraph(await complex())
  const zero = selectView(graph, { depth: 0 })
  assert.deepEqual(locations(zero), new Set(['']))
  assert.equal(zero.edges.length, 0)
  assert.equal(zero.omittedNodes, 15)
  assert.equal(zero.omittedEdges, 20)

  const two = selectView(graph, { depth: 2 })
  assert.equal(locations(two).has('node_modules/a/node_modules/shared'), true)
  assert.equal(locations(two).has('node_modules/hoisted'), false)
  const focused = selectView(graph, { focus: 'shared', depth: 1 })
  assert.deepEqual(locations(focused), locations(selectView(graph, { depth: 1 })))
  assert.equal(focused.hiddenMatches, 2)
  assert.equal(focused.matchCount, 2)
  assert.match(renderReport(focused), /Matching instances hidden by depth: 2 of 2/)
  const filtered = selectView(graph, { focus: 'shared', focusMode: 'filter', depth: 1 })
  assert.deepEqual(locations(filtered), new Set(['', 'node_modules/a', 'node_modules/b']))
  assert.equal(filtered.hiddenMatches, 2)
})

test('focus uses declared alias and placeholder names without highlighting unrelated nodes', async () => {
  const graph = buildGraph(await complex())
  const alias = selectView(graph, { focus: 'alias' })
  assert.deepEqual(alias.matchedNodes, new Set(['node_modules/alias']))
  assert.deepEqual(alias.focusNodes, new Set(['', 'node_modules/alias']))
  assert.throws(() => selectView(graph, { focus: 'real-lib' }), /No reachable dependency/)

  const placeholder = edge(graph, '', 'absent-opt', 'optional').target
  const missing = selectView(graph, { focus: 'absent-opt' })
  assert.deepEqual(missing.matchedNodes, new Set([placeholder]))
  assert.deepEqual(missing.focusNodes, new Set(['', placeholder]))
  assert.equal(missing.focusEdges.size, 1)
  assert.equal(missing.omittedNodes, 0)
})

test('with --no-workspaces, workspace and local links stop resolution without falling back or traversing', () => {
  const manifest = {
    name: 'workspace-root',
    version: '1',
    workspaces: ['packages/*'],
    dependencies: { parent: '^1', workspace: 'file:packages/workspace' },
  }
  const input = makeInputs(manifest, {
    'node_modules/parent': { version: '1', dependencies: { target: '^1' } },
    'node_modules/parent/node_modules/target': { link: true, resolved: 'packages/workspace' },
    'node_modules/target': { version: '1' },
    'node_modules/workspace': { link: true, resolved: 'packages/workspace' },
    'packages/workspace': { name: 'workspace', version: '1', dependencies: { hidden: '^1' } },
    'node_modules/hidden': { version: '1' },
  })
  const graph = buildGraph(input, { workspaces: false })
  assert.equal(graph.exitCode, 0)
  assert.deepEqual(new Set(graph.nodes.keys()), new Set(['', 'node_modules/parent']))
  assert.equal(graph.excludedBoundaries.length, 2)
  assert.equal(graph.excludedProjectRecords, 1)
  assert.equal(graph.diagnostics.filter(item => item.code === 'link-excluded').length, 2)
  assert.equal(graph.diagnostics.some(item => item.code === 'workspace-excluded'), true)
  assert.throws(() => selectView(graph, { focus: 'workspace' }), /No reachable dependency/)
  assert.equal(graph.workspacesExcluded, true)
  assert.ok(renderReport(selectView(graph)).includes('Workspaces: excluded by --no-workspaces.'))
})

const workspaceInputs = () => makeInputs(
  {
    name: 'ws-root',
    version: '1',
    workspaces: ['packages/*', 'tools/**', '!packages/ignored'],
    dependencies: { a: '^1', local: 'file:../local' },
    devDependencies: { rootdev: '^1' },
  },
  {
    'node_modules/a': { link: true, resolved: 'packages/a' },
    'node_modules/b': { link: true, resolved: 'packages/b' },
    'node_modules/deep': { link: true, resolved: 'tools/nested/deep' },
    'node_modules/ignored': { link: true, resolved: 'packages/ignored' },
    'node_modules/local': { link: true, resolved: '../local' },
    'packages/a': {
      name: 'a',
      version: '1.0.0',
      dependencies: { b: '^2', shared: '^1', own: '^1' },
      devDependencies: { adev: '^1' },
    },
    'packages/a/node_modules/own': { version: '3', devDependencies: { transitive: '^1' } },
    'packages/b': { name: 'b', version: '2.0.0', dependencies: { shared: '^1' } },
    'tools/nested/deep': { name: 'deep', version: '1.0.0', devDependencies: { deepdev: '^1' } },
    'packages/ignored': { name: 'ignored', version: '1' },
    '../local': { name: 'local', version: '1' },
    'node_modules/shared': { version: '1' },
    'node_modules/rootdev': { version: '1' },
    'node_modules/adev': { version: '1' },
    'node_modules/deepdev': { version: '1' },
    'node_modules/transitive': { version: '1' },
  },
)

test('workspaces are traversed by default through declared dependencies only', () => {
  const graph = buildGraph(workspaceInputs())
  assert.equal(graph.exitCode, 0)
  assert.equal(edge(graph, '', 'a', 'prod').target, 'packages/a')
  assert.equal(graph.nodes.get('packages/a').kind, 'workspace')
  assert.equal(graph.nodes.has('node_modules/a'), false)
  assert.equal(edge(graph, 'packages/a', 'b', 'prod').target, 'packages/b')
  assert.equal(edge(graph, 'packages/a', 'own', 'prod').target, 'packages/a/node_modules/own')
  assert.equal(edge(graph, 'packages/a', 'shared', 'prod').target, 'node_modules/shared')
  assert.equal(edge(graph, 'packages/b', 'shared', 'prod').target, 'node_modules/shared')
  assert.equal(graph.nodes.has('tools/nested/deep'), false)
  assert.equal(graph.nodes.has('node_modules/adev'), false)
  assert.deepEqual(graph.workspaces, { declared: 3, reached: 2, entryPoints: 0 })
  assert.equal(graph.excludedProjectRecords, 2)
  assert.equal(graph.diagnostics.some(item => item.name === 'local' && item.code === 'link-excluded'), true)
  assert.equal(graph.diagnostics.some(item => item.code === 'local-project-excluded'), true)

  const report = renderReport(selectView(graph))
  assert.ok(report.includes('[["a@1.0.0 (workspace)"]]'))
  assert.ok(report.includes('Workspaces: included; reached 2 of 3 workspace projects.'))
  assert.ok(report.includes('double-bordered (subroutine) nodes'))
})

test('--include-dev follows root and every workspace devDependencies but not transitive ones', () => {
  const graph = buildGraph(workspaceInputs(), { includeDev: true })
  assert.equal(edge(graph, '', 'rootdev', 'dev').target, 'node_modules/rootdev')
  assert.equal(edge(graph, 'packages/a', 'adev', 'dev').target, 'node_modules/adev')
  assert.equal(edge(graph, 'packages/a/node_modules/own', 'transitive', 'dev'), undefined)
  assert.equal(graph.nodes.get('tools/nested/deep').kind, 'workspace')
  assert.equal(edge(graph, 'tools/nested/deep', 'deepdev', 'dev').target, 'node_modules/deepdev')
  assert.equal(graph.incoming.get('tools/nested/deep').length, 0)
  assert.equal(graph.edges.some(item => item.source === '' && item.target === 'tools/nested/deep'), false)
  assert.deepEqual(graph.workspaces, { declared: 3, reached: 3, entryPoints: 3 })
  assert.equal(locations(selectView(graph, { depth: 1 })).has('node_modules/deepdev'), true)
  const report = renderReport(selectView(graph))
  assert.match(report, /root and workspace development dependencies/)
  assert.match(report, /all 3 workspace projects are entry points, without root edges/)
})

test('--workspace starts at a workspace selected by name or location', () => {
  for (const workspace of ['deep', 'tools/nested/deep']) {
    const graph = buildGraph(workspaceInputs(), { includeDev: true, workspace })
    assert.equal(graph.root.key, 'tools/nested/deep')
    assert.equal(graph.nodes.has(''), false)
    assert.equal(edge(graph, 'tools/nested/deep', 'deepdev', 'dev').target, 'node_modules/deepdev')
    assert.ok(renderReport(selectView(graph)).includes('Start node: workspace deep at tools/nested/deep.'))
  }
  assert.throws(() => buildGraph(workspaceInputs(), { workspace: 'ignored' }), /No workspace named/)
  assert.throws(() => buildGraph(workspaceInputs(), { workspace: 'nope' }), /No workspace named/)
  assert.throws(() => buildGraph(workspaceInputs(), { workspace: 'a', workspaces: false }), /--no-workspaces/)
})

test('unsupported private peers and missing required dependencies are diagnostic, even when filtered', async () => {
  const input = await complex()
  input.lockfile.packages['node_modules/a'].peerDependencies.private = '^1'
  input.lockfile.packages['node_modules/a'].peerDependencies.optionalPrivate = '^1'
  input.lockfile.packages['node_modules/a'].peerDependenciesMeta = { optionalPrivate: { optional: true } }
  input.lockfile.packages['node_modules/a/node_modules/private'] = { version: '1' }
  input.lockfile.packages['node_modules/a/node_modules/optionalPrivate'] = { version: '1' }
  delete input.lockfile.packages['node_modules/b']
  const graph = buildGraph(input)

  assert.equal(graph.exitCode, 2)
  assert.equal(graph.nodes.has('node_modules/a/node_modules/private'), false)
  const peer = graph.nodes.get(edge(graph, 'node_modules/a', 'private', 'peer').target)
  assert.equal(peer.status, 'unresolved')
  const optionalPeer = graph.nodes.get(edge(graph, 'node_modules/a', 'optionalPrivate', 'peer').target)
  assert.equal(optionalPeer.status, 'unresolved')
  assert.equal(graph.diagnostics.some(item => item.code === 'peer-private-placement'), true)
  assert.equal(graph.nodes.get(edge(graph, '', 'b', 'prod').target).status, 'unresolved')
  assert.equal(graph.diagnostics.some(item => item.code === 'dependency-unresolved'), true)
  const report = renderReport(selectView(graph, { depth: 0 }))
  assert.match(report, /unsupported private candidate/)
  assert.match(report, /dependency-unresolved/)
})

test('missing requirements with different roles retain distinct placeholders', () => {
  const graph = buildGraph(makeInputs(
    { name: 'root', version: '1', dependencies: { parent: '^1' } },
    { 'node_modules/parent': {
      version: '1',
      dependencies: { missing: '^1' },
      peerDependencies: { missing: '^2' },
    } },
  ))
  const production = edge(graph, 'node_modules/parent', 'missing', 'prod')
  const peer = edge(graph, 'node_modules/parent', 'missing', 'peer')
  assert.notEqual(production.target, peer.target)
  assert.equal(graph.nodes.get(production.target).status, 'unresolved')
  assert.equal(graph.nodes.get(peer.target).status, 'unresolved')
  assert.equal(selectView(graph, { focus: 'missing' }).matchCount, 2)
})

test('missing selected versions are reported without inventing them', () => {
  const graph = buildGraph(makeInputs(
    { name: 'root', dependencies: { dep: '^1' } },
    { 'node_modules/dep': {} },
  ))
  assert.equal(graph.exitCode, 2)
  assert.equal(graph.nodes.get('node_modules/dep').version, null)
  assert.match(renderReport(selectView(graph)), /dep@version not recorded/)
  assert.equal(graph.diagnostics.some(item => item.code === 'version-missing'), true)
})

test('lockfile v2 packages are authoritative and overrides do not cause false invalidity claims', () => {
  const manifest = { name: 'root', version: '1', dependencies: { dep: '^9' }, overrides: { dep: '1' } }
  const inputs = makeInputs(manifest, { 'node_modules/dep': { version: '1' } }, 2)
  inputs.lockfile.dependencies = { dep: { version: '999' }, phantom: { version: '1' } }
  const graph = buildGraph(inputs)
  const v3 = buildGraph(makeInputs(manifest, { 'node_modules/dep': { version: '1' } }, 3))
  assert.equal(graph.exitCode, 0)
  assert.equal(graph.nodes.get('node_modules/dep').version, '1')
  assert.equal(graph.nodes.has('node_modules/phantom'), false)
  assert.deepEqual([...graph.nodes], [...v3.nodes])
  assert.deepEqual(graph.edges, v3.edges)
  assert.match(renderReport(selectView(graph)), /not computed effective overrides/)
})

test('pinned npm/cli graph with workspaces matches Arborist-audited counts', async () => {
  const input = await readInputs(npmCliDirectory)
  const graph = buildGraph(input)
  assert.equal(graph.nodes.size, 149)
  assert.equal(graph.edges.length, 359)
  assert.deepEqual(graph.workspaces, { declared: 16, reached: 12, entryPoints: 0 })
  assert.equal(graph.excludedBoundaries.length, 0)
  assert.equal(graph.excludedProjectRecords, 0)
  assert.equal(graph.exitCode, 0)
  assert.equal(edge(graph, '', '@npmcli/arborist', 'prod').target, 'workspaces/arborist')
  assert.equal(graph.nodes.get('workspaces/arborist').kind, 'workspace')

  const withDev = buildGraph(input, { includeDev: true })
  assert.equal(withDev.nodes.size, 1201)
  assert.equal(withDev.edges.length, 2406)
  assert.deepEqual(withDev.workspaces, { declared: 16, reached: 16, entryPoints: 16 })

  const arborist = buildGraph(input, { workspace: '@npmcli/arborist' })
  assert.equal(arborist.root.key, 'workspaces/arborist')
  assert.equal(arborist.exitCode, 0)
})

test('pinned npm/cli root graph with --no-workspaces matches the independently audited counts and records', async () => {
  const input = await readInputs(npmCliDirectory)
  const graph = buildGraph(input, { workspaces: false })
  assert.equal(input.lockfile.lockfileVersion, 3)
  assert.equal(graph.nodes.size, 125)
  assert.equal(graph.edges.length, 255)
  assert.equal(graph.excludedBoundaries.length, 12)
  assert.equal(graph.excludedProjectRecords, 20)
  assert.equal(graph.exitCode, 0)
  assert.equal(edge(graph, '', 'glob', 'prod').spec, '^13.0.6')
  assert.equal(graph.nodes.get('node_modules/glob').version, '13.0.6')
  assert.equal(edge(graph, 'node_modules/glob', 'minimatch', 'prod').spec, '^10.2.2')
  assert.equal(edge(graph, 'node_modules/glob', 'minimatch', 'prod').target, 'node_modules/minimatch')
  assert.equal(graph.nodes.has('node_modules/@npmcli/arborist'), false)
  assert.equal(graph.diagnostics.some(item => item.name === '@npmcli/arborist' && item.code === 'link-excluded'), true)
  assert.equal(graph.diagnostics.some(item => item.code === 'workspace-excluded'), true)
  assert.equal(locations(selectView(graph, { focus: 'glob' })).has('node_modules/glob'), true)

  const withDev = buildGraph(input, { includeDev: true, workspaces: false })
  assert.equal(withDev.nodes.size, 1066)
  assert.equal(withDev.edges.length, 2042)
  assert.equal(edge(withDev, '', 'diff', 'prod').target, 'node_modules/diff')
  assert.equal(edge(withDev, '', 'diff', 'dev').target, 'node_modules/diff')
})

test('input validation detects stale, malformed, and unsupported lockfiles', async () => {
  const input = await complex()
  const manifest = structuredClone(input.manifest)
  const lockfile = structuredClone(input.lockfile)
  lockfile.packages[''].dependencies.a = '^100'
  assert.throws(() => validateInputs(manifest, lockfile), /dependencies\["a"\]/)
  lockfile.packages[''].dependencies.a = manifest.dependencies.a
  delete lockfile.packages[''].dependencies.opt
  assert.doesNotThrow(() => validateInputs(manifest, lockfile))
  lockfile.lockfileVersion = 1
  assert.throws(() => validateInputs(manifest, lockfile), /Unsupported lockfileVersion 1/)
  lockfile.lockfileVersion = 3
  delete lockfile.packages['']
  assert.throws(() => validateInputs(manifest, lockfile), /root entry/)
  assert.throws(() => validateInputs([], lockfile), /package\.json must be an object/)
  assert.throws(() => makeInputs({ dependencies: { x: 1 } }), /string specifications/)
})
