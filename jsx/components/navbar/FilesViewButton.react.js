var React = require('react');
var FileManagerStore = require('../../stores/FileManagerStore');
var FileManagerActions = require('../../actions/FileManagerActions');

class FilesViewButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
  	var view = this.props.viewType;
  	var icon;

  	if (view === 'grid') {
  		icon = 'list';
  	}
  	else if (view === 'list') {
  		icon = 'view_comfy';
  	}
  	else {
  		throw 'Unknown files view type ' + view;
  	}

  	return (
      <li>
      	<a
          className='material-ripples'
          onClick={this._toggleViewType.bind(this)} >
      		<i className='material-icons'>{icon}</i>
      	</a>
      </li>
  	)
  }

  _toggleViewType() {
  	var nextView = 'grid';
  	if (nextView === this.props.viewType) {
  		nextView = 'list';
  	}

  	FileManagerActions.setFilesViewType(nextView);
  }
}

module.exports = FilesViewButton;