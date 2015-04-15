let ljud = require('./index');

let file = {
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
      start: 10
    }
  }
};

var player = new ljud(file);
window.player = player;
