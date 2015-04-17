// Helper functions
let isUndefined = x => typeof x === 'undefined' || x === null || x === '';
let isDefined = x => !isUndefined(x);
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

  end(errors = [], key, data) {},

  name(errors = [], key, data) {
    if (isDefined(data.name)) { return errors; }
    let error = addError(errors, 'name', key);
    return error('name must be defined');
  }
};

module.exports = function (json = {}) {
  let errors = [];

  // Meta
  errors = validate.name(errors, 'name', json);

  // Data

  return errors;
};
