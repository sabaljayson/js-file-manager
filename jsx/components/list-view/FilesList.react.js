var React = require('react');

var FileManagerStore = require('../../stores/FileManagerStore');
var FileManagerActions = require('../../actions/FileManagerActions');
var ContextMenuActions = require('../../actions/ContextMenuActions');
var ContextMenuConstants = require('../../constants/ContextMenuConstants');
var fileViewable = require('../../utils/FileViewable');

var ListFile = require('./ListFile.react');

function getState() {
  return {
    files: FileManagerStore.getFiles()
  };
}

class FilesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = getState();
  }

  componentDidMount() {
    FileManagerStore.addChangeListener(this._onChange.bind(this));

    // load thumbs if stops/slows scrolling    
    $('.files-list-element').bind('scroll',
      _.debounce(FileManagerActions.updateFilesThumbnails, 120));

    var self = this; // TODO

    $('.files-list-element').areaSelect({
      selectors: ['.list-file-element', '.list-folder-element'],
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
    var minHeight = window.innerHeight - $('.navbar').height();
    var styles = {
      height: minHeight,
      overflowY: 'auto',
      backgroundColor: 'white',
      zIndex: 10
    };

    var files = folders.concat(files).filter(fileViewable);

    return (
      <div
        style={styles}
        className='files-list-element'
        onClick={this._onClick}
        onContextMenu={this._onContextMenu.bind(this)} >
        
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Modification time</th>
            </tr>
          </thead>
          <tbody>
            {files.map(f => <ListFile key={f.id} id={f.id} />)}
          </tbody>
        </table>
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
    // Exit if clicked on <ListFile/>
    var parents = $(e.target).parentsUntil('.list-file-element');
    if (parents.length == 0 || parents[parents.length - 1].nodeName != "HTML") {
      return;
    }
    
    FileManagerActions.unselectAllFiles();
    ContextMenuActions.open(e.pageY, e.pageX);
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

module.exports = FilesList;