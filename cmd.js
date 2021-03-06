#!/usr/bin/env node

var os = require('os').type()

var electron = /electron/i.test(process.argv[0])
if (electron) {
  require('./')(require('minimist')(process.argv.slice(2)))
}

if (!electron) {
  if (os === 'Windows_NT' && process.argv[2] === 'init' && process.versions.node[0] < 4 && process.versions.node[1] < 1) {
    require('babel/register')
    require('./')(require('minimist')(process.argv.slice(2)))
  } else {
    process.title = 'Deck'
    var spawn = require('child_process').spawn
    spawn(
      require('electron-prebuilt'),
      [__filename].concat(process.argv.slice(2)),
      {
        stdio: [0, 1, 2]
      }).on('close', function (code) {
        process.exit(code)
      })
  }
}
