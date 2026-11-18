import { InputError } from './errors.js'

export function selectView(graph, { focus, focusMode = 'highlight', depth } = {}) {
  let selected = new Set(graph.nodes.keys())
  const matchedNodes = new Set()
  const focusNodes = new Set()

  if (focus !== undefined) {
    const names = new Set(Array.isArray(focus) ? focus : [focus])
    if (!names.size) throw new InputError('--focus must not be empty')
    const unmatched = new Set(names)
    for (const edge of graph.edges) {
      if (names.has(edge.name)) {
        matchedNodes.add(edge.target)
        unmatched.delete(edge.name)
      }
    }
    if (unmatched.size) {
      const label = unmatched.size === 1 ? 'dependency' : 'dependencies'
      throw new InputError(`No reachable ${label} named ${[...unmatched].map(name => JSON.stringify(name)).join(', ')}`)
    }
    if (Array.isArray(focus)) focus = [...names]

    const queue = [...matchedNodes]
    for (const key of matchedNodes) focusNodes.add(key)
    for (let cursor = 0; cursor < queue.length; cursor++) {
      for (const edge of graph.incoming.get(queue[cursor])) {
        if (!focusNodes.has(edge.source)) {
          focusNodes.add(edge.source)
          queue.push(edge.source)
        }
      }
    }
    if (focusMode === 'filter') selected = new Set(focusNodes)
  }

  const focusEdges = new Set(graph.edges.filter(edge => focusNodes.has(edge.source) && focusNodes.has(edge.target)))

  if (depth !== undefined) {
    const withinDepth = new Set(graph.entryKeys)
    const queue = graph.entryKeys.map(key => ({ key, distance: 0 }))
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const { key, distance } = queue[cursor]
      if (distance >= depth) continue
      for (const edge of graph.outgoing.get(key)) {
        if (selected.has(edge.target) && !withinDepth.has(edge.target)) {
          withinDepth.add(edge.target)
          queue.push({ key: edge.target, distance: distance + 1 })
        }
      }
    }
    selected = withinDepth
  }

  const nodes = [...graph.nodes.values()].filter(node => selected.has(node.key))
  const edges = graph.edges.filter(edge => selected.has(edge.source) && selected.has(edge.target))
  const hiddenMatches = [...matchedNodes].filter(key => !selected.has(key)).length

  return {
    graph,
    nodes,
    edges,
    focus,
    focusMode: focus === undefined ? undefined : focusMode,
    matchedNodes,
    focusNodes,
    focusEdges,
    depth,
    matchCount: matchedNodes.size,
    hiddenMatches,
    omittedNodes: graph.nodes.size - nodes.length,
    omittedEdges: graph.edges.length - edges.length,
  }
}
