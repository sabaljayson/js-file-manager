var express = require('express');
var path = require('path');
var child_process = require('child_process');

var RoutesPaths = require('./RoutesPaths');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		res.send('error');
	}
	
	child_process.execFile(req.query.address, function(error) {
		if (error) {
			res.send('error');
		}
		else {
	  	res.send('done');
		}

		console.log(RoutesPaths.executeCommand, req.query.address);
	});  
});

module.exports = router;
