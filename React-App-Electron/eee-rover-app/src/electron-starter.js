const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let dgram = require('dgram');
let UdpComms = require('./udpStuff/UdpClass').UdpComms;

console.log(UdpComms);

const { ipcMain } = electron;

let UDP = new UdpComms();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
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
        UDP.window = mainWindow

        console.log(UDP.window.webContents.send);

        mainWindow.webContents.send('asynchronous-reply', 'Web page loaded!')
        UDP.window.webContents.send('asynchronous-reply', 'Sending from udp class')
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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
        createWindow()
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