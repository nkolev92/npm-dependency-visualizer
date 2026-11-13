import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'
import { test } from 'node:test'
import { buildGraph } from '../src/graph.js'
import { readInputs } from '../src/input.js'
import { renderReport } from '../src/render.js'
import { selectView } from '../src/select.js'
import { complexDirectory, makeInputs, npmCliDirectory } from '../test-support/fixtures.js'

const dom = new JSDOM('<!doctype html><html><body></body></html>')
globalThis.window = dom.window
globalThis.document = dom.window.document
const { default: mermaid } = await import('mermaid')
mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' })

function diagramOf(view) {
  const diagrams = marked.lexer(renderReport(view)).filter(token => token.type === 'code' && token.lang === 'mermaid')
  assert.equal(diagrams.length, 1)
  return diagrams[0].text
}

async function assertParses(view) {
  const markdown = renderReport(view)
  const tokens = marked.lexer(markdown)
  const diagrams = tokens.filter(token => token.type === 'code' && token.lang === 'mermaid')
  assert.equal(diagrams.length, 1)
  assert.equal((await mermaid.parse(diagrams[0].text)).diagramType, 'flowchart-v2')
  const parsed = await mermaid.mermaidAPI.getDiagramFromText(diagrams[0].text)
  assert.equal(parsed.db.getVertices().size, view.nodes.length)
  assert.equal(parsed.db.getEdges().length, view.edges.length)
  assert.equal(tokens.filter(token => token.type === 'table').length, 1)
  return markdown
}

test('the Markdown Mermaid block parses with the same nodes and edges', async () => {
  const graph = buildGraph(await readInputs(complexDirectory))
  await assertParses(selectView(graph))
  await assertParses(selectView(graph, { focus: 'shared', depth: 2 }))
  await assertParses(selectView(graph, { focus: 'shared', focusMode: 'filter', depth: 2 }))
  const rootOnly = selectView(graph, { depth: 0 })
  await assertParses(rootOnly)
})

test('the representative full and focused npm/cli graphs parse', async () => {
  const graph = buildGraph(await readInputs(npmCliDirectory))
  await assertParses(selectView(graph))
  await assertParses(selectView(graph, { focus: 'glob' }))
  await assertParses(selectView(graph, { focus: 'glob', focusMode: 'filter', depth: 2 }))
  const parsed = await mermaid.mermaidAPI.getDiagramFromText(diagramOf(selectView(graph)))
  const subroutines = [...parsed.db.getVertices().values()].filter(vertex => vertex.type === 'subroutine')
  assert.equal(subroutines.length, 12)

  const withDev = selectView(buildGraph(await readInputs(npmCliDirectory), { includeDev: true }), { depth: 1 })
  await assertParses(withDev)
  const devParsed = await mermaid.mermaidAPI.getDiagramFromText(diagramOf(withDev))
  assert.equal([...devParsed.db.getVertices().values()].filter(vertex => vertex.type === 'subroutine').length, 16)
})

test('focus styles apply to matches and only ancestor edges in final Mermaid edge order', async () => {
  const graph = buildGraph(await readInputs(complexDirectory))
  for (const options of [
    { focus: 'shared' },
    { focus: 'shared', depth: 2 },
    { focus: 'shared', focusMode: 'filter' },
    { focus: 'shared', focusMode: 'filter', depth: 1 },
    { focus: 'shared', depth: 0 },
  ]) {
    const view = selectView(graph, options)
    const markdown = await assertParses(view)
    const parsed = await mermaid.mermaidAPI.getDiagramFromText(diagramOf(view))
    const vertices = parsed.db.getVertices()
    const ancestorLabels = new Set([
      'sample-project@1.0.0', 'a@1.1.0', 'b@2.1.0', 'cycle@1.0.0', 'deep@2.3.0',
    ])
    let matches = 0
    for (const vertex of vertices.values()) {
      if (vertex.text.startsWith('shared@')) {
        assert.deepEqual(vertex.classes, ['focusMatch'])
        matches++
      } else {
        assert.deepEqual(vertex.classes, ancestorLabels.has(vertex.text) ? ['focusAncestor'] : [])
      }
    }
    assert.equal(matches, view.matchCount - view.hiddenMatches)
    for (const edge of parsed.db.getEdges()) {
      const onPath = vertices.get(edge.start).classes.length && vertices.get(edge.end).classes.length
      assert.deepEqual(edge.style ?? [], onPath ? ['stroke:#e76f51', 'stroke-width:3px', 'fill:none'] : [])
    }
    assert.match(markdown, /\| Lockfile location \| Focus \|/)
    if (matches) assert.match(markdown, /\| Match \|/)
    if (!view.edges.length) assert.doesNotMatch(diagramOf(view), /linkStyle/)
  }
})

test('no focus leaves all nodes and edges unstyled', async () => {
  const graph = buildGraph(await readInputs(complexDirectory))
  const view = selectView(graph)
  const report = diagramOf(view)
  assert.doesNotMatch(report, /classDef|^\s+class |linkStyle/m)
  const parsed = await mermaid.mermaidAPI.getDiagramFromText(report)
  for (const vertex of parsed.db.getVertices().values()) assert.deepEqual(vertex.classes, [])
  for (const edge of parsed.db.getEdges()) assert.equal(edge.style, undefined)
})

test('untrusted labels cannot create Markdown links, HTML, fences, or Mermaid directives', async () => {
  const manifest = {
    name: 'root"]\n```mermaid\nclick n0 href "https://evil.invalid"\n<script>alert(1)</script> www.example.invalid user@example.invalid\u2028',
    version: '1.0.0',
    dependencies: {
      unsafe: 'https://example.invalid/a.tgz?x=1|2&y=3#v1"\n```\n%%{init: {"securityLevel":"loose"}}%% <script>alert(2)</script>',
    },
  }
  const graph = buildGraph(makeInputs(manifest, {
    'node_modules/unsafe': { name: 'name|`[]<&>@example.com', version: '2.0.0' },
  }))
  const markdown = await assertParses(selectView(graph))
  const html = marked.parse(markdown)
  const document = new JSDOM(html).window.document
  assert.equal(document.querySelectorAll('a, script, iframe, img').length, 0)
  assert.match(document.body.textContent, /www\.example\.invalid user@example\.invalid/)
  assert.equal(markdown.match(/^```/gm).length, 2)
  assert.doesNotMatch(markdown, /<script/i)
  assert.doesNotMatch(diagramOf(selectView(graph)), /%%\{/)
})

test('node IDs remain stable when changing only view filters', async () => {
  const graph = buildGraph(await readInputs(complexDirectory))
  const all = diagramOf(selectView(graph))
  const lines = input => input.split('\n').filter(line => /^\s+n\d+\["/.test(line))
  const allLines = new Set(lines(all))
  for (const options of [
    { focus: 'shared' },
    { focus: 'shared', focusMode: 'filter' },
    { focus: 'shared', focusMode: 'filter', depth: 1 },
    { depth: 1 },
  ]) {
    const focused = diagramOf(selectView(graph, options))
    for (const line of lines(focused)) assert.equal(allLines.has(line), true, line)
  }
})
