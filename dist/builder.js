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
  source.start(file.start);
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

module.exports = function (context, cache) {
  return function (files, duration, ready) {
    return {

      /**
       * @method play
       * @return {Array} all buffer sources
       */

      play: function play() {
        return files.map(function (x) {
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