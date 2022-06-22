const electron = require('electron');

const { ipcMain } = electron;

let dgram = require('dgram');

// import Applicatino modules
const appMainWindow = require('./main-window');

//prevent garbage collection:
let mainWindow = null;

// Module to control application life.
const app = electron.app;

const readline = require('readline');
const fs = require('fs');
console.log(app.getPath('userData'));

const readInterface = readline.createInterface({
    input: fs.createReadStream(app.getPath('userData') + '/DebugLogs.txt'),
    console: true
});

const codeToChannel = {
    't': 'received-test-message',
    'm': 'received-move-message',
    'e': 'received-error-message',
    'd': 'received-data-message',
}

const outoingMessageTimeout = 1000; // time out for messages sent that are waiting for response
class UdpComms {

    constructor(){
        this.listeningPort = '52113';
        this.remoteIP = '172.20.10.5';
        this.remotePort = '1883';
        
        // array to contain all messages sent in order to find if they got a response or not
        // move messages will receive back the same message sent if successfull, test messages will receive a t
        // all other messages are not the result of a "request" from this app
        this.sentMessageBuffer = []; 

        // interval that evey second checks if any outgoing messages have timed out
        // time out 
        this.intervalID = setInterval(() => {

        }, 1000);

        this.initializeUDPListener(); //intialize listener
    }

    // declare and instantiate listener socket
    initializeUDPListener(){

        //Create the Udp listener
        console.log('initializing udp listener ---------------------------|');
        this.clientSock = dgram.createSocket('udp4');

        //Handles any recieved messages from the ipcRender
        ipcMain.on('message', this.messageHandler);

        //Handle and print errors from the ipcRender
        ipcMain.on('error', err => {
            console.log("Node incurred an " + err);
            ipcMain.close();
        })

        ipcMain.handle('send-udp-message', (event, arg) => {
            fs.appendFile(app.getPath('userData') + '/DebugLogs.txt', arg + '\n', 'utf-8', ()=>{});
            return this.sendUDPMessage(arg);
        });

        ipcMain.on('change-udp-settings', (event, arg) => {
            fs.appendFile(app.getPath('userData') + '/DebugLogs.txt', arg + '\n', 'utf-8', ()=>{});
            this.remoteIP = arg.remoteIP;
            this.remotePort = arg.remotePort;
        });
        
        ipcMain.handle('read-logs', (event, arg) => {
            readInterface.on('line', function(line) {
                console.log(JSON.parse(line).motorMessage);
            });            
        })
        
        ipcMain.handle('clear-logs', (event, arg) => {
        
        })

    }

    messageHandler(message, remote){
        let endTime = new Date();
        let elapsedTime = 0;
        console.log("Received message from " + remote.address + ':' + remote.port +' - ' + message);

        let incomingMessageContent = message.toString();
        let incomingMessageType = incomingMessageContent[0];
        
        let channel  = 'received-udp-message'; // generic message for unkown incoming message types
        
        if(codeToChannel.keys().includes(incomingMessageType)) { // check if type is withing the accepted ones
            channel = codeToChannel[incomingMessageType];
            incomingMessageContent = incomingMessageContent.slice(1); //remove first character since it is the type
            
            if(incomingMessageType === 'm' || incomingMessageType === 't'){ // message if either response to move or response to test
                // find message in sent message buffer 
                let type = incomingMessageType === 'm' ? 'motor' : 'test'; // bad code
                for(let i = 0; i < this.sentMessageBuffer.length; i++){ 
                    if(type === this.sentMessageBuffer[i].type && incomingMessageContent === this.sentMessageBuffer[i].data){
                        elapsedTime = endTime - this.sentMessageBuffer[i].time;
                        this.sentMessageBuffer.splice(i, 1); // remove message from sent messages
                        i = this.sentMessageBuffer.length + 1; // exit loop
                    }
                }
            }
        } 
        
        // ARRIVING MESSAGES SHOULD BE SAVED TO THE DEBUG HERE
        appMainWindow.get().webContents.send(channel.toString(), JSON.stringify({
            message:incomingMessageContent, //remove first bit
            ip: remote.address,
            port: remote.port,
            timeTaken: elapsedTime, // non-zero only for test and motor messages
        }));        
    }

    sendUDPMessage(message){
        // message object contains:
        //  type of message (motor/test), data and sent-time
        message = JSON.parse(message);
        let bufferMessage = Buffer.from(message.data);
        if(message.type === "motor" || message.type === "test"){
            bufferMessage = Buffer.from(message.type[0] + message.data); // add prefix to message based on type, using first char of type (better way of doing this to be found)
        }
        this.clientSock.send(bufferMessage, this.remotePort, this.remoteIP, (err, bytes) => {
        if(err !== null){
            if(err.message.includes('getaddrinfo')){
                console.log('Incorrect Adress Format')

            }else{
                console.log('error:' + err);
                this.clientSock.close();
            }
        }
        if(message.type === "motor" || message.type === "test"){
            // append to buffer so time taken can be calculated later
            this.sentMessageBuffer.push(message);
        }
        console.log('UDP message sent to ' + this.remoteIP +':'+ this.remotePort);
        });

        return 'success'; //I cant seem to work out how to get this error checking working so rn it always returns success, not a massive issue but still would be nice
    }

    setWindow(windowWebContents){
        this.webContents = windowWebContents;
        console.log("updating window");
        console.log(windowWebContents);
    }

    updateLogs(){

    }
}

let UDP = new UdpComms();

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