var fs = require('fs');
var path = require('path');
var express = require('express');

var RoutesPaths = require('./RoutesPaths');
var response = require('../utils/response');
var Thumbnails = require('../utils/Thumbnails');

var router = express.Router();

router.get('/*', function(req, res, next) {
	var filePath = '/' + req.params[0];

	Thumbnails.getThumb(filePath, function(err, thumbPath) {
		if (err) {
			return response(res).fail(err);
		}

		fs.readFile(thumbPath, function(err, data) {
	  	if (err) {
	  		return response(res).fail(err);
	  	}

	    console.log(RoutesPaths.thumbCommand, filePath);
	    return response(res).success(data);
	  });
	});	
});

module.exports = router;