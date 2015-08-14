var uniqueNodeId = 'drag-image-container-node-for-unique-id';

module.exports = {
	set: function(dragImageNode) {
		getContainerNode().append($(dragImageNode).clone());
		return getContainerNode().get(0);
	},

	clear: function() {
		getContainerNode().empty();
	}
};

function getContainerNode() {	
	var $node = $('#' + uniqueNodeId);
	if (! $node.length) {
		$node = $('<div/>').css({
			position: 'absolute',
			display: 'block',
			top: '0',
			left: '0',
			zIndex: '-1000'
		}).attr({
			id: uniqueNodeId
		}).appendTo('body');
	}

	return $node;
}