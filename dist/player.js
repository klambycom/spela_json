"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * # Player
 */

/*! */

// Create a copy of JSON
var cloneObject = function (json) {
  return JSON.parse(JSON.stringify(json));
};

// Load sound from file
var soundCache = {};
var loadSound = function (context, url, callback) {
  if (soundCache[url]) {
    callback(soundCache[url]);
  } else {
    (function () {
      var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.responseType = "arraybuffer";
      req.addEventListener("load", function () {
        context.decodeAudioData(req.response, function (buffer) {
          soundCache[url] = buffer;
          callback(buffer);
        });
      });
      req.send();
    })();
  }
};

var Player = (function () {
  /**
   * @method constructor
   * @param {Object} json The audio json
   */

  function Player() {
    var json = arguments[0] === undefined ? {} : arguments[0];
    var context = arguments[1] === undefined ? new AudioContext() : arguments[1];
    _classCallCheck(this, Player);

    this._context = context;
    this.setJSON(json);
  }

  _prototypeProperties(Player, null, {
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
        this._counter = 0;
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
    },
    getName: {

      /**
       * @method getName
       */

      value: function getName() {
        return this._json_data.name;
      },
      writable: true,
      configurable: true
    },
    getDuration: {

      /**
       * @method getDuration
       */

      value: function getDuration() {},
      writable: true,
      configurable: true
    },
    play: {

      /**
       * @method play
       */

      value: function play() {
        console.log("play");
      },
      writable: true,
      configurable: true
    },
    ready: {

      /**
       * @method ready
       * @return {Boolean} true if all files are loaded
       */

      value: function ready() {},
      writable: true,
      configurable: true
    }
  });

  return Player;
})();

module.exports = Player;
// TODO!