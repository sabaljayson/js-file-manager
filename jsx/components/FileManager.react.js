var React = require('react');
var path = require('path');

var FileManagerStore = require('../stores/FileManagerStore');

var FileOperationModal = require('./FileOperationModal.react');
var DocumentTitle = require('react-document-title');
var ContextMenu = require('./ContextMenu.react');
var FilesGrid = require('./FilesGrid.react');
var NavBar = require('./NavBar.react');

function getState() {
	return {
		path: FileManagerStore.getPath()
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
		var title = this.state.path.split(path.sep).last();
		var viewZoom = this.state.viewZoom;

		return (
			<DocumentTitle title={title}>
				<div>
					<ContextMenu />
					<FileOperationModal />
					<NavBar path={this.state.path} />
		      <div className="row" style={{padding: "0px 10px"}}>
		        <div className="col-md-12">        
		          <div className="panel panel-default">
		            <div className="panel-body">
		            	<FilesGrid />
		            </div>
		          </div>
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