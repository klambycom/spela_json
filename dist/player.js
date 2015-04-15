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
var loadSound = function (context, fn, url) {
  if (soundCache[url]) {
    fn(soundCache[url]);
  } else {
    (function () {
      var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.responseType = "arraybuffer";
      req.addEventListener("load", function () {
        context.decodeAudioData(req.response, function (buffer) {
          soundCache[url] = buffer;
          fn(buffer);
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
   * @param {AudioContext} context
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
        this._counter = 0; // Reset counter for loaded files
        this._sources = []; // Reset buffer sources
        this._nr_of_files = this._countFiles();
        this._loadFiles();
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
        return this._files().reduce(function (acc, x) {
          var dur = x.start + soundCache[x.file].duration;
          return dur > acc ? dur : acc;
        }, 0);
      },
      writable: true,
      configurable: true
    },
    play: {

      /**
       * @method play
       */

      value: function play() {
        var _this = this;
        if (!this.ready()) {
          return false;
        }this._files().forEach(function (x) {
          return _this._playFile(x);
        });
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
        return this._counter === this._nr_of_files;
      },
      writable: true,
      configurable: true
    },
    _isFile: {

      /*!
       * @method _isFile
       * @return {Boolean} true if it's a file
       */

      value: function _isFile(x) {
        return this._json_data.data[x].type === "file";
      },
      writable: true,
      configurable: true
    },
    _loadFiles: {

      /*!
       * Load all files
       *
       * @method _loadFiles
       */

      value: function _loadFiles() {
        var _this = this;
        this._files().forEach(function (x) {
          loadSound(_this._context, function () {
            return _this._counter += 1;
          }, x.file);
        });
      },
      writable: true,
      configurable: true
    },
    _countFiles: {

      /*!
       * Update counter for nr of files
       *
       * @method _countFiles
       * @return {Number} nr of files in the JSON
       */

      value: function _countFiles() {
        return this._files().length;
      },
      writable: true,
      configurable: true
    },
    _playFile: {

      /*!
       * @method _playFile
       * @param {Object} file
       */

      value: function _playFile(file) {
        var source = this._context.createBufferSource();
        source.buffer = soundCache[file.file];
        source.connect(this._context.destination);
        source.start(file.start);
        this._sources.push(source);
      },
      writable: true,
      configurable: true
    },
    _files: {

      /*!
       * @method _files
       * @return {Array} all files only
       */

      value: function _files() {
        var _this = this;
        return Object.keys(this._json_data.data).filter(this._isFile.bind(this)).map(function (x) {
          return _this._json_data.data[x];
        });
      },
      writable: true,
      configurable: true
    }
  });

  return Player;
})();

module.exports = Player;