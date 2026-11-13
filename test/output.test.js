import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { syncBuiltinESMExports } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

test('temporary output is removed even if writing and closing both fail', async () => {
  const directory = await fs.mkdtemp(join(tmpdir(), 'npm-dependency-output-'))
  const originalOpen = fs.open
  fs.open = async (...args) => {
    const handle = await originalOpen(...args)
    return {
      async writeFile() { throw new Error('simulated write failure') },
      async close() {
        await handle.close()
        throw new Error('simulated close failure')
      },
    }
  }
  syncBuiltinESMExports()

  try {
    const { writeReport } = await import('../src/output.js?close-failure')
    await assert.rejects(writeReport(join(directory, 'report.md'), [], 'report'), /simulated close failure/)
    assert.deepEqual(await fs.readdir(directory), [])
  } finally {
    fs.open = originalOpen
    syncBuiltinESMExports()
    await fs.rm(directory, { recursive: true, force: true })
  }
})
