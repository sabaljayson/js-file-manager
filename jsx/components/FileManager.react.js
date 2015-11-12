var React = require('react');
var Path = require('path');
var classNames = require('classnames');
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

    var split1 = classNames('files-view-panel', {
      'col-xs-6': this.state.settings.contentPaneOpen,
      'col-xs-12': ! this.state.settings.contentPaneOpen
    });

    var split2 = classNames('content-pane-panel', {
      'col-xs-6': this.state.settings.contentPaneOpen,
      'col-xs-0': ! this.state.settings.contentPaneOpen
    });		

    return (
      <DocumentTitle title={title}>
        <div>
          <ContextMenu />
          <FileOperationModal />
          <NavBar path={this.state.path} viewType={viewType} />
          <div className='row'>
            <div className={split1} style={{borderRight: '1px solid #eee', zIndex: 10, paddingRight: 0}}>
              {filesViewComponent}
            </div>
            <div className={split2} style={{height: '100%', padding: 0}}>
              <ContentPane />
            </div>
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
