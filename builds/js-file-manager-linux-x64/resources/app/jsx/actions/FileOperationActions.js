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

  renameFiles: function(files) {
    AppDispatcher.dispatch({
      actionType: FileOperationConstants.RENAME_FILES,
      files: files
    });
  },

  filesProperties: function(files) {
    AppDispatcher.dispatch({
      actionType: FileOperationConstants.OPEN_FILES_PROPERTIES,
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