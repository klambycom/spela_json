/**
 * # Player
 */

/*! */

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
   * @method play
   */

  play() {
    console.log('play');
  }
}

module.exports = Player;
