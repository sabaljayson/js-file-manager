var React = require('react');
var Draggable = require('react-draggable');

var defaultState = {
  zoomLevel: 1
};

class ZoomableMedia extends React.Component {
  constructor(props) {
  	super(props);
    this.state = defaultState;
  }

  componentWillReceiveProps() {
    this.setState(defaultState);
  }

  render() {
    var file = this.props.file;
    var url = CONSTS.BASE_PATH + '/get' + file.path;
    var zoomLevel = this.state.zoomLevel;
    var viewerStyle = {
      maxWidth: '80%',
      maxHeight: '100%'
    };

    var viewerComponent = false;

    if (file.is_image) {
      viewerComponent = (
        <img
          draggable='false'
          onWheel={this._onWheel.bind(this)}
          src={url}
          style={viewerStyle} />
      )
    }
    else if (file.is_video) {
      viewerComponent = (
        <video controls autoPlay style={viewerStyle}>
          <source src={url} type={file.mime} />
          Your browser does not support the video tag.
        </video>
      )
    }

  	return (
      <div style={{transform: 'scale(' + zoomLevel + ', ' + zoomLevel + ')'}}>
        <Draggable zIndex={0}>
          {viewerComponent}
        </Draggable>
      </div>
    )
  }

  _onWheel(ev) {
    var zoomDir = -Math.sign(ev.deltaY);
    this.setState({
      zoomLevel: this.state.zoomLevel + 0.05 * zoomDir,
    });
  }
}

module.exports = ZoomableMedia;