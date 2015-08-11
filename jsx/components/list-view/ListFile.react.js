var React = require('react');
var fileSize = require('filesize');

var FileManagerActions = require('../../actions/FileManagerActions');
var CMActions = require('../../actions/ContextMenuActions');
var CMConstants = require('../../constants/ContextMenuConstants');
var FMStore = require('../../stores/FileManagerStore');
var fileViewable = require('../../utils/FileViewable');

class ListFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = FMStore.getFile(props.id);    
  }

  componentDidMount() {
    FMStore.addFileChangeListener(this.props.id, this._onChange.bind(this));
  }

  componentWillUnmount() {
    FMStore.removeFileChangeListener(this.props.id);
  }

  render() {
  	var file = this.state;
    var selectedClass = file.selected ? 'selected' : '';

    if (! fileViewable(file)) {
      return false;
    }

    var icon = false;
    if (file.is_dir) {
      icon = <i className='mdi-file-folder mdi-material-grey' />;
    }
    else {
      icon = <img src={file.thumbSrc} style={{width: 25, marginRight: 5}} />;
    }

    return (
      <tr
        className={'list-file-element ' + selectedClass}
        id={file.id}
        onMouseDown={this._onMouseDown.bind(this)}
        onClick={this._onClick.bind(this)}
        onDoubleClick={this._onDoubleClick.bind(this)}
        onContextMenu={this._onContextMenu.bind(this)}
        style={{cursor: file.is_dir ? 'pointer' : 'default'}} >

        <td>
          {icon}
          {file.filename}
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
  
  _onMouseDown() {
    FileManagerActions.unselectAllFiles();
    FileManagerActions.setFileSelection(this.state.id, true);
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

    CMActions.open(e.pageY, e.pageX);
  }

  _onChange() {
    this.setState(FMStore.getFile(this.props.id));
  }
}

module.exports = ListFile;