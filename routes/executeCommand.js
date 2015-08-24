var express = require('express');
var path = require('path');
var child_process = require('child_process');

var RoutesPaths = require('./RoutesPaths');
var response = require('../utils/response');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		return response(res).fail('execute, invalid arguments');
	}
	
	child_process.execFile(req.query.address, function(error) {
		if (error) {
			return response(res).fail(error);
		}
		else {
			console.log(RoutesPaths.executeCommand, req.query.address);
	  	return response(res).success();
		}		
	});  
});

module.exports = router;
