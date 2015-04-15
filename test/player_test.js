var Player = require('../dist/player.js');

describe('Player', function () {
  var sut;

  beforeEach(function () {
    sut = new Player();
  });

  it('should have a play-function', function () {
    expect(sut.play).toBeDefined();
  });
});
