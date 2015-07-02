#!/usr/bin/env coffee

Promise = require('bluebird')
meow = require('meow')
fs = require('fs-extra-promise')
path = require('path')
parser = require('post-parse')
save = require('post-save')
chalk = require('chalk')

# Color settings
error = chalk.bold.red
info = chalk.bold.green
info_high = chalk.bold.yellow
info_low = chalk.white.dim

cli = meow(
  help: [
    'Usage',
    ' genc <dir>',
    '',
    ' $ genc ~/Dropbox/Articles',
  ].join('\n')
)

directory = cli.input[0]
unless directory?
  console.log(error("Oops! Needs a directory."))
  process.exit 1

console.log info("Processing #{directory}")
parser(directory)
  .then((posts) -> return save('build', posts))
  .catch((e) -> console.log e)
