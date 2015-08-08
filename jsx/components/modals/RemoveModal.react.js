var React = require('react');
var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;
var Modal = require('react-bootstrap').Modal;

var FileManagerActions = require('../../actions/FileManagerActions');
var FileOperationStore = require('../../stores/FileOperationStore');
var FileOperationConstants = require('../../constants/FileOperationConstants');
var FileOperationActions = require('../../actions/FileOperationActions');

class RemoveModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var files = this.props.files;
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
    
    return (
      <div>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>{footer}</Modal.Footer>
      </div>
    )    
  }

  _removeFiles() {
    this.props.files
      .map(f => f.id)
      .forEach(FileManagerActions.removeFile);
      
    FileOperationActions.closeModal();
  }  
}

module.exports = RemoveModal;