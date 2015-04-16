let addError = (errors, type, key, message) => {
  return errors.push({ type, key, message }) && errors;
};

let isUndefined = x => typeof x === 'undefined' || x === null || x === '';

let validate = {
  type(errors = [], key, data) {
    if (data.type === 'file') { return errors; }

    let message = '"' + data.type + '" is not a valid type';

    if (isUndefined(data.type)) {
      message = 'type must be defined';
    }

    return addError(errors, 'type', key, message);
  },

  start: function (errors = [], data) {},
  end: function (errors = [], data) {}
};

module.exports = {
  data: function () {},
  type: validate.type,
  start: validate.start,
  end: validate.end
};
