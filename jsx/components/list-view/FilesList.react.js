var React = require('react');

var FileManagerStore = require('../../stores/FileManagerStore');
var FileManagerActions = require('../../actions/FileManagerActions');
var ContextMenuActions = require('../../actions/ContextMenuActions');
var ContextMenuConstants = require('../../constants/ContextMenuConstants');
var fileViewable = require('../../utils/FileViewable');

var ListFile = require('./ListFile.react');
var AreaSelect = require('../../utils/AreaSelect');

function getState() {
  return {
    files: FileManagerStore.getFiles(),
    sortValues: FileManagerStore.getSortValues()
  };
}

class FilesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = getState();

    this._onChange = this._onChange.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
  }

  componentDidMount() {
    FileManagerStore.addChangeListener(this._onChange);
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
      height: minHeight
    };

    var files = folders.concat(files).filter(fileViewable);
    var areaSelect = AreaSelect(['.list-file-element', '.list-folder-element']);  

    return areaSelect(
      <div
        style={styles}
        className='files-list-element'
        onClick={this._onClick}
        onContextMenu={this._onContextMenu}
        onScroll={_.debounce(FileManagerActions.updateFilesThumbnails, 120)} >

        <table className='table table-condensed'>
          <thead>
            <tr>
              <th onClick={this._sortByMethod('name')}>Name</th>
              <th onClick={this._sortByMethod('size')}>Size</th>
              <th onClick={this._sortByMethod('mtime')}>Modification time</th>
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

  _sortByMethod(method) {
    return () => {
      var newOrder = this.state.sortValues.order;
      var newMethod = this.state.sortValues.method;

      if (method === this.state.sortValues.method) {
        newOrder = -this.state.sortValues.order;
      }
      else {
        newMethod = method;
      }

      FileManagerActions.sortFilesBy(newMethod, newOrder);
    };
  }
}

module.exports = FilesList;
