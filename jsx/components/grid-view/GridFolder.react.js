var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var classNames = require('classnames');

var FileManagerActions = require('../../actions/FileManagerActions');
var ContextMenuActions = require('../../actions/ContextMenuActions');
var FileManagerStore = require('../../stores/FileManagerStore');
var fileViewable = require('../../utils/FileViewable');
var DragImage = require('../../utils/DragImage');
var API = require('../../utils/API');

var Draggable = require('../Draggable');
var Droppable = require('../Droppable');
var gridDragImageView = require('./gridDragImageView');

class GridFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = FileManagerStore.getFile(props.id);
  }

  componentDidMount() {
    FileManagerStore.addFileChangeListener(this.props.id, this._onChange.bind(this));
  }

  componentWillUnmount() {
    FileManagerStore.removeFileChangeListener(this.props.id);
  }

  render() {
    var file = this.state;

    if (! fileViewable(file)) {
      return false;
    }

    var classes = classNames(
      'grid-folder-element', {
      'selected': file.selected,
      'drag-over': file.dragOver,
      'dragged': file.dragged
    });

    var draggable = Draggable(gridDragImageView);
    var droppable = Droppable(this, this.state.path);

    return draggable(droppable(
      <ReactCSSTransitionGroup transitionName='opacity-animation' transitionAppear={true}>
        <a
          title={file.filename}
          id={this.props.id}
          key={this.props.id}
          onClick={this._onClick.bind(this)}
          onMouseDown={this._onMouseDown.bind(this)}
          onContextMenu={this._onContextMenu.bind(this)}
          className={classes}>
          {file.filename}
        </a>
      </ReactCSSTransitionGroup>
    ))
  }

  _onChange() {
    this.setState(FileManagerStore.getFile(this.props.id));
  }

  _onMouseDown() {
    if (! this.state.selected) {
      FileManagerActions.unselectAllFiles();
      FileManagerActions.setFileSelection(this.state.id, true);
    }
  }

  _onClick() {
    FileManagerActions.changePath(this.state.path);
  }

  _onContextMenu(e) {    
    if (! this.state.selected) {
      FileManagerActions.unselectAllFiles();
    }

    FileManagerActions.setFileSelection(this.props.id, true);

    ContextMenuActions.open(e.pageY, e.pageX);
    e.stopPropagation();
  }
}

module.exports = GridFolder;