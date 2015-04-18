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
var validator = require("./validator");

var cutInParts = function (end, data) {
  var start = 0;
  var parts = [];

  // Cut file
  if (typeof data.cuts !== "undefined") {
    // Create array from object, and delete the object
    var cuts = Object.keys(data.cuts).map(function (y) {
      return data.cuts[y];
    });
    delete data.cuts;

    // TODO Sort cuts

    // Cut out parts and change start time to after the cut
    parts = cuts.map(function (x) {
      var tmp = start;
      start = x.to;
      return { time: [tmp, x.from], edits: [] };
    });

    // Add the last part, if last part is not cut out
    if (start < end) {
      parts.push({ time: [start, end], edits: [] });
    }
  }

  // Don't cut file
  if (parts.length === 0) {
    parts.push({ time: [start, end], edits: [] });
  }

  return parts;
};

var parseData = function (xs) {
  return xs.map(function (x) {
    x.offset = x.start;
    x.parts = cutInParts(x.end - x.start, x);

    delete x.start;
    delete x.end;

    return x;
  });
};

module.exports = function (context) {
  var soundCache = {};
  var files = [];
  var nr_of_loaded_files = 0;
  var duration = 0;

  // Check if all files are loaded
  var ready = function () {
    return nr_of_loaded_files === files.length;
  };

  var builder = _builder(context, soundCache, function () {
    return duration;
  }, ready);

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
          return context.decodeAudioData(req.response, function (buffer) {
            return fn((soundCache[url] = buffer) && buffer);
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

  function ValidationException(errors) {
    this.name = "ValidationException";
    this.message = "The data is not valid SpelaJSON-data";
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

    parse: function parse(json) {
      var errors = validator(json);
      if (errors.length > 0) {
        throw new ValidationException(errors);
      }

      nr_of_loaded_files = 0;
      duration = 0;
      files = findFiles(json);

      // Load files, and check duration
      files.forEach(function (x) {
        loadSound(context, function (buffer) {
          // Calculate duration
          var realDuration = buffer.duration + x.start;
          if (realDuration > duration) {
            duration = realDuration;
          }
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