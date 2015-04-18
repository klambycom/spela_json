module.exports = function () {
  var data = [
    { type: 'file', file: '/alien_phaser.wav', offset: 0, parts: [
      { time: [ 0, 10 ], edits: [  ] } ]},
    { type: 'file', file: '/car.wav', offset: 1.5, parts: [
      { time: [ 0, 8.5 ], edits: [  ] } ]},
    { type: 'file', file: '/crumple_paper.wav', offset: 3, parts: [
      { time: [ 0, 7 ], edits: [  ] } ]},
    { type: 'file', file: '/mbira.wav', offset: 0, parts: [
      { time: [ 0, 2 ], edits: [  ] },
      { time: [ 3, 5 ], edits: [  ] },
      { time: [ 6, 10 ], edits: [  ] } ]},
    { type: 'file', file: '/surround.wav', offset: 3, parts: [
      { time: [ 0, 7 ], edits: [  ] } ]}
  ];

  return JSON.parse(JSON.stringify(data));
};
