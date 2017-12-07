'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PrimitiveTypes = ['number', 'string', 'boolean', 'undefined'];
var isPrimitive = function isPrimitive(val) {
  return PrimitiveTypes.includes(typeof val === 'undefined' ? 'undefined' : _typeof(val)) || val === null;
};

var walk = exports.walk = function walk(obj, fn) {
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  if (!obj) return;
  Object.keys(obj).forEach(function (key) {
    var nextNode = obj[key];
    var nextPath = path ? path + '.' + key : key;
    fn(nextNode, nextPath);
    walk(nextNode, fn, nextPath);
  });
};

var test = exports.test = function test(obj1, obj2) {
  if (isPrimitive(obj1) || isPrimitive(obj2)) return obj1 === obj2;
  var keys = Object.keys(obj2);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (!test(obj1[key], obj2[key])) return false;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return true;
};

var get = exports.get = function get(obj, at) {
  if (!obj) return undefined;
  if (!at) return obj;
  var firstDot = at.indexOf('.');
  if (firstDot === -1) return obj[at];
  var firstKey = at.slice(0, firstDot);
  var restPath = at.slice(firstDot + 1);
  return get(obj[firstKey], restPath);
};

var _finset = function _finset(obj, at, fn) {
  if (!obj || !at) return;
  var firstDot = at.indexOf('.');
  if (firstDot === -1) {
    obj[at] = fn(obj[at]);
  } else {
    var firstKey = at.slice(0, firstDot);
    var restPath = at.slice(firstDot + 1);
    _finset(obj[firstKey], restPath, fn);
  }
  return obj;
};

exports.finset = _finset;
var _inset = function _inset(obj, at, val) {
  return _finset(obj, at, function () {
    return val;
  });
};

exports.inset = _inset;
var _fset = function _fset(obj, at, fn) {
  if (!obj || !at) return obj;
  var firstDot = at.indexOf('.');
  if (firstDot === -1) {
    return _extends({}, obj, _defineProperty({}, at, fn(obj[at])));
  } else {
    var firstKey = at.slice(0, firstDot);
    var restPath = at.slice(firstDot + 1);
    return _extends({}, obj, _defineProperty({}, firstKey, _fset(obj[firstKey], restPath, fn)));
  }
};

exports.fset = _fset;
var _set = function _set(obj, at, val) {
  return _fset(obj, at, function () {
    return val;
  });
};

exports.set = _set;
var exec = exports.exec = {
  on: function on(obj) {
    return function () {
      for (var _len = arguments.length, ops = Array(_len), _key = 0; _key < _len; _key++) {
        ops[_key] = arguments[_key];
      }

      return ops.reduce(function (cur, op) {
        return op(cur);
      }, obj);
    };
  },
  set: function set(at, val) {
    return function (obj) {
      return _set(obj, at, val);
    };
  },
  fset: function fset(at, fn) {
    return function (obj) {
      return _fset(obj, at, fn);
    };
  },
  inset: function inset(at, val) {
    return function (obj) {
      return _inset(obj, at, val);
    };
  },
  finset: function finset(at, fn) {
    return function (obj) {
      return _finset(obj, at, fn);
    };
  }
};

var obtain = exports.obtain = get;
