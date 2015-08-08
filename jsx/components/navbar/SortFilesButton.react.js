var React = require('react');
var FileManagerActions = require('../../actions/FileManagerActions');

class SortFilesButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      method: 'name',
      order: 1
    };
  }

  render() {
  	return (
      <li className='dropdown'>
        <a href='#' className='dropdown-toggle material-ripples' data-toggle='dropdown'>
          <i className='material-icons'>sort_by_alpha</i>
        </a>
        <ul className='dropdown-menu'>
          <li><a onClick={this._sortByMethod('name')}>Name</a></li>
          <li><a onClick={this._sortByMethod('type')}>Type</a></li>
          <li><a onClick={this._sortByMethod('size')}>Size</a></li>
          <li><a onClick={this._sortByMethod('mtime')}>Modification Time</a></li>
          <li className='divider'></li>
          <li><a onClick={this._reverseSort.bind(this)}>Inverse</a></li>
        </ul>
      </li>
  	)
  }

  _sortByMethod(method) {
  	return () => {
  		this.state.method = method;
  		FileManagerActions.sortFilesBy(method, this.state.order);
  	};
  }

  _reverseSort() {
  	this.state.order *= -1;
  	FileManagerActions.sortFilesBy(this.state.method, this.state.order);  	
  }
}

module.exports = SortFilesButton;