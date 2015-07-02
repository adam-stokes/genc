#!/usr/bin/env coffee

Promise = require('bluebird')
meow = require('meow')
fs = require('fs-extra-promise')
path = require('path')
parser = require('post-parse')
save = require('post-save')
template = require('post-template')
chalk = require('chalk')

# Color settings
error = chalk.bold.red
info = chalk.bold.green
info_high = chalk.bold.yellow
info_low = chalk.white.dim

# config items
try
  config = require('./config')
catch e
  console.log error("Cannot find config.js in cwd. Please create that file.")
  process.exit 1

cli = meow(
  help: [
    'Usage',
    ' genc <dir>',
    '',
    'eg:'
    ' $ genc ~/Dropbox/Articles',
  ].join('\n')
)

directory = cli.input[0]

unless directory?
  console.log(error("Oops! Needs a directory."))
  process.exit 1

console.log info("Processing #{directory}")
parser(directory)
  .then((posts) ->
    return template(config.templates.single, posts)
      .then(save('build', posts)))
  .then((posts) -> return template(config.templates.feed, posts))
  .then((posts) -> return template(config.templates.sitemap, posts))
  .then((posts) -> return template(config.templates.home, posts))
  .then((posts) -> return save('build', posts))
  .catch((e) -> console.log e)
