# Ljudspelare [![Dependencies badge][david-image]][david-url] [![DevDependencies badge][david-dev-image]][david-dev-url]


## API

<!-- Start src/player.js -->

### Player

#### constructor(json, context)

##### Params:

* **Object** *json* The audio json
* **AudioContext** *context* 

#### play()

#### stop()

#### ready()

##### Return:

* **Boolean** true if all files are loaded

#### name()

#### duration()

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
