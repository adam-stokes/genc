'use strict';

import pify from 'pify';
import glob from 'glob';
import fs from 'mz/fs';
import jade from 'jade';
import log from 'winston';
import _  from 'lodash';
import fm from 'fastmatter';
import {join} from 'path';
import marked from 'marked';
import is from 'is';
import debug from './debug';
import string from 'string';
import isfile from 'is-file-promise';
import isdir from 'is-dir-promise';
import mkdirp from 'mkdirp';
import rmdir from 'rimraf';

async function parse(item, template) {
    let body = await fs.readFile(item, 'utf8');
    let matter = fm(body.toString());
    let meta = {
        body: await pify(marked)(matter.body),
        filename: item,
        template: template
    };
    _.merge(meta, matter.attributes);
    let noPermalink = meta.permalink === undefined;
    if (noPermalink) {
        _.merge(meta, {
            permalink: string(matter.attributes.title).slugify().s
        });
    }

    return meta;
}

async function render(ctx) {
    let compiled = jade.compileFile(ctx.template);
    let output = compiled(ctx);
    await pify(mkdirp)(join('build', ctx.permalink));
    await fs.writeFile(join('build', ctx.permalink, "index.html"), output);
    debug(`rendered ${ctx.title}`);
}

export async function collection(source, destination, template) {
    if(await isdir(destination)) {
        await pify(rmdir)(destination);
    }
    await pify(mkdirp)(destination);

    debug("reading directory %s", source);
    let items = await pify(glob)(`${source}/\*.md`);
    let promisedItems = items.map((i) => parse(i, template));
    let results = [];
    for (let promise of promisedItems) {
        results.push(await promise);
    }
    for (let res of results) {
        await render(res);
    }
}
