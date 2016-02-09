var React = require('react');
var Path = require('path');
var classNames = require('classnames');
var SplitPane = require('react-split-pane');
var DocumentTitle = require('react-document-title');

var FileManagerStore = require('../stores/FileManagerStore');

var NavBar = require('./navbar/NavBar.react');
var ContentPane = require('./content-pane/ContentPane.react');
var ContextMenu = require('./ContextMenu.react');
var FilesGrid = require('./grid-view/FilesGrid.react');
var FilesList = require('./list-view/FilesList.react');
var FileOperationModal = require('./modals/FileOperationModal.react');

function getState() {
  return {
    path: FileManagerStore.getPath(),
    settings: FileManagerStore.getSettings(),
    viewType: FileManagerStore.getFilesViewType()
  }
}

class FileManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = getState();
  }

  componentDidMount() {
    FileManagerStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    FileManagerStore.removeChangeListener(this._onChange.bind(this));
  }

  render() {
    var viewType = this.state.viewType;
    var title = this.state.path.split(Path.sep).last();
    var viewZoom = this.state.viewZoom;

    var filesViewComponent = false;
    if (viewType === 'grid') {
      filesViewComponent = <FilesGrid/>;
    }
    else if (viewType === 'list') {
      filesViewComponent = <FilesList/>;
    }
    else {
      throw 'Unknown files view type ' + viewType;
    }

    var onSplitChange = _.debounce(
      FileManagerStore.emitChange.bind(FileManagerStore), 120
    );

    return (
      <DocumentTitle title={title}>
        <div>
          <ContextMenu />
          <FileOperationModal />
          <NavBar path={this.state.path} viewType={viewType} />
          <div className='row'>
          <SplitPane
            split="vertical"
            minSize="50"
            defaultSize={window.innerWidth * 0.75}
            onChange={onSplitChange} >
              {filesViewComponent}
              <ContentPane />
          </SplitPane>
          </div>
        </div>
      </DocumentTitle>
    )
  }

  _onChange() {
    this.setState(getState());
  }
}

module.exports = FileManager;
