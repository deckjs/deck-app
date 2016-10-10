var path = require('path')
var fs = require('fs')
var logo = () => {}
var exec = require('child_process').execSync

require('./lib/dock-control')

function arg (p) {
  return !!~arg.s.indexOf(p)
}

module.exports = function (argv) {
  var scope
  arg.s = argv._
  arg.v = argv.version || argv.v

  scope = argv.scope || '@nearform'

  if (scope[0] !== '@') { scope = '@' + scope }

  logo({leftPadding: 4, text: '  Deck'})

  if (arg('init')) {
    return require('./lib/init')()
  }

  if (arg('install') || arg('i') || arg('inst')) {
    return require('./lib/install')(argv)
  }

  if (arg('present') || arg('view')) {
    return require('./lib/present')(argv._[argv._.length - 1], argv)
  }

  if (arg('edit')) {
    require('./lib/edit')(argv._[argv._.length - 1], argv)
  }

  if (arg('publish') || arg('pub')) {
    return require('./lib/publish')(argv, scope)
  }

  if (arg('upstream') || arg('up')) {
    require('./lib/upstream')(argv)
  }

  if (arg.v) {
    var npmVer = exec('npm -v')
    var deckVer = exec('npm info @deck/app version')
    console.log('npm version: ' + npmVer)
    console.log('deck version: ' + deckVer)
    return process.exit()
  }

  console.log('  Commands:\n')
  console.log('   ', fs.readdirSync(path.join(__dirname, 'lib')).filter(function (d) {
    return d !== 'init-input.js' && d !== 'dock-control'
  }).map(function (d) {
    return d.split('.')[0]
  }).join('\n    '), '\n')

  process.exit()
}
