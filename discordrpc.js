// discordrpc.js
const RPC = require('discord-rpc')

const clientId = '1467941717360644274'

let rpc = null

// RPC start
function start() {
  if (rpc) return

   console.log('[RPC] Starting...')

  RPC.register(clientId)
  rpc = new RPC.Client({ transport: 'ipc' })

  rpc.on('ready', () => {
     console.log('[RPC] Ready. Logged in as:', rpc.user.username)

    rpc.setActivity({
      details: 'Playing OpenFront',
      state: 'In OUDL',
      startTimestamp: Date.now(),
      instance: false
    })
  })

  rpc.on('error', (err) => {
    console.error('[RPC] Error:', err)
  })

  rpc.login({ clientId }).catch(err => {
    console.error('[RPC] Login failed:', err)
    rpc = null
  })
}

// RPC stop
function stop() {
  if (!rpc) return

  console.log('[RPC] Stopping...')
  rpc.clearActivity()
  rpc.destroy()
  rpc = null
}

module.exports = { start, stop }