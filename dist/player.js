"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * # Player
 */

/*! */

var cloneObject = function (json) {
  return JSON.parse(JSON.stringify(json));
};

var Player = (function () {
  /**
   * @method constructor
   * @param {Object} json The audio json
   */

  function Player() {
    var json = arguments[0] === undefined ? {} : arguments[0];
    _classCallCheck(this, Player);

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
        this.json_data = cloneObject(json);
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
        return cloneObject(this.json_data);
      },
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
    }
  });

  return Player;
})();

module.exports = Player;