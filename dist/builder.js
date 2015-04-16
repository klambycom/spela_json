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

module.exports = function (context, cache) {
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
    source.buffer = cache[file.file];

    // Choose play rate
    playRate(source, file);

    // Choose where to start playing
    playStart(source, file);

    return source;
  };

  return function (files, duration, ready) {
    return {

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