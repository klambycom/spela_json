var AudioC = function () {
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

global.window = {};
global.window.AudioContext = AudioC;
global.window.webkitAudioContext = AudioC;

global.XMLHttpRequest = function () {
  return {
    open: function () {},
    send: function () {},
    addEventListener: function () {}
  };
};

var rewire = require('rewire');
var Player = rewire('../dist/player.js');

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

    it('should return false when not ready and can\'t play', function () {
      sut._parsed.ready = function () { return false; };
      expect(sut.play()).toEqual(false);
    });

    it('should not play when all files is not ready', function () {
      spyOn(sut._parsed, 'play');
      sut.play();
      expect(sut._parsed.play).not.toHaveBeenCalled();
    });

    it('should return true when ready and can play', function () {
      sut._parsed.ready = function () { return true; };
      expect(sut.play()).toEqual(true);
    });

    it('should play when all files is ready', function () {
      spyOn(sut._parsed, 'play');
      sut._parsed.ready = function () { return true; };
      sut.play();
      expect(sut._parsed.play).toHaveBeenCalled();
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

    it('should set _sources to empty array', function () {
      expect(sut._sources).toEqual([]);
    });
  });

  describe('#name', function () {
    it('should be defined', function () {
      expect(sut.name).toBeDefined();
    });

    it('should return the name', function () {
      expect(sut.name()).toEqual('audiofile1');
    });
  });

  describe('#duration', function () {
    it('should be defined', function () {
      expect(sut.duration).toBeDefined();
    });
  });

  describe('#ready', function () {
    it('should be defined', function () {
      expect(sut.ready).toBeDefined();
    });

    it('should return false when no files are loaded', function () {
      sut._parsed.ready = function () { return false; };
      expect(sut.ready()).toEqual(false);
    });

    it('should return true when all files is loaded', function () {
      sut._parsed.ready = function () { return true; };
      expect(sut.ready()).toEqual(true);
    });
  });
});
