var React = require('react');
var DirectoriesBreadcrumb = require('./DirectoriesBreadcrumb.react');
var SortFilesButton = require('./SortFilesButton.react');

class NavBar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="navbar navbar-primary" style={{marginBottom: 12}}>
				<div className="row">
				  <div className="col-md-12">
					  <div className="navbar-collapse collapse navbar-responsive-collapse">
							<DirectoriesBreadcrumb path={this.props.path}/>

					    <ul className="nav navbar-nav navbar-right">
								<SortFilesButton/>
					      <li>
					      	<a><i className="mdi-action-settings"></i></a>
					      </li>
					    </ul>
					  </div>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = NavBar;