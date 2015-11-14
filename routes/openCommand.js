var express = require('express');
var path = require('path');
var open = require('open');

var RoutesPaths = require('./RoutesPaths');
var response = require('../utils/response');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (! req.query.hasOwnProperty('address')) {
		return response(res).fail('open, Invalid arguments');
	}

	try {
		if (req.query.hasOwnProperty('withApp')) {
			open(req.query.address, req.query.withApp);
		}
		else {
			open(req.query.address);
		}
	}
	catch (e) {
		return response(res).fail(e);
	}		

  console.log(RoutesPaths.openCommand, req.query.address, req.query.withApp);
  return response(res).success();
});

module.exports = router;
