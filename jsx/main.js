var React = require('react');
var url = require('url');
var mousetrap = require('mousetrap');

var FileManagerActions = require('./actions/FileManagerActions');
var FileManagerStore = require('./stores/FileManagerStore');
var FileManager = require('./components/FileManager.react');

$(document).ready(function() {

	// Enable $.material for all newly created elems with .material-ripples
	$(document).arrive('.material-ripples', function() {
	  $.material.ripples('.material-ripples');
	});

	var MainNode = $('#file-manager-container');
	React.render(<FileManager/>, MainNode.get(0));
	FileManagerActions.changePath(CONSTS.DEFAULT_DIR);

	['left', 'right', 'up', 'down'].forEach(key => {
		mousetrap.bind(key, e => {
			var selFiles = FileManagerStore.getFiles().filter(f => f.selected);
			if (selFiles.length) {
				e.preventDefault();
				FileManagerActions.moveSelection(key);
			}
		});
	})

	mousetrap.bind('ctrl+a', FileManagerActions.selectAllFiles);
	mousetrap.bind('backspace',	FileManagerActions.historyBack);	
});