module.exports = function(files) {
	var $node = $('<div/>');

	$(files.map(f => '#' + f.id).join(', ')).each(function() {
		$node.append($(this).clone());
	});

	return $node.get(0);
};