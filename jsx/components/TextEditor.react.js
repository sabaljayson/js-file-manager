var React = require('react');
var brace = require('brace');
var path = require('path');
var AceEditor = require('react-ace');

requireBraceModes();
require('brace/theme/monokai');

var modelist = ace.require("ace/ext/modelist");

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
  	var file = this.props.file;
  	var value = this.props.value;

  	var mode = modelist.getModeForPath(file.path).name;

    return (
			<AceEditor
			  value={value}
			  fontSize={16}
			  mode={mode}
			  theme='monokai'
			  width='100%'
			  height='100%'
			  name='SOME_UNIQUE_ID_OF_DIV' />
    )
  }
}

module.exports = TextEditor;

function requireBraceModes() {
	var includeFolder = require('include-folder');
	var modes = includeFolder(path.join(__dirname, '../../node_modules/brace/mode'));

	for (var key in modes) {
		eval(modes[key]);
	}	
}