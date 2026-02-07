// settings.js

// Event Listener
window.addEventListener('DOMContentLoaded', async () => {
  const updates = document.getElementById('updates')
  const discord = document.getElementById('discord')
  const confirmexit = document.getElementById('confirmexit')
  const devmenu = document.getElementById('devmenu')

// Check for setting chainges
  updates.checked = (await window.settings.get('autoUpdate')) ?? true
  discord.checked = (await window.settings.get('discordRPC')) ?? false
  confirmexit.checked = (await window.settings.get('confirmQuit')) ?? true
  devmenu.checked = (await window.settings.get('devMode')) ?? false

  updates.addEventListener('change', () => {
    window.settings.set('autoUpdate', updates.checked)
  })

  discord.addEventListener('change', () => {
    window.settings.set('discordRPC', discord.checked)
  })

  confirmexit.addEventListener('change', () => {
    window.settings.set('confirmQuit', confirmexit.checked)
  })

  devmenu.addEventListener('change', () => {
    window.settings.set('devMode', devmenu.checked)
  })
})

document.getElementById('resetSettings').addEventListener('click', () => {
  if (confirm('Reset all settings to default?\nOUDL will restart.')) {
    window.settings.reset()
  }
})