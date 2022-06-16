const electron = require('electron');
const { writeFile, readFile, readFileSync, writeFileSync } = require('fs');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const UdpComms = require('./udpStuff/UdpClass').UdpComms;

// Import the necessary Node modules.
const nodePath = require('path');
const { fileURLToPath } = require('url');
const FullDebugPath = electron.app.getPath('userData') + '/DebugLogs.json';

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
ipcMain.handle('send-udp-message', (event, arg) => {
    console.log(arg)

    let response = UDP.sendUDPMessage(arg, event);
    
    console.log(response);
    return response;
    
    //event.reply('asynchronous-reply', 'success');
});

ipcMain.handle('change-udp-settings', (event, arg) => {
    UDP.changeUDPListener(arg.listeningPort);
    UDP.remoteIP = arg.remoteIP;
    UDP.remotePort = arg.remotePort;
    UDP.initializeUDPListener();

    event.reply('asynchronous-reply', 'Changed UDP settings');
});

function CreateEmptyFile(){
    writeFileSync(FullDebugPath, JSON.stringify(''));
    console.log("Created Empty File");
}

ipcMain.handle('update-logs', (event, args) => {
    readFile(FullDebugPath, (error, data) => {

        if(error){
            if(error.errno == -4058){
                console.log("No file found Creating in directory: \n", FullDebugPath);
                CreateEmptyFile();
            }else{
                console.log("An error has occoured while creating the debug file", error);
                return;
            }
        }

        console.log('Data Read successfully');

        try{
            data = JSON.parse(data);
            if(args.sentMotorMessages.length > 0){
                for(let i=0; i < args.sentMotorMessages.length; i++){
                    data.sentMotorMessages.messages.push(args.sentMotorMessages[i]);
                }
            }
            if(args.sentTestMessages.length > 0){
                for(let i=0; i < args.sentTestMessages.length; i++){
                    data.sentTestMessages.messages.push(args.sentTestMessages[i]);
                }
            }

        }catch{
            data = {sentMotorMessages: {messages: []}, sentTestMessages: {messages: []}};
        }

        writeFile(FullDebugPath, JSON.stringify(data), (err) => {
            if(err){
                console.log('An Error occoured', err);
                return;
            }
            console.log('Data written successfully');
        })
    })
    response = "Successful Read and Write";
    return response;
})

ipcMain.handle('read-logs', (event, args) => {

})

ipcMain.handle('clear-logs', (event, args) => {

})