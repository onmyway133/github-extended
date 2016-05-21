'use strict';

var _ = require('lodash');
var picker = require('picker');

module.exports = function (json, target) {
	var type = typeof target;
	if (type === 'string') {
		if (json[target]) {
			delete json[target];
		}
	} else if (type === 'object') {
		var key = _.keys(target)[0];
		var prop = picker(json, key);
		if (prop) {
			var excludes = _.toArray(target[key]);
			prop.container[prop.key] = _.remove(prop.container[prop.key], function (v) {
				return _.indexOf(excludes, v) === -1;
			});
		}
	} else {
		throw new Error('Not supported type: ' + type);
	}
};
