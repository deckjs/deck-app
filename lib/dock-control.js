const {BrowserWindow, app} = require('electron')

app.on('ready', () => {
  var dummy = new BrowserWindow({show: false})
  // forces replace icon to load
  dummy.setProgressBar(-1)
})
