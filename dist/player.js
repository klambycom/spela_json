"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var cloneObject = function (json) {
  return JSON.parse(JSON.stringify(json));
};

var Player = (function () {
  function Player() {
    var json = arguments[0] === undefined ? {} : arguments[0];
    _classCallCheck(this, Player);

    this.json_data = cloneObject(json);
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