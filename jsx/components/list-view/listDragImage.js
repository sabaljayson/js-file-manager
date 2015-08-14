module.exports = function(files) {
	var dirsCount = files.filter(f => f.is_dir).length;
	var filesCount = files.filter(f => ! f.is_dir).length;

	var $node = $('<div/>')
		.text(filesCount + ' files, ' + dirsCount + ' dirs')
		.css('font-size', '15px');

	return $node.get(0);
};