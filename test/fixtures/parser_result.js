module.exports = function () {
  var data = [
    { type: 'file', parts: [
      { time: [ 0, 10 ], edits: [  ], file: '/alien_phaser.wav', offset: 0 } ]},
    { type: 'file', parts: [
      { time: [ 0, 8.5 ], edits: [  ], file: '/car.wav', offset: 1.5 } ]},
    { type: 'file', parts: [
      { time: [ 0, 7 ], edits: [  ], file: '/crumple_paper.wav', offset: 3 } ]},
    { type: 'file', parts: [
      { time: [ 0, 2 ], edits: [  ], file: '/mbira.wav', offset: 0 },
      { time: [ 3, 5 ], edits: [  ], file: '/mbira.wav', offset: 0 },
      { time: [ 6, 10 ], edits: [  ], file: '/mbira.wav', offset: 0 } ]},
    { type: 'file', parts: [
      { time: [ 0, 7 ], edits: [  ], file: '/surround.wav', offset: 3 } ]}
  ];

  return JSON.parse(JSON.stringify(data));
};
