#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { InputError } from './src/errors.js'
import { buildGraph } from './src/graph.js'
import { readInputs } from './src/input.js'
import { writeReport, writeStream } from './src/output.js'
import { formatDiagnostic, renderReport } from './src/render.js'
import { selectView } from './src/select.js'

const help = `Usage: npm-dependency-visualizer [directory] [options]

Read package.json and package-lock.json from directory (default: current directory).
Write Markdown with Mermaid to stdout unless --output is specified.

Options:
  --output <file>          Write a complete report to a file
  --include-dev            Include root and workspace development dependencies
  --depth <n>              Limit the graph to n edges from the start node
  --workspace <name>       Start at a workspace (package name or location)
  --no-workspaces          Exclude workspaces; graph only the root project
  --focus <name>           Highlight matches and ancestor paths, keeping the graph
  --focus-mode <mode>      highlight (default) or filter; requires --focus
  --help                   Show this help
  --version                Show the version

Exit codes: 0 for a report, 1 for an error, 2 for a report with graph defects.
`

function optionsFrom(argv) {
  let parsed
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      allowNegative: true,
      options: {
        output: { type: 'string' },
        'include-dev': { type: 'boolean' },
        depth: { type: 'string' },
        workspace: { type: 'string' },
        workspaces: { type: 'boolean' },
        focus: { type: 'string' },
        'focus-mode': { type: 'string' },
        help: { type: 'boolean' },
        version: { type: 'boolean' },
      },
    })
  } catch (error) {
    throw new InputError(error.message)
  }

  const { values, positionals } = parsed
  if (positionals.length > 1) throw new InputError('Only one project directory may be specified')
  if (values.output === '') throw new InputError('--output must not be empty')
  if (values.focus === '') throw new InputError('--focus must not be empty')
  if (values.workspace === '') throw new InputError('--workspace must not be empty')
  if (values.workspace !== undefined && values.workspaces === false) {
    throw new InputError('--workspace cannot be combined with --no-workspaces')
  }
  if (values['focus-mode'] !== undefined) {
    if (!['highlight', 'filter'].includes(values['focus-mode'])) {
      throw new InputError('--focus-mode must be highlight or filter')
    }
    if (values.focus === undefined) throw new InputError('--focus-mode requires --focus')
  }
  let depth
  if (values.depth !== undefined) {
    if (!/^\d+$/.test(values.depth) || !Number.isSafeInteger(Number(values.depth))) {
      throw new InputError('--depth must be a nonnegative safe integer')
    }
    depth = Number(values.depth)
  }
  return {
    directory: resolve(positionals[0] ?? '.'),
    output: values.output,
    includeDev: values['include-dev'] ?? false,
    depth,
    workspace: values.workspace,
    workspaces: values.workspaces ?? true,
    focus: values.focus,
    focusMode: values['focus-mode'] ?? 'highlight',
    help: values.help ?? false,
    version: values.version ?? false,
  }
}

async function main() {
  const options = optionsFrom(process.argv.slice(2))
  if (options.help) {
    await writeStream(process.stdout, help)
    return 0
  }
  if (options.version) {
    const metadata = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'))
    await writeStream(process.stdout, `${metadata.version}\n`)
    return 0
  }

  const inputs = await readInputs(options.directory)
  const graph = buildGraph(inputs, {
    includeDev: options.includeDev,
    workspaces: options.workspaces,
    workspace: options.workspace,
  })
  const view = selectView(graph, { focus: options.focus, focusMode: options.focusMode, depth: options.depth })
  const report = renderReport(view)
  if (options.output !== undefined) {
    await writeReport(options.output, inputs.inputPaths, report)
  } else {
    await writeStream(process.stdout, report)
  }
  for (const diagnostic of graph.diagnostics) {
    await writeStream(process.stderr, `${formatDiagnostic(diagnostic)}\n`)
  }
  return graph.exitCode
}

try {
  process.exitCode = await main()
} catch (error) {
  const message = error instanceof InputError ? error.message : error.stack ?? String(error)
  await writeStream(process.stderr, `error: ${message}\n`)
  process.exitCode = 1
}
