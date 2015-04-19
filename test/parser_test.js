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
    var result, expectedResult;

    beforeEach(function () {
      var data = fileArray();
      expectedResult = parserResult();
      result = parseData(data);
    });

    it('should parse the data', function () {
      expect(result).toEqual(expectedResult);
    });
  });
});
