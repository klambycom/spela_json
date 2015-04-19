// Helper functions
let isUndefined = x => typeof x === 'undefined' || x === null || x === '';
let isDefined = x => !isUndefined(x);
let isNumber = x => typeof x === 'number';
let isPositive = x => isNumber(x) && x >= 0;
let isObject = x => typeof x === 'object' && !(x instanceof Array);
let isString = x => typeof x === 'string';

let addError = (errors, type, key) => {
  return message => errors.push({ type, key, message }) && errors;
};

// Validation
let validate = {
  type(key, data, errors = []) {
    // No error
    if (data.type === 'file') { return errors; }
    // Error
    let error = addError(errors, 'type', key);
    if (isUndefined(data.type)) { return error('type must be included'); }
    return error('"' + data.type + '" is not a valid type');
  },

  start(key, data, errors = []) {
    // No error
    if (isPositive(data.start)) { return errors; }
    // Errors
    let error = addError(errors, 'start', key);
    if (!isNumber(data.start)) { return error('start time must be a number'); }
    return error('start time must be at least zero');
  },

  end(key, data, errors = []) {
    if (isPositive(data.end) && data.end > data.start) { return errors; }
    let error = addError(errors, 'end', key);
    if (data.end <= data.start) { return error('end time must be larger than start time'); }
    return error('end time must be a number');
  },

  name(key, data, errors = []) {
    if (isDefined(data.name)) { return errors; }
    return addError(errors, 'name', key)('name must be included');
  },

  data(key, data, errors = []) {
    if (isDefined(data.data) && isObject(data.data)) { return errors; }
    return addError(errors, 'data', key)('data must be an object');
  },

  cuts(key, data, errors = []) {
    if (isUndefined(data.cuts) || isObject(data.cuts)) { return errors; }
    return addError(errors, 'cuts', key)('cuts must be an object');
  },

  effects(key, data, errors = []) {
    if (isUndefined(data.effects) || isObject(data.effects)) { return errors; }
    return addError(errors, 'effects', key)('effects must be an object');
  },

  file(key, data, errors = []) {
    if (data.type !== 'file' || (data.type === 'file' && isString(data.file))) { return errors; }
    let error = addError(errors, 'file', key);
    if (isUndefined(data.file)) { return error('file must be included when type is file'); }
    return error('file must be a string');
  },

  effectType(key, data, errors = []) {
    if (data.type === 'rate') { return errors; }
    let error = addError(errors, 'effectType', key);
    if (isUndefined(data.type)) { return error('type must be included'); }
    return error('"' + data.type + '" is not a valid type');
  }
};

module.exports = function (json = {}) {
  let errors = [];

  // Meta
  errors = validate.name('name', json, errors);
  errors = validate.data('data', json, errors);
  if (isUndefined(json.data) || !isObject(json.data)) { return errors; }

  // Data
  Object.keys(json.data).forEach(x => {
    let data = json.data[x];

    errors = validate.type(x, data, errors);
    errors = validate.start(x, data, errors);
    errors = validate.end(x, data, errors);
    errors = validate.cuts(x, data, errors);
    errors = validate.effects(x, data, errors);
    errors = validate.file(x, data, errors);

    if (isUndefined(data.effects) || !isObject(data.effects)) { return; }
    Object.keys(data.effects).forEach(y => {
      let effect = data.effects[y];

      errors = validate.effectType(`${x}, effect(${y})`, effect, errors);
    });
  });

  return errors;
};
