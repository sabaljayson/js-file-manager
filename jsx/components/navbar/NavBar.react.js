var React = require('react');
var DirectoriesBreadcrumb = require('./DirectoriesBreadcrumb.react');
var SortFilesButton = require('./SortFilesButton.react');
var FilesViewButton = require('./FilesViewButton.react');

class NavBar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='navbar navbar-primary navbar-fixed-top'>
				<div className='row' style={{marginBottom: 1}}>
				  <div className='col-md-12'>
						<DirectoriesBreadcrumb path={this.props.path}/>

				    <ul className='nav navbar-nav navbar-right' style={{marginRight: 0}}>
				    	<FilesViewButton viewType={this.props.viewType}/>
							<SortFilesButton/>
				      <li>
				      	<a>
				      		<i className='material-icons'>more_vert</i>
				      	</a>
				      </li>
				    </ul>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = NavBar;