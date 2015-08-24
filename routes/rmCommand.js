var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var express = require('express');
var querystring = require('querystring');
var fileStruct = require('../utils/fileStruct');
 
var RoutesPaths = require('./RoutesPaths');
var response = require('../utils/response');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		return response(res).fail('rm, invalid arguments');
	}

	var address = req.query.address;

	try {
		if (fs.existsSync(address)) {
			if (fileStruct(address).is_dir) {
				rimraf.sync(address);	// rm -rf
			}
			else {
				fs.unlinkSync(address);
			}
		}
	}
	catch (e) {
		return response(res).fail(e);
	}

	console.log(RoutesPaths.rmCommand, address);
	return response(res).success();
});

module.exports = router;
