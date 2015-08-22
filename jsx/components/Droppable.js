var React = require('react');

var FileManagerActions = require('../actions/FileManagerActions');
var FileManagerStore = require('../stores/FileManagerStore');
var DragImage = require('../utils/DragImage');
var API = require('../utils/API');

module.exports = function(self, toPath) {
  var props = {
    onDragEnter: function(e) {
      e.preventDefault();

      var dragEnterCounter = this.state.dragEnterCounter || 0;
      if (dragEnterCounter === 0) {
        this.setState({
          dragOver: true
        });
      }

      this.setState({
        dragEnterCounter: dragEnterCounter + 1
      });
    },

    onDragOver: function(e) {
      e.preventDefault();
    },

    onDragLeave: function(e) {
      e.preventDefault();

      var dragEnterCounter = this.state.dragEnterCounter;

      this.setState({
        dragEnterCounter: dragEnterCounter - 1
      });

      if (dragEnterCounter === 1) {
        this.setState({
          dragOver: false
        });
      }
    },

    onDrop: function(e) {
      this.setState({
        dragOver: false,
        dragEnterCounter: 0
      });

      var urls = e.dataTransfer.getData('text/plain').split('\n');

      urls
        .map(API.urlToPath)
        .forEach(path => FileManagerActions.moveFileToDir(path, toPath));

      e.preventDefault();
    }
  };

  for (var key in props) {
    props[key] = props[key].bind(self);
  }

  return function(element) {
    if (self.state.dragged) {
      return element;
    }

    return React.cloneElement(element, props);
  };
};