let dgram = require('dgram')

// Import the necessary Node modules.
const nodePath = require('path');
const { json } = require('stream/consumers');

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
    console.log("constructing new UDP class");

    this.localIP = '172.20.10.7';
    this.listeningPort = '52113';

    this.remoteIP = '172.20.10.5';
    this.remotePort = '1883';

    this.initializeUDPListener(); //intialize listener
  }

  changeUDPListener(newIp, newPort){
    this.localIP = newIp;
    this.listeningPort = newPort;

    this.initializeUDPListener();
  }

  // declare and instantiate listener socket
  initializeUDPListener(){
    if(this.clientSock){
      this.clientSock.close();
    }
    console.log('initialize udp listener');
    this.clientSock = dgram.createSocket('udp4');

    this.clientSock.on('listening', () => {
      let address = this.clientSock.address();
      console.log('UDP Server listening on ' + address.address + ':' + address.port);
    });

    this.clientSock.on('message', this.messageHandler);

    this.clientSock.bind(this.listeningPort, this.localIP, err => {
      if(err){
        console.log("Error while initializing UDP listener");
        console.log(err);
      } else {
        console.log("UDP listener initialized!");
      }
    });
  }

  messageHandler(message, remote){
    console.log("Received message from " + remote.address + ':' + remote.port +' - ' + message);
    // send to renderer

    // appMainWindow.get().webContents.send('asynchronous-reply', 'received udp message:' + message);

    let channel  = codeToChannel[message.toString()[0]];

    if(!channel) channel = 'received-udp-message';

    appMainWindow.get().webContents.send(channel.toString(), JSON.stringify({
      message:message.toString().slice(1), //remove first bit
      ip: remote.address,
      port: remote.port
    }));
  }

  sendUDPMessage(message){
    let sender = dgram.createSocket('udp4');

    let bufferMessage = new Buffer(message);

    // appMainWindow.get().webContents.send('asynchronous-reply', 'sending udp message');

    sender.send(bufferMessage, 0, bufferMessage.length, this.remotePort, this.remoteIP, (err, bytes) => {
      if(err !== null){
        console.log('error:' + err.message);
        sender.close();
        return "fail";
        // throw err;
      }
      console.log('UDP message sent to ' + this.remoteIP +':'+ this.remotePort);
      sender.close();
      return "success"; // message to relay back to renderer
    })

    return "success"; // a bit jank
  }

  setWindow(windowWebContents){
    this.webContents = windowWebContents;
    console.log("updating window");
    console.log(windowWebContents);
  }
}

module.exports = { UdpComms };