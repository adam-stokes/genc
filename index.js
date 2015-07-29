"use strict";

var promise = require("native-or-bluebird");
var fs = require("mz/fs");
var fm = require("fastmatter");
var isDir = require("is-dir-promise");
var join = require("path").join;
var mkdirp = promise.promisify(require("mkdirp"));
var rmdir = promise.promisify(require("rimraf"));
var marked = require("marked");
var moment = require("moment");
var editor = require("editor");
var _ = require("lodash");
var jade = require("jade");
var string = require("string");
var Log = require("log");
var log = new Log();

function Genc(conf){
    this.conf = conf;
    this.srcContent = "src/content";
    this.srcTemplate = "src/templates";
}

Genc.prototype.clean = function(){
    return rmdir("build");
};

Genc.prototype.template = function(name, ctx){
    var tmplPath = join(this.srcTemplate, name);
    var jadeFn = jade.compileFile(tmplPath);
    return jadeFn(ctx);
};

Genc.prototype.newPost = function*(title, tags){
    log.info("New post: %s, tags: %s", title, tags);
    if (tags != null) {
        tags = "[" + tags + "]";
    } else {
        tags = "[]";
    }

    var fullPath = join(this.srcContent, title + ".md");
    var timestamp = moment.utc().format();
    var template = "---\ntitle: " +
        title +
        "\ndate: " +
        timestamp +
        "\ntags: " +
        tags +
        "\ntemplate: post.jade" +
        "\n---\n\n# Write your post here\n\nFill in whatever blogish topic you want.";
    if (yield isDir(this.srcContent)){
        yield fs.writeFile(fullPath, template);
        return yield editor(fullPath);
    }
};

Genc.prototype.collection = function(){
    var self = this;
    if (!isDir(self.srcContent)) {
        throw Error("Posts directory not found.");
    }
    return fs.readdir(this.srcContent)
        .then(function(files){
            var out = [];
            _.each(files, function(f) {
                var body = fs.readFileSync(join(self.srcContent, f), "utf8");
                var matter = fm(body.toString());
                var meta = {
                    body: marked(matter.body),
                    filename: join(self.srcContent, f)
                };
                _.merge(meta, matter.attributes);
                var noPermalink = meta.permalink === undefined;
                if (noPermalink) {
                    _.merge(meta, {
                        permalink: string(matter.attributes.title).slugify().s
                    });
                }
                var noTemplate = meta.tempalte === undefined;
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

Genc.prototype.init = function*(){
    var dirs = ["content", "templates", "static"];
    log.info("Initializing directories [%s]", dirs);
    for (var dir of dirs){
        yield mkdirp(join("src", dir));
    }
};

Genc.prototype.writeSingle = function*(fullPath, c){
    log.debug("Building: %s (permalink: %s)", c.filename, c.permalink);
    yield mkdirp(fullPath);
    log.debug("Applying Template: (%s) -> %s", c.template, c.title);
    var out = this.template(c.template, c);
    yield fs.writeFile(join(fullPath, "index.html"), out);
};

Genc.prototype.writeCollection = function*(path, template, ctx){
    var out = this.template(template, {items: ctx});
    yield fs.writeFile(path, out);
};

Genc.prototype.build = function*(){
    var content = yield this.collection();
    yield this.writeCollection("build/index.html", "index.jade", content);
    yield this.writeCollection("build/feed.xml", "index.jade", content);
    yield this.writeCollection("build/sitemap.xml", "index.jade", content);
    for (var c of content){
        yield this.writeSingle(join("build", c.permalink), c);
    }
};

module.exports = Genc;
