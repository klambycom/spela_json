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
let playStart = function (context, source, file) {
  source.connect(context.destination);
  source.start(file.offset, file.time[0], file.time[1] - file.time[0]);
};

// Change play rate
let playRate = function (context, source, file) {
  if (typeof file.rate !== 'undefined') {
    source.playbackRate.value = file.rate;
  }
};

// Start build source
let buildSource = function (context, cache, file) {
  let source = context.createBufferSource();
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

      play() {
        let parts = files
          .filter(x => x.type === 'file')
          .map(x => x.parts)
          .reduce((acc, x) => acc.concat(x), []);

        return parts.map(x => {
          let source = buildSource(context, cache, x);

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

      files,

      /**
       * Duration of the whole file in seconds
       *
       * @method duration
       * @return {Number} duration in seconds
       */

      duration,

      /**
       * @method ready
       * @return {Boolean} true if all files are loaded
       */

      ready
    };
  };
};
