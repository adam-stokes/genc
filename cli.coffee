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
  .catch((e) -> console.log e)
