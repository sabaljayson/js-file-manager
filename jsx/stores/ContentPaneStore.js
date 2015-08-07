var path = require('path');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var FileManagerStore = require('../stores/FileManagerStore');
var FileManagerConstants = require('../constants/FileManagerConstants');
var ContentPaneConstants = require('../constants/ContentPaneConstants');

var CHANGE_EVENT = 'change';

var defaultStoreData = {
  selectedFile: false,
  value: false
};

var _storeData = {};
assign(_storeData, defaultStoreData);

function clearStore() {
  assign(_storeData, defaultStoreData);
  ContentPaneStore.emitChange();  
}

function updateValue(path) {
  $.ajax({
    url: '/get' + path,
    dataType: 'text',
    success: function(value) {
      _storeData.value = value;
      ContentPaneStore.emitChange();
    }
  });
}

function onSelectionChange() {
  var selFiles = FileManagerStore.getSelectedFiles();
  if (selFiles.length === 1 && ! selFiles[0].is_dir) {
    _storeData.selectedFile = selFiles[0];
    _storeData.value = false;

    if (_storeData.selectedFile.is_image) {
      ContentPaneStore.emitChange();
    }
    else {
      updateValue(_storeData.selectedFile.path);
    }
  }
  else {
    clearStore();
  }
}

var ContentPaneStore = assign({}, EventEmitter.prototype, {

  getContentPane: function() {
    return _storeData.selectedFile;
  },

  getValue: function() {
    return _storeData.value;
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
  AppDispatcher.waitFor([
    FileManagerStore.dispatchToken,
  ]);

  switch(action.actionType) {

    case FileManagerConstants.CHANGE_PATH:
      clearStore();
      break;

    case FileManagerConstants.SET_FILE_SELECTION:
    case FileManagerConstants.MOVE_SELECTION:
      onSelectionChange();
      break;

    default:
      // no op
  }
});

module.exports = ContentPaneStore;