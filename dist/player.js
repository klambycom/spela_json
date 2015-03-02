"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Player = (function () {
  function Player() {
    _classCallCheck(this, Player);
  }

  _prototypeProperties(Player, null, {
    play: {
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