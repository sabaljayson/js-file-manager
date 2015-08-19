var React = require('react');

module.exports = function(files) {
	var $node = $('<div/>');

	var view = (
		<div style={{maxWidth: 380}}>
			<div className='folders'></div>
			<div className='files'></div>
		</div>
	);

	React.render(view, $node.get(0));

	files.forEach(f => {
		var fileNode = $('#' + f.id).clone();

		if (f.is_dir) {
			$node.find('.folders').append(fileNode);
		}
		else {
			$node.find('.files').append(fileNode);
		}
	});

	return $node.get(0);
};