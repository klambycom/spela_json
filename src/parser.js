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

let cutInParts = function (end, data) {
  let start = 0;
  let parts = [];

  // Cut file
  if (typeof data.cuts !== 'undefined') {
    // Create array from object, and delete the object
    let cuts = Object.keys(data.cuts).map(y => data.cuts[y]);
    delete data.cuts;

    // Sort cuts
    cuts.sort((a, b) => a.from - b.from);

    // Cut out parts and change start time to after the cut
    parts = cuts.map(x => {
      let tmp = start;
      start = x.to;
      return { time: [tmp, x.from], edits: [] };
    });

    // Add the last part, if last part is not cut out
    if (start < end) { parts.push({ time: [start, end], edits: [] }); }
  }

  // Don't cut file
  if (parts.length === 0) { parts.push({ time: [ start, end ], edits: [] }); }

  return parts;
};

let movePathAndOffset = file => file.parts.map(x => {
  x.file = file.file;
  x.offset = file.offset;
  return x;
});

let parseData = xs => xs.map(x => {
  x.offset = x.start;

  if (x.type === 'file') {
    x.parts = cutInParts(x.end - x.start, x);
    x.parts = movePathAndOffset(x);
  }

  delete x.start;
  delete x.end;
  delete x.file;
  delete x.offset;

  return x;
});

module.exports = function (context) {
  let soundCache = {};
  let files = [];
  let nr_of_loaded_files = 0;
  let duration = 0;

  // Check if all files are loaded
  let ready = () => nr_of_loaded_files === files.length;

  let builder = _builder(context, soundCache, () => duration, ready);

  // Load sound from file
  let loadSound = function (context, fn, url) {
    if (soundCache[url]) {
      fn(soundCache[url]);
    } else {
      let req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.responseType = 'arraybuffer';
      req.addEventListener('load', () => context.decodeAudioData(
            req.response,
            buffer => fn((soundCache[url] = buffer) && buffer))
      );
      req.send();
    }
  };

  // Test if key is file
  let isFile = json => key => json.data[key].type === 'file';

  // Find files from JSON
  let findFiles = json => Object
    .keys(json.data)
    .filter(isFile(json))
    .map(x => json.data[x]);

  return {

    /**
     * Parse JSON and load files
     *
     * @method parse
     * @param {Object} json
     */

    parse(json) {
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

      return builder(parseData(files));
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
