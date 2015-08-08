var fs = require('fs');
var md5 = require('md5');
var mime = require('mime');
var path = require('path');

module.exports = function(pathToFile) {
	var stats = fs.lstatSync(pathToFile);
	var isDir = stats.isDirectory();
	var fileMime = mime.lookup(pathToFile);	

	if (isDir) {
		fileMime = 'inode/directory';
	}

	return {
		filename: path.basename(pathToFile),
		path: pathToFile,
		is_dir: isDir,
		mime: fileMime,
		id: md5(pathToFile),
		size: stats.size,
		mtime: stats.mtime,
		selected: false,
		is_image: fileMime.has('image'),
		is_video: fileMime.has('video')
	};
};