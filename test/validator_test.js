var rewire = require('rewire');
var validator = rewire('../dist/validator.js');

describe('Validator', function () {
  var data;

  beforeEach(function () {
    data = {
      name: 'audiofile1',
      data: {
        '1': {
          type: 'file',
          file: '/alien_phaser.wav',
          start: 0
        },
        '2': {
          type: 'file',
          file: '/car.wav',
          start: 1.5
        },
        '3': {
          type: 'file',
          file: '/crumple_paper.wav',
          start: 3
        },
        '4': {
          type: 'file',
          file: '/mbira.wav',
          start: 5
        },
        '5': {
          type: 'file',
          file: '/surround.wav',
          start: 3
        }
      }
    };
  });

  describe('#data', function () {
    it('should have data-function', function () {
      expect(validator.data).toBeDefined();
    });

    it('should have a type');
  });

  describe('#type', function () {
    it('should have type-function', function () {
      expect(validator.type).toBeDefined();
    });

    it('should return empty array when type is "file"', function () {
      expect(validator.type([], 'id1', { type: 'file' })).toEqual([]);
    });

    it('should return old errors when data is valid', function () {
      var errors = { type: 'type', key: 'id1', message: '"fil" is not a valid type' };
      expect(validator.type([errors], 'id1', { type: 'file' })).toEqual([errors]);
    });

    it('should return error when type is wrong', function () {
      expect(validator.type([], 'id1', { type: 'fil' })).toEqual([
          { type: 'type', key: 'id1', message: '"fil" is not a valid type' }
      ]);
    });

    it('should return error when type is empty', function () {
      expect(validator.type([], 'id1', { type: '' })).toEqual([
          { type: 'type', key: 'id1', message: 'type must be defined' }
      ]);
    });

    it('should return error when type is undefined', function () {
      expect(validator.type([], 'id1', { })).toEqual([
          { type: 'type', key: 'id1', message: 'type must be defined' }
      ]);
    });

    it('should return error when type is null', function () {
      expect(validator.type([], 'id1', { type: null })).toEqual([
          { type: 'type', key: 'id1', message: 'type must be defined' }
      ]);
    });

    it('should return old and new errors when data is invalid', function () {
      var errors = { type: 'type', key: 'id1', message: '"fil" is not a valid type' };
      expect(validator.type([errors], 'id1', { type: '' })).toEqual([
          errors,
          { type: 'type', key: 'id1', message: 'type must be defined' }
      ]);
    });
  });

  describe('#start', function () {
    it('should have start-function', function () {
      expect(validator.start).toBeDefined();
    });

    it('should return empty array when start time is valid', function () {
      expect(validator.start([], 'id1', { start: 0 })).toEqual([]);
    });

    it('should return old errors when start time is valid', function () {
      var errors = { type: 'type', key: 'id1', message: '"fil" is not a valid type' };
      expect(validator.start([errors], 'id1', { start: 8 })).toEqual([errors]);
    });

    it('should return error when start time is not a number', function () {
      expect(validator.start([], 'id1', { start: '' })).toEqual([
          { type: 'start', key: 'id1', message: 'start time must be a number' }
      ]);
    });

    it('should return old errors and new error when start time is not a number', function () {
      var errors = { type: 'type', key: 'id1', message: '"fil" is not a valid type' };
      expect(validator.start([errors], 'id1', { start: '' })).toEqual([
          errors,
          { type: 'start', key: 'id1', message: 'start time must be a number' }
      ]);
    });

    it('should return error when start time is negative', function () {
      expect(validator.start([], 'id1', { start: -1 })).toEqual([
          { type: 'start', key: 'id1', message: 'start time must be at least zero' }
      ]);
    });

    it('should return old errors and new error when start time is negative', function () {
      var errors = { type: 'type', key: 'id1', message: '"fil" is not a valid type' };
      expect(validator.start([errors], 'id1', { start: -5 })).toEqual([
          errors,
          { type: 'start', key: 'id1', message: 'start time must be at least zero' }
      ]);
    });
  });

  describe('#end', function () {
    it('should have end-function', function () {
      expect(validator.end).toBeDefined();
    });
  });
});
