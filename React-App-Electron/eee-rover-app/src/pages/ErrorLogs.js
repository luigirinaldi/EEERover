import React, { useContext } from 'react';
import { IpContext } from '../context/ip-context';
import PageContainer from './PageContainer';

const electron = window.require('electron');
const { ipcRenderer } = electron;
// const remote = electron.remote;
// const { os } = remote;

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(event);
  console.log(arg) // prints "pong"
})


const ErrorLogs = () => {  
  const { roverIP } = useContext(IpContext);

  return (
    <PageContainer title="Error Logs">
      <button onClick={() => {
        ipcRenderer.send('send-udp-message', {
          ip: roverIP,
          port: 33333,
          host: window.location.host,
          message: "test",
        });
      }}>
        Click me
      </button>
    </PageContainer>
  );
};
  
// ErrorLogs.contextType = IpContext;

export default ErrorLogs;