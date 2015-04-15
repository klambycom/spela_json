let cloneObject = json => JSON.parse(JSON.stringify(json));

class Player {
  constructor(json = {}) {
    this.json_data = cloneObject(json);
  }

  setJSON(json = {}) {
    this.json_data = cloneObject(json);
  }

  getJSON() {
    return cloneObject(this.json_data);
  }

  play() {
    console.log('play');
  }
}

module.exports = Player;
