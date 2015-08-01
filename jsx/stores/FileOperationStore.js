var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var FileOperationConstants = require('../constants/FileOperationConstants');

var CHANGE_EVENT = 'change';

var _storeData = {
  open: false,
  type: null,
  files: []
};

var FileOperationStore = assign({}, EventEmitter.prototype, {

  isOpen: function() {
    return _storeData.open;
  },

  getType: function() {
    return _storeData.type;
  },

  getFiles: function() {
    return _storeData.files;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(action) {

  switch(action.actionType) {

    case FileOperationConstants.CREATE_DIRECTORY:
      _storeData.open = true;
      _storeData.type = FileOperationConstants.CREATE_DIRECTORY;
      FileOperationStore.emitChange();
      break;

    case FileOperationConstants.REMOVE_FILES:
      _storeData.open = true;
      _storeData.type = FileOperationConstants.REMOVE_FILES;
      _storeData.files = action.files;
      FileOperationStore.emitChange();
      break;

    case FileOperationConstants.RENAME_FILES:
      _storeData.open = true;
      _storeData.type = FileOperationConstants.RENAME_FILES;
      _storeData.files = action.files;
      FileOperationStore.emitChange();
      break;

    case FileOperationConstants.CLOSE_MODAL:
      _storeData.open = false;
      FileOperationStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = FileOperationStore;