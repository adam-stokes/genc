"use strict";

var promise = require("native-or-bluebird");
var jsonfile = require("jsonfile");
var mkdirp = promise.promisify(require("mkdirp"));
var join = require("path").join;

jsonfile.spaces = 2;
var saveJson = promise.promisify(jsonfile.writeFile, jsonfile);

function Post(config, spec){
    this.spec = spec;
    this.config = config;
}

Post.prototype.create = function*(){
    yield mkdirp(join(this.config.buildDir, this.spec.title));
};
