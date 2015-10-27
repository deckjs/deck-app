var fs = require('fs')
var path = require('path')
var ncp = require('ncp')
var init = require('init-package-json')
var argv = require('minimist')(process.argv.slice(2))
var base = require('@deck/base')
var source = base.dir
var deck = base.deck

module.exports = function () {
  argv.name = argv.name || argv._.slice(1)[0]
  var dir = path.join(process.cwd(), argv.name ? argv.name : '')
  var target = file => path.join(dir, file)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  // stop electron from showing alert box on SIGHUP (ctrl c)
  process.on('uncaughtException', code => {
    console.log()
    process.exit(code)
  })

  init(dir, __dirname + '/init-input.js', {dir: dir, argv: argv},
    function (err) {
      if (err) throw err

      ncp(source('images'), target('images'), err => {
        if (err) throw err
        ncp(source('code'), target('code'), err => {
          if (err) throw err
          var targetDeck = target('deck.md')

          if (!fs.existsSync(targetDeck)) {
            fs.writeFileSync(targetDeck, argv.deck
              ? fs.readFileSync(path.join(process.cwd(), argv.deck))
              : deck
            )
          }

          fs.symlinkSync('deck.md', target('readme.md'))

          process.exit()
        })
      })
    })
}
