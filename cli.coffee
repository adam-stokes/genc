#!/usr/bin/env coffee

Promise = require('bluebird')
meow = require('meow')
fs = require('fs-extra-promise')
path = require('path')
parser = require('post-parse')

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
  console.error "Needs a directory."
  process.exit 1

console.log "Processing #{directory}"
parser(directory)
  .then((posts) ->
    for post in posts
      console.log "Title: #{post.title}"
    return)
  .catch((e) -> console.log e)
