#!/usr/bin/env node
"use strict";

var co = require("co");
var Argparse = require("argparse").ArgumentParser;
var gencConf = require("./package.json");
var Genc = require(".");
var fs = require("mz/fs");
var toml = require("toml");
var Log = require("log");
var log = new Log();

co(function*() {
    var app = new Genc(toml.parse(yield fs.readFile("./config.toml")));
    var parser = new Argparse({
        version: gencConf.version,
        addHelp: true,
        description: "genc - the opinionated static site generator"
    });

    var subparser = parser.addSubparsers({
        title: "subcommands",
        dest: "command"
    });

    var newPost = subparser.addParser("new", {addHelp: true, help: "Create a new page/post."});
    newPost.addArgument(
        ["title"],
        {
            help: "Title of page."
        }
    );
    newPost.addArgument(
        ["-t", "--tags"],
        {
            action: "store",
            help: "Tags associated with article."
        }
    );

    subparser.addParser("init", {addHelp: true, help: "Initialize a project."});
    subparser.addParser("build", {addHelp: true, help: "Build your site."});

    var args = parser.parseArgs();
    if(args.command === "new"){
        yield app.newPost(args.title, args.tags);
    }
    if (args.command === "build"){
        yield app.build();
    }
    if (args.command === "init"){
        yield app.init();
    }
}).catch(function(e) {
    log.error(e);
});
