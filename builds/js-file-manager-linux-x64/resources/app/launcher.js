var expressApp = require('./expressApp');

var app = require('app');
var Menu = require('menu');
var Tray = require('tray');
var Path = require('path');
var open = require('open');

require('crash-reporter').start();

var appIcon = null;

app.on('ready', function() {
  appIcon = new Tray(Path.join(__dirname, 'public/img/tray.png'));

  var contextMenu = Menu.buildFromTemplate([
    {
      label: serverAddr(),
      type: 'normal',
      click: openLocalhost
    },
    {
      label: 'Quit',
      type: 'normal',
      click: function() {
        app.quit();
      }
    }
  ]);
  appIcon.setContextMenu(contextMenu);
});

function openLocalhost() {
  open(serverAddr());
}

function serverAddr() {
  return 'http://localhost:' + expressApp.get('port');
}