/*

var React = require('react');
var FileManagerActions = require('../actions/FileManagerActions');

class ZoomButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    var zoomVariants = [50, 75, 100, 125].map((z, key) => {
    	return <li key={key}><a onClick={this._zoomBy.bind(this, z)}>{z}%</a></li>
    });

		return (
      <li className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
        	<i className="material-icons">zoom_in</i>
        </a>
        <ul className="dropdown-menu">
        	{zoomVariants}
        </ul>
      </li>
		)
	}

	_zoomBy(z) {
		FileManagerActions.zoomFilesView(z);
	}
}

module.exports = ZoomButton;

*/