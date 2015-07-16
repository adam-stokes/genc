#!/usr/bin/env node
"use strict";

var co = require("co");
var promise = require("bluebird");
var program = require("commander");
var gencConf = require("./package.json");
var genc = require(".");
var fs = require("mz/fs")
var parse = require("genc-parse");
// save = require("post-save")
var isFile = promise.promisify(require("is-file"));
var isDir = promise.promisify(require("is-dir"));
var is = require("is");
var assert = require("assert");
var debug = require("debug")("genc");
var jsonfile = require("jsonfile");
var join = require("path").join;
var mkdirp = require("mkdirp");
var _ = require("lodash");

jsonfile.spaces = 2;

co(function*() {
    program
        .version("genc v%s", gencConf.version);

    program
        .command("init [dir]")
        .description("Initialize a genc site")
        .action(function(dir){
            assert(is.string(dir), "Must define a directory.");
            assert(yield isDir(dir), "Directory already exists, not overwriting.");
            debug("Generating skeleton");
            jsonfile.writeFileSync(join(dir, "genc.json"), genc.genConfig());
            _.each(["templates/partials", "static"], function(dst){
                mkdirp.sync(join(dir, dst));
            });
        });

    program
        .command("gen-config")
        .description("Prints a skeleton config")
        .action(function(){
            debug(genc.genConfig());
        });

    program
        .command("generate")
        .description("Generate site")
        .alias("compile")
        .action(function() {
            assert(yield isFile(join(process.cwd(), "genc.json")), "No genc.json found.");
            debug("Generating site");
            Genc
                .posts()
                .templates()

        });
    program.parse(process.argv);
}).catch(function(e) {
    debug(e);
    process.exit 1;
});

 // ParserAsync(directory)
 //   .then((posts) ->
 //     console.log(logSym.info, "Generating individual posts.")
 //     for post in posts
 //       save.singleAsync("build", config.templates["single"], post)
 //     return posts)
 //   .then((posts) ->
 //     console.log(logSym.info, "Generating feed.")
 //     save.collectionAsync("build", config.templates["feed"],
 //       "feed.xml", posts)
 //     return posts)
 //   .then((posts) ->
 //     console.log(logSym.info, "Generating sitemap.")
 //     save.collectionAsync("build", config.templates["sitemap"],
 //       "sitemap.xml", posts)
 //     return posts)
 //   .then((posts) ->
 //     console.log(logSym.info, "Generating index")
 //     return save.collectionAsync("build", config.templates["home"],
 //       "index.html", posts))
 //  .then(->
 //     return console.log(logSym.success, "Completed!"))
 //   .catch((e) -> console.log(logSym.error, "Problem: #{e}"))
