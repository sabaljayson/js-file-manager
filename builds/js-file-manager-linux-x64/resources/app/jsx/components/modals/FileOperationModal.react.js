var React = require('react');
var Modal = require('react-bootstrap').Modal;

var FileManagerActions = require('../../actions/FileManagerActions');
var FileOperationStore = require('../../stores/FileOperationStore');
var FileOperationConstants = require('../../constants/FileOperationConstants');
var FileOperationActions = require('../../actions/FileOperationActions');
var CreateDirectoryModal = require('./CreateDirectoryModal.react');
var RemoveModal = require('./RemoveModal.react');
var RenameModal = require('./RenameModal.react');

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
    var modal = false;
    var files = this.state.files;

    if (this.state.type === FileOperationConstants.CREATE_DIRECTORY) {
      modal = <CreateDirectoryModal/>
    }
    else if (this.state.type === FileOperationConstants.REMOVE_FILES) {
      modal = <RemoveModal files={files}/>
    }
    else if (this.state.type === FileOperationConstants.RENAME_FILES) {
      modal = <RenameModal files={files}/>
    }

    return (
      <Modal show={this.state.open} onHide={() => {}}>
        {modal}
      </Modal>
    )
  }

  _onChange() {
    this.setState(getState());    
  }
}

module.exports = FileOperationModal;