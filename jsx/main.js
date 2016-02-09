var React = require('react');
var ReactDOM = require('react-dom');
var url = require('url');
var mousetrap = require('mousetrap');

var FileManagerActions = require('./actions/FileManagerActions');
var FileManagerStore = require('./stores/FileManagerStore');
var FileManager = require('./components/FileManager.react');

$(document).ready(function() {

	var MainNode = $('#file-manager-container');
    ReactDOM.render(<FileManager/>, MainNode.get(0));

	FileManagerActions.changePath(CONSTS.DEFAULT_DIR);

	['left', 'right', 'up', 'down'].forEach(key => {
		mousetrap.bind(key, e => {
			var selFiles = FileManagerStore.getFiles().filter(f => f.selected);
			if (selFiles.length) {
				e.preventDefault();
				FileManagerActions.moveSelection(key);
			}
		});
	});
	mousetrap.bind('ctrl+a', FileManagerActions.selectAllFiles);
	mousetrap.bind('backspace',	FileManagerActions.historyBack);	
});
