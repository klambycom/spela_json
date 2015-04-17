module.exports = function () {
  var data = {
    name: 'audiofile1',
    data: {
      '1': {
        type: 'file',
        file: '/alien_phaser.wav',
        start: 0,
        end: 10
      },
      '2': {
        type: 'file',
        file: '/car.wav',
        start: 1.5,
        end: 10
      },
      '3': {
        type: 'file',
        file: '/crumple_paper.wav',
        start: 3,
        end: 10
      },
      '4': {
        type: 'file',
        file: '/mbira.wav',
        start: 5,
        end: 10
      },
      '5': {
        type: 'file',
        file: '/surround.wav',
        start: 3,
        end: 10
      }
    }
  };

  return JSON.parse(JSON.stringify(data));
};
