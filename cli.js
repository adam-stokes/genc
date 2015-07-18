#!/usr/bin/env node
"use strict";

var co = require("co");
var Argparse = require("argparse").ArgumentParser;
var gencConf = require("./package.json");
var genc = require(".");

co(function*() {
    var parser = new Argparse({
        version: gencConf.version,
        addHelp: true,
        description: "genc - static site generator"
    });

    var subparser = parser.addSubparsers({
        title: "subcommands",
        dest: "command"
    });

    var newPost = subparser.addParser("new", {addHelp: true, help: "new help"});
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
            help: "Creates a new page or post."
        }
    );

    subparser.addParser("gen-config", {addHelp: true, help: "gen-config help"});
    subparser.addParser("build", {addHelp: true, help: "Build your site."});

    var args = parser.parseArgs();
    if(args.command === "new"){
        yield genc.newPost(args.title, args.tags);
    }
    if (args.command === "gen-config"){
        console.log(genc.genConfig());
    }
    if (args.command === "build"){
        yield genc.generate();
    }
}).catch(function(e) {
    genc.log("error", e);
});
