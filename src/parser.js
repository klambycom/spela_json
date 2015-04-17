/**
 * # parser(context)
 *
 *
 * ### Params:
 *
 * * **AudioContext** *context*
 *
 *
 * ### Return:
 *
 * * **Object** functions for parsing audio JSON
 */

/*! */

let _builder = require('./builder');
let validator = require('./validator');

// {
//   "type": "file",
//   "file": "./",
//   "parts": [
//     { "time": [0, 4], "edits": [] },
//     { "time": [5, 8], "edits": [] },
//     { "time": [10, 14], "edits": [ "rate": 3 ] },
//     { "time": [15, 18], "edits": [] }
//   ]
// }

let parse_files = function (files) {

  files = files.map(function (file) {
    let offset = file.start;
    let start = file.start - offset;
    let end = file.end - offset;
    delete file.start;
    delete file.end;

    file.offset = offset;
    file.parts = [];

    if (typeof file.cuts !== 'undefined') {
      let cuts = Object.keys(file.cuts).map(y => file.cuts[y]);
      delete file.cuts;

      // TODO Sort cuts

      file.parts = cuts.map(x => {
        let tmp = start;
        start = x.to;
        return { time: [tmp, x.from], edits: [] };
      });

      if (start < end) {
        file.parts.push({ time: [start, end], edits: [] });
      }
    }

    if (file.parts.length === 0) {
      file.parts.push({ time: [ start, end ], edits: [] });
    }

    return file;
  });

  return files;
};

//parse_files([
//  { type: 'file', file: '/alien_phaser.wav', start: 0, end: 10 },
//  { type: 'file', file: '/car.wav', start: 1.5, end: 10 },
//  { type: 'file', file: '/crumple_paper.wav', start: 3, end: 10 },
//  {
//    type: 'file',
//    file: '/mbira.wav',
//    start: 0,
//    end: 10,
//    cuts: {
//      '1': { from: 2, to: 3 },
//      '2': { from: 5, to: 6 }
//    }
//  },
//  { type: 'file', file: '/surround.wav', start: 3, end: 10 }
//]);

module.exports = function (context) {
  let soundCache = {};
  let files = [];
  let nr_of_loaded_files = 0;
  let duration = 0;

  // Check if all files are loaded
  let ready = function () {
    return nr_of_loaded_files === files.length;
  };

  let builder = _builder(context, soundCache, () => duration, ready);

  // Load sound from file
  let loadSound = function (context, fn, url) {
    if (soundCache[url]) {
      fn(soundCache[url]);
    } else {
      let req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.responseType = 'arraybuffer';
      req.addEventListener('load', function () {
        context.decodeAudioData(req.response, function (buffer) {
          soundCache[url] = buffer;
          fn(buffer);
        });
      });
      req.send();
    }
  };

  // Test if key is file
  let isFile = function (json) {
    return (key) => json.data[key].type === 'file';
  };

  // Find files from JSON
  let findFiles = function (json) {
    return Object
      .keys(json.data)
      .filter(isFile(json))
      .map(x => json.data[x]);
  };

  function ValidationException(errors) {
    this.name = 'ValidationException';
    this.message = 'The data is not valid SpelaJSON-data';
    this.errors = errors;
  }

  return {

    /**
     * Parse JSON and load files
     *
     * @method parse
     * @param {Object} json
     * @throws {ValidationException} Invalid JSON
     */

    parse(json) {
      let errors = validator(json);
      if (errors.length > 0) { throw new ValidationException(errors); }

      nr_of_loaded_files = 0;
      duration = 0;
      files = findFiles(json);

      // Load files, and check duration
      files.forEach(x => {
        loadSound(context, (buffer) => {
          // Calculate duration
          let realDuration = buffer.duration + x.start;
          if (realDuration > duration) { duration = realDuration; }
          // Change nr of loaded files
          nr_of_loaded_files += 1; 
        }, x.file);
      });

      //parse_files(files);

      return builder(files);
    },

    /**
     * @method isFile
     * @param {Object} json
     * @param {String} key
     * @return {Boolean} true if it's a file
     */

    isFile(json, key) {
      return isFile(json)(key);
    }
  };
};
