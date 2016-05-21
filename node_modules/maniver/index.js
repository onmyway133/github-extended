'use strict';

var isManiVersion = require('is-maniver');

function version(ver, length) {
  // Check that build number overflow
  if (!ver[length]) {
    return null;
  }

  if (ver[length] + 1 <= 65535) {
    ver[length] = (Number(ver[length]) + 1).toString();
    return ver;
  } else {
    ver[length] = '0';
    return version(ver, --length);
  }
}

function fill(verarr, length) {
  var to = length - verarr.length;
  for (var i = 0; i < to; ++i) {
    verarr.push('0');
  }
  return verarr;
}

function up(verarr, length) {
  var copie = verarr.slice(0);

  if (copie.length < length) {
    copie = fill(copie, length);
  }

  // return updated version or origin value;
  return version(copie, length - 1) || verarr;
}

function Version(newver) {
  this.version(newver || '0.0.0');
}

Version.prototype.version = function (newver) {
  if (newver){
    if (isManiVersion(newver)) {
      this._version = newver.split('.');
    } else if (this[newver]) {
      this[newver]();
    }
  }

  return this._version.join('.');
};

Version.prototype.build = function() {
  this._version = up(this._version, 4);
  return this;
};

Version.prototype.maintenance = function() {
  this._version = up(this._version, 3);
  return this;
};

Version.prototype.minor = function() {
  this._version = up(this._version, 2);
  return this;
};

Version.prototype.major = function() {
  this._version = up(this._version, 1);
  return this;
};

Version.version = function (maniver, newver) {
  var ver = new Version(maniver);
  return ver.version(newver);
};

module.exports = Version;
