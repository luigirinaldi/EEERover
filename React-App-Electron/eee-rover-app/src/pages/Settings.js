import React from 'react';
import PageContainer from './PageContainer';
import { IpContext } from '../context/ip-context';

const electron = window.require('electron');
const { ipcRenderer } = electron;



class IpInputBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roverIP: '',
      roverPort: '',
      localIP: '',
    };

    this.handleRoverIPChange = this.handleRoverIPChange.bind(this);
    this.handleLocalIPChange = this.handleLocalIPChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleRoverIPChange(event) {
    this.setState({roverIP: event.target.value});
  }

  handleRoverPortChange(event) {
    this.setState({roverPort: event.target.value});
  }

  handleLocalIPChange(event) {
    this.setState({localIP: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("Updating IP to: " + this.state.roverIP);
    this.props.updateIpFunc(this.state.roverIP, this.state.localIP); //update global context of IP
 
    // set values for UDP object
    ipcRenderer.send('change-udp-settings', {
      localIP: this.state.localIP,
      listeningPort: '52113',
      remoteIP: this.state.roverIP,
      remotePort: '1883'
    })
  }

  render() {
    const { currentRoverIp, currentLocalIp } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Change rover IP from {currentRoverIp} to:
          <input type="text" value={this.state.roverIP} onChange={this.handleRoverIPChange} placeholder="Enter new IP"/>
          <br />
          {/* Change rover udp port to:
          <input type="text" value={this.state.roverPort} onChange={this.handleChange} placeholder="Enter new port"/> */}
          Change local IP from {currentLocalIp} to:
          <input type="text" value={this.state.localIP} onChange={this.handleLocalIPChange} placeholder="Enter new IP"/>
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const Settings = () => {
  return (
    
    <PageContainer title={Settings}>
      <div>
        <h1>Settings</h1>
      </div>        
      <IpContext.Consumer>
        {({roverIP, localIP, changeIP}) => (  
          <IpInputBox updateIpFunc={changeIP} currentRoverIp={roverIP} currentLocalIp={localIP} />
        )}
      </IpContext.Consumer>
    </PageContainer>
      
  );
};
  
export default Settings;