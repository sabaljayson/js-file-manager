var fs = require('fs');
var md5 = require('md5');
var mime = require('mime');
var path = require('path');
var imageSize = require('image-size');

module.exports = function(pathToFile) {
	var stats = fs.lstatSync(pathToFile);
	var fileMime = mime.lookup(pathToFile);	

	return {
		filename: path.basename(pathToFile),
		path: pathToFile,
		is_dir: stats.isDirectory(),
		mime: fileMime,
		id: md5(pathToFile),
		size: stats.size / (1024 * 1024), // in MB
		mtime: stats.mtime,
		selected: false,
		is_image: fileMime.has('image')
	};
};