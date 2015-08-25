var assign = require('object-assign');
var Path = require('path');
var EventEmitter = require('events').EventEmitter;
var mimeIcon = require('../utils/MimeIcon');
var mod = require('../utils/Modulo');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var FileManagerConstants = require('../constants/FileManagerConstants');
var FileManagerActions = require('../actions/FileManagerActions');
var fileViewable = require('../utils/FileViewable');
var API = require('../utils/API');

var CHANGE_EVENT = 'change';
var FILE_CHANGE_EVENT = 'file-change';

var _storeData = {
  path: '/',
  socket: null,
  filesViewType: 'grid',
  files: [],
  filesMap: {},
  fileChangeListeners: {},
  sort: {
    method: 'mtime',
    order: -1
  },
  settings: {
    contentPaneOpen: true,
    iconsType: FileManagerConstants.ICON_TYPE_OXYGEN
  }
};

function setPath(path) {
  API.lsCommand(path, data => {
    _storeData.dirData = data.dirData;
    _storeData.files = data.files;
    _storeData.files.forEach(f => {
      _storeData.filesMap[f.id] = f;
    });
    _storeData.files.forEach(setFileIcon);
    _storeData.path = path;

    sortFilesBy(_storeData.sort.method, _storeData.sort.order);

    var dirUrl = API.directoryUrl(path);    
    var state = dirUrl.substr(CONSTS.BASE_PATH.length);
    window.history.pushState('Object', 'Title', state);

    
    FileManagerStore.emitChange();
  });
}

function watchDirectory(path) {
  if (! _storeData.socket) {
    _storeData.socket = io.connect(CONSTS.BASE_PATH);
  }

  if (! _storeData.socket.connected) {
    _storeData.socket.on('connect', ajaxWatch);
  }
  else {
    ajaxWatch();
  }

  function ajaxWatch() {
    API.watchCommand(path, _storeData.socket.id, function() {
      _storeData.socket.removeAllListeners('directoryChange');
      _storeData.socket.on('directoryChange', function(data) {
        if (data.type == 'changed') {
          fileChanged(data.file);
          FileManagerStore.emitChange();
        }
        else if (data.type == 'removed') {
          fileRemoved(data.path);
          FileManagerStore.emitChange();
        }
        else {
          throw "Unknown directoryChange type";
        }
      });
    });
  }

  function fileChanged(file) {
    var found = _storeData.files.filter(f => f.id == file.id);
    if (! found.length) {
      setFileIcon(file);
      _storeData.files.push(file);
      _storeData.filesMap[file.id] = file;

      sortFilesBy(_storeData.sort.method, _storeData.sort.order);
    }
  }

  function fileRemoved(path) {
    _storeData.files.remove(f => f.path == path);
  }  
}

function unselectAllFiles() {
  _storeData.files.forEach(f => {
    if (f.selected) {
      f.selected = false;
      FileManagerStore.emitFileChange(f.id);
    }
  });
}

function moveSelection(direction) {
  var dirs = _storeData.files.filter(f => f.is_dir).filter(fileViewable);
  var files = _storeData.files.filter(f => ! f.is_dir).filter(fileViewable);
  files = dirs.concat(files);

  var selInd = files.findIndex(f => f.selected);
  var selFile = files[selInd];
  var selPos = $('#' + selFile.id).offset();
  var fileHeight = $('#' + selFile.id).height();

  unselectAllFiles();

  FileManagerStore.emitFileChange(selFile.id);
  

  switch (direction) {
    case 'left':
      var prevInd = mod(selInd - 1, files.length);
      var file = files[prevInd];
      file.selected = true;
      FileManagerStore.emitFileChange(file.id);
      break;

    case 'right':
      var nextInd = mod(selInd + 1, files.length);
      var file = files[nextInd];
      file.selected = true;
      FileManagerStore.emitFileChange(file.id);
      break;

    case 'up':
      // TODO
      break;

    case 'down':
      // TODO
      break;

    default:
      throw "Unknown direction";
      break;
  }
}

function sortFilesBy(method, order) {
  _storeData.sort.method = method;
  _storeData.sort.order = order;

  var sortMethods = {
    name: function(a, b) {
      return a.filename.localeCompare(b.filename);
    },
    type: function(a, b) {
      return a.mime.localeCompare(b.mime);
    },
    size: function(a, b) {
      return a.size - b.size;
    },
    mtime: function(a, b) {
      return a.mtime.localeCompare(b.mtime);
    }
  };

  var sortMethod = function(a, b) {
    return order * sortMethods[method](a, b);
  };

  _storeData.files.sort(sortMethod);
}

function updateFilesThumbnails() {
  var files = _storeData.files;
  var scrollTop = $(document).scrollTop();
  var scrollBottom = scrollTop + window.innerHeight;

  for (var id in files) {
    var file = files[id];
    if (file.is_image) {
      var $file = $('#' + file.id);
      if (! $file.length)
        break;
      
      var top = $file.offset().top;

      if (scrollTop <= top && top <= scrollBottom) {
        _storeData.filesMap[file.id].thumbSrc = CONSTS.BASE_PATH + '/thumb' + file.path
        FileManagerStore.emitFileChange(file.id);
      }
    }
  }
}

function setFileIcon(file) {
  var iconType = FileManagerStore.getSettings().iconsType;
  file.thumbSrc = mimeIcon.getIconSrc(iconType, file.mime);
}

function createDirectory(name) {
  var dirPath = Path.join(_storeData.path, name);

  API.mkdirCommand(dirPath);  
}

var FileManagerStore = assign({}, EventEmitter.prototype, {
  getSettings: function() {
    return _storeData.settings;
  },

  getSortValues: function() {
    return _storeData.sort;
  },

  getContentPane: function() {
    return true;
    
    var selFiles = FileManagerStore.getSelectedFiles();
    if (selFiles.length > 1)
      return false;

    return selFiles[0];
  },

  getPath: function() {
    return _storeData.path;
  },

  getFiles: function() {
    return _storeData.files;
  },

  getSelectedFiles: function() {
    return _storeData.files.filter(f => f.selected);
  },

  getFile: function(id) {
    if (_storeData.filesMap[id]) {
      return _storeData.filesMap[id];
    }

    throw "No file with such id " + id;
  },

  getDirectoryObject: function() {
    return _storeData.dirData;
  },

  getFilesViewType: function() {
    return _storeData.filesViewType;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitFileChange: function(fileId) {
    this.emit(FILE_CHANGE_EVENT, fileId);
  },

  addFileChangeListener: function(fileId, callback) {
    _storeData.fileChangeListeners[fileId] = id => {
      if (id == fileId)
        callback();
    };

    this.on(FILE_CHANGE_EVENT, _storeData.fileChangeListeners[fileId]);
  },

  removeFileChangeListener: function(id) {
    this.removeListener(FILE_CHANGE_EVENT, _storeData.fileChangeListeners[id]);
    delete _storeData.fileChangeListeners[id]
  },
});
FileManagerStore.setMaxListeners(0); // Unlimited file change listeners

// Register callback to handle all updates
FileManagerStore.dispatchToken = AppDispatcher.register(function(action) {

  switch(action.actionType) {

    case FileManagerConstants.CHANGE_PATH:
      setPath(action.path);
      break;

    case FileManagerConstants.WATCH_DIRECTORY:
      watchDirectory(action.path);
      break;

    case FileManagerConstants.SORT_FILES_BY:
      sortFilesBy(action.method, action.order);
      FileManagerStore.emitChange();
      break;

    case FileManagerConstants.SET_FILES_VIEW_TYPE:
      _storeData.filesViewType = action.type;
      FileManagerStore.emitChange();
      break;

    case FileManagerConstants.UPDATE_FILES_THUMBS:
      updateFilesThumbnails();
      break;      

    case FileManagerConstants.CREATE_DIRECTORY:
      createDirectory(action.name);
      break;      

    case FileManagerConstants.SET_FILE_SELECTION:
      var file = FileManagerStore.getFile(action.id);

      if (file.selected !== action.selected) {
        file.selected = action.selected;
        FileManagerStore.emitFileChange(file.id);
      }
      break;

    case FileManagerConstants.MOVE_SELECTION:
      moveSelection(action.direction);
      break;

    case FileManagerConstants.OPEN_FILE:
      var filePath = FileManagerStore.getFile(action.id).path;
      API.openCommand(filePath);
      break;

    case FileManagerConstants.MOVE_FILE:
      API.mvCommand(action.fromPath, action.toPath);
      break;

    case FileManagerConstants.COPY_FILE:
      API.cpCommand(action.fromPath, action.toPath);
      break;

    case FileManagerConstants.REMOVE_FILE:
      var filePath = FileManagerStore.getFile(action.id).path;
      API.rmCommand(filePath);
      break;

    case FileManagerConstants.FILE_DRAG_START:
      FileManagerStore.getFile(action.id).dragged = true;
      FileManagerStore.emitFileChange(action.id);
      break;

    case FileManagerConstants.FILE_DRAG_END:
      FileManagerStore.getFile(action.id).dragged = false;
      FileManagerStore.emitFileChange(action.id);
      break;

    default:
      // no op
  }
});

module.exports = FileManagerStore;