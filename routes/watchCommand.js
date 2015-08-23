var fs = require('fs');
var mime = require('mime');
var path = require('path');
var express = require('express');
var querystring = require('querystring');

var fileStruct = require('../utils/fileStruct');
var RoutesPaths = require('./RoutesPaths');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address') || ! req.query.hasOwnProperty('socketId')) {
		res.send('error');
	}

	var address = querystring.unescape(req.query.address);	
	var socketId = req.query.socketId;

	var io = req.app.get('socketIo');
	var socketsList = io.sockets.server.eio.clients;

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

	// Close watcher, if socket is not connected
	for (var id in watchers) {
		if (! socketsList[id]) {
			watchers[id].close();
		}
	}

	// Close watcher for current socket, if already open
	if (watchers[socketId]) {
		watchers[socketId].close();
	}
	
	watchers[socketId] = watcher;
	req.app.set('watchers', watchers);

	res.end('done');
	console.log(RoutesPaths.watchCommand, address);	
});

module.exports = router;