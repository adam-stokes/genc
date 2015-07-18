"use strict";

var promise = require("native-or-bluebird");
var fs = require("mz/fs");
var _ = require("lodash");
var Log = require("log");
var log = new Log();

function Collection(files){
    this.files = files;
}

Collection.prototype.first = function*(){
    yield _.first(this.files);
};

Collection.prototype.export = function*(){
    _.each(this.files, function(f){
        log.info("Exporting: %s", f.title);
    });
    return yield true;
};
