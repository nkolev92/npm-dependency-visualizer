import { randomUUID } from 'node:crypto'
import { open, realpath, rename, stat, unlink } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { InputError } from './errors.js'

async function statIfPresent(path) {
  try {
    return await stat(path, { bigint: true })
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

async function protectInputs(outputPath, inputPaths) {
  const outputInfo = await statIfPresent(outputPath)
  if (!outputInfo) return
  const outputRealPath = await realpath(outputPath)

  for (const inputPath of inputPaths) {
    const inputInfo = await stat(inputPath, { bigint: true })
    const sameFile = outputInfo.ino !== 0n &&
      outputInfo.ino === inputInfo.ino && outputInfo.dev === inputInfo.dev
    const inputRealPath = await realpath(inputPath)
    const normalize = path => process.platform === 'win32' ? path.toLowerCase() : path
    if (sameFile || normalize(outputRealPath) === normalize(inputRealPath)) {
      throw new InputError('Output must not overwrite package.json or package-lock.json, including filesystem aliases')
    }
  }
}

export async function writeReport(output, inputPaths, report) {
  const outputPath = resolve(output)
  await protectInputs(outputPath, inputPaths)
  const temporary = join(dirname(outputPath), `.${basename(outputPath)}.${randomUUID()}.tmp`)
  let handle
  let temporaryExists = false
  try {
    handle = await open(temporary, 'wx')
    temporaryExists = true
    await handle.writeFile(report, 'utf8')
    await handle.close()
    handle = null
    await protectInputs(outputPath, inputPaths)
    await rename(temporary, outputPath)
    temporaryExists = false
  } finally {
    try {
      if (handle) await handle.close()
    } finally {
      if (temporaryExists) await unlink(temporary)
    }
  }
}

export async function writeStream(stream, content) {
  await new Promise((resolveWrite, rejectWrite) => {
    const onError = error => {
      stream.off('error', onError)
      rejectWrite(error)
    }
    stream.once('error', onError)
    stream.write(content, error => {
      if (error) {
        rejectWrite(error)
      } else {
        stream.off('error', onError)
        resolveWrite()
      }
    })
  })
}
