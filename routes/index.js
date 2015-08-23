var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next) {
	var filesDir = '/home';
	var found = req.baseUrl.indexOf('/$');
	if (found == 0) {
		filesDir = req.baseUrl.split('/$')[1];
	}

	res.render('index', {
		basePath: 'http://localhost:3000',
		filesDir: filesDir
	});

	console.log('render', filesDir);
});

module.exports = router;