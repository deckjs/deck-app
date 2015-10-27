var app = require('app')
var BrowserWindow = require('browser-window')

app.on('ready', () => {
  var dummy = new BrowserWindow({show: false})
  // forces replace icon to load
  dummy.setProgressBar(-1)
  setImmediate(() => dummy.close())
})
