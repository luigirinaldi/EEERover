import React from 'react';
import PageContainer from './PageContainer';
import { IpContext } from '../context/ip-context';


class IpInputBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("Updating IP to: " + this.state.value);
    this.props.updateIpFunc(this.state.value); //update global context of IP
  }

  render() {
    const { currentIp } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Change IP from {currentIp} to:
          <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Enter new IP"/>
        </label>
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
            {({roverIP, changeIP}) => (  
              <IpInputBox updateIpFunc={changeIP} currentIp={roverIP} />
            )}
          </IpContext.Consumer>
        </PageContainer>
      
  );
};
  
export default Settings;