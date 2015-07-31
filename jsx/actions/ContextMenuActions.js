var AppDispatcher = require('../dispatcher/AppDispatcher');
var CMConstants = require('../constants/ContextMenuConstants');

var CMActions = {
  open: function(top, left, type, fileId) {
    AppDispatcher.dispatch({
      actionType: CMConstants.OPEN_CONTEXT_MENU,
      top: top,
      left: left,
      type: type,
      fileId: fileId
    });
  },

  close: function() {
    AppDispatcher.dispatch({
      actionType: CMConstants.CLOSE_CONTEXT_MENU
    });
  }
};

module.exports = CMActions;