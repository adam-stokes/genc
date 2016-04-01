#!/usr/bin/env node
"use strict";

import {ArgumentParser} from 'argparse';
import Genc from './index';
import log from 'winston';
import pkg from '../package.json';

async function start() {
    let parser = new ArgumentParser({
        version: pkg.version,
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
    log.info(app);
    try {
        await app.collection();
    } catch (err) {
        log.info(err);
    }
}

start().catch((err) => log.info(err));
