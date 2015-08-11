var React = require('react');
var brace = require('brace');
var path = require('path');
var AceEditor = require('react-ace');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Button = require('react-bootstrap').Button;
var modelist = ace.require("ace/ext/modelist");
requireBraceModes();
require('brace/theme/monokai');

var API = require('../../utils/API');
var notifyThat = require('../../utils/notifyThat');

class TextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.currentValue = props.value;
  }

  render() {
  	var file = this.props.file;
  	var value = this.props.value;

  	var mode = modelist.getModeForPath(file.path).name;

    return (
    	<div style={{display: 'table', width: '100%', height: '100%'}}>
	    	<div style={{display: 'table-row'}}>
					<AceEditor
					  value={value}
					  onChange={this._onTextChange.bind(this)}
					  fontSize={16}
					  mode={mode}
					  theme='monokai'
					  width='100%'
					  height='100%'
					  name='SOME_UNIQUE_ID_OF_DIV' />    	
	    	</div>
	    	<div style={{display: 'table-row', height: 50}}>
					<div style={{background: 'white'}}>
						<div className='pull-right'>
							<ButtonToolbar>
								<Button bsStyle='primary' onClick={this._resetDefault.bind(this)}>Reset default</Button>
								<Button bsStyle='success' onClick={this._saveChanges.bind(this)}>Save changes</Button>
							</ButtonToolbar>
						</div>
					</div>
	    	</div>	    	
	    </div>
    )
  }

  _resetDefault() {
  	this.forceUpdate();
  }

  _saveChanges() {
  	var file = this.props.file;

  	if (confirm('Are you sure?')) {
  		API.setCommand(file.path, this.currentValue);
    }
  }

  _onTextChange(newVal) {
  	this.currentValue = newVal;
  }
}

module.exports = TextEditor;

function requireBraceModes() {
	var includeFolder = require('include-folder');
	var modes = includeFolder(path.join(__dirname, '../../../node_modules/brace/mode'));

	for (var key in modes) {
		eval(modes[key]);
	}	
}