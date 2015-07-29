#!/usr/bin/env node
"use strict";

var co = require("co");
var Argparse = require("argparse").ArgumentParser;
var gencConf = require("./package.json");
var Genc = require(".");
var _ = require("lodash");
var fs = require("mz/fs");
var toml = require("toml");
var join = require("path").join;
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
    subparser.addParser("sitemap", {addHelp: true, help: "Generate a sitemap"});
    subparser.addParser("build", {addHelp: true, help: "Build your site."});
    var feed = subparser.addParser("feed", {addHelp: true, help: "Generate a RSS feed."});
    feed.addArgument(
        ["--tag"],
        {
            action: "store",
            help: "Filter by a tag."
        }
    );


    var args = parser.parseArgs();
    if(args.command === "new"){
        yield app.newPost(args.title, args.tags);
    }
    if (args.command === "feed"){
        yield app.writeFeed(args.tag, "feed.jade");
    }
    if (args.command === "build"){
        var collection = yield app.collection();
        yield app.writeCollection("build/index.html", "index.jade", collection);
    }
    if (args.command === "init"){
        yield app.init();
    }
}).catch(function(e) {
    log.error(e);
});
