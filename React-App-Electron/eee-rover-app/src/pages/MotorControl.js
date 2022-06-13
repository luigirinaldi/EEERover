import React from 'react';
import PageContainer from './PageContainer';
import ArrowControl from '../components/ArrowControl';

import { IpContext } from '../context/ip-context';
import '../css/motorControl.css';
import { DebugOutput, ResponseElement } from '../components/DebugOutput';


const directionToCode = {
  'up':1,
  'left':4,
  'down':2,
  'right':3,
  'clockwise':5,
  'anticlockwise':6,
  'stop':0,
}

const keyToDirection = {
  'w': 'up',
  'a': 'left',
  's': 'down',
  'd': 'right',
  'e': 'clockwise',
  'q': 'anticlockwise',
  ' ': 'stop',
  'r': 'sped',
  'f': 'slow',
}

const MIN_DIFFERENCE = 0.03;
const ZERO_BOUNDARY = 0.08;
const MIN_SPED = 0;
const MAX_SPED = 255;
const CONTROLLER_POLLING_RATE = 150; // in milliseconds 

class DiscreteControl extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dir: 0,
      sped: 255,
    };

    // not using state becasue it re-renders the page and is slow
    this.dir = 0;
    this.sped = 255;

    this.prevKey = ''; // use to only execute one thing per keypress

    //measure time taken for request to get response
    this.startDate = new Date();
    this.endDate = new Date();

    this.destinationIP = props.roverIP;
    this.destinationURL = "http://" + props.roverIP + "/";

    // not sure if all of this is needed
    this.handleDirectionChange = this.handleDirectionChange.bind(this);
    this.testConnection = this.testConnection.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
    this.move = this.move.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.gamepad && this.props.gamepad){
      let prevGamepad = prevProps.gamepad;
      let prevDirection = {
        'up': prevGamepad.buttons[12].pressed,
        'left':prevGamepad.buttons[14].pressed,
        'down':prevGamepad.buttons[13].pressed,
        'right':prevGamepad.buttons[15].pressed,
        'clockwise':prevGamepad.buttons[1].pressed, //B button because the bumpers are broken on my controller
        'anticlockwise':prevGamepad.buttons[2].pressed, //X
      }

      let newGamepad = this.props.gamepad;
      let newDirection = {
        'up': newGamepad.buttons[12].pressed,
        'left':newGamepad.buttons[14].pressed,
        'down':newGamepad.buttons[13].pressed,
        'right':newGamepad.buttons[15].pressed,
        'clockwise':newGamepad.buttons[1].pressed, //B button because the bumpers are broken on my controller
        'anticlockwise':newGamepad.buttons[2].pressed, //X
      }

      let isFalse = false;
      let isDifferent = false;
      let multipleDifferences = false;
      let newDir;

      for (let key in newDirection) {
        isFalse = isFalse || newDirection[key];
        if(newDirection[key] ? !prevDirection[key] : prevDirection[key]){ // XOR
          if(isDifferent) multipleDifferences = true;
          isDifferent = true;
          newDir = key;
        }
      }
      
      // console.log(isDifferent);

      // if the two differ by more than one than stop the rover
      if(multipleDifferences) {
        this.dir = 0;
        this.sped = 0;
        this.move();
      } else {
        if(isDifferent){
          if(!isFalse) { //all zeros therefore stop
            console.log("all zeros")
            this.dir = 0;
            this.sped = 0;
            this.move();
          } else {
            console.log(newDir)
            this.dir = directionToCode[newDir];
            this.sped = 255;
            this.move();
          }
        } else {
          return;
        }
      }

    } else if (this.props.gamepad) {
      // gamepad has just connected, do nothing
    } else if (prevProps.gamepad) {
      // gamepad has been disconnected, stop the rover:
      this.dir = 0;
      this.sped = 0;
      this.move();
    } else {
      // component updating where gamepad is not defined
    }
  }

  move(){
    if(this.dir < 7 && this.sped < 256 && this.sped >= 0){

      // message to control motors encoded in J__A___B format
      let msg = 'J' + String(this.dir).padStart(2, '0') + 'A' + String(this.sped).padStart(3, '0') + 'B';
      console.log(msg);

      this.startDate = new Date();
      fetch(this.destinationURL + "move", {
        method: 'POST',
        body: msg,
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
    } else {
      console.log("Incorrect movement values")
    }
  }

  updateResponse(response){
    this.endDate = new Date(); //not very accurate but other methods break the response stuff
    let elapsedTime = (this.endDate - this.startDate)/1000;
    let time = this.endDate.getHours() + ":" + this.endDate.getMinutes() + ":" + this.endDate.getSeconds();
    this.props.responseDataFunc(time, elapsedTime, response);
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

  handleDirectionChange(direction){
    this.dir = directionToCode[direction];
    // this.setState({dir: directionToCode[direction]});
    console.log("Going " + direction + " New dir: " + directionToCode[direction] + " from " + this.dir);
    this.move();
  }

  handleKeyUp(e){
    if(Object.keys(keyToDirection).includes(e.key)){
      let direction = keyToDirection[e.key];
      if(direction !== 'sped' && direction !== 'slow') {
        this.dir = 0;
        this.move();
      } else{
        this.move();
      }
    }
  }

  handleKeyDown(e){
    if(Object.keys(keyToDirection).includes(e.key)){
      let direction = keyToDirection[e.key];
      // check if key pressed is part of the available ones 

      if(direction === 'sped' || direction === 'slow'){
        if(this.sped <= 253){
          if(direction === 'sped') this.sped += 2;
        } 
        if (this.sped >= 2) {
          if(direction === 'slow') this.sped -= 2;
        }
        console.log("Updating Sped. " + this.dir + " " + this.sped);
        // this.move();
      } else if (directionToCode[direction] !== this.dir) {
        this.dir = directionToCode[direction];
        this.move();
        console.log("Moving " + this.dir);
        this.prevKey = e.key;
      }
    }
  }

  render(){
    return(
      <div onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}> 
        <ArrowControl clickHandler={this.handleDirectionChange}/>
        <button onClick={this.testConnection} >
          Test Connection
        </button>
      </div>
    );
  }
}


// J + Rotation (0 stop 1 clockwise 2 anti clockwise) + motion 1 (forward 1, back 2, stop 0) + motion 2 (right 3, left 4, stop 0) + A + motion 1 sped + motion 2 sped + rotating sped + B

//using gamepads API
class AnalogueControl extends React.Component {

  constructor(props){
    super(props);

    this.vectors = {
      rightStick: {X: 0, Y: 0},
      leftStick: {X: 0, Y: 0},
      rightVector: {magnitude: 0, angle: 0},
      leftVector: {magnitude: 0, angle: 0},
    }

    this.stopped = true;

    //measure time taken for request to get response
    this.startDate = new Date();
    this.endDate = new Date();

    this.destinationIP = props.roverIP;
    this.destinationURL = "http://" + props.roverIP + "/";

    this.move = this.move.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
    this.stop = this.stop.bind(this);
  }

  getVector(polarCoords){
    return {
      magnitude: Math.sqrt(Math.pow(polarCoords.X,2) + Math.pow(polarCoords.Y,2)),
      angle: Math.atan(polarCoords.Y/polarCoords.X),
    }
  }

  getSped(polarCoords){
    return {
      X: (polarCoords.X * (MAX_SPED - MIN_SPED)) + (polarCoords.X < 0 ? -MIN_SPED: MIN_SPED),
      Y: (polarCoords.Y * (MAX_SPED - MIN_SPED)) + (polarCoords.Y < 0 ? -MIN_SPED: MIN_SPED),
    }
  }

  componentDidUpdate(prevProps){
    let newGamepad = this.props.gamepad;

    let rightStick = {
      X: newGamepad.axes[2],
      Y: -newGamepad.axes[3],
    }
    
    let leftStick = {
      X: newGamepad.axes[0],
      Y: -newGamepad.axes[1],
    }

    let leftVector = this.getVector(leftStick);
    let rightVector = this.getVector(rightStick);

    if(Math.abs(rightStick.X) < ZERO_BOUNDARY && Math.abs(leftVector.magnitude) < ZERO_BOUNDARY) {
      // withing zero boundary therfore stop
      if(!this.stopped){
        console.log("stopping");
        this.stop();
        this.stopped = true;

        // set all vectors to zero
        rightStick = {X: 0, Y: 0}
        leftStick = {X: 0, Y: 0}
        rightVector = {magnitude: 0, angle: 0}
        leftVector = {magnitude: 0, angle: 0}
      }
    } else {
      this.move(rightStick, leftStick, leftVector);
    }

    this.vectors = {
      rightStick: rightStick,
      leftStick: leftStick,
      rightVector: rightVector,
      leftVector: leftVector,
    };
  }

  move(right, left, leftV){
    let oldLeftV = this.vectors.leftVector;
    let oldRight = this.vectors.rightStick;
    let oldLeft = this.vectors.leftStick;

    // let { X, Y } = oldLeftV.magnitude < ZERO_BOUNDARY ? 0 : this.getSped(this.vectors.leftStick);
    // let rotation = this.getSped(oldRight).X < ZERO_BOUNDARY ? 0 : this.getSped(oldRight).X;

    let  X = 0; 
    let Y = 0;
    let rotation = 0;

    let changingDirection = false;

    if (Math.abs(leftV.magnitude) < ZERO_BOUNDARY){
      X = 0;
      Y = 0;
    } else {
      if (Math.abs(oldLeftV.magnitude - leftV.magnitude) > MIN_DIFFERENCE || Math.abs(oldLeftV.angle - leftV.angle) > MIN_DIFFERENCE) {
        changingDirection = true;
        X = this.getSped(left).X;
        Y = this.getSped(left).Y;
      } else {
        X = this.getSped(oldLeft).X;
        Y = this.getSped(oldLeft).Y;
      }

    }

    if (Math.abs(right.X) < ZERO_BOUNDARY){
      rotation = 0;
    } else {
      if (Math.abs(oldRight.X - right.X) > MIN_DIFFERENCE){
        changingDirection = true;      
        rotation = this.getSped(right).X;
      } else {
        rotation = this.getSped(oldRight).X;
      }
    }

    if(changingDirection){
      this.stopped = false;
      // J + Rotation (0 stop 1 clockwise 2 anti clockwise) + motion 1 (forward 1, back 2, stop 0) + motion 2 (right 3, left 4, stop 0) + A + motion 1 sped + motion 2 sped + rotating sped + B
      console.log("Changing direction");
      let msg = 'J' + (rotation < 0 ? '2' : '1') + (Y < 0 ? '2' : '1') +  (X < 0 ? '4' : '3');
      Y = Math.abs(Math.round(Y));
      X = Math.abs(Math.round(X));
      rotation = Math.abs(Math.round(rotation));
      msg += 'A' + String(Y).padStart(3, '0') + String(X).padStart(3, '0') + String(rotation).padStart(3, '0') + 'B';

      // console.log(msg);
      this.sendPostRequest(msg);
    }
  }

  stop(){
    this.sendPostRequest("J000A000000000B"); // stop message)
  }

  sendPostRequest(msg){
    this.startDate = new Date();
    fetch(this.destinationURL + "move", {
      method: 'POST',
      body: msg,
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

  updateResponse(response){
    this.endDate = new Date(); //not very accurate but other methods break the response stuff
    let elapsedTime = (this.endDate - this.startDate)/1000;
    let time = this.endDate.getHours() + ":" + this.endDate.getMinutes() + ":" + this.endDate.getSeconds();
    this.props.responseDataFunc(time, elapsedTime, response);
  }

  render(){
    const { rightStick, leftStick, rightVector, leftVector } = this.vectors;
    return(
      <>
        <h4>Right stick</h4>
        <p>X: {rightStick.X} <br /> Y: {rightStick.Y}</p>
        <p>M: {rightVector.magnitude} <br /> A: {rightVector.angle}</p>
        <h4>Left stick</h4>
        <p>X: {leftStick.X} <br /> Y: {leftStick.Y}</p>
        <p>M: {leftVector.magnitude} <br /> A: {leftVector.angle}</p>
      </>
    )
  }
}

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