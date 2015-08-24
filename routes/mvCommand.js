var fs = require('fs');
var path = require('path');
var express = require('express');
var querystring = require('querystring');

var RoutesPaths = require('./RoutesPaths');
var response = require('../utils/response');
var fileStruct = require('../utils/fileStruct');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('from') || ! req.query.hasOwnProperty('to')) {
		return response(res).fail('mv, invalid arguments');
	}

	var from = req.query.from;
	var to = req.query.to;

	try {
		fs.renameSync(from, to);
	}
	catch(e) {
		return response(res).fail(e);
	}

	console.log(RoutesPaths.mvCommand, from, to);
	return response(res).success();
});

module.exports = router;