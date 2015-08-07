var React = require('react');

var TextEditor = require('../components/TextEditor.react');
var ZoomableImage = require('../components/ZoomableImage.react');
var ContentPaneStore = require('../stores/ContentPaneStore');

function getState() {
  return {
    file: ContentPaneStore.getContentPane(),
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
    var file = this.state.file;
    if (! file)
      return false;

    if (file.is_image) {
      var url = CONSTS.BASE_PATH + '/get' + file.path;
      return <ZoomableImage src={url} />
    }
    else if (file.size < 0.25) {
      return <TextEditor file={file} value={this.state.value} />;
    }

    return false;
  }

  _onChange() {
    this.setState(getState());
  }
}

module.exports = ContentPane;