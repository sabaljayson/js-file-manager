var React = require('react');

var FileManagerStore = require('../stores/FileManagerStore');
var FileManagerActions = require('../actions/FileManagerActions');
var DragImage = require('../utils/DragImage');
var API = require('../utils/API');

module.exports = function(dragImageView) {
  var props = {
    draggable: 'true',
    onDragStart: function(e) {
      var selectedFiles = FileManagerStore.getSelectedFiles();
      selectedFiles.map(f => f.id).forEach(FileManagerActions.fileDragStarted);

      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.setData('text/plain', transferData(selectedFiles));

      var dragImage = dragImageView(selectedFiles);
      var dragImageNode = DragImage.set(dragImage);
      e.dataTransfer.setDragImage(dragImageNode, 0, 0);      
    },

    onDragEnd: function() {
      DragImage.clear();

      var selectedFiles = FileManagerStore.getSelectedFiles();
      selectedFiles.map(f => f.id).forEach(FileManagerActions.fileDragEnded);
    }
  };

  return function(element) {
    return React.cloneElement(element, props);
  };
};

function transferData(files) {
  return files.map(f => {
    var apiUrl = f.is_dir ? API.directoryUrl : API.fileUrl;
    return apiUrl(f.path);
  }).join('\n');
}
