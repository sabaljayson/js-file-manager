var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ClipboardActions = require('../actions/ClipboardActions');
var ContextMenuActions = require('../actions/ContextMenuActions');
var FileManagerActions = require('../actions/FileManagerActions');
var FileOperationActions = require('../actions/FileOperationActions');
var ContextMenuConstants = require('../constants/ContextMenuConstants');
var FileManagerStore = require('../stores/FileManagerStore');


var CHANGE_EVENT = 'change';

var _storeData = {
  visible: false,
  top: 0,
  left: 0,
  items: []
};

function openInNewTab(dir) {
  var url = CONSTS.BASE_PATH + '/path=' + dir.path;
  var win = window.open(url, '_blank');
  win.focus();  
}

function getBackgroundItems() {
  var currentDir = FileManagerStore.getDirectoryObject();

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
      label: 'Paste',
      onclick: ClipboardActions.pasteFiles
    },    
    {
      label: 'Properties',
      onclick: () => FileOperationActions.filesProperties([currentDir])
    },
    { type: 'delimiter' },
    { label: 'Open terminal' },
    { label: 'Execute JS' }
  ];
}

function getSelLabel(files, dirs) {
  var selLabel = '';

  var filesCount = files.length,
    dirsCount = dirs.length;

  var filesLabel = filesCount + ' file' + (filesCount > 1 ? 's' : '');
  var dirsLabel = dirsCount + ' dir' + (dirsCount > 1 ? 's' : '');

  if (filesCount && dirsCount) {
    selLabel = filesLabel + ', ' + dirsLabel;
  }
  else if (filesCount > 1) {
    selLabel = filesLabel;
  }
  else if (dirsCount > 1) {
    selLabel = dirsLabel;
  }

  return selLabel;
}

function getFileItems(selectedFiles) {

  var files = selectedFiles.filter(f => ! f.is_dir),
    dirs = selectedFiles.filter(f => f.is_dir);

  var selLabel = getSelLabel(files, dirs);

  var items = [{
    label: 'Open ' + selLabel,
    onclick: () => {
      dirs.forEach(openInNewTab);
      files
        .map(f => f.id)
        .forEach(FileManagerActions.openFile);
    }
  }, {
    label: 'Rename ' + selLabel,
    onclick: () => FileOperationActions.renameFiles(selectedFiles)
  }, {
    label: 'Remove ' + selLabel,
    onclick: () => FileOperationActions.removeFiles(selectedFiles)
  }, {
    type: 'delimiter'
  }, {
    label: 'Cut ' + selLabel,
    onclick: () => {
      ClipboardActions.resetClipboard();
      selectedFiles.forEach(ClipboardActions.cutFile);
    }
  }, {
    label: 'Copy ' + selLabel,
    onclick: () => {
      ClipboardActions.resetClipboard();
      selectedFiles.forEach(ClipboardActions.copyFile);
    }
  }, {
    type: 'delimiter'
  }, {
    label: 'Properties',
    onclick: () => FileOperationActions.filesProperties(selectedFiles)
  }];

  return items;
}

function openContextMenu(top, left) {
  _storeData.top = top;
  _storeData.left = left;
  _storeData.visible = true;

  var selFiles = FileManagerStore.getSelectedFiles();

  _storeData.items = selFiles.length ? getFileItems(selFiles) : getBackgroundItems();
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

    case ContextMenuConstants.OPEN_CONTEXT_MENU:
      openContextMenu(action.top, action.left);
      CMStore.emitChange();
      break;

    case ContextMenuConstants.CLOSE_CONTEXT_MENU:
      closeContextMenu();
      CMStore.emitChange();    
      break;

    default:
      // no op
  }
});

module.exports = CMStore;