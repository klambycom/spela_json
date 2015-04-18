"use strict";

// Helper functions
var isUndefined = function (x) {
  return typeof x === "undefined" || x === null || x === "";
};
var isDefined = function (x) {
  return !isUndefined(x);
};
var isNumber = function (x) {
  return typeof x === "number";
};
var isPositive = function (x) {
  return isNumber(x) && x >= 0;
};
var isObject = function (x) {
  return typeof x === "object" && !(x instanceof Array);
};

var addError = function (errors, type, key) {
  return function (message) {
    return errors.push({ type: type, key: key, message: message }) && errors;
  };
};

// Validation
var validate = {
  type: function type(key, data) {
    var errors = arguments[2] === undefined ? [] : arguments[2];
    // No error
    if (data.type === "file") {
      return errors;
    }
    // Error
    var error = addError(errors, "type", key);
    if (isUndefined(data.type)) {
      return error("type must be included");
    }
    return error("\"" + data.type + "\" is not a valid type");
  },

  start: function start(key, data) {
    var errors = arguments[2] === undefined ? [] : arguments[2];
    // No error
    if (isPositive(data.start)) {
      return errors;
    }
    // Errors
    var error = addError(errors, "start", key);
    if (!isNumber(data.start)) {
      return error("start time must be a number");
    }
    return error("start time must be at least zero");
  },

  end: function end(key, data) {
    var errors = arguments[2] === undefined ? [] : arguments[2];
    if (isPositive(data.end) && data.end > data.start) {
      return errors;
    }
    var error = addError(errors, "end", key);
    if (data.end <= data.start) {
      return error("end time must be larger than start time");
    }
    return error("end time must be a number");
  },

  name: function name(key, data) {
    var errors = arguments[2] === undefined ? [] : arguments[2];
    if (isDefined(data.name)) {
      return errors;
    }
    return addError(errors, "name", key)("name must be included");
  },

  data: function data(key, data) {
    var errors = arguments[2] === undefined ? [] : arguments[2];
    if (isDefined(data.data) && isObject(data.data)) {
      return errors;
    }
    return addError(errors, "data", key)("data must be an object");
  }
};

module.exports = function () {
  var json = arguments[0] === undefined ? {} : arguments[0];
  var errors = [];

  // Meta
  errors = validate.name("name", json, errors);
  errors = validate.data("data", json, errors);
  if (isUndefined(json.data) || !isObject(json.data)) {
    return errors;
  }

  // Data
  Object.keys(json.data).forEach(function (x) {
    var data = json.data[x];

    errors = validate.type(x, data, errors);
    errors = validate.start(x, data, errors);
    errors = validate.end(x, data, errors);
  });

  return errors;
};