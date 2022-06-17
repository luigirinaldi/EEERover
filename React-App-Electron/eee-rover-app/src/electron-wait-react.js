const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 5000;

// NOTE: Foreman will offset the port number by 100 for processes of different types. (See here.) 
// So, electron-wait-react.js subtracts 100 to set the port number of the React dev server correctly.

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
        client.end();
        if(!startedElectron) {
            console.log('starting electron');
            startedElectron = true;
            const exec = require('child_process').exec;
            exec('npm run electron');
        }
    }
);

console.log("port is:" + port);
tryConnection();

client.handle('error', (error) => {
    setTimeout(tryConnection, 1000);
});