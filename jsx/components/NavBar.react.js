var React = require('react');
var DirectoriesBreadcrumb = require('./DirectoriesBreadcrumb.react');
var SortFilesButton = require('./SortFilesButton.react');

class NavBar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='navbar navbar-primary navbar-fixed-top' style={{marginBottom: 0, paddingRight: 10}}>
				<div className='row'>
				  <div className='col-md-12'>
						<DirectoriesBreadcrumb path={this.props.path}/>

				    <ul className='nav navbar-nav navbar-right'>
							<SortFilesButton/>
				      <li>
				      	<a><i className='mdi-action-settings'></i></a>
				      </li>
				    </ul>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = NavBar;