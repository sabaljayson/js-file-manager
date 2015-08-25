var Path = require('path');

var notifyThat = require('./notifyThat');
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
		var getUrl = Path.join(RoutesPaths.getCommand, path);
		ajax(getUrl, {}, callback);
	},

	setCommand: function(path, data, callback) {
		ajax(RoutesPaths.setCommand, { address: path, data: data }, callback);
	},

	lsCommand: function(path, callback) {
		ajax(RoutesPaths.lsCommand, { address: path }, callback);
	},

	watchCommand: function(path, socketId, callback) {
		ajax(RoutesPaths.watchCommand, { address: path, socketId: socketId }, callback);
	},

	openCommand: function(path, callback) {
		ajax(RoutesPaths.openCommand, { address: path }, callback);
	},

	mvCommand: function(fromPath, toPath, callback) {
		ajax(RoutesPaths.mvCommand, { from: fromPath, to: toPath }, callback);
	},

	cpCommand: function(fromPath, toPath, callback) {
		ajax(RoutesPaths.cpCommand, { from: fromPath, to: toPath }, callback);
	},

	rmCommand: function(path, callback) {
		ajax(RoutesPaths.rmCommand, { address: path }, callback);
	},

	mkdirCommand: function(path, callback) {
		ajax(RoutesPaths.mkdirCommand, { address: path }, callback);
	},

	executeCommand: function(path, callback) {
		ajax(RoutesPaths.executeCommand, { address: path }, callback);
	}
};

module.exports = API;

function ajax(url, args, callback) {
	$.ajax({
    url: url,
    data: args,
    success: function(data) {
    	if (data === 'error') {
    		notifyThat.failed('Failed ' + url + ' ' + JSON.stringify(args));
    		return;
    	}

    	callback(data);
    }
  });
}