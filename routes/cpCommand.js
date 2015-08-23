var fs = require('fs-extra');
var path = require('path');
var express = require('express');
var querystring = require('querystring');

var fileStruct = require('../utils/fileStruct');
var RoutesPaths = require('./RoutesPaths');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('from') || ! req.query.hasOwnProperty('to')) {
		res.send('error');
	}

	var from = querystring.unescape(req.query.from);
	var to = querystring.unescape(req.query.to);

	try {
		fs.copySync(from, to);
	}
	catch(e) {
		console.log(e);
	}

	res.end('done');
	console.log(RoutesPaths.cpCommand, from, to);
});

module.exports = router;
