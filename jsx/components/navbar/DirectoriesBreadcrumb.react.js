var React = require('react');
var Path = require('path');
var classNames = require('classnames');
var querystring = require('querystring');
var FileManagerStore = require('../../stores/FileManagerStore');
var FileManagerActions = require('../../actions/FileManagerActions');

class DirectoriesBreadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragOver: []
    };
  }

  render() {
    var pathArr = this.props.path.split(Path.sep);
    if (! pathArr[0].length) {
      pathArr[0] = '/';
    }

    pathArr = pathArr.filter(x => x.length);

    return (
      <div className='nav navbar-nav navbar-left directories-breadcrumb'>
        {pathArr.map(dirToLink.bind(this))}
      </div>
    )

    function dirToLink(dirName, ind) {
      var currentPath = pathArr.slice(0, ind + 1).join('/');
      if (currentPath[0] == '/' && currentPath.length > 1) {
        currentPath = currentPath.substr(1);
      }

      var classes = classNames('material-ripples', {
        'drag-over': this.state.dragOver[ind]
      });

      return (
        <li key={ind}>
          <a
            className={classes}
            onDragEnter={e => e.preventDefault()}
            onDragOver={this._onDragOver.bind(this, ind)}
            onDragLeave={this._onDragLeave.bind(this, ind)}
            onDrop={this._onDrop.bind(this, ind, currentPath)}
            onClick={()=>{FileManagerActions.changePath(currentPath)}}>
            {dirName}
          </a>
        </li>
      )
    }
  }

  _onDragOver(dirIndex, e) {
    this._setDragOver(dirIndex, true);

    e.preventDefault()
  }

  _onDragLeave(dirIndex, e) {
    this._setDragOver(dirIndex, false);    
  }

  _onDrop(dirIndex, toPath, e) {
    if (! e.dataTransfer.types.find('text/plain')) {
      return;
    }

    this._setDragOver(dirIndex, false);

    FileManagerStore.getSelectedFiles()
      .forEach(function(f)  {return FileManagerActions.moveFileToDir(f, toPath);});

    e.preventDefault();
  }

  _setDragOver(dirIndex, bool) {
    var dragOver = this.state.dragOver.slice();
    dragOver[dirIndex] = bool;
    this.setState({
      dragOver: dragOver
    });
  }
}

module.exports = DirectoriesBreadcrumb;