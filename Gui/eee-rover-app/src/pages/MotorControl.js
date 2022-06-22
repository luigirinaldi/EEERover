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
class MotorControl extends React.Component {
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
    console.log(JSON.stringify({type: "motor", data: msg, time: startDate}));
    let arg = JSON.stringify({type: "motor", data: msg, time: startDate});
    let udpStatus = await ipcRenderer.invoke('send-udp-message', arg);
    console.log(udpStatus);
  }

  testConnection(){    
    let msg = '';
    let startDate = new Date();
    let udpStatus = ipcRenderer.invoke('send-udp-message', JSON.stringify({type: "test", data: msg, time: startDate}));
    
    console.log(udpStatus);
    if(udpStatus === 'fail'){
      console.log('Failed connection test');
    } else if (udpStatus === 'success'){
      console.log("test");
      this.sentTestMessages.push(startDate);
    } 
  }

  addResponse(time, timeTaken, message){
    // appending to response container
    this.setState({ 
      responseMessage: [ <ResponseElement time={time} timeTaken={timeTaken} msg={message}/>, ...this.state.responseMessage] 
    })
  }

  componentDidMount() {

    ipcRenderer.on('received-test-message', (event, arg) => {
      let stopDate = new Date();
      let message = JSON.parse(arg);

      // console.log("Received test message from " + message.ip + ':' + message.port +' - ' + message.message);
      if(this.sentTestMessages.length > 0){
        let elapsedTime = (stopDate - this.sentTestMessages.shift())/1000; //get first value and remove it
        this.addResponse(stopDate.toLocaleTimeString('it-IT'), elapsedTime, message.message);        
      } else {
        this.addResponse(stopDate.toLocaleTimeString('it-IT'), '', message.message);  
      }
    });   

    ipcRenderer.on('received-move-message', (event, arg) => {
      // console.log(arg);
      let stopDate = new Date();
      let message = JSON.parse(arg);
      console.log(this.sentMotorMessages.length);

      console.log("Received move message from " + message.ip + ':' + message.port +' - ' + message.message);
      
      if(this.sentMotorMessages.length > 0){
        let elapsedTime = ''; 

        for(let i = 0; i < this.sentMotorMessages.length; i++){
          if(this.sentMotorMessages[i].code === message.message){
            elapsedTime = (stopDate - this.sentMotorMessages[i].startTime)/1000; //get time
            this.sentMotorMessages.splice(i, 1); //remove element from array
            i = this.sentMotorMessages.length; //terminate loop
          } 
        }
      
        this.addResponse(stopDate.toLocaleTimeString('it-IT'), elapsedTime, message.message);        
      } else {
        this.addResponse(stopDate.toLocaleTimeString('it-IT'), '', message.message);  
      }
    });

    ipcRenderer.on('received-udp-message', (event, arg) => {
      // console.log(arg);
      let stopDate = new Date();
      let message = JSON.parse(arg);
      console.log(message);
      console.log("Received message from " + message.ip + ':' + message.port +' - ' + message.message);

      this.addResponse(stopDate.toLocaleTimeString('it-IT'), '', message.message);
    });

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
        </div>
        {/* TODO, add clear output button */}
        <div className='row2'> 
          <DebugOutput Title="Arduino Responses" IP={roverIP}>
            {this.state.responseMessage}
          </DebugOutput>
        </div>
      </div>
    </PageContainer>     
  )}
}

MotorControl.contextType = IpContext; //set the context to access global IP var
  
export default MotorControl;