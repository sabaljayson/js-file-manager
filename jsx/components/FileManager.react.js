var React = require('react');
var path = require('path');

var FileManagerStore = require('../stores/FileManagerStore');

var FileOperationModal = require('./FileOperationModal.react');
var DocumentTitle = require('react-document-title');
var NavBar = require('./navbar/NavBar.react');
var ContextMenu = require('./ContextMenu.react');
var ContentPane = require('./ContentPane.react');
var FilesGrid = require('./grid-view/FilesGrid.react');
var FilesList = require('./list-view/FilesList.react');

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
		var contentPane = this.state.contentPane;
		var title = this.state.path.split(path.sep).last();
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

		var split1 = 'col-xs-12', split2 = 'col-xs-0';
		if (this.state.settings.contentPaneOpen) {
			split1 = split2 = 'col-xs-6';
		}

		return (
			<DocumentTitle title={title}>
				<div>
					<ContextMenu />
					<FileOperationModal />
					<NavBar path={this.state.path} viewType={viewType} />
		      <div className='row' style={{padding: '0px 10px'}}>
		        <div className={split1} style={{borderRight: '1px solid #eee', zIndex: 10, paddingRight: 0}}>
		          {filesViewComponent}
		        </div>
		        <div className={split2} style={{height: '100%', padding: 0, background: '#eee'}}>
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