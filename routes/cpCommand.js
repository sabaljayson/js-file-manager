var fs = require('fs-extra');
var path = require('path');
var express = require('express');
var querystring = require('querystring');

var RoutesPaths = require('./RoutesPaths');
var response = require('../utils/response');
var fileStruct = require('../utils/fileStruct');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('from') || ! req.query.hasOwnProperty('to')) {
		return response(res).fail('cp, invalid arguments');
	}

	var from = req.query.from;
	var to = req.query.to;

	try {
		fs.copySync(from, to);
	}
	catch(e) {
		return response(res).fail(e);
	}

	console.log(RoutesPaths.cpCommand, from, to);
	return response(res).success();
});

module.exports = router;
