var fs = require('fs');
var path = require('path');
var express = require('express');
var querystring = require('querystring');

var RoutesPaths = require('./RoutesPaths');
var response = require('../utils/response');
var fileStruct = require('../utils/fileStruct');
var getFileOpenWithApps = require('../utils/getFileOpenWithApps');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		return response(res).fail('getOpenWithList, invalid arguments');
	}

	var address = req.query.address;
    var apps = getFileOpenWithApps(address);

	console.log(RoutesPaths.getOpenWithList, address);
	return response(res).success(apps);
});

module.exports = router;
