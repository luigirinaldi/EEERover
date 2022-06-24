import React from 'react';
import PageContainer from './PageContainer';
import { IpContext } from '../context/ip-context';
import '../css/motorControl.css';
import { DebugOutput, ResponseElement } from '../components/DebugOutput';
import { DiscreteControl, AnalogueControl } from '../components/MotorControlComponents';

// to interact with main process
const electron = window.require('electron');
const { ipcRenderer } = electron;

const CONTROLLER_POLLING_RATE = 150; // in milliseconds

export class MotorControlSection extends React.Component {
  //to time how long each udp requests takes:
  // the code sent is saved with the start time of the request 
  // upon receiving udp packet code is compared and time taken is found
  
  constructor(props){
    super(props)
    
    this.state = {
      controllerAvailable: false,
      responseMessage: [], //array of ResponseElements
    }

    // timing the requests 
    this.endDate = new Date();
    this.startDate = new Date();

    // this.updateResponse = this.updateResponse.bind(this);
    this.sendCode = this.sendCode.bind(this);
    this.testConnection = this.testConnection.bind(this);
  }

  async componentWillUnmount(){
    ipcRenderer.removeAllListeners();
    clearInterval(this.gamepadTimer);
  }

  async sendCode(code){
    // movement code therefore prefixed by m
    let msg = code;
    let startDate = new Date();
    console.log(JSON.stringify({type: "move", transmission: "sending", data: msg, time: startDate}));
    let arg = JSON.stringify({type: "move", transmission: "sending", data: msg, time: startDate});
    let udpStatus = await ipcRenderer.invoke('send-udp-message', arg);
    console.log(udpStatus);
  }

  testConnection(){    
    let msg = '';
    let startDate = new Date();
    let udpStatus = ipcRenderer.invoke('send-udp-message', JSON.stringify({type: "test", transmission: "sending", data: msg, time: startDate}));
    
    console.log(udpStatus);
    if(udpStatus === 'fail'){
      console.log('Failed connection test');
    } else if (udpStatus === 'success'){
      console.log("test");
      this.sentTestMessages.push(startDate);
    } 
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


  render(){
  const { roverIP } = this.context;

  return(            
    <>
      <DiscreteControl 
        sendCode={this.sendCode}
        testConnection={this.testConnection}
        gamepad={this.gamepad}
      />
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
  )}
}

MotorControlSection.contextType = IpContext; //set the context to access global IP var
export class MotorControl extends React.Component {


  render(){
    const { roverIP } = this.context;

  return(            
    <PageContainer title="Motor Control UDP">   
      <div className='Grid-Container'>
        <div className='row1'>
          <MotorControlSection />
        </div>
        {/* TODO, add clear output button */}
        <div className='row2'> 
          <DebugOutput Title="Arduino Responses" IP={roverIP} types={['move','test','error']}/>
        </div>
        <div className='row3'> 
          <DebugOutput Title="Arduino Responses" IP={roverIP} types={['data']}/>
        </div>
      </div>
    </PageContainer>     
  )}
}

MotorControl.contextType = IpContext; //set the context to access global IP var
  