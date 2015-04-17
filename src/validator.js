// Functionl functions
let compose = (...fns) => {
  return (result) => {
    for (let i = fns.length - 1; i > -1; i--) {
      result = fns[i].call(this, result);
    }

    return result;
  };
};

let eq = x => y => x === y;
let dot = key => obj => obj[key];

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
  type: check('type', compose(eq('file'), dot('type')), function (data) {
    if (isUndefined(data.type)) { return 'type must be defined'; }
    return '"' + data.type + '" is not a valid type';
  }),

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

module.exports = {
  data: function () {},
  type: validate.type,
  start: validate.start,
  end: validate.end
};
