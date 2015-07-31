var AppDispatcher = require('../dispatcher/AppDispatcher');
var FileOperationConstants = require('../constants/FileOperationConstants');

var FileOperationActions = {
  createDirectory: function() {
    AppDispatcher.dispatch({
      actionType: FileOperationConstants.CREATE_DIRECTORY
    });
  },

  removeFiles: function(files) {
    AppDispatcher.dispatch({
      actionType: FileOperationConstants.REMOVE_FILES,
      files: files
    });
  },

  closeModal: function() {
    AppDispatcher.dispatch({
      actionType: FileOperationConstants.CLOSE_MODAL
    });
  }
};

module.exports = FileOperationActions;