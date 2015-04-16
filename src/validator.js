let isUndefined = (x) => typeof x === 'undefined' || x === null || x === '';

let validate = {
  type(errors = [], key, data) {
    if (data.type === 'file') { return errors; }

    if (isUndefined(data.type)) {
      errors.push({ type: 'type', key: key, message: 'type must be defined' });
    } else {
      errors.push({ type: 'type', key: key, message: '"' + data.type + '" is not a valid type' });
    }

    return errors;
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
