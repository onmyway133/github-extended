# chrome-manifest [![Build Status](https://travis-ci.org/ragingwind/chrome-manifest.svg?branch=master)](https://travis-ci.org/ragingwind/chrome-manifest)

> Help you manage manifest when you are developing Chrome Apps and Extensions


## Install

```sh
$ npm install --save chrome-manifest
```

## Usage

### Manifest

```js
var Manifest = require('chrome-manifest');
var manifest = new Manifest('manifest.json');

// exclude value or key what you want
manifest.exclude([
  {
    // you can use string array expression to access array property
    'content_scripts.[0].matches': [
      "http://*/*"
    ]
  },
  {
    'background.scripts': [
      'scripts/willbe-remove-only-for-debug.js',
      'scripts/user-script.js'
    ]
  },
  'manifest_version',
  'key'
]);

// get/set
console.log(manifest.content_scripts.[0].matches.length);
console.log(manifest.content_scripts.[0]);
console.log(manifest.background.scripts);
console.log(manifest.manifest_version);
console.log(manifest.manifest['key']);

// patch version from 0.0.1 to 0.0.2
manifest.patch();

// Get various types
console.log(manifest.toJSON());
console.log(manifest.toBuffer());
console.log(manifest.toString());
```

### Metadata

Generating manifest.json with basic sample configures

```js
var Manifest = require('chrome-manifest');

// Query permissions by stable and platform_app(Chrome Apps)
var metadata = Manifest.queryMetadata({
  channel: 'stable',
  extensionTypes: ['platform_app']
});

// Create a manifest with selected fields and permissions of Chrome Manifest
var manifest = new Manifest({
  fields: Object.keys(metadata.fields),
  permissions: Object.keys(metadata.permissions)
});

// Merge with new value
manifest.merge({
  name: 'My Apps',
  author: 'New Author',
  app: {
    background: {
      scripts: [
        "scripts/background.js",
        "scripts/addmore.js"
      ]
    }
  },
  permissions: [
    'tabs',
    'http://*/**',
    'https://*/**',
    'test permissions'
  ]
});

assert.equal(manifest.name, 'My Apps');
assert.equal(manifest.author, 'New Author');
assert.equal(manifest.app.background.scripts.length, 2);
assert.equal(manifest.app.background.scripts[1], 'scripts/addmore.js');
assert(manifest.permissions.indexOf('test permissions') >= 0);
```

## License

MIT ©[Jommy Moon](http://ragingwind.me)
