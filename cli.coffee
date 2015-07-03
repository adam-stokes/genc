#!/usr/bin/env coffee

meow = require('meow')
fs = require('fs-extra-promise')
path = require('path')
parser = require('post-parse')
save = require('post-save')
logSym = require('log-symbols')

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
  console.log(logSym.error, "Need to pass a --config file.")
try
  config = require(process.cwd() + '/config.coffee')
catch e
  console.log(logSym.error, "Unable to load config file: #{e}")
  process.exit 1

directory = cli.input[0]

unless directory?
  console.log(logSym.error, "Oops! Needs a directory.")
  process.exit 1

parser(directory)
  .then((posts) ->
    console.log(logSym.info, "Generating individual posts.")
    for post in posts
      save.single('build', hb.templates['single'], post)
    return posts)
  .then((posts) ->
    console.log(logSym.info, "Generating feed.")
    save.collection('build', hb.templates['feed'], 'feed.xml', posts)
    return posts)
  .then((posts) ->
    console.log(logSym.info, "Generating sitemap.")
    save.collection('build', hb.templates['sitemap'], 'sitemap.xml', posts)
    return posts)
  .then((posts) ->
    console.log(logSym.info, "Generating index")
    return save.collection('build', hb.templates['home'], 'index.html', posts))
  .catch((e) -> console.log "Problem: #{e}")
