var rewire = require('rewire');
var parser = rewire('../dist/parser.js');
var parseData = parser.__get__('parseData');
var parserResult = require('./fixtures/parser_result.js');
var fileArray = require('./fixtures/file_array.js');

describe('Parser', function () {
  var sut, mock;

  beforeEach(function () {
    mock = {
      context: {},
      builder: function () {}
    };

    sut = parser(mock.context);

    parser.__set__('_builder', mock.builder);
  });

  describe('#parse', function () {
    it('should be defined', function () {
      expect(sut.parse).toBeDefined();
    });
  });

  describe('#isFile', function () {
    it('should be defined', function () {
      expect(sut.isFile).toBeDefined();
    });
  });

  describe('Parse data', function () {
    var data, result, expectedResult;

    beforeEach(function () {
      data = fileArray();
      expectedResult = parserResult();
      result = parseData(data);
    });

    it('should parse the data', function () {
      expect(result).toEqual(expectedResult);
    });

    it('should sort the cuts/parts', function () {
      data = fileArray();

      data[0].cuts = {
        '1': { from: 5, to: 6 },
        '2': { from: 2, to: 3 }
      };

      expectedResult[0].parts = [
        { time: [ 0, 2 ], edits: [  ] },
        { time: [ 3, 5 ], edits: [  ] },
        { time: [ 6, 10 ], edits: [  ] }
      ];

      expect(parseData(data)).toEqual(expectedResult);
    });
  });
});
