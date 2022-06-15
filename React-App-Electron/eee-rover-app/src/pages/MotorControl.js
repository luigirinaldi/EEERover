import React from 'react';
import PageContainer from './PageContainer';

import { IpContext } from '../context/ip-context';
import '../css/motorControl.css';
import { DebugOutput, ResponseElement } from '../components/DebugOutput';
import { DiscreteControl, AnalogueControl } from '../components/MotorControlComponents';



const CONTROLLER_POLLING_RATE = 50; // in milliseconds 
class MotorControl extends React.Component {

  constructor(props){
    super(props)
    
    this.state = {
      controllerAvailable: false,
      responseMessage: [], //array of ResponseElements
    }


    // timing the requests 
    this.endDate = new Date();
    this.startDate = new Date();

    this.updateResponse = this.updateResponse.bind(this);
    this.sendCode = this.sendCode.bind(this);
    this.testConnection = this.testConnection.bind(this);
  }

  sendCode(code){
    // send post request to arduino
    this.startDate = new Date();
    fetch(this.destinationURL + "move", {
        method: 'POST',
        body: code,
        headers: {"Content-Type": "text/plain"},
        mode: 'cors',
        Host: `http://${window.location.host}/`,
        Origin: this.destinationURL,
      })
      .then(response => response.text())
      .then(data => this.updateResponse(data))
      .catch((error) => {
        console.error('Error:', error);
    });
  }

  testConnection(){    
    this.startDate = new Date();
    fetch(this.destinationURL, {
      method: 'GET',
      mode: 'cors',
      Host: `http://${window.location.host}/`,
      Origin: this.destinationURL,
    })
    .then(response => response.text())
    .then(data => this.updateResponse(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  updateResponse(message){
    this.endDate = new Date(); //not very accurate but other methods break the response stuff
    let elapsedTime = (this.endDate - this.startDate)/1000;
    let time = this.endDate.getHours() + ":" + this.endDate.getMinutes() + ":" + this.endDate.getSeconds();

    // appending to response container
    this.setState({ 
      responseMessage: [ <ResponseElement time={time} timeTaken={elapsedTime} msg={message}/>, ...this.state.responseMessage] 
    })
  }

  componentDidMount() {
    // set the destination url here becasue context is not yet defined in constructor
    this.destinationURL = "http://" + this.context.roverIP + "/";

    this.gamepadTimer = setInterval(() => {
      const gamepad = navigator.getGamepads()[0]; // use the first gamepad

      if(gamepad){
        this.gamepad = gamepad;

        this.setState({
          controllerAvailable: true,
          controllerID: gamepad.id,
        });

      } else {
        this.setState({controllerAvailable: false});
      }
    }, CONTROLLER_POLLING_RATE); //repeat every 100 milliseconds
  }

  componentWillUnmount() {
    clearInterval(this.gamepadTimer);
  }

  render(){
  const { roverIP } = this.context;

  return(            
    <PageContainer title="Motor Control">   
      <div className='Grid-Container'>
        <div className='row1'>
          <DiscreteControl 
            sendCode={this.sendCode}
            testConnection={this.testConnection}
            gamepad={this.gamepad}
          />
          <>
            <h3>Analogue Control</h3>
            {this.state.controllerAvailable ? 
              <>
                <p>Controller Connected!</p>
                <p>ID: {this.state.controllerID}</p>
                <AnalogueControl 
                  sendCode={this.sendCode}
                  testConnection={this.testConnection}
                  gamepad={this.gamepad}
                />
              </>
              : 
              <p>Press a button on the controller</p>
            }
          </>
        </div>
        {/* TODO, add clear output button */}
        <div className='row2'> 
          <DebugOutput Title="Arduino Responses" IP={roverIP}>
            {this.state.responseMessage}
          </DebugOutput>
        </div>
        <div className='row3'>

        </div>
      </div>
    </PageContainer>     
  )}
}

MotorControl.contextType = IpContext; //set the context to access global IP var
  
export default MotorControl;