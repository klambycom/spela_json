// Helper functions
let check = (type, valid, fn) => {
  return (errors = [], key, data) => {
    if (valid(data)) { return errors; }
    return errors.push({ type, key, message: fn(data) }) && errors;
  };
};

let isUndefined = x => typeof x === 'undefined' || x === null || x === '';
let isNumber = x => typeof x === 'number';
let isPositive = x => isNumber(x) && x >= 0;

let addError = (errors, type, key) => {
  return message => errors.push({ type, key, message }) && errors;
};

// Validation
let validate = {
  type(errors = [], key, data) {
    // No error
    if (data.type === 'file') { return errors; }
    // Error
    let error = addError(errors, 'type', key);
    if (isUndefined(data.type)) { return error('type must be defined'); }
    return error('"' + data.type + '" is not a valid type');
  },

  start(errors = [], key, data) {
    // No error
    if (isPositive(data.start)) { return errors; }
    // Errors
    let error = addError(errors, 'start', key);
    if (!isNumber(data.start)) { return error('start time must be a number'); }
    return error('start time must be at least zero');
  },

  end: function (errors = [], key, data) {}
};

module.exports = function () {
};
