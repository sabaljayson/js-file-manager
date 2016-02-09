var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var classNames = require('classnames');

var FileManagerActions = require('../../actions/FileManagerActions');
var CMActions = require('../../actions/ContextMenuActions');
var CMConstants = require('../../constants/ContextMenuConstants');
var FileManagerStore = require('../../stores/FileManagerStore');
var fileViewable = require('../../utils/FileViewable');

var Draggable = require('../Draggable');
var gridDragImageView = require('./gridDragImageView');

class GridFile extends React.Component {
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

    var classes = classNames('grid-file-element', {
      'selected': file.selected,
      'dragged': file.dragged
    });

    var draggable = Draggable(gridDragImageView);

    return draggable(
      <ReactCSSTransitionGroup transitionName='opacity-animation' transitionAppear={true}
        transitionAppearTimeout={500}
        transitionLeaveTimeout={500}
        transitionEnterTimeout={500}>
        <div
          className={classes}
          key={file.id}
          id={file.id}
          onMouseDown={this._onMouseDown.bind(this)}
          onDoubleClick={this._onDoubleClick.bind(this)}
          onContextMenu={this._onContextMenu.bind(this)} >
          <img draggable='false' src={file.thumbSrc} />
          <p>{file.filename}</p>
    		</div>
      </ReactCSSTransitionGroup>
  	)
  }

  _onMouseDown() {
    if (! this.state.selected) {
      FileManagerActions.unselectAllFiles();
      FileManagerActions.setFileSelection(this.state.id, true);
    }
  }

  _onDoubleClick() {
    FileManagerActions.openFile(this.state.id);
  }

  _onContextMenu(e) {
    if (! this.state.selected) {
      FileManagerActions.unselectAllFiles();
      FileManagerActions.setFileSelection(this.props.id, true);
    }

    CMActions.open(e.pageY, e.pageX);
  }

  _onChange() {
    this.setState(FileManagerStore.getFile(this.props.id));
  }
}

module.exports = GridFile;
