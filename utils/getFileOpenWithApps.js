var child_process = require('child_process');
var shellEscape = require('shell-escape');
var _ = require('lodash');

module.exports = function(path) {
	var command = shellEscape(['cpp/file_open_with', path]);
	var out = child_process.execSync(command).toString();

	var apps = out.split('\n').filter(_.negate(_.isEmpty)).map(function(app) {
		var info = app.split('\t');

		return {
			name: info[0],
			cmd: info[1]
		};
	});

	return apps;
};