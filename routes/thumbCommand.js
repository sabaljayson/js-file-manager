var express = require('express');
var path = require('path');
var fs = require('fs');
var Thumbnail = require('thumbnail');

var router = express.Router();

router.get('/*', function(req, res, next) {
	var filePath = '/' + req.params[0];
	var fileDir = path.dirname(filePath);
	var filename = path.basename(filePath);
	var thumbnailsDir = path.join(__dirname, '../thumbnails');

	var thumb = new Thumbnail(fileDir, thumbnailsDir);
	thumb.ensureThumbnail(filename, 70, 70, function(err, thumbFilename) {
		if (err) {
			 return;
		}

		var thumbnailPath = path.join(thumbnailsDir, thumbFilename);
		fs.readFile(thumbnailPath, function(err, data) {
	  	if (err) throw err;

	    res.writeHead(200);
	    res.end(data);

	    console.log('thumbnail ' + filePath);
	  });
	});
});

module.exports = router;