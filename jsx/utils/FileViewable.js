module.exports = function(file) {
	return ! file.filename.startsWith('.');
};