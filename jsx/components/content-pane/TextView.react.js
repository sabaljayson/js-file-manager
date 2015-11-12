var React = require('react');

class TextView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <textarea className='text-view-textarea'>
        {this.props.value}
      </textarea>
    );
  }
}

module.exports = TextView;
