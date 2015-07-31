var AppDispatcher = require('../dispatcher/AppDispatcher');
var ClipboardConstants = require('../constants/ClipboardConstants');

var ClipboardActions = {
  copyFile: function(fileId) {
    AppDispatcher.dispatch({
      actionType: ClipboardConstants.COPY_FILE,
      id: fileId
    });
  },

  cutFile: function(fileId) {
    AppDispatcher.dispatch({
      actionType: ClipboardConstants.CUT_FILE,
      id: fileId
    });
  },

  pasteFiles: function() {
    AppDispatcher.dispatch({
      actionType: ClipboardConstants.PASTE_FILES
    });
  },

  resetClipboard: function() {
    AppDispatcher.dispatch({
      actionType: ClipboardConstants.RESET_CLIBOARD
    });
  }
};

module.exports = ClipboardActions;