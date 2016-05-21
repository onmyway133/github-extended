# picker [![Build Status](https://travis-ci.org/ragingwind/picker.svg?branch=master)](https://travis-ci.org/ragingwind/picker)

> Pick property in json data by string path key


## Install

```
$ npm install --save picker
```


## Usage

```js
var picker = require('picker');

var prop = picker(json, 'json.properties.object.name');
console.log(prop.value, prop.key, prop.container);

var prop = picker(json, 'json.properties.array.[0]');
console.log(prop.container[0]);
```


## API

### picker(jsonData, path)

#### input

*Required*  
Type: `json`

Target json data contains name and value to pick

#### path

*Required*  
Type: `string`

Path to get to target property. Using string index to get a path to `Array` type property. You can find more information in the test.js

## Returns

If picker can find a target then will returns its parent, key and value of object or not picker returns null.

## License

MIT © [ragingwind](http://ragingwind.me)
