/**
 * # Player
 */

/*! */

let context = new AudioContext();
let cloneObject = json => JSON.parse(JSON.stringify(json));

class Player {

  /**
   * @method constructor
   * @param {Object} json The audio json
   */

  constructor(json = {}) {
    this.setJSON(json);
  }

  /**
   * Update JSON.
   *
   * @method setJSON
   * @param {Object} json The audio json
   */

  setJSON(json = {}) {
    this.json_data = cloneObject(json);
  }

  /**
   * Get the JSON.
   *
   * @method getJSON
   * @return {Object} json The audio json
   */

  getJSON() {
    return cloneObject(this.json_data);
  }

  /**
   * @method getName
   */

  getName() {
    return this.json_data.name;
  }

  /**
   * @method getDuration
   */

  getDuration() {
  }

  /**
   * @method play
   */

  play() {
    console.log('play');
  }
}

module.exports = Player;
