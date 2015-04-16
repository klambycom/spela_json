"use strict";

module.exports = function (context) {
  var files = [];
  var nr_of_loaded_files = 0;
  var duration = 0;

  // Load sound from file
  var soundCache = {};
  var loadSound = function (context, fn, url) {
    if (soundCache[url]) {
      fn(soundCache[url]);
    } else {
      (function () {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "arraybuffer";
        req.addEventListener("load", function () {
          context.decodeAudioData(req.response, function (buffer) {
            soundCache[url] = buffer;
            fn(buffer);
          });
        });
        req.send();
      })();
    }
  };

  // Start playing on right position
  var playStart = function (source, file) {
    source.connect(context.destination);
    source.start(file.start);
  };

  // Change play rate
  var playRate = function (source, file) {
    if (typeof file.rate !== "undefined") {
      source.playbackRate.value = file.rate;
    }
  };

  // Start build source
  var buildSource = function (file) {
    // Create source
    var source = context.createBufferSource();
    source.buffer = soundCache[file.file];

    // Choose play rate
    playRate(source, file);

    // Choose where to start playing
    playStart(source, file);

    return source;
  };

  // Test if key is file
  var isFile = function (json) {
    return function (key) {
      return json.data[key].type === "file";
    };
  };

  // Find files from JSON
  var findFiles = function (json) {
    return Object.keys(json.data).filter(isFile(json)).map(function (x) {
      return json.data[x];
    });
  };

  // Returned object from parse
  var fns = {

    /**
     * @method play
     * @return {Array} all buffer sources
     */

    play: function play() {
      return files.map(function (x) {
        return buildSource(x);
      });
    },

    /**
     * Array containing all files
     *
     * @name files
     */

    files: files,

    /**
     * Duration of the whole file in seconds
     *
     * @name duration
     */

    duration: duration,

    /**
     * @method ready
     * @return {Boolean} true if all files are loaded
     */

    ready: function ready() {
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

    parse: function parse(json) {
      // TODO Validation!

      nr_of_loaded_files = 0;
      duration = 0;
      files = findFiles(json);

      // Load files, and check duration
      files.forEach(function (x) {
        loadSound(context, function (buffer) {
          // Calculate duration
          // TODO Calculate rate and cuts
          var realDuration = buffer.duration + x.start;
          if (realDuration > duration) {
            duration = realDuration;
          }
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

    isFile: (function (_isFile) {
      var _isFileWrapper = function isFile() {
        return _isFile.apply(this, arguments);
      };

      _isFileWrapper.toString = function () {
        return _isFile.toString();
      };

      return _isFileWrapper;
    })(function (json, key) {
      return isFile(json)(key);
    })
  };
};