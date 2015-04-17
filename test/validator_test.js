var rewire = require('rewire');
var validator = rewire('../dist/validator.js');
var validatorFns = validator.__get__('validate');

var msg = {
  name: { missing: 'name must be defined' },
  data: { obj: 'data must be an object' },
  type: {
    invalid: '"fil" is not a valid type',
    missing: 'type must be defined'
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

describe('Validator', function () {
  var errors;

  beforeEach(function () {
    errors = { type: 'type', key: 'id1', message: msg.type.invalid };
  });

  describe('JSON', function () {
    var data;

    beforeEach(function () {
      data = {
        name: 'filen',
        data: {
          '1': {
            type: 'file',
            start: 0,
            end: 5
          },
          '2': {
            type: 'file',
            start: 0,
            end: 5
          }
        }
      };
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
    it('should have type-function', function () {
      expect(validatorFns.type).toBeDefined();
    });

    it('should return empty array when type is "file"', function () {
      expect(validatorFns.type([], 'id1', { type: 'file' })).toEqual([]);
    });

    it('should return old errors when data is valid', function () {
      expect(validatorFns.type([errors], 'id1', { type: 'file' })).toEqual([errors]);
    });

    it('should return error when type is wrong', function () {
      expect(validatorFns.type([], 'id1', { type: 'fil' })).toEqual([
          { type: 'type', key: 'id1', message: msg.type.invalid }
      ]);
    });

    it('should return error when type is empty', function () {
      expect(validatorFns.type([], 'id1', { type: '' })).toEqual([
          { type: 'type', key: 'id1', message: msg.type.missing }
      ]);
    });

    it('should return error when type is undefined', function () {
      expect(validatorFns.type([], 'id1', { })).toEqual([
          { type: 'type', key: 'id1', message: msg.type.missing }
      ]);
    });

    it('should return error when type is null', function () {
      expect(validatorFns.type([], 'id1', { type: null })).toEqual([
          { type: 'type', key: 'id1', message: msg.type.missing }
      ]);
    });

    it('should return old and new errors when data is invalid', function () {
      expect(validatorFns.type([errors], 'id1', { type: '' })).toEqual([
          errors,
          { type: 'type', key: 'id1', message: msg.type.missing }
      ]);
    });
  });

  describe('#start', function () {
    it('should have start-function', function () {
      expect(validatorFns.start).toBeDefined();
    });

    it('should return empty array when start time is valid', function () {
      expect(validatorFns.start([], 'id1', { start: 0 })).toEqual([]);
    });

    it('should return old errors when start time is valid', function () {
      expect(validatorFns.start([errors], 'id1', { start: 8 })).toEqual([errors]);
    });

    it('should return error when start time is not a number', function () {
      expect(validatorFns.start([], 'id1', { start: '' })).toEqual([
          { type: 'start', key: 'id1', message: msg.start.num }
      ]);
    });

    it('should return old errors and new error when start time is not a number', function () {
      expect(validatorFns.start([errors], 'id1', { start: '' })).toEqual([
          errors,
          { type: 'start', key: 'id1', message: msg.start.num }
      ]);
    });

    it('should return error when start time is negative', function () {
      expect(validatorFns.start([], 'id1', { start: -1 })).toEqual([
          { type: 'start', key: 'id1', message: msg.start.zero }
      ]);
    });

    it('should return old errors and new error when start time is negative', function () {
      expect(validatorFns.start([errors], 'id1', { start: -5 })).toEqual([
          errors,
          { type: 'start', key: 'id1', message: msg.start.zero }
      ]);
    });
  });

  describe('#end', function () {
    it('should have end-function', function () {
      expect(validatorFns.end).toBeDefined();
    });

    it('should not return error when end time is valid', function () {
      expect(validatorFns.end([], 'id1', { start: 0, end: 10 })).toEqual([]);
    });

    it('should return error when end time is lower than start time', function () {
      expect(validatorFns.end([errors], 'id1', { start: 10, end: 1 })).toEqual([
          errors,
          { type: 'end', key: 'id1', message: msg.end.toLow }
      ]);
    });

    it('should return error when end time is missing', function () {
      expect(validatorFns.end([errors], 'id1', { start: 0 })).toEqual([
          errors,
          { type: 'end', key: 'id1', message: msg.end.num }
      ]);
    });

    it('should return error when end time is not a number', function () {
      expect(validatorFns.end([errors], 'id1', { start: [] })).toEqual([
          errors,
          { type: 'end', key: 'id1', message: msg.end.num }
      ]);
    });
  });

  describe('#name', function () {
    it('should be defined', function () {
      expect(validatorFns.name).toBeDefined();
    });

    it('should return empty array if valid', function () {
      expect(validatorFns.name([ ], 'id1', { name: 'hej' })).toEqual([ ]);
    });

    it('should return error if invalid', function () {
      expect(validatorFns.name([ ], 'id1', { })).toEqual([
        { type: 'name', key: 'id1', message: msg.name.missing }
      ]);
    });
  });

  describe('#data', function () {
    it('should be defined', function () {
      expect(validatorFns.data).toBeDefined();
    });

    it('should return empty array if valid', function () {
      expect(validatorFns.data([ ], 'id1', { data: {} })).toEqual([ ]);
    });

    it('should return error if data is not an object', function () {
      var error = { type: 'data', key: 'id1', message: msg.data.obj };
      expect(validatorFns.data([ ], 'id1', { data: 1 })).toEqual([ error ]);
      expect(validatorFns.data([ ], 'id1', { data: [] })).toEqual([ error ]);
      expect(validatorFns.data([ ], 'id1', { })).toEqual([ error ]);
    });
  });
});
