module.exports = function () {
  var data = [
    { type: 'file', file: '/alien_phaser.wav', start: 0, end: 10 },
    { type: 'file', file: '/car.wav', start: 1.5, end: 10 },
    { type: 'file', file: '/crumple_paper.wav', start: 3, end: 10 },
      {
        type: 'file',
        file: '/mbira.wav',
        start: 0,
        end: 10,
        cuts: {
          '1': { from: 2, to: 3 },
          '2': { from: 5, to: 6 }
        }
      },
      { type: 'file', file: '/surround.wav', start: 3, end: 10 }
    ];

  return JSON.parse(JSON.stringify(data));
};
