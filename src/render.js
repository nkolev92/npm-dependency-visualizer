const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0

const focusLegend = 'Focus (Sunset Boulevard): coral nodes with thick borders are matches; warm-sand nodes are ancestors; thick burnt-orange arrows trace the ancestor subgraph. Unrelated branches keep their normal style.'

function compareNodes(a, b) {
  const aLocation = a.kind === 'placeholder' ? a.parent : a.location
  const bLocation = b.kind === 'placeholder' ? b.parent : b.location
  return compare(aLocation, bLocation) ||
    compare(a.kind === 'placeholder' ? '1' : '0', b.kind === 'placeholder' ? '1' : '0') ||
    compare(a.installationName, b.installationName) ||
    compare(a.role ?? '', b.role ?? '')
}

function nodeName(node) {
  if (node.kind === 'placeholder') return node.installationName
  if (node.kind === 'root') return node.actualName
  if (node.kind === 'workspace') return `${node.actualName} (workspace)`
  if (node.actualName && node.actualName !== node.installationName) {
    return `${node.installationName} (package ${node.actualName})`
  }
  if (node.aliasRequested && !node.actualName) {
    return `${node.installationName} (package name not recorded)`
  }
  return node.installationName
}

function nodeLocation(node) {
  if (node.kind === 'root') return '(root)'
  if (node.kind === 'placeholder') {
    return `not recorded; declared by ${node.parent || '(root)'} (${node.role})`
  }
  return node.location
}

function labelsAndIds(graph) {
  const nodes = [...graph.nodes.values()].sort(compareNodes)
  const labels = new Map()
  const labelCounts = new Map()

  for (const node of nodes) {
    const label = node.kind === 'placeholder'
      ? `${nodeName(node)} (${node.status})`
      : node.kind === 'workspace'
        ? `${node.actualName}@${node.version || 'version not recorded'} (workspace)`
        : `${nodeName(node)}@${node.version || 'version not recorded'}`
    labels.set(node.key, label)
    labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1)
  }

  const ids = new Map()
  nodes.forEach((node, index) => {
    ids.set(node.key, `n${index}`)
    if (labelCounts.get(labels.get(node.key)) > 1) {
      labels.set(node.key, `${labels.get(node.key)} [${nodeLocation(node)}]`)
    }
  })
  return { ids, labels }
}

function mermaidText(value) {
  return [...String(value)].map(character => {
    const code = character.codePointAt(0)
    return code < 32 || code === 127 || code === 0x2028 || code === 0x2029 || '#"&<>|[]`\\%'.includes(character)
      ? `#${code};`
      : character
  }).join('')
}

function markdownText(value) {
  const characters = [...String(value)]
  return characters.map((character, index) => {
    const code = character.codePointAt(0)
    const urlColon = character === ':' && characters[index + 1] === '/' && characters[index + 2] === '/'
    const wwwDot = character === '.' && characters.slice(Math.max(0, index - 3), index).join('').toLowerCase() === 'www'
    return code < 32 || code === 127 || code === 0x2028 || code === 0x2029 ||
      '&<>\\|`*_[\\]#!@'.includes(character) || urlColon || wwwDot
      ? `&#${code};`
      : character
  }).join('')
}

function commentText(value) {
  return [...String(value)].map(character => {
    const code = character.codePointAt(0)
    if (code < 32 || code === 127 || code === 0x2028 || code === 0x2029 || '%`\\<>'.includes(character)) {
      return `\\u${code.toString(16).padStart(4, '0')}`
    }
    return character
  }).join('')
}

function summary(view) {
  const { graph } = view
  const developmentOwners = graph.workspaces === null ? 'root' : 'root and workspace'
  const selection = graph.includeDev
    ? `production, optional, peer, and ${developmentOwners} development dependencies`
    : 'production, optional, and peer dependencies'
  const focus = Array.isArray(view.focus) ? view.focus.join(', ') : view.focus ?? 'none'
  const depth = view.depth === undefined ? 'unlimited' : String(view.depth)
  const lines = [
    `Inputs: package.json, package-lock.json; lockfile version ${graph.lockfileVersion}.`,
    `Dependency selection: ${selection}.`,
    `Filters: focus ${focus}; depth ${depth}.`,
    `Displayed: ${view.nodes.length} nodes, ${view.edges.length} relationships.`,
    `Omitted by filters: ${view.omittedNodes} nodes, ${view.omittedEdges} relationships.`,
    `Excluded boundaries: ${graph.excludedBoundaries.length} relationships; excluded non-node_modules project records: ${graph.excludedProjectRecords}.`,
  ]
  if (graph.workspaces?.entryPoints) {
    lines.push(`Workspaces: included; all ${graph.workspaces.declared} workspace projects are entry points, without root edges, because --include-dev follows every workspace's development dependencies.`)
  } else if (graph.workspaces !== null) {
    lines.push(`Workspaces: included; reached ${graph.workspaces.reached} of ${graph.workspaces.declared} workspace projects.`)
  } else if (graph.workspacesExcluded) {
    lines.push('Workspaces: excluded by --no-workspaces.')
  }
  if (graph.root.kind === 'workspace') {
    lines.push(`Start node: workspace ${graph.root.actualName} at ${graph.root.location}.`)
  }
  if (view.focus !== undefined) {
    lines.push(`Focus mode: ${view.focusMode}; matching instances: ${view.matchCount}.`)
  }
  if (view.hiddenMatches) {
    lines.push(`Matching instances hidden by depth: ${view.hiddenMatches} of ${view.matchCount}.`)
  }
  return lines
}

function edgeLabel(edge) {
  const role = edge.role === 'peer' && edge.optional ? 'optional peer' : edge.role
  return `${role}: ${edge.name} @ ${edge.spec}`
}

function renderDiagram(view, ids, labels) {
  const lines = ['flowchart LR']
  const nodes = [...view.nodes].sort(compareNodes)
  for (const node of nodes) {
    const [open, close] = node.kind === 'workspace' ? ['[[', ']]'] : ['[', ']']
    lines.push(`    ${ids.get(node.key)}${open}"${mermaidText(labels.get(node.key))}"${close}`)
  }

  const edges = [...view.edges].sort((a, b) =>
    compare(a.source, b.source) ||
    compare(a.target, b.target) ||
    compare(a.name, b.name) ||
    compare(a.role, b.role) ||
    compare(a.spec, b.spec))
  for (const edge of edges) {
    lines.push(`    ${ids.get(edge.source)} -->|"${mermaidText(edgeLabel(edge))}"| ${ids.get(edge.target)}`)
  }
  if (view.focus !== undefined) {
    lines.push(
      '    classDef focusMatch fill:#f4a261,stroke:#264653,color:#264653,stroke-width:3px,font-family:DejaVu Sans',
      '    classDef focusAncestor fill:#e9c46a,stroke:#264653,color:#264653,stroke-width:1.5px,font-family:DejaVu Sans',
    )
    for (const node of nodes) {
      if (view.matchedNodes.has(node.key)) {
        lines.push(`    class ${ids.get(node.key)} focusMatch`)
      } else if (view.focusNodes.has(node.key)) {
        lines.push(`    class ${ids.get(node.key)} focusAncestor`)
      }
    }
    const highlightedEdges = edges.flatMap((edge, index) => view.focusEdges.has(edge) ? [index] : [])
    if (highlightedEdges.length) {
      lines.push(`    linkStyle ${highlightedEdges.join(',')} stroke:#e76f51,stroke-width:3px`)
    }
  }
  return lines.join('\n')
}

export function renderReport(view) {
  const { graph } = view
  const { ids, labels } = labelsAndIds(graph)
  const diagram = renderDiagram(view, ids, labels)

  const lines = [
    `# Dependency graph: ${markdownText(graph.root.actualName)}`,
    '',
    ...summary(view).map(line => `- ${markdownText(line)}`),
    '',
  ]
  if (graph.diagnostics.length) {
    lines.push('## Warnings', '')
    for (const diagnostic of graph.diagnostics) {
      lines.push(`- ${markdownText(`${diagnostic.code}: ${diagnostic.message}`)}`)
    }
    lines.push('')
  }

  lines.push(
    '## Legend',
    '',
    '- Arrows point from the declaring package to its resolved dependency.',
    '- Node versions are selected versions; edge labels show the dependency role, declared name, and original specification.',
    '- `prod`, `dev`, `optional`, `peer`, and `optional peer` identify dependency roles.',
    '- Unresolved and unrecorded optional dependencies have placeholder nodes.',
    ...(graph.workspaces === null ? [] : ['- Workspace projects use double-bordered (subroutine) nodes labeled `(workspace)`.']),
    ...(view.focus === undefined ? [] : [`- ${focusLegend}`, '- The node index identifies matches and ancestors without relying on color.']),
    '',
    '## Dependency graph',
    '',
    '```mermaid',
    diagram,
    '```',
    '',
    '## Node index',
    '',
    view.focus === undefined
      ? '| ID | Name | Selected version | Lockfile location |'
      : '| ID | Name | Selected version | Lockfile location | Focus |',
    view.focus === undefined
      ? '| --- | --- | --- | --- |'
      : '| --- | --- | --- | --- | --- |',
  )

  for (const node of [...view.nodes].sort(compareNodes)) {
    const fields = [ids.get(node.key), nodeName(node), node.version || 'not recorded', nodeLocation(node)]
    if (view.focus !== undefined) {
      fields.push(view.matchedNodes.has(node.key) ? 'Match' : view.focusNodes.has(node.key) ? 'Ancestor' : 'Unrelated')
    }
    lines.push(`| ${fields.map(markdownText).join(' | ')} |`)
  }
  return `${lines.join('\n')}\n`
}

export function formatDiagnostic(diagnostic) {
  const message = commentText(diagnostic.message)
  return `${diagnostic.severity} [${diagnostic.code}]: ${message}`
}
