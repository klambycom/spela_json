let ljud = require('./index');

let file = {
  name: 'audiofile1',
  data: {
    '1': {
      type: 'file',
      file: '/alien_phaser.wav',
      start: 0,
      end: 1.399
    },
    '2': {
      type: 'file',
      file: '/car.wav',
      start: 1.5,
      end: 2.7935833333
    },
    '3': {
      type: 'file',
      file: '/crumple_paper.wav',
      start: 3,
      end: 5.69875
    },
    '4': {
      type: 'file',
      file: '/mbira.wav',
      start: 5,
      end: 52.3308125,
      rate: 4
    },
    '5': {
      type: 'file',
      file: '/surround.wav',
      start: 10,
      end: 25.9999,
      rate: 3
    }
  }
};

let file2 = {
  data: {
    '1': {
      type: 'file',
      file: '/alien_phaser.wav',
      start: -10,
      end: 1.399
    },
    '2': {
      type: 'fille',
      file: '/car.wav',
      start: 1.5,
      end: 1.2935833333
    },
    '3': {
      type: 'file',
      file: '/crumple_paper.wav',
      start: 3,
      end: 5.69875
    },
    '4': {
      type: 'file',
      file: '/mbira.wav',
      start: 5,
      end: 52.3308125,
      rate: 4
    },
    '5': {
      type: 'file',
      file: '/surround.wav',
      start: 10,
      end: 25.9999,
      rate: 3
    }
  }
};

//console.log('VALID', ljud.validate(file));
//console.log('INVALID', ljud.validate(file2));

try {
  var player = new ljud(file);
  window.player = player;
} catch (e) {
  console.log(e);
}
