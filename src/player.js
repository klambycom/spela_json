/**
 * # Player
 */

/*! */

// Create a copy of JSON
let cloneObject = json => JSON.parse(JSON.stringify(json));

// Load sound from file
let loadSound = function (context, url, callback) {
  let req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.responseType = 'arraybuffer';
  req.addEventListener('load', function () {
    context.decodeAudioData(req.response, callback);
  });
  req.send();
};

class Player {

  /**
   * @method constructor
   * @param {Object} json The audio json
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
    this._counter = 0;
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
  }
}

module.exports = Player;
