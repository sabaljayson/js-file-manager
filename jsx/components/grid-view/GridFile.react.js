var React = require('react');
var FileManagerActions = require('../../actions/FileManagerActions');
var CMActions = require('../../actions/ContextMenuActions');
var CMConstants = require('../../constants/ContextMenuConstants');
var FMStore = require('../../stores/FileManagerStore');
var fileViewable = require('../../utils/FileViewable');

class GridFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = FMStore.getFile(props.id);    
  }

  componentDidMount() {
    FMStore.addFileChangeListener(this.props.id, this._onChange.bind(this));
  }

  componentWillUnmount() {
    FMStore.removeFileChangeListener(this.props.id);
  }

  render() {
  	var file = this.state;
    var selectedClass = file.selected ? 'selected' : '';

    if (! fileViewable(file)) {
      return false;
    }

    return (
      <div
        className={'grid-file-element ' + selectedClass}
        id={file.id}
        onContextMenu={this._onContextMenu.bind(this)}>
        <div className='thumbnail' style={{overflow: 'hidden'}}>
  			  <img src={file.thumbSrc} />
  			  <hr style={{'margin': '5px'}} />
          <span>
            {file.filename}
          </span>
        </div>
  		</div>
  	)
  }

  _onContextMenu(e) {
    if (! this.state.selected) {
      FileManagerActions.unselectAllFiles();
      FileManagerActions.setFileSelection(this.props.id, true);
    }

    CMActions.open(e.pageY, e.pageX);
  }

  _onChange() {
    this.setState(FMStore.getFile(this.props.id));
  }
}

module.exports = GridFile;