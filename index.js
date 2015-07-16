"use strict";

var promise = require("bluebird");
var parse = require("genc-parse");
var isDir = promise.promisify(require("is-dir"));
var assert = require("assert");
var expandUser = require("expand-tilde");

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
      blogPostsDir: expandUser("~/Dropbox/Articles/*")
    };
}

Genc.prototype.genConfig = function(){
    return JSON.stringify(this.conf, null, 2);
};

Genc.prototype.posts = function*(){
    assert(yield isDir(this.conf.blogPostsDir), "Posts directory not found.");
    return yield parse(this.conf.blogPostsDir);
};

module.exports = new Genc();
