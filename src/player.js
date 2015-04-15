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

  constructor(json = {}, context = new AudioContext()) {
    this._context = context;
    this.setJSON(json);
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

  /**
   * @method getName
   */

  getName() {
    return this._json_data.name;
  }

  /**
   * @method getDuration
   */

  getDuration() {
    // TODO!
  }

  /**
   * @method play
   */

  play() {
    console.log('play');
  }

  /**
   * @method ready
   * @return {Boolean} true if all files are loaded
   */

  ready() {
    return this._counter === this._nr_of_files;
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
    let load = x => {
      return loadSound(this._context, () => this._counter += 1, this._json_data.data[x].file);
    };

    Object
      .keys(this._json_data.data)
      .filter(this._isFile.bind(this))
      .forEach(load);
  }

  /*!
   * Update counter for nr of files
   *
   * @method _countFiles
   * @return {Number} nr of files in the JSON
   */

  _countFiles() {
    return Object
      .keys(this._json_data.data)
      .filter(this._isFile.bind(this))
      .length;
  }
}

module.exports = Player;
