var React = require('react');

var FileManagerStore = require('../../stores/FileManagerStore');
var FileManagerActions = require('../../actions/FileManagerActions');
var ContextMenuActions = require('../../actions/ContextMenuActions');
var ContextMenuConstants = require('../../constants/ContextMenuConstants');

var GridFolder = require('./GridFolder.react');
var GridFile = require('./GridFile.react');
var AreaSelect = require('../../utils/AreaSelect');

function getState() {
  return {
    files: FileManagerStore.getFiles()
  };
}

class FilesGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = getState();

    this._onChange = this._onChange.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
  }

  componentDidMount() {
    FileManagerStore.addChangeListener(this._onChange);

    // load thumbs if stops/slows scrolling    
    $('.files-grid-element').bind('scroll',
      _.debounce(FileManagerActions.updateFilesThumbnails, 120));
  }

  componentWillUnmount() {
    FileManagerStore.removeChangeListener(this._onChange);
  }

  componentDidUpdate() {
    FileManagerActions.updateFilesThumbnails();
  }

  render() {
    var folders = this.state.files.filter(f => f.is_dir);
    var files = this.state.files.filter(f => ! f.is_dir);
    var minHeight = window.innerHeight - $('.navbar').height();
    var styles = {
      height: minHeight,
      overflowY: 'auto',
      backgroundColor: 'white',
      zIndex: 10
    };
    
    var areaSelect = AreaSelect(['.grid-file-element', '.grid-folder-element']);

    return areaSelect(
      <div
        style={styles}
        className='files-grid-element'
        onClick={this._onClick}
        onContextMenu={this._onContextMenu} >
        <div>          
          {folders.map(f => <GridFolder key={f.id} id={f.id}></GridFolder>)}
        </div>
        <div style={{marginTop: 10, minHeight: 200, clear: 'left'}}>
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
    
    FileManagerActions.unselectAllFiles();
    ContextMenuActions.open(e.pageY, e.pageX);
  }
}

module.exports = FilesGrid;
