// Helper functions
let isUndefined = x => typeof x === 'undefined' || x === null || x === '';
let isDefined = x => !isUndefined(x);
let isNumber = x => typeof x === 'number';
let isPositive = x => isNumber(x) && x >= 0;
let isObject = x => typeof x === 'object' && !(x instanceof Array);

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

  end(errors = [], key, data) {
    if (isPositive(data.end) && data.end > data.start) { return errors; }
    let error = addError(errors, 'end', key);
    if (data.end <= data.start) { return error('end time must be larger than start time'); }
    return error('end time must be a number');
  },

  name(errors = [], key, data) {
    if (isDefined(data.name)) { return errors; }
    return addError(errors, 'name', key)('name must be defined');
  },

  data(errors = [], key, data) {
    if (isDefined(data.data) && isObject(data.data)) { return errors; }
    return addError(errors, 'data', key)('data must be an object');
  }
};

module.exports = function (json = {}) {
  let errors = [];

  // Meta
  errors = validate.name(errors, 'name', json);
  errors = validate.data(errors, 'data', json);
  if (isUndefined(json.data) || !isObject(json.data)) { return errors; }

  // Data
  Object.keys(json.data).forEach(x => {
    let data = json.data[x];

    errors = validate.type(errors, x, data);
    errors = validate.start(errors, x, data);
  });

  return errors;
};
