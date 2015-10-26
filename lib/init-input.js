/* global config, prompt */
var base = require('@deck/base')
var extend = require('extend-object')
var exec = require('child_process').execSync
var fs = require('fs')
var path = require('path')
var argv = config.get('argv')

var scope = argv.scope || ''
var dir = config.get('dir')
var pkg = path.join(dir, '/package.json')
var DEFAULT_LICENSE = 'Attribution-ShareAlike 4.0 International'

pkg = fs.existsSync(pkg) ? require(pkg) : {files: []}

base.deck = null
base.dir = null

var allFiles = (pkg.files || []).concat(base.files).reduce(function (p, c) {
  if (p.indexOf(c) < 0) p.push(c)
  return p
}, [])

// ensures name goes at top:
exports.name = ''

extend(exports, base, pkg)

exports.name = processName(argv.name) ||
  prompt('name', pkg.name || path.basename(dir), processName)

exports.author = argv.author ||
  prompt('author', (exec('npm get init.author.name') + '').trim())

exports.license = argv.license ||
  prompt('license', exec('npm get init.license') + '', DEFAULT_LICENSE) ||
  DEFAULT_LICENSE

exports.dependencies = exports.dependencies || {}

exports.skin = argv.skin || prompt('skin', exports.skin, processSkinAndSetDependency)

exports.files = allFiles

function processSkinAndSetDependency (skin) {
  skin = processSkin(skin)
  exports.dependencies[skin.name] = skin.version ||
    '^' + (exec('npm info ' + skin.name + ' version') + '').trim()
  return skin.name
}

function processSkin (skin) {
  var split = skin.split('@')
  // scoped module with version
  if (skin[0] === '@' && (split.length > 2)) {
    return {
      name: '@' + split.filter(Boolean)[0],
      version: '^' + split.pop()
    }
  }

  // non scoped with version
  if (skin[0] !== '@' && ~skin.indexOf('@')) {
    return {
      name: split[0],
      version: '^' + split.pop()
    }
  }

  // either scoped or unscoped, no version:
  return {
    name: skin
  }
}

function processName (name) {
  if (!name) {
    return ''
  }
  if (scope) {
    name = name.replace(RegExp('^' + scope + '/'), '')
  }
  if (!/-deck$/.test(name)) {
    name += '-deck'
  }
  name = scope + name
  return name
}
