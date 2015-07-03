#!/usr/bin/env coffee

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
    ' -c --config <file>  Config file for site (config.coffee)'
    'eg:'
    ' $ genc ~/Dropbox/Articles',
  ].join('\n')
)

# config items
configFile = cli.flags.config || cli.flags.c
unless configFile?
  console.log(error("Need to pass a --config file."))
try
  config = require(path.resolve("#{configFile}"))
  config.init()
catch e
  console.log error("Unable to load config file: #{e}")
  process.exit 1

directory = cli.input[0]

unless directory?
  console.log(error("Oops! Needs a directory."))
  process.exit 1

parser(directory)
  .then((posts) ->
    console.log info_high("Generating individual posts.")
    for post in posts
      save.single('build', config.templates.single, post)
    return posts)
  .then((posts) ->
    console.log info_high("Generating feed.")
    save.collection('build', config.templates.feed, 'feed.xml', posts)
    return posts)
  .then((posts) ->
    console.log info_high("Generating sitemap.")
    save.collection('build', config.templates.sitemap, 'sitemap.xml', posts)
    return posts)
  .then((posts) ->
    console.log info_high("Generating index")
    return save.collection('build', config.templates.home, 'index.html', posts))
  .catch((e) -> console.log "Problem: #{e}")
