var Path = require('path');
var fs = require('fs');

module.exports = function(dirPath, filesMaxCount, ignoreFilenames) {
	var filenames = fs.readdirSync(dirPath).filter(function(filename) {
		return ignoreFilenames.indexOf(filename) === -1;
	});
	
	var paths = filenames.map(function(filename) {
		return Path.join(dirPath, filename);
	});

	var files = paths.map(function(path) {
		var stats = fs.statSync(path);
		stats.path = path;
		return stats;
	});

	// New to old
	files.sort(function(a, b) {
		return b.mtime - a.mtime;
	});

	var oldFiles = files.slice(filesMaxCount);

	oldFiles.forEach(function(file) {
		fs.unlinkSync(file.path);
	});
}