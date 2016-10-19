#!/usr/bin/env node
"use strict";

import minimist from 'minimist';
import {collection} from './index';
import pkg from '../package.json';
import debug from './debug';
import log from 'winston';
import isfile from 'is-file-promise';

log.level = 'debug';

function usage() {
    console.log(
            `usage: genc

 Options:
  -h              show help
            `);
    process.exit();
}

async function start() {
    let argv = minimist(process.argv.slice(2), {
        boolean: ['--help'],
        alias: {
            help: 'h'
        }
    });

    debug(argv);

    if (argv.help) {
        usage();
    }

    if(await !isfile('_templates/index.pug') || await !isfile('_templates/post.pug')) {
        log.debug("Unable to find _templates/{index,post}.pug.");
        process.exit();
    }

    try {
        await collection();
    } catch (err) {
        debug(err);
    }
}

start().catch((err) => debug(err));
