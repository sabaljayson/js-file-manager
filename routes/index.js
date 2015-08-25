var express = require('express');
var osenv = require('osenv');
var fs = require('fs');

var RoutesPaths = require('./RoutesPaths');

var router = express.Router();

router.get('/', function(req, res, next) {
	var filesDir = osenv.home();
	
	var found = req.baseUrl.indexOf(RoutesPaths.index);
	if (found == 0) {
		filesDir = req.baseUrl.split(RoutesPaths.index)[1];
	}

	res.render('index', {
		basePath: 'http://localhost:' + req.app.get('port'),
		filesDir: filesDir
	});

	console.log('render', filesDir);
});

module.exports = router;