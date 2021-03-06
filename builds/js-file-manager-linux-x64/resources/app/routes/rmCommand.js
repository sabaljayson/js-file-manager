var fs = require('fs');
var path = require('path');
var express = require('express');
var querystring = require('querystring');
var fileStruct = require('../utils/fileStruct');
 
var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		res.send('error');
	}

	var address = querystring.unescape(req.query.address);

	if (fs.existsSync(address)) {
		if (fileStruct(address).is_dir) {
			fs.rmdirSync(address);
		}
		else {
			fs.unlinkSync(address);
		}
	}

	res.end('error');
	console.log('rm', address);
});

module.exports = router;
