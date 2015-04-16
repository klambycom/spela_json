module.exports = function (context, cache) {

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
