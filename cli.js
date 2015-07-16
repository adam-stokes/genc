#!/usr/bin/env node
"use strict";

var co = require("co");
var program = require("commander");
var gencConf = require("./package.json");
var genc = require(".");

co(function*() {
    program.version(gencConf.version);

    program.on("-h, --help", function(){
        console.log("  Commands:");
        console.log();
        console.log("    init [dir]      Initialize a genc site");
        console.log("    gen-config      Prints a skeleton config");
        console.log("    generate        Generate site");
        console.log();
        throw Error();
    });

    program.parse(process.argv);

    var args = process.argv.slice(3);
    var cmd = program.args[0];

    if (!cmd) {
        program.help();
    }

    switch(cmd) {
    case "init":
        yield genc.init(args[0]);
        break;
    case "gen-config":
        genc.log("info", genc.genConfig());
        break;
    case "generate":
    case "compile":
    default:
        genc.log("info", "Starting genc...");
        yield genc.posts();
    }
}).catch(function(e) {
    genc.log("error", e);
});
