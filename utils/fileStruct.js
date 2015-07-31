var fs = require('fs');
var md5 = require('md5');
var mime = require('mime');
var path = require('path');

module.exports = function(pathToFile) {
	var stats = fs.lstatSync(pathToFile);

	return {
		filename: path.basename(pathToFile),
		path: pathToFile,
		is_dir: stats.isDirectory(),
		mime: mime.lookup(pathToFile),
		id: md5(pathToFile),
		size: stats.size,
		mtime: stats.mtime,
		selected: false
	};
};