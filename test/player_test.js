var Player = require('../dist/player.js');

//// For tests run using node
//if (typeof AudioContext === 'undefined') {
//  global.AudioContext = function () {};
//}


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
          start: 0
        },
        '3': {
          type: 'file',
          file: '/crumple_paper.wav',
          start: 0
        },
        '4': {
          type: 'file',
          file: '/mbira.wav',
          start: 0
        },
        '5': {
          type: 'file',
          file: '/surround.wav',
          start: 0
        }
      }
    };

    dataCopy = JSON.parse(JSON.stringify(data));

    sut = new Player(data);
  });

  it('should have a play-function', function () {
    expect(sut.play).toBeDefined();
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
        name: 'walt'
      };
      sut.setJSON(json);
    });

    it('should be defined', function () {
      expect(sut.setJSON).toBeDefined();
    });

    it('should change the JSON', function () {
      expect(sut.getJSON()).toEqual({ name: 'walt' });
    });

    it('should change the JSON', function () {
      json.name = 'jesse';
      expect(sut.getJSON()).toEqual({ name: 'walt' });
    });

    it('should reset loaded files counter', function () {
      expect(sut._counter).toEqual(0);
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
  });
});
