var React = require('react');

var FileManagerStore = require('../stores/FileManagerStore');
var DragImage = require('../utils/DragImage');
var API = require('../utils/API');

module.exports = function(self, dragImageView) {
  var apiUrl = self.state.is_dir ? API.directoryUrl : API.fileUrl;

  var props = {
    onDragStart: function(e) {
      this.setState({
        dragged: true
      });

      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.setData('text/plain', apiUrl(this.state.path));

      var dragImage = dragImageView(FileManagerStore.getSelectedFiles());
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