"use strict";

var promise = require("native-or-bluebird");
var parse = require("genc-parse");
var fs = require("mz/fs");
var isDir = require("is-dir-promise");
var isFile = require("is-file-promise");
var jsonfile = require("jsonfile");
var join = require("path").join;
var mkdirp = promise.promisify(require("mkdirp"));
var moment = require("moment");
var editor = require("editor");
var Collection = require("./collection");
var Log = require("log");
var log = new Log();

jsonfile.spaces = 2;
var writeJson = promise.promisify(jsonfile.writeFile, jsonfile);

function Genc(conf){
    this.conf = conf;
}

Genc.prototype.newPost = function*(title, tags){
    log.info("New post: %s, tags: %s", title, tags);
    if (tags != null) {
        tags = "[" + tags + "]";
    } else {
        tags = "[]";
    }

    var fullPath = join(this.conf.blogPostsDir, title + ".md");
    var timestamp = moment.utc().format();
    var template = "---\ntitle: " +
        title +
        "\ndate: " +
        timestamp +
        "\ntags: " +
        tags +
        "\n---\n\n# Write your post here\n\nFill in whatever blogish topic you want.";
    if (yield isDir(this.conf.blogPostsDir)){
        yield fs.writeFile(fullPath, template);
        return yield editor(fullPath);
    }
};

Genc.prototype.config = function(){
    return JSON.stringify(this.conf);
};

Genc.prototype.collection = function(){
    if (!isDir(this.conf.blogPostsDir)) {
        throw Error("Posts directory not found.");
    }
    return new Collection(parse(this.conf.blogPostsDir));
};

Genc.prototype.init = function*(){
    var dirs = ["posts", "pages", "templates", "static"];
    for (var dir of dirs){
        yield mkdirp(join("src", dir));
    }
};

Genc.prototype.export = function*(){
    if (yield isFile(join(process.cwd(), ".genc.json"))){
        return yield this.posts();
    }
};

module.exports = Genc;
