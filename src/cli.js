#!/usr/bin/env node
"use strict";

import minimist from 'minimist';
import {collection} from './index';
import pkg from '../package.json';
import debug from './debug';
import log from 'winston';

function usage() {
    console.log(
            `usage: genc --source SOURCE --output OUTDIR --post-template <post>.pug --list-template <list>.pug

 Options:
  --source DIR    directory of posts
  --output DIR    directory to store build
  --post-template path to single post template
  --list-template path to posts listing template
  -h              show help
            `);
    process.exit();
}

async function start() {
    let argv = minimist(process.argv.slice(2), {
        string: ['source', 'post-template', 'list-template', 'output'],
        boolean: ['--help'],
        alias: {
            help: 'h'
        }
    });

    debug(argv);

    if (argv.help) {
        usage();
    }

    if (!argv.source || !argv.output || !argv['post-template'] || !argv['list-template']) {
        log.error('Needs --source,  --output, --post-template, and --list-template set.');
        usage();
    }

    try {
        await collection(argv.source, argv.output, argv['post-template'], argv['list-template']);
    } catch (err) {
        debug(err);
    }
}

start().catch((err) => debug(err));
