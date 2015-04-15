var Player = require('../dist/player.js');

describe('Player', function () {
  var sut, data;

  beforeEach(function () {
    data = {
      name: 'audiofile1'
    };

    sut = new Player(data);
  });

  it('should have a play-function', function () {
    expect(sut.play).toBeDefined();
  });

  describe('#constructor', function () {
    it('shuld take JSON as input to constructor', function () {
      expect(sut.json_data).toEqual({ name: 'audiofile1' });
    });

    it('shuld copy the JSON', function () {
      data.name = 'af1';
      expect(sut.json_data).toEqual({ name: 'audiofile1' });
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
});
