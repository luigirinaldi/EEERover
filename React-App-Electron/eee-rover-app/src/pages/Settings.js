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
    };

    this.handleRoverIPChange = this.handleRoverIPChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleRoverIPChange(event) {
    this.setState({roverIP: event.target.value});
  }

  handleRoverPortChange(event) {
    this.setState({roverPort: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("Updating IP to: " + this.state.roverIP);
    this.props.updateIpFunc(this.state.roverIP); //update global context of IP
 
    // set values for UDP object
    ipcRenderer.invoke('change-udp-settings', {
      listeningPort: '52113',
      remoteIP: this.state.roverIP,
      remotePort: '1883'
    })
  }

  render() {
    const { currentRoverIp} = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Change rover IP from {currentRoverIp} to:
          <input type="text" value={this.state.roverIP} onChange={this.handleRoverIPChange} placeholder="Enter new IP"/>
          <br />
          {/* Change rover udp port to:
          <input type="text" value={this.state.roverPort} onChange={this.handleChange} placeholder="Enter new port"/> */}
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const Settings = () => {
  return (
    
    <PageContainer title="settings">     
      <IpContext.Consumer>
        {({roverIP, changeIP}) => (  
          <IpInputBox updateIpFunc={changeIP} currentRoverIp={roverIP}/>
        )}
      </IpContext.Consumer>
    </PageContainer>
      
  );
};
  
export default Settings;