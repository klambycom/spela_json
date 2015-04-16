"use strict";

var addError = function (errors, type, key, message) {
  return errors.push({ type: type, key: key, message: message }) && errors;
};

var isUndefined = function (x) {
  return typeof x === "undefined" || x === null || x === "";
};

var validate = {
  type: function type(_x, key, data) {
    var errors = arguments[0] === undefined ? [] : arguments[0];
    if (data.type === "file") {
      return errors;
    }

    var message = "\"" + data.type + "\" is not a valid type";

    if (isUndefined(data.type)) {
      message = "type must be defined";
    }

    return addError(errors, "type", key, message);
  },

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