var rewire = require('rewire');
var validator = rewire('../dist/validator.js');
var validatorFns = validator.__get__('validate');

describe('Validator', function () {
  describe('JSON', function () {
    var data;

    beforeEach(function () {
      data = { name: 'filen' };
    });

    it('should return empty array if no errors', function () {
      expect(validator(data)).toEqual([]);
    });

    it('should create error if name-field is missing', function () {
      delete data.name;
      expect(validator(data)).toEqual([
        { type: 'meta', key: 'name', message: 'name must be defined' }
      ]);
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
      var errors = { type: 'type', key: 'id1', message: '"fil" is not a valid type' };
      expect(validatorFns.type([errors], 'id1', { type: 'file' })).toEqual([errors]);
    });

    it('should return error when type is wrong', function () {
      expect(validatorFns.type([], 'id1', { type: 'fil' })).toEqual([
          { type: 'type', key: 'id1', message: '"fil" is not a valid type' }
      ]);
    });

    it('should return error when type is empty', function () {
      expect(validatorFns.type([], 'id1', { type: '' })).toEqual([
          { type: 'type', key: 'id1', message: 'type must be defined' }
      ]);
    });

    it('should return error when type is undefined', function () {
      expect(validatorFns.type([], 'id1', { })).toEqual([
          { type: 'type', key: 'id1', message: 'type must be defined' }
      ]);
    });

    it('should return error when type is null', function () {
      expect(validatorFns.type([], 'id1', { type: null })).toEqual([
          { type: 'type', key: 'id1', message: 'type must be defined' }
      ]);
    });

    it('should return old and new errors when data is invalid', function () {
      var errors = { type: 'type', key: 'id1', message: '"fil" is not a valid type' };
      expect(validatorFns.type([errors], 'id1', { type: '' })).toEqual([
          errors,
          { type: 'type', key: 'id1', message: 'type must be defined' }
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
      var errors = { type: 'type', key: 'id1', message: '"fil" is not a valid type' };
      expect(validatorFns.start([errors], 'id1', { start: 8 })).toEqual([errors]);
    });

    it('should return error when start time is not a number', function () {
      expect(validatorFns.start([], 'id1', { start: '' })).toEqual([
          { type: 'start', key: 'id1', message: 'start time must be a number' }
      ]);
    });

    it('should return old errors and new error when start time is not a number', function () {
      var errors = { type: 'type', key: 'id1', message: '"fil" is not a valid type' };
      expect(validatorFns.start([errors], 'id1', { start: '' })).toEqual([
          errors,
          { type: 'start', key: 'id1', message: 'start time must be a number' }
      ]);
    });

    it('should return error when start time is negative', function () {
      expect(validatorFns.start([], 'id1', { start: -1 })).toEqual([
          { type: 'start', key: 'id1', message: 'start time must be at least zero' }
      ]);
    });

    it('should return old errors and new error when start time is negative', function () {
      var errors = { type: 'type', key: 'id1', message: '"fil" is not a valid type' };
      expect(validatorFns.start([errors], 'id1', { start: -5 })).toEqual([
          errors,
          { type: 'start', key: 'id1', message: 'start time must be at least zero' }
      ]);
    });
  });

  describe('#end', function () {
    it('should have end-function', function () {
      expect(validatorFns.end).toBeDefined();
    });
  });
});
