var React = require('react');

var TextView = require('./TextView.react');
var ZoomableMedia = require('./ZoomableMedia.react');
var ContentPaneStore = require('../../stores/ContentPaneStore');

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

    if (file.is_image || file.is_video || file.is_audio) {      
      return <ZoomableMedia file={file} />
    }
    else if (this.state.value) {
      return <TextView value={this.state.value} />;
    }

    return false;
  }

  _onChange() {
    this.setState(getState());
  }
}

module.exports = ContentPane;
