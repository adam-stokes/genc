#!/usr/bin/env node

"use strict";

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _index = require('./index');

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function usage() {
    console.log('usage: genc --source SOURCE --output OUTDIR --post-template <post>.pug --list-template <list>.pug\n\n Options:\n  --source DIR    directory of posts\n  --output DIR    directory to store build\n  --post-template path to single post template\n  --list-template path to posts listing template\n  -h              show help\n            ');
    process.exit();
}

function start() {
    var argv;
    return _regenerator2.default.async(function start$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    argv = (0, _minimist2.default)(process.argv.slice(2), {
                        string: ['source', 'post-template', 'list-template', 'output'],
                        boolean: ['--help'],
                        alias: {
                            help: 'h'
                        }
                    });


                    (0, _debug2.default)(argv);

                    if (argv.help) {
                        usage();
                    }

                    if (!argv.source || !argv.output || !argv['post-template'] || !argv['list-template']) {
                        _winston2.default.error('Needs --source,  --output, --post-template, and --list-template set.');
                        usage();
                    }

                    _context.prev = 4;
                    _context.next = 7;
                    return _regenerator2.default.awrap((0, _index.collection)(argv.source, argv.output, argv['post-template'], argv['list-template']));

                case 7:
                    _context.next = 12;
                    break;

                case 9:
                    _context.prev = 9;
                    _context.t0 = _context['catch'](4);

                    (0, _debug2.default)(_context.t0);

                case 12:
                case 'end':
                    return _context.stop();
            }
        }
    }, null, this, [[4, 9]]);
}

start().catch(function (err) {
    return (0, _debug2.default)(err);
});