var rewire = require('rewire');
var parser = rewire('../dist/parser.js');

describe('Parser', function () {
  var sut, mock;

  beforeEach(function () {
    mock = {
      context: {},
      builder: function () {},
      validator: function (json) {
        if (json.fail) { return [1, 2]; }
        return [];
      }
    };

    sut = parser(mock.context);

    parser.__set__('_builder', mock.builder);
    parser.__set__('validator', mock.validator);

    spyOn(mock, 'validator');
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
});
