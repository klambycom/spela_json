# SpelaJSON [![Dependencies badge][david-image]][david-url] [![DevDependencies badge][david-dev-image]][david-dev-url]

SpelaJSON *(swedish for PlayJSON)*, plays JSON using
[Web Audio API](http://webaudio.github.io/web-audio-api/). I use it togheter
with [DiffSync](https://github.com/klambycom/diffsync), a implementation of
Differential Syncronization in JavaScript, to let users edit the same audio file.


## Installation

TODO


## Usage

TODO


## API

<!-- Start src/player.js -->

### Player

Plays JSON. See example.

#### constructor(json, context)

Create a player-object with the JSON, and optional AudioContext. The
browser only allow a few number of AudioContext.

##### Params:

* **Object** *json* The audio json
* **AudioContext** *context* 

#### play()

Plays JSON, only if ready and all files is loaded.

##### Return:

* **Boolean** true if the file can be played

#### stop()

Stops playing the file.

#### ready()

Check if JSON-file is ready, and all files are loaded.

##### Return:

* **Boolean** true if all files are loaded

#### name()

Name of the JSON-file.

##### Return:

* **String** name of the file

#### duration()

Duration of the whole JSON-file. Returns zero of file is not ready.

##### Return:

* **Number** length of the file

#### setJSON(json)

Update JSON.

##### Params:

* **Object** *json* The audio json

#### getJSON()

Get the JSON.

##### Return:

* **Object** json The audio json

<!-- End src/player.js -->


## License

Copyright (c) 2015 Christian Nilsson

Licensed under the [MIT license](LICENSE).


[david-url]: https://david-dm.org/klambycom/spela_json#info=dependencies&view=table
[david-image]: https://david-dm.org/klambycom/spela_json.svg?style=flat-square

[david-dev-url]: https://david-dm.org/klambycom/spela_json#info=devDependencies&view=table
[david-dev-image]: https://david-dm.org/klambycom/spela_json/dev-status.svg?style=flat-square
