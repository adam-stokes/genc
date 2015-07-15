#!/usr/bin/env coffee

program = require('commander')
GencConf = require('./package.json')
Fs = require('fs-extra-promise')
# ParserAsync = require('post-parse')
# save = require('post-save')
isFile = require('is-file')
isDir = require('is-dir')

program
  .version("genc v#{GencConf.version}")

program
  .command('init [dir]')
  .description('Initialize a genc site')
  .action (dir) ->
    unless dir?
      console.error "Must define a directory."
      process.exit 1
    if isDir(dir)
      console.error "#{dir} already exists, not overwriting."
      process.exit 1
    opts =
      sitename: null
      slogan: null
      description: null
      author: null
      title: null
      templateDir: "templates"
      partialDir: "templates/partials"
      assets: "static"
    console.log "Generating skeleton..."
    Fs.outputJsonSync("#{dir}/genc.json", opts)
    for newDir in ['templates/partials', 'static']
      Fs.mkdirsSync("#{dir}/#{newDir}")

program.parse(process.argv)

# ParserAsync(directory)
#   .then((posts) ->
#     console.log(logSym.info, "Generating individual posts.")
#     for post in posts
#       save.singleAsync('build', config.templates['single'], post)
#     return posts)
#   .then((posts) ->
#     console.log(logSym.info, "Generating feed.")
#     save.collectionAsync('build', config.templates['feed'],
#       'feed.xml', posts)
#     return posts)
#   .then((posts) ->
#     console.log(logSym.info, "Generating sitemap.")
#     save.collectionAsync('build', config.templates['sitemap'],
#       'sitemap.xml', posts)
#     return posts)
#   .then((posts) ->
#     console.log(logSym.info, "Generating index")
#     return save.collectionAsync('build', config.templates['home'],
#       'index.html', posts))
#   .then(->
#     return console.log(logSym.success, "Completed!"))
#   .catch((e) -> console.log(logSym.error, "Problem: #{e}"))
