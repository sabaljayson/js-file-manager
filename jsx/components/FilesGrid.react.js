var React = require('react');

var FileManagerStore = require('../stores/FileManagerStore');
var FileManagerActions = require('../actions/FileManagerActions');
var ContextMenuActions = require('../actions/ContextMenuActions');
var ContextMenuConstants = require('../constants/ContextMenuConstants');

var GridFolder = require('./GridFolder.react');
var GridFile = require('./GridFile.react');

function getState() {
  return {
    files: FileManagerStore.getFiles()
  };
}

class FilesGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = getState();
  }

  componentDidMount() {
    FileManagerStore.addChangeListener(this._onChange.bind(this));

    // load thumbs if stops/slows scrolling    
    $(document).bind('scroll',
      _.debounce(FileManagerActions.updateFilesThumbnails, 120));

    var self = this;

    $('.files-grid-element').areaSelect({
      selectors: ['.grid-file-element', '.grid-folder-element'],
      enterArea: self._selectFile,
      exitArea: self._unselectFile
    }, {
      borderColor: '#009688',
      backgroundColor: 'rgba(0, 150, 136, 0.3)'
    });
  }

  componentWillUnmount() {
    FileManagerStore.removeChangeListener(this._onChange.bind(this));
  }

  componentDidUpdate() {
    FileManagerActions.updateFilesThumbnails();
  }

  render() {
    var folders = this.state.files.filter(f => f.is_dir);
    var files = this.state.files.filter(f => ! f.is_dir);

    var minHeight = window.innerHeight - $('.navbar').height() - 80;

    return (
      <div
        style={{minHeight: minHeight}}
        className='files-grid-element'
        onClick={this._onClick}
        onContextMenu={this._onContextMenu.bind(this)} >
        <div>
          {folders.map(f => <GridFolder key={f.id} id={f.id}></GridFolder>)}
        </div>
        <hr></hr>
        <div style={{minHeight: 200}}>
          {files.map(f => <GridFile key={f.id} id={f.id}></GridFile>)}
        </div>
      </div>
    )
  }

  _onChange() {
    this.setState(getState());
  }

  _onClick(e) {
    ContextMenuActions.close();
  }

  _onContextMenu(e) {
    // Exit if clicked on <GridFile/>
    var parents = $(e.target).parentsUntil('.grid-file-element');
    if (parents.length == 0 || parents[parents.length - 1].nodeName != "HTML") {
      return;
    }
    
    ContextMenuActions.open(e.pageY, e.pageX, ContextMenuConstants.MENU_TYPE_BACKGROUND);
  }

  _selectFile(node) {
    FileManagerActions.setFileSelection(node.id, true);
  }

  _unselectFile(node) {
    if (FileManagerStore.getFile(node.id).selected) {
      FileManagerActions.setFileSelection(node.id, false);
    }
  }
}

module.exports = FilesGrid;