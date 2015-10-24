var readline = require('readline')
var up = require('@deck/upstream')

function upstream (argv) {
  var deck = {}
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  var deckName = argv._[argv._.length - 1]
  var fullName = require(process.cwd() + '/package.json').name
  if (argv._.length < 2) {
    var name = /^@.+\/(.+)/.exec(fullName)
    deckName = name ? name[1] : fullName
  }

  if (!/-deck$/.test(deckName)) {
    deckName += '-deck'
  }
  deck.remote = deckName
  deck.local = fullName

  rl.question('Enter PR Message: ', (msg) => {
    up(deck, msg, function (err, url) {
      if (err) {
        return console.error(err)
      }
      console.log('made pull request: ', url)
    })
  })
}

module.exports = upstream
