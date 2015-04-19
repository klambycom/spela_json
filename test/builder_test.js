var rewire = require('rewire');
var builder = rewire('../dist/builder.js');
var builder2 = rewire('../dist/builder.js');

describe('Builder', function () {
  var sut, sutWithoutDI, contextMock, sourceMock, files, mock;

  beforeEach(function () {
    sourceMock = {
      buffer: '',
      connect: function () {},
      start: function () {},
      playbackRate: { value: 1.0 }
    };

    spyOn(sourceMock, 'connect');
    spyOn(sourceMock, 'start');

    contextMock = {
      createBufferSource: function () { return sourceMock; }
    };

    files = [
      { type: 'file', parts: [{ file: '', time: [0, 1], offset: 0 }] },
      { type: 'file', parts: [{ file: '', time: [1, 4], offset: 0 }] },
      { type: 'file', parts: [{ file: '', time: [5, 7], offset: 0 }] },
      { type: 'file', parts: [{ file: '', time: [9, 11], offset: 0 }] }
    ];

    mock = {
      duration: function () {},
      ready: function () {},

      buildSource: function () {},
      playStart: function () {},
      playRate: function () {}
    };

    spyOn(mock, 'duration');
    spyOn(mock, 'ready');
    spyOn(mock, 'buildSource');
    spyOn(mock, 'playStart');
    spyOn(mock, 'playRate');

    // Create builder
    var _builder = builder(contextMock, [], mock.duration, mock.ready);

    builder.__set__('buildSource', mock.buildSource);
    builder.__set__('playStart', mock.playStart);
    builder.__set__('playRate', mock.playRate);

    sut = _builder(files);

    // Create builder without DI
    _builder = builder2(contextMock, []);
    sutWithoutDI = _builder(files, mock.duration, mock.ready);

    spyOn(contextMock, 'createBufferSource').and.callThrough();
  });

  describe('#play', function () {
    beforeEach(function () {
      sut.play();
      sutWithoutDI.play();
    });

    it('should be defined', function () {
      expect(sut.play).toBeDefined();
    });

    it('should call buildSource', function () {
      expect(mock.buildSource).toHaveBeenCalled();
    });

    it('should call playRate', function () {
      expect(mock.playRate).toHaveBeenCalled();
    });

    it('should call playStart', function () {
      expect(mock.playStart).toHaveBeenCalled();
    });

    describe('#buildSource', function () {
      it('should create a buffer source', function () {
        expect(contextMock.createBufferSource).toHaveBeenCalled();
      });
    });

    describe('#playRate', function () {
      var playRate = builder2.__get__('playRate');

      it('should not change playbackRate when no rate is specified', function () {
        playRate(null, sourceMock, { type: 'file', file: '', start: 0 });
        expect(sourceMock.playbackRate.value).toEqual(1.0);
      });

      it('should change playbackRate when rate is specified', function () {
        playRate(null, sourceMock, { type: 'file', file: '', start: 0, rate: 1.5 });
        expect(sourceMock.playbackRate.value).toEqual(1.5);
      });
    });

    describe('#playStart', function () {
      it('should connect source and context', function () {
        expect(sourceMock.connect).toHaveBeenCalled();
      });

      it('should set start time', function () {
        expect(sourceMock.start).toHaveBeenCalledWith(0);
        expect(sourceMock.start).toHaveBeenCalledWith(1);
        expect(sourceMock.start).toHaveBeenCalledWith(5);
        expect(sourceMock.start).toHaveBeenCalledWith(9);
      });
    });
  });

  describe('#files', function () {
    it('should be defined', function () {
      expect(sut.files).toBeDefined();
    });
  });

  describe('#duration', function () {
    it('should be defined', function () {
      expect(sut.duration).toBeDefined();
    });

    it('should call passed duration function', function () {
      sut.duration();
      expect(mock.duration).toHaveBeenCalled();
    });
  });

  describe('#ready', function () {
    it('should be defined', function () {
      expect(sut.ready).toBeDefined();
    });

    it('should call passed ready function', function () {
      sut.ready();
      expect(mock.ready).toHaveBeenCalled();
    });
  });
});
