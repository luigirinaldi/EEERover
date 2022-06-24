import React, { PureComponent } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

const electron = window.require('electron');
const { ipcRenderer } = electron;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const numDataPoints = 20;

export class MyChart extends PureComponent{
  
  constructor(props){
    super(props);
    this.options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: this.props.title,
        },
      },
    };

    this.graphId =  Math.random().toString();
    this.chartReference = React.createRef(null);

    this.state = {data:{
      labels: [],
      datasets: [
        {
          label: 'Dataset 1',
          data: [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    }};

    this.handleMessage = this.handleMessage.bind(this);
  }

  componentDidMount(){
    // console.log("adding listener");
    ipcRenderer.on('received-udp-message', this.handleMessage);
  }

  handleMessage(event, args, props) {
    // console.log(args);
    // console.log("test");
    let message = JSON.parse(args);
    if (message.type === 'data'){
      let currentState = this.state.data;
      console.log(currentState);
      // console.log(message.message.substring(26,32)); 

      if(currentState.datasets[0].data.length >= numDataPoints){
        currentState.labels.splice(0,1); //remove first element
        // console.log(currentState.labels);        
        currentState.datasets[0].data.splice(0,1);
        // console.log(currentState.datasets[0].data);
        // this.chartReference.current.update();
      }

      currentState.labels.push(new Date(message.time).toLocaleTimeString('it-IT'));
      currentState.datasets[0].data.push(parseInt(message.message.substring(this.props.startchar,this.props.endchar)));

      // console.log(currentState.labels);
      // console.log(currentState.datasets[0].data);

      this.setState(
        {data: currentState}
      );
      console.log(currentState);
      // 3 hours 
      if(this.chartReference.current){
        this.chartReference.current.update();
      }
    }
  }

  componentWillUnmount(){
    ipcRenderer.removeAllListeners();
  }

  render(){
    return <Line datasetIdKey={this.graphId} 
              redraw={true}
              options={this.options} 
              data={this.state.data} 
              ref={this.chartReference}
              height={"120%"}/>;
  }
}

