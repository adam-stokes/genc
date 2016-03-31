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

function Genc(args){
    this.args = args;
    this.src = args.src;
    if (!isFile(args.template)) {
        throw Error('Unknown file template.');
    }
    this.template = jade.compileFile(args.template);
}

Genc.prototype.collection = () => {
    return fs.readdir(this.src)
        .then((files) => {
            let out = [];
            _.each(files, (f) => {
                let body = fs.readFileSync(join(this.srcContent, f), "utf8");
                let matter = fm(body.toString());
                let meta = {
                    body: marked(matter.body),
                    filename: join(this.srcContent, f)
                };
                _.merge(meta, matter.attributes);
                let noPermalink = meta.permalink === undefined;
                if (noPermalink) {
                    _.merge(meta, {
                        permalink: string(matter.attributes.title).slugify().s
                    });
                }
                let noTemplate = meta.tempalte === undefined;
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
    log.debug("Building: %s (permalink: %s)", c.filename, c.permalink);
    yield mkdirp(fullPath);
    log.debug("Applying Template: (%s) -> %s", c.template, c.title);
    let out = this.template(c.template, c);
    yield fs.writeFile(join(fullPath, "index.html"), out);
};

Genc.prototype.writeCollection = function*(path, template, ctx){
    let out = this.template(template, {items: ctx});
    yield fs.writeFile(path, out);
};

Genc.prototype.build = function*(){
    let content = yield this.collection();
    yield this.writeCollection("build/index.html", "index.jade", content);
    yield this.writeCollection("build/feed.xml", "index.jade", content);
    yield this.writeCollection("build/sitemap.xml", "index.jade", content);
    for (let c of content){
        yield this.writeSingle(join("build", c.permalink), c);
    }
};

module.exports = Genc;
