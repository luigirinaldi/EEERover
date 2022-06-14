import React, { useContext } from 'react';
import { IpContext } from '../context/ip-context';
import PageContainer from './PageContainer';

const electron = window.require('electron');
const { ipcRenderer } = electron;


const ErrorLogs = () => {  
  const { roverIP } = useContext(IpContext);

  return (
    <PageContainer title="Error Logs">
      <button onClick={() => {
        console.log(electron);
        console.log(ipcRenderer);
        ipcRenderer.send('send-udp-message', "mB00A000R");
      }}>
        Click me
      </button>
    </PageContainer>
  );
};


export default ErrorLogs;