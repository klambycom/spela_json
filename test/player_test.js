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
});
