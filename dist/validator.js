"use strict";

// Helper functions
var isUndefined = function (x) {
  return typeof x === "undefined" || x === null || x === "";
};
var isNumber = function (x) {
  return typeof x === "number";
};
var isPositive = function (x) {
  return isNumber(x) && x >= 0;
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

  end: function (_x, key, data) {
    var errors = arguments[0] === undefined ? [] : arguments[0];
  }
};

module.exports = function () {};