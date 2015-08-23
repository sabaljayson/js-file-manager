var Path = require('path');

var RoutesPaths = require('../../routes/RoutesPaths');

var dirUrlPrefix = RoutesPaths.index;
var fileUrlPrefix = RoutesPaths.getCommand;

var API = {
	directoryUrl: function(path) {
		return CONSTS.BASE_PATH + Path.join(dirUrlPrefix, path);
	},

	fileUrl: function(path) {
		return CONSTS.BASE_PATH + Path.join(fileUrlPrefix, path);
	},

	isDirectoryUrl: function(url) {
		if (url.startsWith(CONSTS.BASE_PATH)) {
			url = url.substr(CONSTS.BASE_PATH.length);

			var isDir = url.startsWith(dirUrlPrefix);
			var isFile = url.startsWith(fileUrlPrefix);
			if (isDir !== isFile) {
				return isDir;
			}
		}

		throw 'Invalid url';
	},

	urlToPath: function(url) {
		if (API.isDirectoryUrl(url)) {
			return url.substr(CONSTS.BASE_PATH.length + dirUrlPrefix.length);
		}
		else {
			return url.substr(CONSTS.BASE_PATH.length + fileUrlPrefix.length);
		}
	},

	getCommand: function(path, callback) {
	  $.ajax({
	    url:  Path.join(RoutesPaths.getCommand, path),
	    dataType: 'text',
	    success: callback
	  });
	},

	setCommand: function(path, data, callback) {
	  $.ajax({
	    url: RoutesPaths.setCommand,
	    data: { address: path, data: data },
	    success: callback
	  });
	},

	lsCommand: function(path, callback) {
	  $.ajax({
	    url: RoutesPaths.lsCommand,
	    data: { address: path },
	    success: callback
	  });
	},

	openCommand: function(path, callback) {
	  $.ajax({
	    url: RoutesPaths.openCommand,
	    data: { address: path },
	    success: callback
	  });
	},

	mvCommand: function(fromPath, toPath, callback) {
	  $.ajax({
	    url: RoutesPaths.mvCommand,
	    data: { from: fromPath, to: toPath },
	    success: callback
	  });
	},

	cpCommand: function(fromPath, toPath, callback) {
	  $.ajax({
	    url: RoutesPaths.cpCommand,
	    data: { from: fromPath, to: toPath },
	    success: callback
	  });
	},

	rmCommand: function(path, callback) {
		$.ajax({
	    url: RoutesPaths.rmCommand,
	    data: { address: path },
	    success: callback
	  });
	},

	mkdirCommand: function(path, callback) {
		$.ajax({
	    url: RoutesPaths.mkdirCommand,
	    data: { address: path },
	    success: callback
	  });
	}
};

module.exports = API;