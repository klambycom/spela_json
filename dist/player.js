"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * # Player
 *
 * Plays JSON. See example.
 */

/*! */

var AJSON = require("./parser");
var validator = require("./validator");

// Create a copy of JSON
var cloneObject = function (json) {
  return JSON.parse(JSON.stringify(json));
};

// Stupid jshint with bad documentation, bad constructor
var AudioContext = window.AudioContext || window.webkitAudioContext;

function ValidationError(errors) {
  this.name = "ValidationError";
  this.message = "Input data is not valid SpelaJSON-data";
  this.errors = errors;
}

var Player = (function () {
  /**
   * Create a player-object with the JSON, and optional AudioContext. The
   * browser only allow a few number of AudioContext.
   *
   * @method constructor
   * @param {Object} json The audio json
   * @param {AudioContext} context
   * @throws {ValidationError} Invalid JSON
   */

  function Player() {
    var json = arguments[0] === undefined ? {} : arguments[0];
    var context = arguments[1] === undefined ? new AudioContext() : arguments[1];
    _classCallCheck(this, Player);

    this._context = context;
    this._AJSON = AJSON(context);
    this.setJSON(json);
  }

  _prototypeProperties(Player, {
    validate: {

      /**
       * ## Player.validate(json)
       *
       * Validate the JSON.
       *
       * @param {Object} json
       * @return {Array} errors
       */

      value: function validate(json) {
        return validator(json);
      },
      writable: true,
      configurable: true
    }
  }, {
    play: {

      /**
       * Plays JSON, only if ready and all files is loaded.
       *
       * @method play
       * @return {Boolean} true if the file can be played
       */

      value: function play() {
        if (!this.ready()) {
          return false;
        }

        this._sources = this._parsed.play();
        return true;
      },
      writable: true,
      configurable: true
    },
    stop: {

      /**
       * Stops playing the file.
       *
       * @method stop
       */

      value: function stop() {
        this._sources.forEach(function (x) {
          return x.stop();
        });
      },
      writable: true,
      configurable: true
    },
    ready: {

      /**
       * Check if JSON-file is ready, and all files are loaded.
       *
       * @method ready
       * @return {Boolean} true if all files are loaded
       */

      value: function ready() {
        if (typeof this._parsed.ready === "undefined") {
          return false;
        }
        return this._parsed.ready();
      },
      writable: true,
      configurable: true
    },
    name: {

      /**
       * Name of the JSON-file.
       *
       * @method name
       * @return {String} name of the file
       */

      value: function name() {
        return this._json_data.name;
      },
      writable: true,
      configurable: true
    },
    duration: {

      /**
       * Duration of the whole JSON-file. Returns zero of file is not ready.
       *
       * @method duration
       * @return {Number} length of the file
       */

      value: function duration() {
        if (!this.ready()) {
          return 0;
        }
        return this._parsed.duration();
      },
      writable: true,
      configurable: true
    },
    setJSON: {

      /**
       * Update JSON.
       *
       * @method setJSON
       * @param {Object} json The audio json
       * @throws {ValidationError} Invalid JSON
       */

      value: function setJSON() {
        var json = arguments[0] === undefined ? {} : arguments[0];
        var errors = validator(json);
        if (errors.length > 0) {
          throw new ValidationError(errors);
        }

        this._json_data = cloneObject(json);
        this._sources = []; // Reset buffer sources
        this._parsed = this._AJSON.parse(cloneObject(json));
      },
      writable: true,
      configurable: true
    },
    getJSON: {

      /**
       * Get the JSON.
       *
       * @method getJSON
       * @return {Object} The audio json
       */

      value: function getJSON() {
        return cloneObject(this._json_data);
      },
      writable: true,
      configurable: true
    }
  });

  return Player;
})();

module.exports = Player;