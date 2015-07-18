"use strict";

var promise = require("native-or-bluebird");
var parse = require("genc-parse");
var fs = require("mz/fs");
var isDir = require("is-dir");
var isFile = require("is-file-promise");
var expandUser = require("expand-tilde");
var is = require("is");
var jsonfile = require("jsonfile");
var join = require("path").join;
var mkdirp = promise.promisify(require("mkdirp"));
var moment = require("moment");
var editor = require("editor");
var Collection = require("./collection");
var debug = require("debug")("genc:init");

jsonfile.spaces = 2;
var writeJson = promise.promisify(jsonfile.writeFile, jsonfile);

function Genc(){
    this.conf = {
        sitename: null,
        slogan: null,
        description: null,
        author: null,
        title: null,
        templateDir: "templates",
        partialDir: "templates/partials",
        assetsDir: "static",
        blogPostsDir: expandUser("~/Dropbox/Articles")
    };
}

Genc.prototype.newPost = function*(title, tags){
    this.debug.log("New post: %s, tags: %s", title, tags);
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
    if (isDir(this.conf.blogPostsDir)){
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

Genc.prototype.init = function*(dir){
    if(!is.string(dir)) {
        throw Error("Must define a directory.");
    }
    if(isDir(dir)) {
        throw Error("Directory already exists, not overwriting.");
    }
    yield mkdirp(dir);
    yield writeJson(join(dir, ".genc.json"), this.conf);
    var tplDirs = ["templates/partials", "src"];
    for(var dst of tplDirs){
        yield mkdirp(join(dir, dst));
    }
};

Genc.prototype.export = function*(){
    if (yield isFile(join(process.cwd(), ".genc.json"))){
        return yield this.posts();
    }
};

module.exports = Genc;
