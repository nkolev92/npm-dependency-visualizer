import childProcess from 'node:child_process'
import dgram from 'node:dgram'
import dns from 'node:dns'
import http from 'node:http'
import https from 'node:https'
import { syncBuiltinESMExports } from 'node:module'
import net from 'node:net'

const blocked = () => {
  throw new Error('Network access and child processes are forbidden in this test')
}

for (const name of ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']) {
  childProcess[name] = blocked
}
for (const name of ['connect', 'createConnection', 'createServer']) net[name] = blocked
net.Socket.prototype.connect = blocked
for (const name of ['request', 'get']) {
  http[name] = blocked
  https[name] = blocked
}
for (const name of ['lookup', 'resolve', 'resolve4', 'resolve6']) dns[name] = blocked
dgram.createSocket = blocked
globalThis.fetch = blocked
syncBuiltinESMExports()
