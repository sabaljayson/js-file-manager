module.exports = {

	lsCommand: function(path, callback) {
	  $.ajax({
	    url: '/ls',
	    data: { address: path },
	    success: callback
	  });
	},

	openCommand: function(path) {
	  $.ajax({
	    url: '/open',
	    data: { address: path }
	  });
	},

	mvCommand: function(fromPath, toPath) {
	  $.ajax({
	    url: '/mv',
	    data: { from: fromPath, to: toPath }
	  });
	},

	cpCommand: function(fromPath, toPath) {
	  $.ajax({
	    url: '/cp',
	    data: { from: fromPath, to: toPath }
	  });
	},

	rmCommand: function(path) {
		$.ajax({
	    url: '/rm',
	    data: { address: path }
	  });
	},

	mkdirCommand: function(path) {
		$.ajax({
	    url: '/mkdir',
	    data: { address: path }
	  });
	}
};