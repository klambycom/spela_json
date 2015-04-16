"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * # Player
 */

/*! */

var AJSON = require("./parser");

// Create a copy of JSON
var cloneObject = function (json) {
  return JSON.parse(JSON.stringify(json));
};

// Stupid jshint with bad documentation, bad constructor
var AudioContext = window.AudioContext || window.webkitAudioContext;

var Player = (function () {
  /**
   * @method constructor
   * @param {Object} json The audio json
   * @param {AudioContext} context
   */

  function Player() {
    var json = arguments[0] === undefined ? {} : arguments[0];
    var context = arguments[1] === undefined ? new AudioContext() : arguments[1];
    _classCallCheck(this, Player);

    this._context = context;
    this._AJSON = AJSON(context);
    this.setJSON(json);
  }

  _prototypeProperties(Player, null, {
    play: {

      /**
       * @method play
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
       * @method name
       */

      value: function name() {
        return this._json_data.name;
      },
      writable: true,
      configurable: true
    },
    duration: {

      /**
       * @method duration
       */

      value: function duration() {
        if (!this.ready()) {
          return 0;
        }
        return this._parsed.duration;
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
       */

      value: function setJSON() {
        var json = arguments[0] === undefined ? {} : arguments[0];
        this._json_data = cloneObject(json);
        this._sources = []; // Reset buffer sources
        this._parsed = this._AJSON.parse(json);
      },
      writable: true,
      configurable: true
    },
    getJSON: {

      /**
       * Get the JSON.
       *
       * @method getJSON
       * @return {Object} json The audio json
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