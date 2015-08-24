var express = require('express');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');

var RoutesPaths = require('./RoutesPaths');
var response = require('../utils/response');
var fileStruct = require('../utils/fileStruct');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address') || ! req.query.hasOwnProperty('data')) {
		return response(res).fail('set, invalid arguments');
	}

	var address = req.query.address;

	try {
		fs.writeFileSync(address, req.query.data, {flag: 'w'});
	}
	catch (e) {
		return response(res).fail(e);
	}	

  console.log(RoutesPaths.setCommand, address);
  return response(res).success();
});

module.exports = router;
