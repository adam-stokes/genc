"use strict";

var promise = require("native-or-bluebird");
var fs = require("mz/fs");
var fm = require("fastmatter");
var isDir = require("is-dir-promise");
var join = require("path").join;
var mkdirp = promise.promisify(require("mkdirp"));
var rmdir = promise.promisify(require("rimraf"));
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
    if (!isDir("src/content")) {
        throw Error("Posts directory not found.");
    }
    return fs.readdir(this.srcContent)
        .then(function(files){
            var out = [];
            _.each(files, function(f) {
                var body = fs.readFileSync(join(self.srcContent, f), "utf8");
                var matter = fm(body.toString());
                var meta = {
                    body: matter.body,
                    filename: join(self.srcContent, f)
                };
                _.merge(meta, matter.attributes);
                var noPermalink = meta.permalink === undefined;
                if (noPermalink) {
                    _.merge(meta, {
                        permalink: string(matter.attributes.title).slugify().s
                    });
                }
                out.push(meta);
            });
            return out;
        });
};

Genc.prototype.init = function*(){
    var dirs = ["content", "templates", "static"];
    log.info("Initializing directories [%s]", dirs);
    for (var dir of dirs){
        yield mkdirp(join("src", dir));
    }
};

Genc.prototype.build = function*(){
    yield this.clean();
    var content = yield this.collection();
    for (var c of content){
        var fullPath = join("build", c.permalink);
        yield mkdirp(fullPath);
        var out = this.template(c.template, c);
        yield fs.writeFile(join(fullPath, "index.html"), out);
    }
};

module.exports = Genc;
