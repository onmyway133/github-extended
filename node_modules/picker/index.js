'use strict';


function toKey(key) {
  return /\[[0-9]\]/.test(key) ? parseInt(/\[([0-9])\]/.exec(key)[1]) : key;
}

function pickKey(exp) {
  exp = exp.split('.');
  return toKey(exp.pop());
}

function pickValue(obj, exp) {
  var prop = null;
  var key = pickKey(exp);

  function travelProps(obj, exp) {
    var next = obj[toKey(exp[0])];

    if (typeof obj !== 'object' || !obj || exp.length === 0) {
      return prop[key];
    } else if (!next) { // lost the next
      return null;
    }

    prop = obj;
    return travelProps(next, exp.slice(1));
  }
  return travelProps(obj, exp.split('.'));
}

function pick(obj, exp) {
  var container = null;
  var key = pickKey(exp);

  function travels(obj, exp) {
    var next = obj[toKey(exp[0])];

    if (typeof obj !== 'object' || !obj || exp.length === 0) {
      return;
    } else if (!next) {
      container = null;
      return;
    }

    container = obj;
    return travels(next, exp.slice(1));
  }

  travels(obj, exp.split('.'));

  return !container ? container : {
    value: container[key],
    key: key,
    container: container
  };
}

module.exports = pick;
