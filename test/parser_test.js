var rewire = require('rewire');
var parser = rewire('../dist/parser.js');

describe('Parser', function () {
  var sut, contextMock, builderMock;

  beforeEach(function () {
    contextMock = {};
    sut = parser(contextMock);

    builderMock = function () {
    };
    parser.__set__('_builder', builderMock);
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
