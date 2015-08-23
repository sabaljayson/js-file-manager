var express = require('express');
var RoutesPaths = require('./RoutesPaths');

module.exports = function(req, res, next) {
	express.static('/').apply(this, arguments);	
	console.log(RoutesPaths.getCommand, decodeURI(req.url));
}