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
    console.log('usage: genc --src SRC -o OUTDIR\n\n Options:\n  --src DIR       source directory of posts\n  -o, --output DIR directory to store build\n  -h              show help\n            ');
    process.exit();
}

function start() {
    var argv;
    return _regenerator2.default.async(function start$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    argv = (0, _minimist2.default)(process.argv.slice(2), {
                        string: ['src', 'template', 'output'],
                        boolean: ['--help'],
                        alias: {
                            help: 'h',
                            output: 'o'
                        }
                    });


                    if (argv.help) {
                        usage();
                    }

                    if (!argv.src || !argv.output) {
                        _winston2.default.error('Needs --src, and --output set.');
                        usage();
                    }

                    _context.prev = 3;
                    _context.next = 6;
                    return _regenerator2.default.awrap((0, _index.collection)(argv.src, argv.output));

                case 6:
                    _context.next = 11;
                    break;

                case 8:
                    _context.prev = 8;
                    _context.t0 = _context['catch'](3);

                    (0, _debug2.default)(_context.t0);

                case 11:
                case 'end':
                    return _context.stop();
            }
        }
    }, null, this, [[3, 8]]);
}

start().catch(function (err) {
    return (0, _debug2.default)(err);
});