var React = require('react');

var FileManagerStore = require('../stores/FileManagerStore');
var DragImage = require('../utils/DragImage');
var API = require('../utils/API');

module.exports = function(self, dragImageView) {
  var props = {
    onDragStart: function(e) {
      this.setState({
        dragged: true
      });

      var selectedFiles = FileManagerStore.getSelectedFiles();
      var transferData = selectedFiles.map(f => {
        var apiUrl = f.is_dir ? API.directoryUrl : API.fileUrl;
        return apiUrl(f.path);
      }).join('\n');

      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.setData('text/plain', transferData);

      var dragImage = dragImageView(selectedFiles);
      var dragImageNode = DragImage.set(dragImage);
      e.dataTransfer.setDragImage(dragImageNode, 0, 0);      
    },

    onDragEnd: function() {
      this.setState({
        dragged: false
      });

      DragImage.clear();
    }
  };

  for (var key in props) {
    props[key] = props[key].bind(self);
  }
  props.draggable = 'true';

  return function(element) {
    return React.cloneElement(element, props);
  };
};