var rewire = require('rewire');
var validator = rewire('../dist/validator.js');
var validatorFns = validator.__get__('validate');
var audioJson = require('./fixtures/audio_json.js');

var msg = {
  name: { missing: 'name must be included' },
  data: { obj: 'data must be an object' },
  cuts: { obj: 'cuts must be an object' },
  effects: { obj: 'effects must be an object' },
  type: {
    invalid: '"fil" is not a valid type',
    missing: 'type must be included'
  },
  start: {
    num: 'start time must be a number',
    zero: 'start time must be at least zero'
  },
  end: {
    toLow: 'end time must be larger than start time',
    num: 'end time must be a number'
  }
};

var errors = { type: 'fake', key: 'id1', message: 'fake error' };

var valid = function (fn, obj) {
  return function () {
    expect(validatorFns[fn]('id1', obj, [errors])).toEqual([errors]);
  };
};

var invalid = function (fn, text, obj) {
  return function () {
    var error = { type: fn, key: 'id1', message: msg[fn][text] };
    expect(validatorFns[fn]('id1', obj, [errors])).toEqual([errors, error]);
  };
};

var defined = function (fn) {
  it('should have a ' + fn + '-validator function', function () {
    expect(validatorFns[fn]).toBeDefined();
  });
};

describe('Validator', function () {
  describe('JSON', function () {
    var data;

    beforeEach(function () {
      data = audioJson();
    });

    it('should return empty array if no errors', function () {
      expect(validator(data)).toEqual([]);
    });

    it('should create error if name-field is missing', function () {
      delete data.name;
      expect(validator(data)).toEqual([
        { type: 'name', key: 'name', message: msg.name.missing }
      ]);
    });

    it('should create error if data-field is missing', function () {
      delete data.data;
      expect(validator(data)).toEqual([
        { type: 'data', key: 'data', message: msg.data.obj }
      ]);
    });

    it('should return all errors', function () {
      delete data.name;
      delete data.data;
      expect(validator(data)).toEqual([
        { type: 'name', key: 'name', message: msg.name.missing },
        { type: 'data', key: 'data', message: msg.data.obj }
      ]);
    });

    describe('data', function () {
      it('should create error if type is invalid', function () {
        data.data['1'].type = 'fil';
        expect(validator(data))
          .toEqual([{ type: 'type', key: '1', message: msg.type.invalid }]);
      });

      it('should create error if start is invalid', function () {
        data.data['1'].start = -2;
        expect(validator(data))
          .toEqual([{ type: 'start', key: '1', message: msg.start.zero }]);
      });


      it('should create error if end-field is missing', function () {
        delete data.data['2'].end;
        expect(validator(data)).toEqual([
          { type: 'end', key: '2', message: msg.end.num }
        ]);
      });
    });
  });

  describe('#type', function () {
    defined('type');

    it('should return not create error when type is "file"', valid('type', { type: 'file' }));
    it('should create error when type is wrong', invalid('type', 'invalid', { type: 'fil' }));
    it('should create error when type is empty', invalid('type', 'missing', { type: '' }));
    it('should create error when type is undefined', invalid('type', 'missing', {}));
    it('should create error when type is null', invalid('type', 'missing', { type: null }));
    it('should return old and new errors when data is invalid',
        invalid('type', 'missing', { type: '' }));
  });

  describe('#start', function () {
    defined('start');

    it('should not create error when start time is valid', valid('start', { start: 0 }));
    it('should return old errors when start time is valid', valid('start', { start: 8 }));

    it('should create error when start time is not a number',
        invalid('start', 'num', { start: '' }));

    it('should return old errors and new error when start time is not a number',
        invalid('start', 'num', { start: '' }));

    it('should create error when start time is negative',
        invalid('start', 'zero', { start: -1 }));

    it('should return old errors and new error when start time is negative',
        invalid('start', 'zero', { start: -5 }));
  });

  describe('#end', function () {
    defined('end');

    it('should not create error when end time is valid', valid('end', { start: 0, end: 10 }));

    it('should create error when end time is lower than start time',
        invalid('end', 'toLow', { start: 10, end: 1 }));
    it('should create error when end time is missing', invalid('end', 'num', { start: 0 }));
    it('should create error when end time is not a number', invalid('end', 'num', { start: [] }));
  });

  describe('#name', function () {
    defined('name');

    it('should not create error if valid', valid('name', { name: 'hej' }));
    it('should create error if invalid', invalid('name', 'missing', {}));
  });

  describe('#data', function () {
    defined('data');

    it('should not create error if valid', valid('data', { data: {} }));

    it('should create error if data is not an object', function () {
      var error = { type: 'data', key: 'id1', message: msg.data.obj };
      expect(validatorFns.data('id1', { data: 1 }, [])).toEqual([ error ]);
      expect(validatorFns.data('id1', { data: [] }, [])).toEqual([ error ]);
      expect(validatorFns.data('id1', { }, [])).toEqual([ error ]);
    });
  });

  describe('#cuts', function () {
    defined('cuts');

    it('should not create error if cuts is a object', valid('cuts', { cuts: {} }));
    it('should not create error if cuts is missing', valid('cuts', {}));
    it('should create error if data is not an object', invalid('cuts', 'obj', { cuts: [] }));
  });

  describe('#effects', function () {
    defined('effects');

    it('should not create error if effects is a object', valid('effects', { effects: {} }));
    it('should not create error if effects is missing', valid('effects', {}));
    it('should create error if effects is not an object',
        invalid('effects', 'obj', { effects: [] }));
  });
});
