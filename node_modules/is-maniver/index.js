'use strict';

module.exports = function(ver) {
  var verarr = ver.indexOf('.') >= 0 ? ver.split('.') : [ver];

  if (!/[0-9]/.test(verarr[0]) || verarr.length > 4 || verarr.length === 0) {
    return false;
  }

  return verarr.map(function(v) {
    if (/^[0]\d+/.test(v) || Number(v) > 99999) {
      return false;
    }

    return true;
  }).indexOf(false) === -1;
};
