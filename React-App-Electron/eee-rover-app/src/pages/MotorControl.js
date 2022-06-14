import React from 'react';
import PageContainer from './PageContainer';

import { IpContext } from '../context/ip-context';
import '../css/motorControl.css';
import { DebugOutput, ResponseElement } from '../components/DebugOutput';


const CONTROLLER_POLLING_RATE = 150; // in milliseconds 

class MotorControl extends React.Component {

  constructor(props){
    super(props)
    
    this.state = {
      controllerAvailable: false,
      responseMessage: [], //array of ResponseElements
    }

    this.updateResponse = this.updateResponse.bind(this)
  }

  updateResponse(time, timeTaken, message){
    // appending to response container
    this.setState({ 
      responseMessage: [ <ResponseElement time={time} timeTaken={timeTaken} msg={message}/>, ...this.state.responseMessage] 
    })
  }

  componentDidMount() {
    this.gamepadTimer = setInterval(() => {
      const gamepad = navigator.getGamepads()[0]; // use the first gamepad

      if(gamepad){
        this.gamepad = gamepad;

        this.setState({
          controllerAvailable: true,
          controllerID: gamepad.id,
          gamepad: gamepad,
        });

        this.rightStick = {
          X: gamepad.axes[2],
          Y: gamepad.axes[3],
        }
        
        this.leftStick = {
          X: gamepad.axes[0],
          Y: gamepad.axes[1],
        }
      } else {
        this.setState({controllerAvailable: false});
      }
      // console.log(`Left stick at (${myGamepad.axes[0]}, ${myGamepad.axes[1]})` );
      // console.log(`Right stick at (${myGamepad.axes[2]}, ${myGamepad.axes[3]})` );
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
          <DiscreteControl roverIP={roverIP} responseDataFunc={this.updateResponse} gamepad={this.gamepad}/>
          <>
            <h3>Analogue Control</h3>
            {this.state.controllerAvailable ? 
              <>
                <p>Controller Connected!</p>
                <p>ID: {this.state.controllerID}</p>
                <AnalogueControl roverIP={roverIP} responseDataFunc={this.updateResponse} gamepad={this.gamepad}/>
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