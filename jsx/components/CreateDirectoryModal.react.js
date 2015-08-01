var React = require('react');
var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;
var Modal = require('react-bootstrap').Modal;
var FileManagerActions = require('../actions/FileManagerActions');
var FileOperationStore = require('../stores/FileOperationStore');
var FileOperationConstants = require('../constants/FileOperationConstants');
var FileOperationActions = require('../actions/FileOperationActions');


class RenameModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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

  _createDirectory() {
    var dirName = this.refs.directoryName.getValue();

    if (dirName.length) {
      FileManagerActions.createDirectory(dirName);
      FileOperationActions.closeModal();
    }
  }  
}

module.exports = RenameModal;