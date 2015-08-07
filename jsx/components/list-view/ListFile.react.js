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

    return (
      <tr
        className={'list-file-element ' + selectedClass}
        id={file.id}
        onClick={this._onClick.bind(this)}
        onContextMenu={this._onContextMenu.bind(this)} >

        <td>
          <img src={file.thumbSrc} style={{width: 25, marginRight: 5}} />
          {file.filename}
        </td>
        <td>
          {fileSize(file.size)}
        </td>
        <td>
          {new Date(file.mtime).toLocaleDateString()}
        </td>
  		</tr>
  	)
  }

  _onClick() {
    if (this.state.is_dir) {
      FileManagerActions.changePath(this.state.path);
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