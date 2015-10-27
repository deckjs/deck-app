var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawnSync
var npm = path.join(__dirname, '../node_modules/.bin/npm')

module.exports = function (argv) {
  var pkg = path.join(process.cwd(), 'package.json')
  var code
  var proc

  if (argv._.length < 2) {
    if (!fs.existsSync(pkg)) {
      return console.error('No deck specified and no package.json in current working directory')
    }

    process.stdout.write('\nfetching dependencies..\n\n')

    proc = spawn(npm, ['install'], {
      stdio: argv.debug ? 'inherit' : 'ignore',
      cwd: process.cwd()
    })

    code = proc.status

    if (code) {
      console.error('\nFailure, exit code ', code)
    }

    return process.exit(code)
  }

  var deck = argv._[argv._.length - 1]
  var split = deck.split('/')

  var cwd = process.cwd()

  if (fs.existsSync(path.join(cwd, deck))) {
    console.error(' ', deck, 'already exists\n')
    return process.exit(2)
  }

  process.stdout.write('\ninstalling ' + deck + '..')

  var args = (argv._.join(' ') + ' --json --prefix').split(' ')
  args.push(cwd)
  console.log('\n')

  proc = spawn(npm, args, {
    stdio: argv.debug ? 'inherit' : 'ignore'
  })

  code = proc.status

  if (code) {
    console.error('\nFailure, exit code ', code)
    if (!argv.debug) {
      console.error('run with --debug for more info')
    }
    console.error()
    clean()
    process.exit(code)
  }

  fs.renameSync(path.join('node_modules', split[0]), split[0])

  clean(deck)

  console.log('\n\ndone\n')
  fs.writeFileSync(path.join(__dirname, '..', 'last-installed-deck'), path.join(process.cwd(), argv._[argv._.length - 1]))
  console.log('next: deck present ' + argv._[argv._.length - 1] + '\n(pro-tip alt: deck present !)\n')
  process.exit()
}

function clean (deck) {
  var mods, pkg, bins

  if (fs.existsSync('etc') && !fs.readdirSync('etc').length) {
    fs.rmdirSync('etc')
  }

  if (fs.existsSync('node_modules')) {
    mods = fs.readdirSync('node_modules')
    if (!mods.length) {
      fs.rmdirSync('node_modules')
      return
    }
    // nasty case, if a deck module has a bin field in package.json
    // node_modules won't get cleaned up

    if (mods.length === 1 && mods[0] === '.bin') {
      bins = fs.readdirSync(path.join('node_modules', '.bin'))

      if (!bins.length) {
        fs.rmdirSync(path.join('node_modules', '.bin'))
        return clean()
      }

      pkg = require(path.join(process.cwd(), deck, 'package.json'))
      if (!pkg.bin) { return }
      if (Object(pkg.bin) === Object(pkg.bin)) {
        Object.keys(pkg.bin).forEach(bin => {
          if (~~bins.indexOf(pkg.bin)) {
            fs.unlink(path.join('node_modules', '.bin', bin))
          }
        })
        return clean()
      }

      if (~~bins.indexOf(pkg.name)) {
        fs.unlink(path.join('node_modules', '.bin', pkg.name))
        clean()
      }
    }
  }
}
