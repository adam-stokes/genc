"use strict";

var promise = require("bluebird");
var parse = require("genc-parse");
var isDir = require("is-dir");
var isFile = require("is-file-promise");
var expandUser = require("expand-tilde");
var is = require("is");
var debug = require("debug")("genc");
var jsonfile = require("jsonfile");
var join = require("path").join;
var mkdirp = promise.promisify(require("mkdirp"));
var colors = require("colors");

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

Genc.prototype.log = function(level, msg){
    switch(level){
    case "error":
        console.log(colors.bold.red(msg));
        break;
    case "info":
    default:
        console.log(colors.bold.cyan("Info: %s"), msg);
    }
};

Genc.prototype.genConfig = function(){
    return JSON.stringify(this.conf, null, 2);
};

Genc.prototype.posts = function(){
    if (!isDir(this.conf.blogPostsDir)) {
        debug("Problem with posts()");
        throw Error("Posts directory not found.");
    }
    return parse(this.conf.blogPostsDir);
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

Genc.prototype.generate = function*(){
    if (yield isFile(join(process.cwd(), ".genc.json"))){
        return yield this.posts();
    }
};

module.exports = new Genc();
