# npm Dependency Visualizer

Generate a dependency graph from a local `package.json` and `package-lock.json`.
The output is a Markdown document with a Mermaid diagram.
Package nodes show locked versions, and arrows show the original dependency specifications and roles.

The CLI requires Node.js 22.12.0 or later and supports lockfile versions 2 and 3.
It has no runtime dependencies, does not read `node_modules`, and makes no network requests or changes to the inputs.

## Usage

Run the CLI from this repository:

```powershell
# Read the current directory and write Markdown to stdout.
node .\cli.js

# Read another project and write a Markdown report.
node .\cli.js C:\src\project --output graph.md

# Include root and workspace development dependencies.
node .\cli.js C:\src\project --include-dev --output graph.md

# Generate the default npm/cli graph, including reached workspaces, from the pinned fixture.
node .\cli.js .\test\fixtures\npm-cli --output npm-cli.md

# Start the graph at one workspace, selected by name or location.
node .\cli.js .\test\fixtures\npm-cli --workspace @npmcli/arborist --output arborist.md

# Show only the root graph, excluding workspaces.
node .\cli.js .\test\fixtures\npm-cli --no-workspaces --output npm-cli-root.md

# Highlight glob and its ancestor paths without removing the rest of the graph.
node .\cli.js .\test\fixtures\npm-cli --focus glob --output npm-glob.md

# Use a smaller focused view when a graph is too dense to read.
node .\cli.js .\test\fixtures\npm-cli --focus read --focus-mode filter --depth 2 --output npm-read.md
```

Alternatively, install the local CLI with `npm install --global --omit=dev .` and run `npm-dependency-visualizer`.
The optional directory argument defaults to the current directory, and `--output` is relative to the current directory.
Generated reports from the pinned npm/cli fixture:

| Example | Arguments | Shows |
| --- | --- | --- |
| `examples\npm-cli.md` | (none) | Full graph, 149 nodes and 359 relationships, no focus |
| `examples\npm-cli-focus-highlight.md` | `--focus glob` | Same full graph; `glob` and its 26 ancestors are colored, other branches keep their normal style |
| `examples\npm-cli-focus-filter.md` | `--focus glob --focus-mode filter` | Only `glob` and its ancestors: 27 nodes and 70 relationships, with the same colors |
| `examples\npm-cli-arborist.md` | `--workspace @npmcli/arborist` | Graph started at the `@npmcli/arborist` workspace |

| Option | Description |
| --- | --- |
| `--output <file>` | Write a report to a file instead of stdout |
| `--include-dev` | Include development dependencies of the root and every workspace |
| `--depth <n>` | Keep nodes at most `n` dependency edges from the start node |
| `--workspace <name>` | Start the graph at one workspace, matched by package name or location |
| `--no-workspaces` | Exclude workspaces and show only the root graph |
| `--focus <name>` | Highlight every matching dependency instance and its ancestor paths, keeping the rest of the graph |
| `--focus-mode highlight\|filter` | Keep all branches (default), or keep only matches and ancestors; requires `--focus` |
| `--help`, `--version` | Display usage or the CLI version |

Without focus, the complete selected graph is shown without highlighting.
Focus uses the Sunset Boulevard palette: coral, thick-bordered nodes are matches; warm-sand nodes are ancestors; thick burnt-orange arrows trace the ancestor subgraph.
Unrelated nodes and edges keep their normal style.
The node index also labels matches and ancestors so the report does not rely on color alone.
`--focus-mode filter` applies the same colors but removes unrelated branches.
Focus is computed before depth, and the report notes any matches hidden by the explicit depth limit.
Visible ancestors can therefore remain highlighted even when a matching instance is deeper than the limit.
Diagnostics are written to stderr; the document includes warnings and counts of filtered nodes, excluded links, and excluded project records.
An output file is replaced only after the report is generated, and input files and their filesystem aliases cannot be used as output.

| Exit code | Meaning |
| --- | --- |
| `0` | Report generated, possibly with optional-dependency or link warnings |
| `1` | Invalid arguments or input, unmatched focus, or output failure |
| `2` | Diagnostic report generated for missing required dependencies, missing non-root versions, or unsupported private peer placement |

## Scope and limitations

The default graph includes reachable production, optional, and peer dependencies.
`--include-dev` also includes development dependencies of the root and of every workspace, but not transitive packages' development requirements.
With `--include-dev`, every workspace becomes an extra graph entry point, so workspaces nothing depends on appear as separate unconnected starting nodes (no synthetic root edges). With `--workspace`, only the selected workspace and the workspaces it reaches contribute development dependencies.
Distinct installation locations remain distinct nodes, including when their names and versions match.
Mermaid's default `maxEdges` limit is 500, so large graphs (for example, npm/cli with `--include-dev`, 2,406 relationships) need `--depth`, `--focus <name> --focus-mode filter`, or a renderer configured with a higher limit.

Workspaces declared in the root `package.json` are included by default.
Without `--include-dev`, a workspace appears only when a declared dependency reaches it through its `node_modules` link; there are never synthetic root-to-workspace edges.
Workspace nodes use Mermaid's double-bordered subroutine shape and a `(workspace)` label, and the report states how many declared workspaces were reached.
Workspace dependencies resolve from the workspace's own `node_modules` first, then from the root.
Use `--workspace <name>` to start at one workspace, or `--no-workspaces` to restore the root-only graph.
Non-workspace local-directory links (such as `file:` dependencies) are excluded and reported.
The original edge specifications are displayed even when root overrides are present; the tool does not calculate effective override ranges.

Use `--focus` to inspect current parent chains to a dependency, not to calculate an upgrade plan.
Determining which releases enable a new dependency version requires additional release metadata and constraint analysis.

Reports are tested with Mermaid 12.3.0.
The focused sample and npm/cli `read` diagrams were visually checked in a local Markdown viewer using Marked 16.4.2, Mermaid 12.3.0, and Chrome 157.0.8103.40.
Focus colors and path styling were also checked in local Chrome on the small fixture and the full npm/cli graph, retaining all 125 nodes and 255 relationships of the root-only (`--no-workspaces`) graph.
Large graphs may exceed a viewer's layout limits; use `--depth` or `--focus <name> --focus-mode filter` for a smaller view.

## Tests

Install the development dependencies with `npm ci`, then run `npm test`.
Tests use local fixtures, including an npm/cli snapshot pinned to a single commit; they do not fetch current npm/cli files.
