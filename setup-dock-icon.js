if (require('os').type() !== 'Darwin') process.exit()

var fs = require('fs')

var icon = fs.createWriteStream(
  'node_modules/electron-prebuilt/dist/Electron.app/Contents/Resources/atom.icns'
)

fs.createReadStream('./deck.icns').pipe(icon)
