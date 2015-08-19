var React = require('react');

module.exports = function(files) {
	var $node = $('<div/>');

	var dirsCount = files.filter(f => f.is_dir).length;
	var filesCount = files.filter(f => ! f.is_dir).length;

	var view = (
		<div style={{fontSize: '16px'}}>
			{filesCount + ' files, ' + dirsCount + ' dirs'}
			{files.map(f => <p>{f.filename}</p>)}
		</div>
	);

	React.render(view, $node.get(0));

	return $node.get(0);
};