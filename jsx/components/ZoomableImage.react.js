var React = require('react');
var Draggable = require('react-draggable');

var defaultState = {
  zoomLevel: 1
};

class ZoomableImage extends React.Component {
  constructor(props) {
  	super(props);
    this.state = defaultState;
  }

  componentWillReceiveProps() {
    this.setState(defaultState);
  }

  render() {
    var zoomLevel = this.state.zoomLevel;
    var imageStyle = {
      maxWidth: '90%',
      maxGeight: '90%'
    };

  	return (
      <div style={{transform: 'scale(' + zoomLevel + ', ' + zoomLevel + ')'}}>
        <Draggable zIndex={0}>
          <img
            draggable='false'
            onWheel={this._onWheel.bind(this)}
            src={this.props.src}
            style={imageStyle} />
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

module.exports = ZoomableImage;