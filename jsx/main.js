var React = require('react');
var url = require('url');
var mousetrap = require('mousetrap');

var FileManagerActions = require('./actions/FileManagerActions');
var FileManagerStore = require('./stores/FileManagerStore');
var FileManager = require('./components/FileManager.react');
var FileOperationModal = require('./components/FileOperationModal.react');


$(document).ready(function() {
	// Enable material effects
	$.material.init();

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

	// Select all
	mousetrap.bind('ctrl+a', e => {
		FileManagerStore.getFiles()
			.map(f => f.id)
			.forEach(id => FileManagerActions.setFileSelection(id, true));
	});

	mousetrap.bind('backspace',	FileManagerActions.historyBack);	
});