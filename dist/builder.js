"use strict";

/**
 * # builder(context, cache)
 *
 *
 * ### Params:
 *
 * * **AudioContext** *context*
 * * **Object** *cache* cached files
 *
 *
 * ### Return:
 *
 * * **Function** function with params files, duration and ready
 */

/*! */

// Start playing on right position
var playStart = function (context, source, file) {
  source.connect(context.destination);
  source.start(file.offset, file.time[0], file.time[1] - file.time[0]);
};

// Change play rate
var playRate = function (context, source, file) {
  if (typeof file.rate !== "undefined") {
    source.playbackRate.value = file.rate;
  }
};

// Start build source
var buildSource = function (context, cache, file) {
  var source = context.createBufferSource();
  source.buffer = cache[file.file];
  return source;
};

module.exports = function (context, cache, duration, ready) {
  return function (files) {
    return {

      /**
       * @method play
       * @return {Array} all buffer sources
       */

      play: function play() {
        var parts = files.filter(function (x) {
          return x.type === "file";
        }).map(function (x) {
          return x.parts;
        }).reduce(function (acc, x) {
          return acc.concat(x);
        }, []);

        return parts.map(function (x) {
          var source = buildSource(context, cache, x);

          playRate(context, source, x); // Choose play rate
          playStart(context, source, x); // Choose where to start playing

          return source;
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
       * @method duration
       * @return {Number} duration in seconds
       */

      duration: duration,

      /**
       * @method ready
       * @return {Boolean} true if all files are loaded
       */

      ready: ready
    };
  };
};