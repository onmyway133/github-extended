# is-maniver [![Build Status](https://travis-ci.org/ragingwind/is-maniver.svg?branch=master)](https://travis-ci.org/ragingwind/is-maniver)

> What is correct manifest version string?


## Install

```
$ npm install --save is-maniver
```


## Usage

```js
var isManiver = require('is-maniver');

isManiver('0.0.9');
//=> true

isManiver('0.0.99999999');
//=> false
```


## API

### isManiver(versionString)

#### versionString

*Required*  
Type: `string`

## License

MIT © [ragingwind](http://ragingwind.me)
