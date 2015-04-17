/**
 * # Player
 *
 * Plays JSON. See example.
 */

/*! */

let AJSON = require('./parser');

// Create a copy of JSON
let cloneObject = json => JSON.parse(JSON.stringify(json));

// Stupid jshint with bad documentation, bad constructor
let AudioContext = window.AudioContext || window.webkitAudioContext;

class Player {

  /**
   * Create a player-object with the JSON, and optional AudioContext. The
   * browser only allow a few number of AudioContext.
   *
   * @method constructor
   * @param {Object} json The audio json
   * @param {AudioContext} context
   * @throws {ValidationException} Invalid JSON
   */

  constructor(json = {}, context = new AudioContext()) {
    this._context = context;
    this._AJSON = AJSON(context);
    this.setJSON(json);
  }

  /**
   * Plays JSON, only if ready and all files is loaded.
   *
   * @method play
   * @return {Boolean} true if the file can be played
   */

  play() {
    if (!this.ready()) { return false; }

    this._sources = this._parsed.play();
    return true;
  }

  /**
   * Stops playing the file.
   *
   * @method stop
   */

  stop() {
    this._sources.forEach(x => x.stop());
  }

  /**
   * Check if JSON-file is ready, and all files are loaded.
   *
   * @method ready
   * @return {Boolean} true if all files are loaded
   */

  ready() {
    if (typeof this._parsed.ready === 'undefined') { return false; }
    return this._parsed.ready();
  }

  /**
   * Name of the JSON-file.
   *
   * @method name
   * @return {String} name of the file
   */

  name() {
    return this._json_data.name;
  }

  /**
   * Duration of the whole JSON-file. Returns zero of file is not ready.
   *
   * @method duration
   * @return {Number} length of the file
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
   * @throws {ValidationException} Invalid JSON
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
