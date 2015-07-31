var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;

var FileManagerActions = require('../actions/FileManagerActions');
var FileOperationStore = require('../stores/FileOperationStore');
var FileOperationConstants = require('../constants/FileOperationConstants');
var FileOperationActions = require('../actions/FileOperationActions');

function getState() {
  return {
    open: FileOperationStore.isOpen(),
    type: FileOperationStore.getType(),
    files: FileOperationStore.getFiles()
  };
}

class FileOperationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = getState();
  }  

  componentDidMount() {
    FileOperationStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    FileOperationStore.removeChangeListener(this._onChange.bind(this));
  }

  render() {
    switch (this.state.type) {
      case FileOperationConstants.CREATE_DIRECTORY:
        var title = "Create folder";
        var body = (
          <div>
            <Input
              type='text'
              placeholder='Folder name'
              ref='directoryName'
              groupClassName='group-class'
              labelClassName='label-class'
              style={{marginTop: 30}} />
          </div>
        );
        var footer = (
          <div>
            <Button onClick={this._createDirectory.bind(this)}>Save</Button>
            <Button onClick={FileOperationActions.closeModal}>Cancel</Button>          
          </div>
        );
        break;

      case FileOperationConstants.REMOVE_FILES:
        var files = this.state.files;
        var fileNames = files.map(f => f.filename).join(', ');
        var title = "Remove ";
        if (files.length == 1) {
          title += files[0].filename;
        }
        else {
          title += fileNames + ' files';
        }

        var body = (
          <div>
            Are you sure you want to remove {fileNames} ?
          </div>
        );
        var footer = (
          <div>
            <Button onClick={this._removeFiles.bind(this)}>Yes</Button>
            <Button onClick={FileOperationActions.closeModal}>Cancel</Button>          
          </div>
        );
        break;
    }

    return (
      <Modal show={this.state.open} onHide={function(){}}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>{footer}</Modal.Footer>
      </Modal>
    )
  }

  _createDirectory() {
    var dirName = this.refs.directoryName.getValue();

    if (dirName.length) {
      FileManagerActions.createDirectory(dirName);
      FileOperationActions.closeModal();
    }
  }

  _removeFiles() {
    FileManagerActions.removeFiles(this.state.files);
    FileOperationActions.closeModal();
  }

  _onChange() {
    this.setState(getState());    
  }
}

module.exports = FileOperationModal;