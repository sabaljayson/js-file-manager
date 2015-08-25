var React = require('react');
var Path = require('path');
var classNames = require('classnames');
var querystring = require('querystring');
var Droppable = require('../Droppable');
var FileManagerStore = require('../../stores/FileManagerStore');
var FileManagerActions = require('../../actions/FileManagerActions');

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var classes = classNames({
      'drag-over': this.state.dragOver
    });

    var droppable = Droppable(this, this.props.path);

    return droppable(
      <a
        className={classes}
        onClick={()=>{FileManagerActions.changePath(this.props.path)}}>
        {this.props.name}
      </a>
    )
  }
}

module.exports = Breadcrumb;