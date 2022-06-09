import React from 'react';
import PageContainer from './PageContainer';
import ArrowControl from '../components/ArrowControl';

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
      let requestURL = this.destinationURL + "move?dir=" + this.dir + "&sped=" + this.sped;
      fetch(requestURL, {
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
        {'\n'}
        <button onClick={this.testConnection} >
          Test Connection
        </button>
        <h3>
          Responses from Arduino
        </h3>
        <div style={{whiteSpace: 'pre-wrap'}}>
          {requestResponse}
          {'\n'}
        </div>
      </div>
    );
  }
}

class MotorControl extends React.Component {

  // TODO add option to change IP
  constructor(props){
    super(props);
    this.state = {
      RoverIP: "172.20.10.2"
    };

    this.tmpRoverIP = "172.20.10.2";

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.tmpRoverIP = event.target.value;
  }

  handleSubmit(event) {
    console.log("Changing IP from " + this.state.RoverIP +" to " + this.tmpRoverIP);
    this.setState({RoverIP: this.tmpRoverIP});
    event.preventDefault();
  }

  render() {
    return(
      <PageContainer>
      <div>
        <h1>Motor Control</h1>
        <div>
          <form onSubmit={this.handleSubmit}>
            <strong>Set ip</strong>
            
            <textarea 
                value={this.state.tmpRoverIP}
                onChange={this.handleChange} />
              
            <input type="submit" value="Change IP" />
          </form>
        </div>
       
        <DiscreteControl roverIP={this.state.RoverIP} />
      </div>
    </PageContainer>
    );
  }
}
  
export default MotorControl;