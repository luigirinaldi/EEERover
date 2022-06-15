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
class MotorControlUDP extends React.Component {
  //to time how long each udp requests takes:
    // the code sent is saved with the start time of the request 
    // upon receiving udp packet code is compared and time taken is found

  constructor(props){
    super(props)
    
    this.state = {
      controllerAvailable: false,
      responseMessage: [], //array of ResponseElements
    }

    this.sentCodes = []; //array of codes and start times
    this.sentTests = []; // array of start times

    // timing the requests 
    this.endDate = new Date();
    this.startDate = new Date();

    // this.updateResponse = this.updateResponse.bind(this);
    this.sendCode = this.sendCode.bind(this);
    this.testConnection = this.testConnection.bind(this);

    ipcRenderer.on('received-udp-message', (event, arg) => {
      // console.log(arg);
      let stopDate = new Date();
      let message = JSON.parse(arg);
      console.log(message);
      console.log("Received message from " + message.ip + ':' + message.port +' - ' + message.message);

      if(message.message[0] === 'J'){ // enough to check if it is a motor control message
        // TODO timing the request
      } else {
        this.addResponse(stopDate.toLocaleTimeString('it-IT'), '', message.message);
      }
    });

    ipcRenderer.on('received-test-message', (event, arg) => {
      // console.log(arg);
      let stopDate = new Date();
      let message = JSON.parse(arg);
      console.log("Received test message from " + message.ip + ':' + message.port +' - ' + message.message);
  
      console.log(this); //why is it undefined???
      if(this.sentTests.length > 0){
        let elapsedTime = (stopDate - this.sentTests.shift())/1000; //get first value and remove it
        this.addResponse(stopDate.toLocaleTimeString('it-IT'), elapsedTime, message.message);        
      } else {
        this.addResponse(stopDate.toLocaleTimeString('it-IT'), '', message.message);  
      }
    });   
  }


  componentWillUnmount(){
    ipcRenderer.removeAllListeners('received-udp-message');
    // ipcRenderer.removeListener('received-test-message', this.handleTestMessage);
    ipcRenderer.removeAllListeners('received-move-message');
    ipcRenderer.removeAllListeners('received-error-message');
    ipcRenderer.removeAllListeners('received-data-message');

    clearInterval(this.gamepadTimer);
  }

  sendCode(code){
    // movement code therefore prefixed by m
    let msg = 'm' + code;
    let udpStatus = ipcRenderer.sendSync('send-udp-message',msg);
    let startDate = new Date();

    if(udpStatus === 'fail'){
      console.log('Failed sending code: ' + msg);
    } else if (udpStatus === 'success'){
      this.sentCodes.push({code:code, startTime: startDate});
    }    
  }

  testConnection(){    
    let msg = 't'; //test connection message

    let udpStatus = ipcRenderer.sendSync('send-udp-message',msg);
    let startDate = new Date();
    console.log(udpStatus);

    if(udpStatus === 'fail'){
      console.log('Failed connection test');
    } else if (udpStatus === 'success'){
      this.sentTests.push(startDate);
    } 

    console.log(this.sentTests);
  }

  updateMotorResponse(message){
    this.endDate = new Date(); //not very accurate but other methods break the response stuff
    let elapsedTime = (this.endDate - this.startDate)/1000;
    let time = this.endDate.getHours() + ":" + this.endDate.getMinutes() + ":" + this.endDate.getSeconds();

    this.addResponse(time, elapsedTime, message);
  }

  addResponse(time, timeTaken, message){
    // appending to response container
    this.setState({ 
      responseMessage: [ <ResponseElement time={time} timeTaken={timeTaken} msg={message}/>, ...this.state.responseMessage] 
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


  render(){
  const { roverIP } = this.context;

  return(            
    <PageContainer title="Motor Control UDP">   
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

MotorControlUDP.contextType = IpContext; //set the context to access global IP var
  
export default MotorControlUDP;