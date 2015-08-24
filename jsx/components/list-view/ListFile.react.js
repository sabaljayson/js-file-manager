var React = require('react');
var fileSize = require('filesize');
var classNames = require('classnames');

var FileManagerActions = require('../../actions/FileManagerActions');
var ContextMenuActions = require('../../actions/ContextMenuActions');
var FileManagerStore = require('../../stores/FileManagerStore');
var fileViewable = require('../../utils/FileViewable');
var DragImage = require('../../utils/DragImage');
var API = require('../../utils/API');

var Draggable = require('../Draggable');
var Droppable = require('../Droppable');
var listDragImageView = require('./listDragImageView');

class ListFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = FileManagerStore.getFile(props.id);

    this.dragEnterCounter = 0;
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

    var classes = classNames('list-file-element', {      
      'list-folder-element': file.is_dir,
      'selected': file.selected,
      'drag-over': file.dragOver,
      'dragged': file.dragged
    });

    var filename = file.filename.slice();

    if (file.is_dir && file.dragOver) {
      filename = 'Move into ' + filename;
    }

    var draggable = Draggable(listDragImageView);
    var droppable = Droppable(this, this.state.path);
    if (! file.is_dir) {
      droppable = (el => el);
    }

    return draggable(droppable(
      <tr
        className={classes}
        id={file.id}
        onMouseDown={this._onMouseDown.bind(this)}
        onClick={this._onClick.bind(this)}
        onDoubleClick={this._onDoubleClick.bind(this)}
        onContextMenu={this._onContextMenu.bind(this)} >

        <td>
          {
            file.is_dir
            ? <i className='mdi-file-folder mdi-material-grey' />
            : <img src={file.thumbSrc} style={{width: 25, marginRight: 5}} />
          }
          {filename}
        </td>
        <td>
          {file.is_dir ? '<directory>' : fileSize(file.size)}
        </td> 
        <td>
          {new Date(file.mtime).toLocaleDateString()}
        </td>
  		</tr>
  	))
  }
  
  _onMouseDown() {
    if (! this.state.selected) {
      FileManagerActions.unselectAllFiles();
      FileManagerActions.setFileSelection(this.state.id, true);
    }
  }

  _onClick() {
    if (this.state.is_dir) {
      FileManagerActions.changePath(this.state.path);
    }    
  }

  _onDoubleClick() {
    if (! this.state.is_dir) {
      FileManagerActions.openFile(this.state.id);
    }
  }

  _onContextMenu(e) {
    if (! this.state.selected) {
      FileManagerActions.unselectAllFiles();
      FileManagerActions.setFileSelection(this.props.id, true);
    }

    ContextMenuActions.open(e.pageY, e.pageX);
  }

  _onChange() {
    this.setState(FileManagerStore.getFile(this.props.id));
  }
}

module.exports = ListFile;