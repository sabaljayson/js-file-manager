var path = require('path');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var FileManagerStore = require('../stores/FileManagerStore');
var FileManagerActions = require('../actions/FileManagerActions');
var ClipboardConstants = require('../constants/ClipboardConstants');

var CHANGE_EVENT = 'change';

var _storeData = {
  toCutFiles: [],
  toCopyFiles: []
};

function pasteFiles(pastePath) {
  _storeData.toCopyFiles.forEach(f => {
    var baseName = path.basename(f.path);
    FileManagerActions.copyFile(f.path, path.join(pastePath, baseName));
  });

  _storeData.toCutFiles.forEach(f => {
    var baseName = path.basename(f.path);
    FileManagerActions.moveFile(f.path, path.join(pastePath, baseName));
  });
}

function clearStore() {
  _storeData.toCutFiles = [];
  _storeData.toCopyFiles = [];  
}

var ClipboardStore = assign({}, EventEmitter.prototype, {

  pasteFilesCount: function() {
    return _storeData.toCopyFiles.length + _storeData.toCutFiles.length;
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

    case ClipboardConstants.CUT_FILE:
      _storeData.toCutFiles.push(FileManagerStore.getFile(action.id));
      break;

    case ClipboardConstants.COPY_FILE:
      _storeData.toCopyFiles.push(FileManagerStore.getFile(action.id));
      break;

    case ClipboardConstants.PASTE_FILES:
      pasteFiles(action.path);
      clearStore();
      break;

    case ClipboardConstants.RESET_CLIPBOARD:
      clearStore();
      break;

    default:
      // no op
  }
});

module.exports = ClipboardStore;