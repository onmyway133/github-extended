# maniver [![Build Status](https://travis-ci.org/ragingwind/maniver.svg?branch=master)](https://travis-ci.org/ragingwind/maniver)

> Manage [manifest version of Chrome apps / extensions](https://developer.chrome.com/apps/manifest/version)


## Install

```
$ npm install --save maniver
```


## Usage

```sh
maniver manifest.json build
// manifest.json has been updated to 0.0.1.3
```

```js
var ManiVer = require('maniver');


var maniver = new ManiVer();
assert.equal(maniver.version(), '1.0.0');

maniver.version('1');
assert.equal(maniver.version(), '1');

maniver.version('1.0');
assert.equal(maniver.version(), '1.0');

maniver.version('1');
maniver.build();
assert.equal(maniver.version(), '1.0.0.1');

maniver.version('1.0.9');
maniver.maintenance();
assert.equal(maniver.version(), '1.0.10');

maniver.version('1.9');
maniver.minor();
assert.equal(maniver.version(), '1.10');

maniver.version('1.0.9');
maniver.major();
maniver.major();
assert.equal(maniver.version(), '3.0.9');
```


## API

### ManiVer(version)

Create a instance for maniver with version string.

### version(version)

*Optional*  
version: `string`

Set/Get version string

### build()

Increase a build number as 0.0.0.1, it will be added if not exist.

### maintenance()

Increase a maintenance build number same as 0.0.1, it will be added if not exist.

### minor()

Increase a minor build number as 0.1, it will be added if not exist.

### major()

Increase major build number as 1.0, it will be added if not exist.

## License

MIT © [ragingwind](http://ragingwind.me)
