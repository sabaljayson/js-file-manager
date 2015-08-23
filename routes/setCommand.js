var express = require('express');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');

var fileStruct = require('../utils/fileStruct');
var RoutesPaths = require('./RoutesPaths');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address') || ! req.query.hasOwnProperty('data')) {
		res.send('error');
	}

	var address = querystring.unescape(req.query.address);

	try {
		fs.writeFileSync(address, req.query.data, {flag: 'w'});
	}
	catch (e) {
		console.log(e);
	}
	
  res.send('done');

  console.log(RoutesPaths.setCommand, address);
});

module.exports = router;
