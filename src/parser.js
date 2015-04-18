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

let cutInParts = function (start, end, data) {
  let parts = [];

  // Cut file
  if (typeof data.cuts !== 'undefined') {
    let cuts = Object.keys(data.cuts).map(y => data.cuts[y]);
    delete data.cuts;

    // TODO Sort cuts

    parts = cuts.map(x => {
      let tmp = start;
      start = x.to;
      return { time: [tmp, x.from], edits: [] };
    });

    if (start < end) {
      parts.push({ time: [start, end], edits: [] });
    }
  }

  // Don't cut file
  if (parts.length === 0) {
    parts.push({ time: [ start, end ], edits: [] });
  }

  return parts;
};

let parseData = function (rows) {

  rows = rows.map(function (row) {
    let offset = row.start;
    let start = row.start - offset;
    let end = row.end - offset;
    delete row.start;
    delete row.end;

    row.offset = offset;
    row.parts = cutInParts(start, end, row);

    return row;
  });

  return rows;
};

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

      //parseData(files);

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
