import { fileURLToPath } from 'node:url'
import { validateInputs } from '../src/input.js'

export const complexDirectory = fileURLToPath(new URL('../test/fixtures/complex/', import.meta.url))
export const npmCliDirectory = fileURLToPath(new URL('../test/fixtures/npm-cli/', import.meta.url))

export function makeInputs(manifest, packages = {}, version = 3) {
  const root = structuredClone(manifest)
  delete root.overrides
  const lockfile = {
    lockfileVersion: version,
    packages: { '': root, ...packages },
  }
  return validateInputs(manifest, lockfile)
}

export function edge(graph, source, name, role) {
  return graph.edges.find(item => item.source === source && item.name === name && item.role === role)
}
