"use strict";

const promise = require('pinkie-promise');
const pify = require('pify');
const fs = require("mz/fs");
const fm = require("fastmatter");
const isFile = require("is-file-promise");
const join = require("path").join;
const mkdirp = pify(require("mkdirp"));
const rmdir = pify(require("rimraf"));
const marked = require("marked");
const moment = require("moment");
const _ = require("lodash");
const jade = require("jade");
const string = require("string");
const log = require('winston');

module.exports = Genc;

function Genc(args){
    this.args = args;
    this.src = args.src;
    if (!isFile(args.template)) {
        throw Error('Unknown file template.');
    }
    this.template = jade.compileFile(args.template);
}

Genc.prototype.collection = () => {
    log.info("Querying %s", this.src);
    return fs.readdir(this.src)
        .then((files) => {
            let out = [];
            _.each(files, (f) => {
                let body = fs.readFileSync(join(this.src, f), "utf8");
                let matter = fm(body.toString());
                let meta = {
                    body: marked(matter.body),
                    filename: join(this.src, f)
                };
                _.merge(meta, matter.attributes);
                let noPermalink = meta.permalink === undefined;
                if (noPermalink) {
                    _.merge(meta, {
                        permalink: string(matter.attributes.title).slugify().s
                    });
                }
                let noTemplate = meta.template === undefined;
                if (noTemplate){
                    _.merge(meta, {
                        template: "post.jade"
                    });
                }
                out.push(meta);
            });
            return promise.all(_.sortByAll(out, ["date"]));
        });
};

Genc.prototype.writeSingle = function*(fullPath, c){
    log.info("Building: %s (permalink: %s)", c.filename, c.permalink);
    yield mkdirp(fullPath);
    let out = this.template(c);
    yield fs.writeFile(join(fullPath, "index.html"), out);
};

Genc.prototype.writeCollection = function*(path, ctx){
    let out = this.template({items: ctx});
    yield fs.writeFile(path, out);
};

Genc.prototype.build = function*(){
    let content = yield this.collection();
    yield this.writeCollection("build/index.html", content);
    yield this.writeCollection("build/feed.xml", content);
    yield this.writeCollection("build/sitemap.xml", content);
    for (let c of content){
        log.info("context: "+ c);
        yield this.writeSingle(join("build", c.permalink), c);
    }
};

