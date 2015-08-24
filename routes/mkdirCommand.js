var express = require('express');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var querystring = require('querystring');
var mime = require('mime');

var RoutesPaths = require('./RoutesPaths');
var response = require('../utils/response');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		return response(res).fail('mkdir, Invalid arguments');
	}

	var address = req.query.address;

	mkdirp(address, function(err) {
		if (err) return response(res).fail(err);

		
  	console.log(RoutesPaths.mkdirCommand, address);
		return response(res).success();
	});
});

module.exports = router;
