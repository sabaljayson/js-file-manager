var app = require('app');
var Menu = require('menu');
var Tray = require('tray');
var BrowserWindow = require('browser-window');
var Path = require('path');

require('crash-reporter').start();

var mainWindow = null;
var appIcon = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 400, height: 200, resizeable: false});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('minimize', onClose);
  mainWindow.on('close', onClose);
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  appIcon = new Tray(Path.join(__dirname, '../public/favicon.png'));
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      type: 'normal',
      click: function() {
        mainWindow.forceClose = true;
        app.quit();
      }
    }
  ]);
  appIcon.setToolTip('This is my application.');
  appIcon.setContextMenu(contextMenu);

  function onClose(e) {
    if (! mainWindow.forceClose) {
      mainWindow.hide();
      e.preventDefault();
      return;
    }
  }
});