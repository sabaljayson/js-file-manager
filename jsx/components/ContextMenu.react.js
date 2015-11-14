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
    var menu = this._renderDropdownMenu(this.state.items);

    return (
      <div className='dropdown context-menu' style={{ top: this.state.top, left: this.state.left }} >
				{this.state.visible ? menu : false}
  		</div>
  	)
  }

  _onChange() {
  	this.setState(getCMState());
  }

  _renderDropdownMenu(items, isSubmenu) {
    var style = isSubmenu ? {} : {display: 'block'};

    return (
      <ul className='dropdown-menu multi-level' style={style}>
        {items.map((item, key) => {
          if (item.type == 'delimiter') {
            return <hr key={key} />
          }

          if (item.type == 'submenu') {
            return (
              <li className='dropdown-submenu'>
                <a tabIndex='-1' href='#'>{item.label}</a>
                {this._renderDropdownMenu(item.items, true)}
              </li>
            );
          }

          if (item.inactive) {
            return <li key={key}><a style={{color: 'grey'}}>{item.label}</a></li>;
          }

          var onClick = () => {
            item.onclick();
            ContextMenuActions.close();
          };

          return <li key={key}><a onClick={onClick}>{item.label}</a></li>;
        })}
      </ul>
    );
  }
}

module.exports = ContextMenu;