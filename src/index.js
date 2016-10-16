'use strict';

import pify from 'pify';
import glob from 'glob';
import fs from 'mz/fs';
import log from 'winston';
import _  from 'lodash';
import fm from 'fastmatter';
import {join} from 'path';
import marked from 'marked';
import debug from './debug';
import string from 'string';
import isfile from 'is-file-promise';
import isdir from 'is-dir-promise';
import mkdirp from 'mkdirp';
import rmdir from 'rimraf';
import moment from 'moment';
import pug from 'pug';

// parse post
async function parse(item, template) {
    let body = await fs.readFile(item, 'utf8');
    let matter = fm(body.toString());
    let meta = {
        body: await pify(marked)(matter.body),
        filename: item,
        template: template,
        moment: moment
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

async function render(dst, ctx) {
    let output = ctx.template(ctx);
    await pify(mkdirp)(join(dst, ctx.permalink));
    await fs.writeFile(join(dst, ctx.permalink, "index.html"), output);
    log.info(`Rendered ${ctx.date} - ${ctx.title}`);
}

export async function collection(source, destination, post_tpl, list_tpl) {
    if(await isdir(destination)) {
        await pify(rmdir)(destination);
    }
    await pify(mkdirp)(destination);

    let template = pug.compileFile(post_tpl);
    debug("reading directory %s", source);
    let items = await pify(glob)(`${source}/\*.md`);
    let promisedItems = items.map((i) => parse(i, template));
    let results = [];
    for (let promise of promisedItems) {
        results.push(await promise);
    }
    for (let res of _.sortBy(results, ['date'])) {
        await render(destination, res);
    }
    debug("generating index");
    let indexTemplate = pug.compileFile(list_tpl);
    let output = indexTemplate({posts: _.reverse(_.sortBy(results, ['date']))});
    await fs.writeFile(join(destination, 'index.html'), output);
    log.info(`Site built and located at ${destination}.`);
}
