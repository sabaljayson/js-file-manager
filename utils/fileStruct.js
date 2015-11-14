var fs = require('fs');
var md5 = require('md5');
var mime = require('mime');
var path = require('path');
var executable = require('executable');

var getFileOpenWithApps = require('./getFileOpenWithApps');

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
		mime: fileMime,
		open_with: isDir ? false : getFileOpenWithApps(pathToFile),
		id: md5(pathToFile),
		size: stats.size,
		mtime: stats.mtime,
		selected: false,
		is_executable: executable.sync(pathToFile),
		is_dir: isDir,
		is_image: isImage(fileMime, stats.size),
		is_video: fileMime.has('video'),
		is_audio: fileMime.has('audio'),
	};
};

function isImage(mime, size) {
	var forbidden = [
		'image/vnd.djvu'
	];

	if (forbidden.find(mime)) {
		return false;
	}

	if (size > megabytes(3.5)) {
		return false;
	}

	return mime.has('image');
}

function megabytes(mbytes) {
	return mbytes * 1024 * 1024;
}