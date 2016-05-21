'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var File = gutil.File;
var path = require('path');
var fs = require('fs');
var Manifest = require('chrome-manifest');

module.exports = function (options) {
	var opts = options || {};

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-chrome-manifest', 'Streaming not supported'));
			return;
		}

		var manifest = new Manifest().load(JSON.parse(file.contents));
		var appBasePath = path.dirname(file.path);
		var cwd = '';

		function enter() {
			cwd = process.cwd();
			process.chdir(appBasePath);
		}

		function pop() {
			process.chdir(cwd);
		}

		// patch version number
		if (typeof opts.buildnumber === 'boolean' && opts.buildnumber) {
			manifest.patch();
		} else if (typeof opts.buildnumber === 'string') {
			manifest.patch(opts.buildnumber);
		}

		// exclude
		if (opts.exclude) {
			manifest.exclude(opts.exclude);
		}

		enter();

		var backgrounds = manifest.app ? manifest.app.background : manifest.background;
		if (backgrounds) {
			backgrounds = backgrounds.scripts;
		}

		if (opts.background) {
			if (!backgrounds) {
				throw new Error('Manifest has no background property');
			}

			if (!Array.isArray(backgrounds)) {
				backgrounds = new Array(backgrounds);
			}

			var contents = [];

			backgrounds.map(function(src) {
				if (opts.background.exclude) {
					if (opts.background.exclude.indexOf(src) === -1) {
						contents.push(fs.readFileSync(src));
					}
				} else {
					contents.push(fs.readFileSync(src));
				}
			});

			this.push(new File({
				path: path.resolve(opts.background.target),
				contents: Buffer.concat(contents)
			}));

			if (manifest.app) {
				manifest.app.background.scripts = [opts.background.target];
			} else {
				manifest.background.scripts = [opts.background.target];
			}
		} else if (backgrounds) {
			backgrounds.forEach(function(src) {
				this.push(new File({
					path: path.resolve(src),
					contents: fs.readFileSync(path.resolve(src))
				}));
			}.bind(this));
		}

		// streaming content resources
		var contentFiles = [];

		if (manifest.content_scripts && manifest.content_scripts.length > 0) {
			manifest.content_scripts.forEach(function(r) {
				if (r.js && r.js.length > 0) {
					contentFiles = contentFiles.concat(r.js);
				}

				if (r.css && r.css.length > 0) {
					contentFiles = contentFiles.concat(r.css);
				}
			});

			// stream out files
			contentFiles.forEach(function(src) {
				this.push(new gutil.File({
					path: path.resolve(src),
					contents: fs.readFileSync(path.resolve(src))
				}));
			}.bind(this));
		}


		// add manifest.json
		this.push(new File({
			path: file.path,
			contents: manifest.toBuffer()
		}));

		pop();

		cb();
	});
};
