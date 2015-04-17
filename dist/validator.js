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
  type: function type(_x, key, data) {
    var errors = arguments[0] === undefined ? [] : arguments[0];
    // No error
    if (data.type === "file") {
      return errors;
    }
    // Error
    var error = addError(errors, "type", key);
    if (isUndefined(data.type)) {
      return error("type must be defined");
    }
    return error("\"" + data.type + "\" is not a valid type");
  },

  start: function start(_x, key, data) {
    var errors = arguments[0] === undefined ? [] : arguments[0];
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

  end: function end(_x, key, data) {
    var errors = arguments[0] === undefined ? [] : arguments[0];
  },

  name: function name(_x, key, data) {
    var errors = arguments[0] === undefined ? [] : arguments[0];
    if (isDefined(data.name)) {
      return errors;
    }
    return addError(errors, "name", key)("name must be defined");
  },

  data: function data(_x, key, data) {
    var errors = arguments[0] === undefined ? [] : arguments[0];
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
  errors = validate.name(errors, "name", json);
  errors = validate.data(errors, "data", json);
  if (isUndefined(json.data) || !isObject(json.data)) {
    return errors;
  }

  // Data
  Object.keys(json.data).forEach(function (x) {
    var data = json.data[x];

    errors = validate.type(errors, x, data);
    errors = validate.start(errors, x, data);
  });

  return errors;
};