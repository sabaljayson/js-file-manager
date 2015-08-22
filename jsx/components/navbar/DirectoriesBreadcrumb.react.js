var React = require('react');
var Path = require('path');
var classNames = require('classnames');
var querystring = require('querystring');
var Breadcrumb = require('./Breadcrumb.react');
var FileManagerStore = require('../../stores/FileManagerStore');
var FileManagerActions = require('../../actions/FileManagerActions');

class DirectoriesBreadcrumb extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var pathArr = splitPath(this.props.path);
    var breadcrumbs = pathArr.map(function(name, i) {
      return (
        <li key={i}>
          <Breadcrumb name={name} path={pathUntil(pathArr, i)} />
        </li>
      )
    });

    return (
      <div className='nav navbar-nav navbar-left directories-breadcrumb'>
        {breadcrumbs}
      </div>
    )
  }
}

function splitPath(path) {
  var pathArr = path.split(Path.sep);
  if (! pathArr[0].length) {
    pathArr[0] = '/';
  }  

  return pathArr.filter(x => x.length);
}

function pathUntil(pathArr, ind) {
  var path = pathArr.slice(0, ind + 1).join('/');
  if (path[0] == '/' && path.length > 1) {
    path = path.substr(1);
  }

  return path;
}

module.exports = DirectoriesBreadcrumb;