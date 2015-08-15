var fs = require('fs');
var path = require('path');
var express = require('express');
var Thumbnails = require('../utils/Thumbnails');

var router = express.Router();

router.get('/*', function(req, res, next) {
	var filePath = '/' + req.params[0];

	Thumbnails.getThumb(filePath, function(err, thumbPath) {
		if (err) {
			console.log(err);
			return;
		}

		fs.readFile(thumbPath, function(err, data) {
	  	if (err) {
	  		console.log(err);
	  		return;
	  	}

	    res.writeHead(200);
	    res.end(data);

	    console.log('thumbnail', filePath);
	  });		
	});
});

module.exports = router;