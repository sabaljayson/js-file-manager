var express = require('express');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');

var RoutesPaths = require('./RoutesPaths');
var response = require('../utils/response');
var fileStruct = require('../utils/fileStruct');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		return response(res).fail('ls, invalid arguments');
	}

	var address = req.query.address;
	var files = fs.readdirSync(address);

	files = files.map(function(file) {
		var pathToFile = path.join(address, file);
		return fileStruct(pathToFile);
	});
	
  console.log(RoutesPaths.lsCommand, address);
  return response(res).success({
  	dirData: fileStruct(address),
  	files: files
  });
});

module.exports = router;
