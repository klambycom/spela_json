"use strict";

var isUndefined = function (x) {
  return typeof x === "undefined" || x === null || x === "";
};

var validate = {
  type: function type(_x, key, data) {
    var errors = arguments[0] === undefined ? [] : arguments[0];
    if (data.type === "file") {
      return errors;
    }

    if (isUndefined(data.type)) {
      errors.push({ type: "type", key: key, message: "type must be defined" });
    } else {
      errors.push({ type: "type", key: key, message: "\"" + data.type + "\" is not a valid type" });
    }

    return errors;
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