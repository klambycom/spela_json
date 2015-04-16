/**
 * # Player
 */

/*! */

let AJSON = require('./parser');

// Create a copy of JSON
let cloneObject = json => JSON.parse(JSON.stringify(json));

// Stupid jshint with bad documentation, bad constructor
let AudioContext = window.AudioContext || window.webkitAudioContext;

class Player {

  /**
   * @method constructor
   * @param {Object} json The audio json
   * @param {AudioContext} context
   */

  constructor(json = {}, context = new AudioContext()) {
    this._context = context;
    this._AJSON = AJSON(context);
    this.setJSON(json);
  }

  /**
   * @method play
   */

  play() {
    if (!this.ready()) { return false; }

    this._sources = this._parsed.play();
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
    if (typeof this._parsed.ready === 'undefined') { return false; }
    return this._parsed.ready();
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
    if (!this.ready()) { return 0; }
    return this._parsed.duration();
  }

  /**
   * Update JSON.
   *
   * @method setJSON
   * @param {Object} json The audio json
   */

  setJSON(json = {}) {
    this._json_data = cloneObject(json);
    this._sources = []; // Reset buffer sources
    this._parsed = this._AJSON.parse(json);
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
}

module.exports = Player;
