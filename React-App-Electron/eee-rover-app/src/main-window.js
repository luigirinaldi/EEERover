const electron = require('electron');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

let mainWindow;


function create() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
      width: 800, 
      height: 600,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
       }
  });


  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadURL("http://localhost:3000");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  //attach window to UDP class so messages can be sent to renderer:
  mainWindow.webContents.on('did-finish-load', () => {
      // UDP.window = mainWindow

      // console.log(UDP.window.webContents.send);

      mainWindow.webContents.send('asynchronous-reply', 'Web page loaded!')
      // UDP.window.webContents.send('asynchronous-reply', 'Sending from udp class')

  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
  })
}

function get(){
  return mainWindow;
}

module.exports = { create, get };