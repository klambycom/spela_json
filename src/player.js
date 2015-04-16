/**
 * # Player
 */

/*! */

// Create a copy of JSON
let cloneObject = json => JSON.parse(JSON.stringify(json));

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

class Player {

  /**
   * @method constructor
   * @param {Object} json The audio json
   * @param {AudioContext} context
   */

  constructor(json = {}, context = new (AudioContext || webkitAudioContext)()) {
    this._context = context;
    this.setJSON(json);
  }

  /**
   * @method play
   */

  play() {
    if (!this.ready()) return false;

    this._files().forEach(x => this._playFile(x));
    return true;
  }

  /**
   * @method stop
   */

  stop() {
    this._sources.forEach(x => x.stop());
  }

  /**
   * @method ready
   * @return {Boolean} true if all files are loaded
   */

  ready() {
    return this._counter === this._nr_of_files;
  }

  /**
   * @method name
   */

  name() {
    return this._json_data.name;
  }

  /**
   * @method duration
   */

  duration() {
    return this._files().reduce((acc, x) => {
      let dur = x.start + soundCache[x.file].duration;
      return dur > acc ? dur : acc;
    }, 0);
  }

  /**
   * Update JSON.
   *
   * @method setJSON
   * @param {Object} json The audio json
   */

  setJSON(json = {}) {
    this._json_data = cloneObject(json);
    this._counter = 0; // Reset counter for loaded files
    this._sources = []; // Reset buffer sources
    this._nr_of_files = this._countFiles();
    this._loadFiles();
  }

  /**
   * Get the JSON.
   *
   * @method getJSON
   * @return {Object} json The audio json
   */

  getJSON() {
    return cloneObject(this._json_data);
  }

  /*!
   * @method _isFile
   * @return {Boolean} true if it's a file
   */

  _isFile(x) {
    return this._json_data.data[x].type === 'file';
  }

  /*!
   * Load all files
   *
   * @method _loadFiles
   */

  _loadFiles() {
    this._files().forEach(x => {
      loadSound(this._context, () => this._counter += 1, x.file);
    });
  }

  /*!
   * Update counter for nr of files
   *
   * @method _countFiles
   * @return {Number} nr of files in the JSON
   */

  _countFiles() {
    return this._files().length;
  }

  /*!
   * @method _playFile
   * @param {Object} file
   */

  _playFile(file) {
    // Create source
    let source = this._context.createBufferSource();
    source.buffer = soundCache[file.file];
    this._sources.push(source); // Remember source, so it can be stopped

    // Choose play rate
    this._playRate(source, file);

    // Choose where to start playing
    this._playStart(source, file);
  }

  _playStart(source, file) {
    source.connect(this._context.destination);
    source.start(file.start);
  }

  _playRate(source, file) {
    if (typeof file.rate !== 'undefined') {
      source.playbackRate.value = file.rate;
    }
  }

  /*!
   * @method _files
   * @return {Array} all files only
   */

  _files() {
    return Object
      .keys(this._json_data.data)
      .filter(this._isFile.bind(this))
      .map(x => this._json_data.data[x]);
  }
}

module.exports = Player;
