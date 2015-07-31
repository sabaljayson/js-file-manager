var AppDispatcher = require('../dispatcher/AppDispatcher');
var FileManagerConstants = require('../constants/FileManagerConstants');
var FileManagerStore = require('../stores/FileManagerStore');

var FileManagerActions = {
  changePath: function(path) {
    AppDispatcher.dispatch({
      actionType: FileManagerConstants.CHANGE_PATH,
      path: path
    });

    FileManagerActions.watchDirectory(path);
  },

  watchDirectory: function(path) {
    AppDispatcher.dispatch({
      actionType: FileManagerConstants.WATCH_DIRECTORY,
      path: path
    });
  },

  sortFilesBy: function(method, order) {
    AppDispatcher.dispatch({
      actionType: FileManagerConstants.SORT_FILES_BY,
      method: method,
      order: order
    });
  },

  updateFilesThumbnails: function() {
    AppDispatcher.dispatch({
      actionType: FileManagerConstants.UPDATE_FILES_THUMBS
    });
  },

  createDirectory: function(name) {
    AppDispatcher.dispatch({
      actionType: FileManagerConstants.CREATE_DIRECTORY,
      name: name
    });
  },

  setFileSelection: function(id, selected) {
    AppDispatcher.dispatch({
      actionType: FileManagerConstants.SET_FILE_SELECTION,
      id: id,
      selected: selected
    });
  },

  moveSelection: function(direction) {
    AppDispatcher.dispatch({
      actionType: FileManagerConstants.MOVE_SELECTION,
      direction: direction
    });
  },

  selectAllFiles: function() {
    FileManagerStore
      .getFiles()
      .forEach(f => FileManagerActions.setFileSelection(f.id, true));
  },

  unselectAllFiles: function() {
    FileManagerStore
      .getFiles()
      .filter(f => f.selected)
      .forEach(f => FileManagerActions.setFileSelection(f.id, false));
  },

  openFile: function(id) {
    AppDispatcher.dispatch({
      actionType: FileManagerConstants.OPEN_FILE,
      id: id
    });
  },

  removeFile: function(id) {
    AppDispatcher.dispatch({
      actionType: FileManagerConstants.REMOVE_FILE,
      id: id
    });
  },

  historyBack: function(e) {
    AppDispatcher.dispatch({
      actionType: FileManagerConstants.HISTORY_MOVE_BACK,
      event: e
    });
  }
};

module.exports = FileManagerActions;