var React = require('react');
var fileSize = require('filesize');
var classNames = require('classnames');

var FileManagerActions = require('../../actions/FileManagerActions');
var ContextMenuActions = require('../../actions/ContextMenuActions');
var FileManagerStore = require('../../stores/FileManagerStore');
var fileViewable = require('../../utils/FileViewable');
var DragImage = require('../../utils/DragImage');
var API = require('../../utils/API');

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
      'selected': file.selected,
      'drag-over': file.dragOver,
      'list-folder-element': file.is_dir
    });

    var filename = file.filename.slice();

    if (file.is_dir && file.dragOver) {
      filename = 'Move into ' + filename;
    }

    return (
      <tr
        draggable='true'
        className={classes}
        id={file.id}
        onDragStart={this._onDragStart.bind(this)}
        onDragEnd={this._onDragEnd.bind(this)}
        onDragEnter={this._onDragEnter.bind(this)}
        onDragLeave={this._onDragLeave.bind(this)}
        onDrop={this._onDrop.bind(this)}
        onDragOver={e => e.preventDefault()}
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
  	)
  }
  
  _onDragStart(e) {
    var urlTo = this.state.is_dir ? API.directoryUrl : API.fileUrl;

    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setData('text/plain', urlTo(this.state.path));

    var dragImage = listDragImageView(FileManagerStore.getSelectedFiles());
    var dragImageNode = DragImage.set(dragImage);
    e.dataTransfer.setDragImage(dragImageNode, 0, 0);
  };

  _onDragEnd() {
    DragImage.clear();
  }

  _onDragEnter(e) {
    e.preventDefault();

    if (this.dragEnterCounter++ === 0) { 
      this.setState({dragOver: true});
    }
  };

  _onDragLeave(e) {
    e.preventDefault();

    if (--this.dragEnterCounter === 0) {
      this.setState({dragOver: false});
    }
  };

  _onDrop(e) {
    this.dragEnterCounter = 0;
    this.setState({dragOver: false});    

    if (this.state.is_dir) {
      FileManagerStore.getSelectedFiles()
        .forEach(f => FileManagerActions.moveFileToDir(f, this.state.path));
      
      e.preventDefault();
    }
  };

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