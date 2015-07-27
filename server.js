"use strict";

var Hapi = require("hapi");
var Good = require("good");
var Yar = require("yar");
var config = require("./config");

var server = new Hapi.Server();

server.connection({
    port: 8080
});

var yarOpts = {
    cookieOptions: {
        password: "il0vec00kiez",
        isSecure: false
    }
};

server.register({
    register: Yar,
    options: yarOpts
}, function(err) {
    if (err) {
        throw Error(err);
    }
});

server.views({
    engines: {
        hbs: require("handlebars")
    },
    relativeTo: __dirname,
    path: "./templates",
    layoutPath: "./templates/layout",
    layout: "default",
    helpersPath: "./templates/helpers",
    partialsPath: "./templates/partials",
    context: config
});

server.route({
    path: "/favicon.ico",
    method: "GET",
    handler: {
        file: "./favicon.ico"
    }
});

server.route({
    path: "/static/{path*}",
    method: "GET",
    handler: {
        directory: {
            path: "./static",
            listing: false,
            index: false
        }
    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require("good-console"),
            events: {
                response: "*",
                log: "*"
            }
        }]
    }
}, function(err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function() {
        server.log("info", "Server running at: " + server.info.uri);
    });
});
