"use strict";

var promise = require("bluebird");
var parse = require("genc-parse");
var isDir = require("is-dir");
var isFile = require("is-file");
var expandUser = require("expand-tilde");
var is = require("is");
var debug = require("debug")("genc");
var jsonfile = require("jsonfile");
var _ = require("lodash");
var join = require("path").join;
var mkdirp = promise.promisify(require("mkdirp"));
var colors = require("colors");

jsonfile.spaces = 2;

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
        console.log(colors.green("Info: %s"), msg);
    }
};

Genc.prototype.genConfig = function(){
    return JSON.stringify(this.conf, null, 2);
};

Genc.prototype.posts = function(){
    if (!isDir(this.conf.blogPostsDir)) {
        throw Error("Posts directory not found.");
    }
    return parse(this.conf.blogPostsDir);
};

Genc.prototype.init = function(dir){
    var self = this;
    debug("Generating skeleton in %s", dir);

    if(!is.string(dir)) {
        throw Error("Must define a directory.");
    }
    if(isDir(dir)) {
        throw Error("Directory already exists, not overwriting.");
    }
    return mkdirp(dir)
        .then(function(){
            return jsonfile.writeFileSync(join(dir, ".genc.json"), self.conf);
        }).then(function(){
            return _.each(["templates/partials", "static"], function(dst){
                mkdirp.sync(join(dir, dst));
            });
        })
        .catch(function(e){
            throw Error(e);
        });
};

Genc.prototype.generate = function(){
    if(!isFile(join(process.cwd(), ".genc.json"))){
        throw Error("No .genc.json found");
    }
    return this.posts();
};

module.exports = new Genc();
