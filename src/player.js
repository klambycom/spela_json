let cloneObject = json => JSON.parse(JSON.stringify(json));

class Player {
  constructor(json = {}) {
    this.json_data = cloneObject(json);
  }

  play() {
    console.log('play');
  }
}

module.exports = Player;
