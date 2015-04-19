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
var isString = function (x) {
  return typeof x === "string";
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
  },

  cuts: function cuts(key, data) {
    var errors = arguments[2] === undefined ? [] : arguments[2];
    if (isUndefined(data.cuts) || isObject(data.cuts)) {
      return errors;
    }
    return addError(errors, "cuts", key)("cuts must be an object");
  },

  effects: function effects(key, data) {
    var errors = arguments[2] === undefined ? [] : arguments[2];
    if (isUndefined(data.effects) || isObject(data.effects)) {
      return errors;
    }
    return addError(errors, "effects", key)("effects must be an object");
  },

  file: function file(key, data) {
    var errors = arguments[2] === undefined ? [] : arguments[2];
    if (data.type !== "file" || data.type === "file" && isString(data.file)) {
      return errors;
    }
    var error = addError(errors, "file", key);
    if (isUndefined(data.file)) {
      return error("file must be included when type is file");
    }
    return error("file must be a string");
  },

  effectType: function effectType(key, data) {
    var errors = arguments[2] === undefined ? [] : arguments[2];
    if (data.type === "rate") {
      return errors;
    }
    var error = addError(errors, "effectType", key);
    if (isUndefined(data.type)) {
      return error("type must be included");
    }
    return error("\"" + data.type + "\" is not a valid type");
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

    errors = validate.type("row(" + x + ")", data, errors);
    errors = validate.start("row(" + x + ")", data, errors);
    errors = validate.end("row(" + x + ")", data, errors);
    errors = validate.cuts("row(" + x + ")", data, errors);
    errors = validate.effects("row(" + x + ")", data, errors);
    errors = validate.file("row(" + x + ")", data, errors);

    if (isUndefined(data.effects) || !isObject(data.effects)) {
      return;
    }
    Object.keys(data.effects).forEach(function (y) {
      var effect = data.effects[y];

      errors = validate.effectType("row(" + x + "), effect(" + y + ")", effect, errors);
    });
  });

  return errors;
};