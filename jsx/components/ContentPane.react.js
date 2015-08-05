var React = require('react');
var brace = require('brace');
var wheelzoom = require('vf-wheelzoom');
var AceEditor = require('react-ace');
var ContentPaneStore = require('../stores/ContentPaneStore');
var ZoomableImage = require('../components/ZoomableImage.react');
 
require('brace/mode/javascript');
require('brace/theme/monokai');

function getState() {
  return {
    data: ContentPaneStore.getContentPane(),
    value: ContentPaneStore.getValue()
  };
}

class ContentPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = getState();
  }

  componentDidMount() {
    ContentPaneStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    ContentPaneStore.removeChangeListener(this._onChange.bind(this));
  }

  render() {
    var data = this.state.data;
    if (! data)
      return false;

    if (data.is_image) {
      var url = CONSTS.BASE_PATH + '/get' + data.path;
      return <ZoomableImage src={url} />
    }
    else if (data.size < 0.25) {
      return <AceEditor
        value={this.state.value}
        fontSize={16}
        mode='javascript'
        theme='monokai'
        width='100%'
        height='100%'
        name='SOME_UNIQUE_ID_OF_DIV' />;      
    }

    return false;
  }

  _onChange() {
    this.setState(getState());
  }
}

module.exports = ContentPane;