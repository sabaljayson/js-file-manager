var express = require('express');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var querystring = require('querystring');
var mime = require('mime');

var RoutesPaths = require('./RoutesPaths');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		res.send('error');
	}

	var address = req.query.address;

	mkdirp(address, function(err) {
		if (err) return;
		res.end('done');
		
  	console.log(RoutesPaths.mkdirCommand, address);
	});
});

module.exports = router;
