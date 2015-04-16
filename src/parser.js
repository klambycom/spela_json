module.exports = function (context) {
  let files = [];
  let nr_of_loaded_files = 0;
  let duration = 0;

  // Load sound from file
  let soundCache = {};
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

  // Start playing on right position
  let playStart = function (source, file) {
    source.connect(context.destination);
    source.start(file.start);
  };

  // Change play rate
  let playRate = function (source, file) {
    if (typeof file.rate !== 'undefined') {
      source.playbackRate.value = file.rate;
    }
  };

  // Start build source
  let buildSource = function (file) {
    // Create source
    let source = context.createBufferSource();
    source.buffer = soundCache[file.file];

    // Choose play rate
    playRate(source, file);

    // Choose where to start playing
    playStart(source, file);

    return source;
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

  // Returned object from parse
  let fns = {

    /**
     * @method play
     * @return {Array} all buffer sources
     */

    play() {
      return files.map(x => buildSource(x));
    },

    /**
     * Array containing all files
     *
     * @name files
     */

    files,

    /**
     * Duration of the whole file in seconds
     *
     * @name duration
     */

    duration,

    /**
     * @method ready
     * @return {Boolean} true if all files are loaded
     */

    ready() {
      return nr_of_loaded_files === files.length;
    }
  };

  return {

    /**
     * Parse JSON and load files
     *
     * @method parse
     * @param {Object} json
     */

    parse(json) {
      // TODO Validation!

      nr_of_loaded_files = 0;
      duration = 0;
      files = findFiles(json);

      // Load files, and check duration
      files.forEach(x => {
        loadSound(context, (buffer) => {
          // Calculate duration
          // TODO Calculate rate and cuts
          let realDuration = buffer.duration + x.start;
          if (realDuration > duration) { duration = realDuration; }
          // Change nr of loaded files
          nr_of_loaded_files += 1; 
        }, x.file);
      });

      return fns;
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
