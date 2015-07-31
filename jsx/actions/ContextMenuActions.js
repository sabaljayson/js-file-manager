var AppDispatcher = require('../dispatcher/AppDispatcher');
var CMConstants = require('../constants/ContextMenuConstants');

var CMActions = {
  open: function(top, left) {
    AppDispatcher.dispatch({
      actionType: CMConstants.OPEN_CONTEXT_MENU,
      top: top,
      left: left
    });
  },

  close: function() {
    AppDispatcher.dispatch({
      actionType: CMConstants.CLOSE_CONTEXT_MENU
    });
  }
};

module.exports = CMActions;