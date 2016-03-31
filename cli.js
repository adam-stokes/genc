#!/usr/bin/env node
"use strict";

const co = require("co");
const Argparse = require("argparse").ArgumentParser;
const gencConf = require("./package.json");
const Genc = require(".");
const fs = require("mz/fs");
const join = require("path").join;
const log = require('winston');

co(function*() {
    let parser = new Argparse({
        version: gencConf.version,
        addHelp: true,
        description: "genc - the opinionated static site generator"
    });
    parser.addArgument(
        ["--src"],
        {
            action: "store",
            help: "Path where markdown files reside."
        }
    );

    parser.addArgument(
        ["--template"],
        {
            action: "store",
            help: "Template to bind to"
        }
    );

    let args = parser.parseArgs();
    let app = new Genc(args);
}).catch(function(e) {
    log.error(e);
});
