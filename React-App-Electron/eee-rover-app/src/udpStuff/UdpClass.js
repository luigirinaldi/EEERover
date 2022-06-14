let dgram = require('dgram')

var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log(addresses);

class UdpComms {
  constructor(){
    console.log("constructing new UDP class");
    this.clientSock = dgram.createSocket('udp4');

    this.localIP = '172.20.10.2';
    this.listeningPort = '52113';

    this.clientSock.on('listening', () => {
      let address = this.clientSock.address();
      console.log('UDP Server listening on ' + address.address + ':' + address.port);
    });

    this.clientSock.on('message', (message, remote) => {
      console.log("message received from: " + remote.address + ':' + remote.port +' - ' + message);
    });

    this.clientSock.bind(this.listeningPort, this.localIP);
  }
}

module.exports = { UdpComms };