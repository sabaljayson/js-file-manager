var React = require('react');
var path = require('path');
var querystring = require('querystring');
var FMActions = require('../../actions/FileManagerActions');

class DirectoriesBreadcrumb extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var pathArr = this.props.path.split(path.sep);
    if (! pathArr[0].length) {
      pathArr[0] = '/';
    }

    pathArr = pathArr.filter( x => x.length );

    function dirToLink(dir, ind) {
      var currentPath = pathArr.slice( 0, ind + 1 ).join( '/' );
      if (currentPath[0] == '/' && currentPath.length > 1) {
        currentPath = currentPath.substr(1);
      }

      return (
        <li key={ind}>
          <a
            className='material-ripples'
            onClick={()=>{FMActions.changePath(currentPath)}}>
            {dir}
          </a>
        </li>
      )
    }

    return (
      <div className='nav navbar-nav navbar-left directories-breadcrumb'>
        {pathArr.map(dirToLink)}
      </div>
    )
  }
}

module.exports = DirectoriesBreadcrumb;