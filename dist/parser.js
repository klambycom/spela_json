"use strict";

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

var _builder = require("./builder");

module.exports = function (context) {
  var soundCache = {};
  var files = [];
  var nr_of_loaded_files = 0;
  var duration = 0;
  var builder = _builder(context, soundCache);

  // Load sound from file
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

  // Check if all files are loaded
  var ready = function () {
    return nr_of_loaded_files === files.length;
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

      return builder(files, function () {
        return duration;
      }, ready);
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