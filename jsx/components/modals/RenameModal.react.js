var path = require('path');
var range = require('range').range;
var React = require('react');
var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;
var Modal = require('react-bootstrap').Modal;

var FileManagerActions = require('../../actions/FileManagerActions');
var FileOperationStore = require('../../stores/FileOperationStore');
var FileOperationConstants = require('../../constants/FileOperationConstants');
var FileOperationActions = require('../../actions/FileOperationActions');

class RenameModal extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var inputNode = this.refs.renamePattern.getInputDOMNode();
    inputNode.focus();
    inputNode.setSelectionRange(0, this.basename.length);
  }

  render() {
    var files = this.props.files;
    var fileNames = files.map(f => f.filename).join(', ');
    var title = 'Rename';

    var multipleFiles = files.length > 1;
    var ext = path.extname(files[0].filename);
    var basename = path.basename(files[0].filename, ext);

    this.basename = basename;

    var rangeInputs = multipleFiles ? (
      <form className='row'>
        <div className='col col-md-6'>
          <Input
            type='number'
            ref='renameFrom'
            defaultValue={0}
            addonBefore='From' />
        </div>
        <div className='col col-md-6'>
          <Input
            type='number'
            ref='renameTo'
            defaultValue={files.length - 1}
            addonBefore='To' />
        </div>
      </form>
    ) : false;

    var pattern = basename + (multipleFiles ? '{i}' : '') + ext;

    var body = (
      <div style={{marginTop: 30}}>
        <Input
          type='text'
          addonBefore='Filename'
          defaultValue={pattern}
          ref='renamePattern' />
        {rangeInputs}
      </div>
    );

    var footer = (
      <div>
        <Button onClick={this._renameFiles.bind(this)}>Rename</Button>
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

  _renameFiles() {
    var files = this.props.files;
    var pattern = this.refs.renamePattern.getValue();
    var from = 0, to = 0;

    if (files.length > 1) {
      from = parseFloat(this.refs.renameFrom.getValue());
      to = parseFloat(this.refs.renameTo.getValue());
    }

    var fileInd = 0;

    range(from, to + 1).forEach(i => {
      var file = files[fileInd++];

      var dirName = path.dirname(file.path);
      var newPath = path.join(dirName, pattern.replace('{i}', i));
      FileManagerActions.moveFile(file.path, newPath);
    });

    FileOperationActions.closeModal();
  }
}

module.exports = RenameModal;
