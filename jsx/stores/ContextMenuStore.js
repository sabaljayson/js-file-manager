var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ClipboardActions = require('../actions/ClipboardActions');
var ContextMenuActions = require('../actions/ContextMenuActions');
var FileManagerActions = require('../actions/FileManagerActions');
var FileOperationActions = require('../actions/FileOperationActions');
var ContextMenuConstants = require('../constants/ContextMenuConstants');
var FileManagerStore = require('../stores/FileManagerStore');
var ClipboardStore = require('../stores/ClipboardStore');
var API = require('../utils/API');

var CHANGE_EVENT = 'change';

var _storeData = {
  visible: false,
  top: 0,
  left: 0,
  items: []
};

function openInNewTab(file) {
  var url;

  if (file.is_dir) {
    url = API.directoryUrl(file.path);
  }
  else {
    url = API.fileUrl(file.path);
  }
  
  var win = window.open(url, '_blank');
  win.focus();
}

function getBackgroundItems() {
  var currentDir = FileManagerStore.getDirectoryObject();

  var pasteCount = ClipboardStore.pasteFilesCount();
  var pasteLabel = pasteCount + ' file' + (pasteCount > 1 ?  's' : '');
  var dirPath = FileManagerStore.getPath();

  return [
    {
      label: 'New Folder',
      onclick: FileOperationActions.createDirectory
    },
    {
      inactive: pasteCount == 0,
      label: 'Paste ' + (pasteCount ? pasteLabel : ''),
      onclick: () => ClipboardActions.pasteFiles(dirPath)
    },
    {
      inactive: true,
      label: 'Properties',
      onclick: () => FileOperationActions.filesProperties([currentDir])
    }
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
  var items = [];

  /* Still buggy
  var execFiles = files.filter(f => f.is_executable);
  if (execFiles.length && ! dirs.length) {
    items.push({
      label: 'Run ' + selLabel,
      onclick: () => {
        execFiles.forEach(f => API.executeCommand(f.path));
      }
    });
  }
  */

  if (dirs.length <= 1) {
    items.push({
      label: 'Open ' + selLabel,
      onclick: () => {
        dirs.forEach(dir => FileManagerActions.changePath(dir.path));
        files
          .map(f => f.id)
          .forEach(FileManagerActions.openFile);
      }
    });  
  }

  if (files.length == 1) {
    items.push({
      type: 'submenu',
      label: 'Open with',
      items: API.getOpenWithList(files[0].path).map(app => {
        return {
          label: app.name,
          onclick: () => FileManagerActions.openFile(files[0].id, app.cmd)
        };
      })
    });
  }

  items.push({
    label: 'Open in new tab ' + selLabel,
    onclick: () => {
      dirs.concat(files).forEach(openInNewTab);
    }
  });

  if (dirs.length == 1 && files.length == 0) {
    items.push({
      label: 'Open with system file manager' + selLabel,
      onclick: () => FileManagerActions.openFile(dirs[0].id)
    });
  }

  items = items.concat([
  {
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
      selectedFiles.map(f => f.id).forEach(ClipboardActions.cutFile);
    }
  }, {
    label: 'Copy ' + selLabel,
    onclick: () => {
      ClipboardActions.resetClipboard();
      selectedFiles.map(f => f.id).forEach(ClipboardActions.copyFile);
    }
  }, {
    type: 'delimiter'
  }, {
    inactive: true,
    label: 'Properties',
    onclick: () => FileOperationActions.filesProperties(selectedFiles)
  }]);

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
