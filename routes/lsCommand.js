var express = require('express');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');
var fileStruct = require('../utils/fileStruct');
 
var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		res.send('error');
	}

	var address = querystring.unescape(req.query.address);
	var files = fs.readdirSync(address);

	files = files.map(function(file) {
		var pathToFile = path.join(address, file);
		return fileStruct(pathToFile);
	});
	
  res.send({
  	dirData: fileStruct(address),
  	files: files
  });

  console.log('ls ' + address);
});

module.exports = router;
