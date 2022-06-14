const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const UdpComms = require('./udpStuff/UdpClass').UdpComms;

// Import the necessary Node modules.
const nodePath = require('path');
// import Applicatino modules
const appMainWindow = require(nodePath.join(__dirname, 'main-window'));

//prevent garbage collection:
let mainWindow = null;

console.log(UdpComms);

const { ipcMain } = electron;

let UDP = new UdpComms();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// UDP.window = mainWindow;s



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    mainWindow = appMainWindow.create();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        mainWindow = appMainWindow.create();
    }
});

// Commuincation between main process (this one) and renderer (react)

ipcMain.on('send-udp-message', (event, arg) => {
    console.log(arg)

    UDP.sendUDPMessage(arg, event);
});

ipcMain.on('change-udp-settings', (event, arg) => {
    UDP.changeUDPListener(arg.localIP, arg.listeningPort);
    UDP.remoteIP = arg.remoteIP;
    UDP.remotePort = arg.remotePort;

    event.reply('asynchronous-reply', 'Changed UDP settings');
});