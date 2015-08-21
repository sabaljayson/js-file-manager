var fs = require('fs');
var md5 = require('md5');
var Path = require('path');
var im = require('imagemagick');

var fileStruct = require('./fileStruct');
var removeOldFiles = require('./removeOldFiles');

var getThumbCallsCounter = 0;

var Thumbnails = {
	dir: Path.join(__dirname, '../thumbnails'),
	maxCount: 5000,
	removeFrequency: 1000,
	skipRemoveOfFiles: ['README.md'],
	thumbSize: 70,

	getThumb: function(path, callback) {
		try {
			if (++getThumbCallsCounter === Thumbnails.removeFrequency) {
				removeOldFiles(Thumbnails.dir, Thumbnails.maxCount, Thumbnails.skipRemoveOfFiles);
				getThumbCallsCounter = 0;
			}
		}
		catch (e) {
			console.log(e);
		}

		try {
			var thumbPath = Path.join(Thumbnails.dir, thumbName(path));

			if (! fs.existsSync(thumbPath)) {
				makeThumbnail(path, thumbPath, callback);
			}
			else {
				success(callback, thumbPath);
			}
		}
		catch (e) {
			fail(callback, e);
		}
	}
};

module.exports = Thumbnails;

function fileHash(path) {
	var stats = fs.statSync(path);
	return md5(path + stats.mtime.toString());
}

function thumbName(path) {
	var ext = Path.extname(path);
	var file = fileStruct(path);

	if (file.mime === 'image/gif' || file.is_video) {
		ext = '.jpg';
	}

	return fileHash(path) + ext;
}

function makeThumbnail(srcPath, dstPath, callback) {
	var file = fileStruct(srcPath);
	if (file.mime === 'image/gif' || file.is_video) {
		srcPath += '[0]';
	}

	im.resize({
	  srcPath: srcPath,
	  dstPath: dstPath,
	  width: Thumbnails.thumbSize,
	  height: Thumbnails.thumbSize
	}, function(err) {
		if (err) {
			fail(callback, err);
		}
		else {
			success(callback, dstPath);
		}
	});
}

function success(callback, thumbPath) {
	callback(false, thumbPath);
}

function fail(callback, err) {
	callback(err);
}