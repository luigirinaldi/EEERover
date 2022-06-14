let dgram = require('dgram')

// Import the necessary Node modules.
const nodePath = require('path');
const { json } = require('stream/consumers');

// Import the necessary Application modules.
const appMainWindow = require(nodePath.join(__dirname, '../main-window'));

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

    appMainWindow.get().webContents.send('asynchronous-reply', 'received udp message' + message);

    // appMainWindow.get().webContents.send('received-udp-message', {
    //   address: remote.address,
    //   port: remote.port,
    //   message: message
    // })

    appMainWindow.get().webContents.send('received-udp-message', JSON.stringify({
      message:message.toString(),
      ip: remote.address,
      port: remote.port
    }));
  }

  sendUDPMessage(message){
    let sender = dgram.createSocket('udp4');

    let bufferMessage = new Buffer(message);

    appMainWindow.get().webContents.send('asynchronous-reply', 'sending udp message');

    sender.send(bufferMessage, 0, bufferMessage.length, this.remotePort, this.remoteIP, (err, bytes) => {
      if(err){
        console.log('error:' + err.message);
        // throw err;
      }
      console.log('UDP message sent to ' + this.remoteIP +':'+ this.remotePort);
      sender.close();
      return err ? "fail" : "success"; // message to relay back to renderer
    })
  }

  setWindow(windowWebContents){
    this.webContents = windowWebContents;
    console.log("updating window");
    console.log(windowWebContents);
  }
}

module.exports = { UdpComms };