var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var CMConstants = require('../constants/ContextMenuConstants');
var CMActions = require('../actions/ContextMenuActions');
var FMActions = require('../actions/FileManagerActions');
var FileManagerStore = require('../stores/FileManagerStore');
var FileOperationActions = require('../actions/FileOperationActions');

var CHANGE_EVENT = 'change';

var _storeData = {
  visible: false,
  top: 0,
  left: 0,
  items: []
};

function getBackgroundItems() {
  return [
    {
      label: 'New Folder',
      onclick: FileOperationActions.createDirectory
    },
    {
      label: 'New Document',
      onclick: FileOperationActions.createFile
    },
    {
      label: 'Properties',
      onclick: FileOperationActions.openFolderProperties
    },
    { type: 'delimiter' },
    { label: 'Open terminal' },
    { label: 'Execute JS' }
  ];
}

function getFileItems(fileId) {
  var selFiles = FileManagerStore.getSelectedFiles();
  var multipleFilesSel = selFiles.length > 1;
  var selLabel = multipleFilesSel ? selFiles.length + ' files' : '';

  var items = [
    {
      label: 'Open ' + selLabel,
      onclick: () => {
        FMActions.openFiles(selFiles);
        CMActions.close();
      }
    },
    {
      label: 'Cut ' + selLabel,
      onclick: () => {
        FMActions.cutSelectedFiles();
      }        
    },
    {
      label: 'Copy ' + selLabel,
      onclick: () => {
        FMActions.cutSelectedFiles();
      }        
    },
    {
      label: 'Rename ' + selLabel,
      onclick: () => {
        FMActions.renameSelectedFiles();
      }        
    },
    {
      label: 'Remove ' + selLabel,
      onclick: () => {
        FileOperationActions.removeFiles(selFiles);
      }        
    }
  ];

  if (! multipleFilesSel) {
    items.push({
      label: 'Properties',
      onclick: () => {
        FMActions.openFileProperties(fileId);
      }
    });
  }

  return items;
}

function getFolderItems(dirId) {
  var dir = FileManagerStore.getFile(dirId);

  return [
    {
      label: 'Open',
      onclick: () => {
        FMActions.changePath(dir.path);
      }
    },
    {
      label: 'Open in new tab',
      onclick: () => {
        var url = CONSTS.BASE_PATH + '/path=' + dir.path;
        var win = window.open(url, '_blank');
        win.focus();
      }
    },
    { label: 'Cut' },
    { label: 'Copy' },
    { label: 'Rename' },
    { label: 'Remove' },
    { label: 'Properties' }
  ];
}

function openContextMenu(top, left, type, fileId) {
  _storeData.top = top;
  _storeData.left = left;
  _storeData.visible = true;

  switch (type) {
    case CMConstants.MENU_TYPE_BACKGROUND:
      _storeData.items = getBackgroundItems();
      break;

    case CMConstants.MENU_TYPE_FILE:
      _storeData.items = getFileItems(fileId);
      break;

    case CMConstants.MENU_TYPE_FOLDER:
      _storeData.items = getFolderItems(fileId);
      break;

    default:
      throw "Unknown context menu type " + type;
  }
}

function closeContextMenu() {
  _storeData.visible = false;
}

var CMStore = assign({}, EventEmitter.prototype, {

  getVisibility: function() {
    return _storeData.visible;
  },

  getTop: function() {
    return _storeData.top;
  },

  getLeft: function() {
    return _storeData.left;
  },

  getItems: function() {
    return _storeData.items;
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

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {

    case CMConstants.OPEN_CONTEXT_MENU:
      openContextMenu(action.top, action.left, action.type, action.fileId);
      CMStore.emitChange();
      break;

    case CMConstants.CLOSE_CONTEXT_MENU:
      closeContextMenu();
      CMStore.emitChange();    
      break;

    default:
      // no op
  }
});

module.exports = CMStore;