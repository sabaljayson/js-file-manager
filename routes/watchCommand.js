var fs = require('fs');
var mime = require('mime');
var path = require('path');
var express = require('express');
var querystring = require('querystring');
var fileStruct = require('../utils/fileStruct');
 
var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address') || ! req.query.hasOwnProperty('socketId')) {
		res.send('error');
	}

	var address = querystring.unescape(req.query.address);	
	var socketId = req.query.socketId;

	var io = req.app.get('socketIo');

	var watcher = fs.watch(address, function(ev, filename) {
		var pathToFile = path.join(address, filename);

		if (fs.existsSync(pathToFile)) {
			io.to(socketId).emit('directoryChange', {
				type: 'changed',
				file: fileStruct(pathToFile)
			});
		}
		else {
			io.to(socketId).emit('directoryChange', {
				type: 'removed',
				path: pathToFile
			});
		}
	});

	var watchers = req.app.get('watchers') || {};
	if (watchers[socketId]) {
		watchers[socketId].close();
	}
	watchers[socketId] = watcher;
	req.app.set('watchers', watchers);


	res.end('done');
	console.log('watch', address);	
});

module.exports = router;
