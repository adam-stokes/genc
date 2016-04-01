#!/usr/bin/env node
"use strict";

import minimist from 'minimist';
import {collection} from './index';
import pkg from '../package.json';
import debug from './debug';
import log from 'winston';

function usage() {
    console.log(
            `usage: genc --src SRC --template TEMPLATE -o OUTDIR

 Options:
  --src DIR       source directory of posts
  --template FILE jade template filename
  -o, --output DIR directory to store build
  -h              show help
            `);
    process.exit();
}

async function start() {
    let argv = minimist(process.argv.slice(2), {
        string: ['src', 'template', 'output'],
        boolean: ['--help'],
        alias: {
            help: 'h',
            output: 'o'
        }
    });

    if (argv.help) {
        usage();
    }

    if (!argv.src || !argv.template || !argv.output) {
        log.error('Needs --src, --template, and --output set.');
        usage();
    }

    try {
        await collection(argv.src, argv.output, argv.template);
    } catch (err) {
        debug(err);
    }
}

start().catch((err) => debug(err));
