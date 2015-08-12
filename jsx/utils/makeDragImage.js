var uniqueNodeId = 'drag-image-node-for-makeDragImage';

module.exports = function(files) {
	var $node = $('#' + uniqueNodeId);
	if (! $node.length) {
		$node = $('<div/>').css({
			position: 'absolute',
			display: 'block',
			top: '0',
			left: '0',
			height: '0'
		}).attr({
			id: uniqueNodeId
		}).appendTo('body');
	}

	$node.empty();

	$(files.map(f => '#' + f.id).join(', ')).each(function() {
		$node.append($(this).clone());
	});

	return $node.get(0);
};