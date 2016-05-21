'use strict';

var fs = require('fs');
var _ = require('lodash');
var Metadata = require('./metadata');
var exclude = require('./exclude');
var Version = require('maniver');

function isMetadataOption(json) {
	return typeof json === 'object' && (!json.name && !json.manifest_version &&
		!json.version) && (json.fields || json.permissions);
}

function Manifest(opts) {
	return this.load(opts);
}

Manifest.prototype.load = function (json) {
	json = json || {};

	if (typeof json === 'string') {
		json = JSON.parse(fs.readFileSync(json));
	} else if (isMetadataOption(json)) {
		json = Metadata.getManifest({
			fields: json.fields,
			permissions: json.permissions
		});
	}

	_.extend(this, json);

	return this;
};

Manifest.prototype.toJSON = function () {
	return this;
};

Manifest.prototype.toBuffer = function () {
	return new Buffer(this.toString());
};

Manifest.prototype.toString = function () {
	return JSON.stringify(this.toJSON(), 0, '\t');
};

Manifest.prototype.exclude = function (props) {
	var manifest = this;

	props = _.toArray(props);
	props.forEach(function (prop) {
		exclude(manifest, prop);
	});
};

Manifest.prototype.patch = function (patchVersion) {
	if (!patchVersion) {
		var version = new Version(this.version);
		version.maintenance();
		this.version = version.version();
	} else if (typeof patchVersion === 'string' && (/^\d+(\.\d+){0,3}$/).test(patchVersion)) {
		this.version = patchVersion;
	}
};

Manifest.prototype.merge = function (src) {
	_.merge(this, src);
};

module.exports = Manifest;
module.exports.queryMetadata = function (opts) {
	return {
		fields: Metadata.queryManifest(opts),
		permissions: Metadata.queryPermissions(opts)
	};
};
