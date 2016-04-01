'use strict';

import pify from 'pify';
import fs from 'mz/fs';
import jade from 'jade';
import log from 'winston';
import _  from 'lodash';
import fm from 'fastmatter';
// const fm = require("fastmatter");
// const isFile = require("is-file-promise");
// const join = require("path").join;
// const mkdirp = pify(require("mkdirp"));
// const rmdir = pify(require("rimraf"));
// const marked = require("marked");
// const moment = require("moment");
// const string = require("string");

export default class {
    constructor(args) {
        this.args = args;
        this.src = args.src;
        // this.template = jade.compileFile(args.template);
    }
    async collection() {
        log.info("Querying %s", this.src);
        let items = await fs.readdir(this.src);
        for (let i of items) {
            log.info("processing: %s", i);
            let body = await fs.readFile(join(this.src, i), 'utf8');
            let matter = await pify(fm)(body.toString());
        }
        //         let out = [];
        //         _.each(files, (f) => {
        //             let body = fs.readFileSync(join(this.src, f), "utf8");
        //             let matter = fm(body.toString());
        //             let meta = {
        //                 body: marked(matter.body),
        //                 filename: join(this.src, f)
        //             };
        //             _.merge(meta, matter.attributes);
        //             let noPermalink = meta.permalink === undefined;
        //             if (noPermalink) {
        //                 _.merge(meta, {
        //                     permalink: string(matter.attributes.title).slugify().s
        //                 });
        //             }
        //             let noTemplate = meta.template === undefined;
        //             if (noTemplate){
        //                 _.merge(meta, {
        //                     template: "post.jade"
        //                 });
        //             }
        //             out.push(meta);
        //         });
        //         return promise.all(_.sortByAll(out, ["date"]));
        // });
    }
    async writeSingle(path, c) {
        log.info("Building: %s (permalink: %s)", c.filename, c.permalink);
        await mkdirp(fullPath);
        let out = this.template(c);
        await fs.writeFile(join(fullPath, "index.html"), out);
    }
    async writeCollection(path, ctx) {
        let out = this.template({items: ctx});
        await fs.writeFile(path, out);
    }
    async build() {
        let content = await this.collection();
        await this.writeCollection("build/index.html", content);
        await this.writeCollection("build/feed.xml", content);
        await this.writeCollection("build/sitemap.xml", content);
        for (let c of content) {
            log.info("context: "+ c);
            await this.writeSingle(join("build", c.permalink), c);
        }
    }
};
