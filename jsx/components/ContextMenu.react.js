var React = require('react');
var ContextMenuStore = require('../stores/ContextMenuStore');
var ContextMenuActions = require('../actions/ContextMenuActions');

function getCMState() {
	return {
		visible: ContextMenuStore.getVisibility(),
		top: ContextMenuStore.getTop(),
		left: ContextMenuStore.getLeft(),
		items: ContextMenuStore.getItems()
	};
}

class ContextMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = getCMState();
  }

  componentDidMount() {
    ContextMenuStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    ContextMenuStore.removeChangeListener(this._onChange.bind(this));
  }

  render() {
  	var menu = (
      <ul className="dropdown-menu" style={{display: 'block'}}>
        {this.state.items.map((item, key) => {
          if (item.type == 'delimiter') {
            return <hr key={key} />
          }

          var onClick = () => {
            item.onclick();
            ContextMenuActions.close();
          };

          return <li key={key}><a onClick={onClick}>{item.label}</a></li>;
        })}
      </ul>
    );

    return (
      <div className='context-menu' style={{ top: this.state.top, left: this.state.left }} >
				{this.state.visible ? menu : <section></section>}
  		</div>
  	)
  }

  _onChange() {
  	this.setState(getCMState());
  }
}

module.exports = ContextMenu;