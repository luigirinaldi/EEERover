let dgram = require('dgram')

// Import the necessary Node modules.
const nodePath = require('path');
const { json } = require('stream/consumers');
const { domainToUnicode } = require('url');

// Import the necessary Application modules.
const appMainWindow = require(nodePath.join(__dirname, '../main-window'));

const codeToChannel = {
  't': 'received-test-message',
  'm': 'received-move-message',
  'e': 'received-error-message',
  'd': 'received-data-message',
}

class UdpComms {

  constructor(){
    this.listeningPort = '52113';
    this.remoteIP = '172.20.10.5';
    this.remotePort = '1883';

    this.initializeUDPListener(); //intialize listener
  }

  changeUDPListener(newPort){//Closes the old listerner and creates a new one with a different port and IP
    this.clientSock.close();
    this.listeningPort = newPort;
  }

  // declare and instantiate listener socket
  initializeUDPListener(){

    //Create the Udp listener
    console.log('initializing udp listener ---------------------------|');
    this.clientSock = dgram.createSocket('udp4');

    //Once the connection is open to recieve data run this call back function
    this.clientSock.on('listening', () => {
      console.log('UDP Server listening on ');
      console.log(this.clientSock.address());
      console.log('\n');
    });

    //Handles any recieved messages from the node server
    this.clientSock.on('message', this.messageHandler);

    //Handle and print errors from the node server
    this.clientSock.on('error', err => {
      console.log("Node incurred an " + err);
      this.clientSock.close();
    })

    //Set the local port to send data to node onto, DO NOT SPECIFY ADDRESS, it throws an error as we are communicating on local
    this.clientSock.bind(parseInt(this.listeningPort));
  }

  messageHandler(message, remote){
    console.log("Received message from " + remote.address + ':' + remote.port +' - ' + message);
    
    // send to renderer
    //appMainWindow.get().webContents.invoke('asynchronous-reply', 'received udp message:' + message);

    let channel  = codeToChannel[message.toString()[0]];
    if(!channel) channel = 'received-udp-message';

    appMainWindow.get().webContents.send(channel.toString(), JSON.stringify({
      message:message.toString().slice(1), //remove first bit
      ip: remote.address,
      port: remote.port
    }));
  }

  sendUDPMessage(message){

    let bufferMessage = Buffer.from(message);
    //appMainWindow.get().webContents.invoke('asynchronous-reply', 'sending udp message');
    this.clientSock.send(bufferMessage, this.clientSock.address().port,  (err, bytes) => {

      if(err !== null){
        console.log('error:' + err.message);
        this.clientSock.close();
      }

      console.log('UDP message sent to ' + this.remoteIP +':'+ this.remotePort);
    })

    return 'success'; // a bit jank
  }

  setWindow(windowWebContents){
    this.webContents = windowWebContents;
    console.log("updating window");
    console.log(windowWebContents);
  }
}

module.exports = { UdpComms };