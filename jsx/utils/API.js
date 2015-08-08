var Path = require('path');

module.exports = {

	getCommand: function(path, callback) {
	  $.ajax({
	    url:  Path.join('/get', path),
	    dataType: 'text',
	    success: callback
	  });
	},

	setCommand: function(path, data, callback) {
	  $.ajax({
	    url: '/set',
	    data: { address: path, data: data },
	    success: callback
	  });
	},

	lsCommand: function(path, callback) {
	  $.ajax({
	    url: '/ls',
	    data: { address: path },
	    success: callback
	  });
	},

	openCommand: function(path, callback) {
	  $.ajax({
	    url: '/open',
	    data: { address: path },
	    success: callback
	  });
	},

	mvCommand: function(fromPath, toPath, callback) {
	  $.ajax({
	    url: '/mv',
	    data: { from: fromPath, to: toPath },
	    success: callback
	  });
	},

	cpCommand: function(fromPath, toPath, callback) {
	  $.ajax({
	    url: '/cp',
	    data: { from: fromPath, to: toPath },
	    success: callback
	  });
	},

	rmCommand: function(path, callback) {
		$.ajax({
	    url: '/rm',
	    data: { address: path },
	    success: callback
	  });
	},

	mkdirCommand: function(path, callback) {
		$.ajax({
	    url: '/mkdir',
	    data: { address: path },
	    success: callback
	  });
	}
};