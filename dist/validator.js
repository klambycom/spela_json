"use strict";

// Functionl functions
var compose = function () {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (result) {
    for (var i = fns.length - 1; i > -1; i--) {
      result = fns[i].call(undefined, result);
    }

    return result;
  };
};

var eq = function (x) {
  return function (y) {
    return x === y;
  };
};
var dot = function (key) {
  return function (obj) {
    return obj[key];
  };
};

// Helper functions
var check = function (type, valid, fn) {
  return function (_x, key, data) {
    var errors = arguments[0] === undefined ? [] : arguments[0];
    if (valid(data)) {
      return errors;
    }
    return errors.push({ type: type, key: key, message: fn(data) }) && errors;
  };
};

var isUndefined = function (x) {
  return typeof x === "undefined" || x === null || x === "";
};

// Validation
var validate = {
  type: check("type", compose(eq("file"), dot("type")), function (data) {
    if (isUndefined(data.type)) {
      return "type must be defined";
    }
    return "\"" + data.type + "\" is not a valid type";
  }),

  start: function (_x, data) {
    var errors = arguments[0] === undefined ? [] : arguments[0];
  },
  end: function (_x, data) {
    var errors = arguments[0] === undefined ? [] : arguments[0];
  }
};

module.exports = {
  data: function () {},
  type: validate.type,
  start: validate.start,
  end: validate.end
};