import React, { Component } from "react";
const electron = window.require('electron');
const { ipcRenderer } = electron;

export class RockData extends Component{

  constructor(props){
    super(props);

    this.state = {Rockdata: {
      RadioModulating_30: ['false', 0],
      RadioModulating_44: ['false', 0],
      RadioCarrier_151: ['false', 0],
      RadioCarrier_239: ['false', 0],
      Acoustic: ['false', 0],
      Magnetic: ['false', 0],
      Infrared: ['false', 0],
      radioMo_total_30: 0,
      radioMo_total_44: 0,
      radioCar_total_151: 0,
      radioCar_total_239: 0,
      acoustic_total: 0,
      magnetic_total: 0,
      infrared_total: 0,
    }}

    this.laststates = [];

    this.handleMessage = this.handleMessage.bind(this);
  }

  componentDidMount(){
    ipcRenderer.on('received-udp-message', this.handleMessage);
  }

  handleMessage(event, args, props) {
    let message = JSON.parse(args);
    if (message.type === 'data'){
      let newState = {
        RadioModulating_30: ['false', 0],
        RadioModulating_44: ['false', 0],
        RadioCarrier_151: ['false', 0],
        RadioCarrier_239: ['false', 0],
        Acoustic: ['false', 0],
        Magnetic: ['false', 0],
        Infrared: ['false', 0],
        radioMo_total_30: 0,
        radioMo_total_44: 0,
        radioCar_total_151: 0,
        radioCar_total_239: 0,
        acoustic_total: 0,
        magnetic_total: 0,
        infrared_total: 0,
      };

      if ((parseInt(message.message.substring(7, 9)) >= 25 && parseInt(message.message.substring(7,9)) <= 35)){
        newState.RadioModulating_30[0] = 'true';
        newState.RadioModulating_30[1] = message.message.substring(7,9);

        if ((parseInt(message.message.substring(2, 5)) >= 135 && parseInt(message.message.substring(2,5)) <= 200)){
          newState.RadioCarrier_151[0] = 'true';
          newState.RadioCarrier_151[1] = message.message.substring(2,5);
        }else if ((parseInt(message.message.substring(2, 5)) >= 225 && parseInt(message.message.substring(2,5)) <= 265)){
          newState.RadioCarrier_239[0] = 'true';
          newState.RadioCarrier_239[1] = message.message.substring(2,5);
        }

      }
      else if(parseInt(message.message.substring(7, 9)) >= 39 && parseInt(message.message.substring(7,9)) <= 49){
        newState.RadioModulating_44[0] = 'true';
        newState.RadioModulating_44[1] = message.message.substring(7,9);  
      }
        if ((parseInt(message.message.substring(2, 5)) >= 135 && parseInt(message.message.substring(2,5)) <= 200)){
          newState.RadioCarrier_151[0] = 'true';
          newState.RadioCarrier_151[1] = message.message.substring(2,5);
        }else if ((parseInt(message.message.substring(2, 5)) >= 225 && parseInt(message.message.substring(2,5)) <= 265)){
          newState.RadioCarrier_239[0] = 'true';
          newState.RadioCarrier_239[1] = message.message.substring(2,5);
        }

      // console.log(parseInt(message.message.substring(2,5)));
      // console.log(newState.RadioModulating[0]);

      if ((parseInt(message.message.substring(11, 14)) >= 348 && parseInt(message.message.substring(11,14)) <= 358) || parseInt((message.message.substring(11, 14)) >= 566 && parseInt(message.message.substring(11,14)) <= 576)){
        newState.Infrared[0] = 'true';
        newState.Infrared[1] = message.message.substring(11,14);
      }

      if (parseInt(message.message.substring(16, 18)) > 0){
        newState.Acoustic[0] = 'true';
        newState.Acoustic[1] = message.message.substring(16,18);
      }

      if ((parseInt(message.message.substring(33,39)) >= 90) || (parseInt(message.message.substring(33,39)) >x 90 && )){
        newState.Magnetic[0] = 'true';
        newState.Magnetic[1] = message.message.substring(34,39);
      }

      if(this.laststates.length >= 5){
        for(let i =0; this.laststates.length > i; i++){
          // console.log(this.laststates[i].RadioModulating[0]);
          if(this.laststates[i].RadioModulating_30[0] === 'true'){
            newState.radioMo_total_30++;
          }

          if(this.laststates[i].RadioModulating_44[0] === 'true'){
            newState.radioMo_total_44++;
          }

          if(this.laststates[i].RadioCarrier_151[0] === 'true'){
            newState.radioCar_total_151++;
          }
          
          if(this.laststates[i].RadioCarrier_239[0] === 'true'){
            newState.radioCar_total_239++;
          }

          if(this.laststates[i].Acoustic[0] === 'true'){
            newState.acoustic_total++;
          }

          if(this.laststates[i].Magnetic[0] === 'true'){
            newState.magnetic_total++;
          }

          if(this.laststates[i].Infrared[0] === 'true'){
            newState.infrared_total++;
          }

        }
        this.laststates.splice(0,1);
      }

      this.laststates.push(newState);

      // console.log(newState);
      // console.log(this.laststates);

      this.setState(
        {Rockdata: newState}
      );
    }
 }

  componentWillUnmount(){
    ipcRenderer.removeAllListeners();
  }

  render(){
    return (
      <div>
        <p>Modulating Radio: </p>
        <p>Active: {this.state.Rockdata.RadioModulating_30[0]} Value: {this.state.Rockdata.RadioModulating_30[1]}</p>
        <p>Carrier Radio: </p>
        <p>Active: {this.state.Rockdata.RadioCarrier_151[0]} Value: {this.state.Rockdata.RadioCarrier_151[1]}</p>
        <p>Infrared: </p>
        <p>Active: {this.state.Rockdata.Infrared[0]} Value: {this.state.Rockdata.Infrared[1]}</p>
        <p>Acoustic: </p>
        <p>Active: {this.state.Rockdata.Acoustic[0]} Value: {this.state.Rockdata.Acoustic[1]}</p>
        <p>Magnetic: </p>
        <p>Active: {this.state.Rockdata.Magnetic[0]} Value: {this.state.Rockdata.Magnetic[1]}</p>
        <p>Running Averages:</p>
        <p>Modulating Radio 61k: {this.state.Rockdata.radioMo_total_30} Carrier Radio 151: {this.state.Rockdata.radioCar_total_151}</p>
        <p>Modulating Radio 89k: {this.state.Rockdata.radioMo_total_44} Carrier Radio 239: {this.state.Rockdata.radioCar_total_239}</p>

      </div>
    )
  }
}

