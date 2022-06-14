let dgram = require('dgram')
const { ipcMain
 } = require('electron');

class UdpComms {
  constructor(){
    console.log("constructing new UDP class");

    this.localIP = '172.20.10.2';
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

    this.clientSock = dgram.createSocket('udp4');

    this.clientSock.on('listening', () => {
      let address = this.clientSock.address();
      console.log('UDP Server listening on ' + address.address + ':' + address.port);
    });

    this.clientSock.on('message', this.messageHandler);

    this.clientSock.bind(this.listeningPort, this.localIP);
  }

  messageHandler(message, remote){
    console.log("Received message from " + remote.address + ':' + remote.port +' - ' + message);
    // send to renderer
    // if(this.window !== undefined){ //check if exists and if correct type
    // this.window.webContents.on('did-finish-load', () => {
    //   this.window.webContents.send('received-udp-message', {
    //     address: remote.address,
    //     port: remote.port,
    //     message: message
    //   });
    // });
  //   } else {
  //     console.log("Window is not defined");
  //   }

    // webContents.send('send-asynchronous-reply', 'received message')
  }

  sendUDPMessage(message, event){
    let sender = dgram.createSocket('udp4');

    let bufferMessage = new Buffer(message);

    sender.send(bufferMessage, 0, bufferMessage.length, this.remotePort, this.remoteIP, (err, bytes) => {
      if(err){
        console.log('error:');
        throw err;
      }
      console.log('UDP message sent to ' + this.remoteIP +':'+ this.remotePort);
      event.reply('udp-message-sent', 'success');
      sender.close();
    })
  }

  setWindow(windowWebContents){
    this.webContents = windowWebContents;
    console.log("updating window");
    console.log(windowWebContents);
  }
}

module.exports = { UdpComms };