var rewire = require('rewire');
var Player = rewire('../dist/player.js');

global.AudioContext = function () {
  return {
    createBufferSource: function () {
      return {
        buffer: '',
        connect: function () {},
        start: function () {}
      };
    }
  }
};

global.XMLHttpRequest = function () {
  return {
    open: function () {},
    send: function () {},
    addEventListener: function () {}
  };
};

describe('Player', function () {
  var sut, data, dataCopy;

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

    dataCopy = JSON.parse(JSON.stringify(data));

    sut = new Player(data);
  });

  it('should have a _countFiles-function', function () {
    expect(sut._countFiles()).toEqual(5);
  });

  describe('#constructor', function () {
    it('shuld take JSON as input to constructor', function () {
      expect(sut._json_data).toEqual(dataCopy);
    });

    it('shuld copy the JSON', function () {
      data.name = 'af1';
      expect(sut._json_data).toEqual(dataCopy);
    });
  });

  describe('#play', function () {
    it('should have a play-function', function () {
      expect(sut.play).toBeDefined();
    });

    it('should return true when not ready and can\'t play', function () {
      expect(sut.play()).toEqual(false);
    });

    it('should not play when all files is not ready', function () {
      spyOn(sut, '_playFile');
      sut.play();
      expect(sut._playFile).not.toHaveBeenCalled();
    });

    it('should return true when ready and can play', function () {
      sut._counter = 5;
      expect(sut.play()).toEqual(true);
    });

    it('should play when all files is ready', function () {
      spyOn(sut, '_playFile');
      sut._counter = 5;
      sut.play();
      expect(sut._playFile).toHaveBeenCalled();
    });
  });

  describe('#stop', function () {
    it('should be defined', function () {
      expect(sut.stop).toBeDefined();
    });
  });

  describe('#getJSON', function () {
    it('should be defined', function () {
      expect(sut.getJSON).toBeDefined();
    });

    it('should return the json', function () {
      expect(sut.getJSON()).toEqual(data);
    });

    it('should return a copy of the json', function () {
      var json = sut.getJSON();
      json.name = 'fail';
      expect(sut.getJSON()).toEqual(data);
    });
  });

  describe('#setJSON', function () {
    var json;

    beforeEach(function () {
      json = {
        name: 'walt',
        data: {}
      };
      sut.setJSON(json);
    });

    it('should be defined', function () {
      expect(sut.setJSON).toBeDefined();
    });

    it('should change the JSON', function () {
      expect(sut.getJSON()).toEqual({ name: 'walt', data: {} });
    });

    it('should change the JSON', function () {
      json.name = 'jesse';
      expect(sut.getJSON()).toEqual({ name: 'walt', data: {} });
    });

    it('should reset loaded files counter', function () {
      expect(sut._counter).toEqual(0);
    });

    it('should count nr of files', function () {
      sut.setJSON(data);
      expect(sut._nr_of_files).toEqual(5);
    });

    it('should call loadSound for each file', function () {
      var counter = 0;
      Player.__set__('loadSound', function () { counter += 1; });
      sut.setJSON(data);
      expect(counter).toEqual(5);
    });

    it('should set _sources to empty array', function () {
      expect(sut._sources).toEqual([]);
    });
  });

  describe('#getName', function () {
    it('should be defined', function () {
      expect(sut.getName).toBeDefined();
    });

    it('should return the name', function () {
      expect(sut.getName()).toEqual('audiofile1');
    });
  });

  describe('#getDuration', function () {
    it('should be defined', function () {
      expect(sut.getDuration).toBeDefined();
    });
  });

  describe('#ready', function () {
    it('should be defined', function () {
      expect(sut.ready).toBeDefined();
    });

    it('should return false when no files are loaded', function () {
      sut._counter = 0;
      expect(sut.ready()).toEqual(false);
    });

    it('should return true when all files is loaded', function () {
      sut._counter = 5;
      expect(sut.ready()).toEqual(true);
    });
  });
});
