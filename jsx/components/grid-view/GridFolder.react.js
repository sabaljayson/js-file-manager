var React = require('react');
var FileManagerActions = require('../../actions/FileManagerActions');
var ContextMenuActions = require('../../actions/ContextMenuActions');
var CMConstants = require('../../constants/ContextMenuConstants');
var FileManagerStore = require('../../stores/FileManagerStore');

class GridFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = FileManagerStore.getFile(props.id) 
  }

  componentDidMount() {
    FileManagerStore.addFileChangeListener(this.props.id, this._onChange.bind(this));
  }

  componentWillUnmount() {
    FileManagerStore.removeFileChangeListener(this.props.id);
  }

  render() {
    var file = this.state;
    var selectedClass = file.selected ? 'selected' : '';

    if (file.filename.startsWith('.')) {
      return false;
    }

    return (
      <a
        title={file.filename}
        id={this.props.id}
        onMouseDown={this._onMouseDown.bind(this)}
        onDoubleClick={this._onDoubleClick.bind(this)}
        onContextMenu={this._onContextMenu.bind(this)}
        className={'grid-folder-element btn btn-default btn-raised ' + selectedClass}>
        <i className='pull-left mdi-file-folder mdi-material-grey'></i>
        {file.filename}
      </a>
    )
  }

  _onChange() {
    this.setState(FileManagerStore.getFile(this.props.id));
  }

  _onMouseDown() {
    FileManagerActions.unselectAllFiles();
    FileManagerActions.setFileSelection(this.state.id, true);
  }

  _onDoubleClick() {
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