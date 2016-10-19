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

var _isFilePromise = require('is-file-promise');

var _isFilePromise2 = _interopRequireDefault(_isFilePromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_winston2.default.level = 'debug';

function usage() {
    console.log('usage: genc\n\n Options:\n  -h              show help\n            ');
    process.exit();
}

function start() {
    var argv;
    return _regenerator2.default.async(function start$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    argv = (0, _minimist2.default)(process.argv.slice(2), {
                        boolean: ['--help'],
                        alias: {
                            help: 'h'
                        }
                    });


                    (0, _debug2.default)(argv);

                    if (argv.help) {
                        usage();
                    }

                    _context.next = 5;
                    return _regenerator2.default.awrap(!(0, _isFilePromise2.default)('_templates/index.pug'));

                case 5:
                    _context.t0 = _context.sent;

                    if (_context.t0) {
                        _context.next = 10;
                        break;
                    }

                    _context.next = 9;
                    return _regenerator2.default.awrap(!(0, _isFilePromise2.default)('_templates/post.pug'));

                case 9:
                    _context.t0 = _context.sent;

                case 10:
                    if (!_context.t0) {
                        _context.next = 13;
                        break;
                    }

                    _winston2.default.debug("Unable to find _templates/{index,post}.pug.");
                    process.exit();

                case 13:
                    _context.prev = 13;
                    _context.next = 16;
                    return _regenerator2.default.awrap((0, _index.collection)());

                case 16:
                    _context.next = 21;
                    break;

                case 18:
                    _context.prev = 18;
                    _context.t1 = _context['catch'](13);

                    (0, _debug2.default)(_context.t1);

                case 21:
                case 'end':
                    return _context.stop();
            }
        }
    }, null, this, [[13, 18]]);
}

start().catch(function (err) {
    return (0, _debug2.default)(err);
});