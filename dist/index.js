'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.collection = collection;

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fastmatter = require('fastmatter');

var _fastmatter2 = _interopRequireDefault(_fastmatter);

var _path = require('path');

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _isFilePromise = require('is-file-promise');

var _isFilePromise2 = _interopRequireDefault(_isFilePromise);

var _isDirPromise = require('is-dir-promise');

var _isDirPromise2 = _interopRequireDefault(_isDirPromise);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _jade = require('jade');

var _jade2 = _interopRequireDefault(_jade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(item, template) {
    var body, matter, meta, noPermalink;
    return _regenerator2.default.async(function parse$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return _regenerator2.default.awrap(_fs2.default.readFile(item, 'utf8'));

                case 2:
                    body = _context.sent;
                    matter = (0, _fastmatter2.default)(body.toString());
                    _context.next = 6;
                    return _regenerator2.default.awrap((0, _pify2.default)(_marked2.default)(matter.body));

                case 6:
                    _context.t0 = _context.sent;
                    _context.t1 = item;
                    _context.t2 = template;
                    _context.t3 = _moment2.default;
                    meta = {
                        body: _context.t0,
                        filename: _context.t1,
                        template: _context.t2,
                        moment: _context.t3
                    };

                    _lodash2.default.merge(meta, matter.attributes);
                    noPermalink = meta.permalink === undefined;

                    if (noPermalink) {
                        _lodash2.default.merge(meta, {
                            permalink: (0, _string2.default)(matter.attributes.title).slugify().s
                        });
                    }

                    return _context.abrupt('return', meta);

                case 15:
                case 'end':
                    return _context.stop();
            }
        }
    }, null, this);
}

function render(ctx) {
    var output;
    return _regenerator2.default.async(function render$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    output = ctx.template(ctx);
                    _context2.next = 3;
                    return _regenerator2.default.awrap((0, _pify2.default)(_mkdirp2.default)((0, _path.join)('build', ctx.permalink)));

                case 3:
                    _context2.next = 5;
                    return _regenerator2.default.awrap(_fs2.default.writeFile((0, _path.join)('build', ctx.permalink, "index.html"), output));

                case 5:
                    (0, _debug2.default)('rendered ' + ctx.date + ' - ' + ctx.title);

                case 6:
                case 'end':
                    return _context2.stop();
            }
        }
    }, null, this);
}

function collection(source, destination) {
    var template, items, promisedItems, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, promise, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, res, indexTemplate, output;

    return _regenerator2.default.async(function collection$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.next = 2;
                    return _regenerator2.default.awrap((0, _isDirPromise2.default)(destination));

                case 2:
                    if (!_context3.sent) {
                        _context3.next = 5;
                        break;
                    }

                    _context3.next = 5;
                    return _regenerator2.default.awrap((0, _pify2.default)(_rimraf2.default)(destination));

                case 5:
                    _context3.next = 7;
                    return _regenerator2.default.awrap((0, _pify2.default)(_mkdirp2.default)(destination));

                case 7:
                    template = _jade2.default.compileFile((0, _path.join)(source, 'post.jade'));

                    (0, _debug2.default)("reading directory %s", source);
                    _context3.next = 11;
                    return _regenerator2.default.awrap((0, _pify2.default)(_glob2.default)(source + '/*.md'));

                case 11:
                    items = _context3.sent;
                    promisedItems = items.map(function (i) {
                        return parse(i, template);
                    });
                    results = [];
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context3.prev = 17;
                    _iterator = (0, _getIterator3.default)(promisedItems);

                case 19:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        _context3.next = 29;
                        break;
                    }

                    promise = _step.value;
                    _context3.t0 = results;
                    _context3.next = 24;
                    return _regenerator2.default.awrap(promise);

                case 24:
                    _context3.t1 = _context3.sent;

                    _context3.t0.push.call(_context3.t0, _context3.t1);

                case 26:
                    _iteratorNormalCompletion = true;
                    _context3.next = 19;
                    break;

                case 29:
                    _context3.next = 35;
                    break;

                case 31:
                    _context3.prev = 31;
                    _context3.t2 = _context3['catch'](17);
                    _didIteratorError = true;
                    _iteratorError = _context3.t2;

                case 35:
                    _context3.prev = 35;
                    _context3.prev = 36;

                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }

                case 38:
                    _context3.prev = 38;

                    if (!_didIteratorError) {
                        _context3.next = 41;
                        break;
                    }

                    throw _iteratorError;

                case 41:
                    return _context3.finish(38);

                case 42:
                    return _context3.finish(35);

                case 43:
                    _iteratorNormalCompletion2 = true;
                    _didIteratorError2 = false;
                    _iteratorError2 = undefined;
                    _context3.prev = 46;
                    _iterator2 = (0, _getIterator3.default)(_lodash2.default.sortBy(results, ['date']));

                case 48:
                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                        _context3.next = 55;
                        break;
                    }

                    res = _step2.value;
                    _context3.next = 52;
                    return _regenerator2.default.awrap(render(res));

                case 52:
                    _iteratorNormalCompletion2 = true;
                    _context3.next = 48;
                    break;

                case 55:
                    _context3.next = 61;
                    break;

                case 57:
                    _context3.prev = 57;
                    _context3.t3 = _context3['catch'](46);
                    _didIteratorError2 = true;
                    _iteratorError2 = _context3.t3;

                case 61:
                    _context3.prev = 61;
                    _context3.prev = 62;

                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }

                case 64:
                    _context3.prev = 64;

                    if (!_didIteratorError2) {
                        _context3.next = 67;
                        break;
                    }

                    throw _iteratorError2;

                case 67:
                    return _context3.finish(64);

                case 68:
                    return _context3.finish(61);

                case 69:
                    (0, _debug2.default)("generating index");
                    indexTemplate = _jade2.default.compileFile((0, _path.join)(source, 'index.jade'));
                    output = indexTemplate({ posts: _lodash2.default.reverse(_lodash2.default.sortBy(results, ['date'])) });
                    _context3.next = 74;
                    return _regenerator2.default.awrap(_fs2.default.writeFile((0, _path.join)('build', 'index.html'), output));

                case 74:
                case 'end':
                    return _context3.stop();
            }
        }
    }, null, this, [[17, 31, 35, 43], [36,, 38, 42], [46, 57, 61, 69], [62,, 64, 68]]);
}