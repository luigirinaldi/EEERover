import React from 'react';
import PageContainer from './PageContainer';
import ArrowControl from '../components/ArrowControl';
import { useContext } from 'react';
import { IpContext } from '../context/ip-context';

import '../css/motorControl.css';
import DebugOutput from '../components/DebugOutput';


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

class DiscreteControl extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dir: 0,
      sped: 255,
      requestResponse: "",
    };

    // not using state becasue it re-renders the page and is slow
    this.dir = 0;
    this.sped = 255;

    this.prevKey = ''; // use to only execute one thing per keypress

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

  componentDidMount() {
    this.myDiv.focus();
  }

  move(){
    if(this.dir < 7 && this.sped < 256 && this.sped >= 0){

      // message to control motors encoded in J__A___B format
      let msg = 'J' + String(this.dir).padStart(2, '0') + 'A' + String(this.sped).padStart(3, '0') + 'B';

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
    this.setState({requestResponse: response + this.state.requestResponse +  '\n'});
  }

  testConnection(){
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
    const { requestResponse } = this.state;
    return(
      <div onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} ref={ref => this.myDiv = ref}> 
        <ArrowControl clickHandler={this.handleDirectionChange}/>
        <button onClick={this.testConnection} >
          Test Connection
        </button>
        <h3>
          Responses from Arduino
        </h3>
        <div style={{whiteSpace: 'pre-wrap'}}>
          {requestResponse}
        </div>
      </div>
    );
  }
}


function MotorControl() {
  const { roverIP } = useContext(IpContext);
  return(            
    <PageContainer title="Motor Control">   
      <div className='Grid-Container'>
        <div className='row1'>
          <DiscreteControl roverIP={roverIP} />
        </div>
        <div className='row2'>
          {/* <p> Current Ip : {roverIP}</p>             */}
          <DebugOutput />
        </div>
        <div className='row3'>

        </div>
      </div>
    </PageContainer>     
  );
}
  
export default MotorControl;