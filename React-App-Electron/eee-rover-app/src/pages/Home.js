import React from 'react';
import PageContainer from './PageContainer';

class WebSocketTesting extends React.Component {

  // new instance of websocket
  ws = new WebSocket('ws://192.168.0.16:81/');

  componentDidMount() {
    this.ws.onopen = () => {
    // on connecting, do nothing but log it to the console
    console.log('connected')
    }

    this.ws.onmessage = evt => {
    // listen to data sent from the websocket server
    const message = JSON.parse(evt.data)
    this.setState({dataFromServer: message})
    console.log(evt)
    }

    this.ws.onclose = () => {
    console.log('disconnected')
    // automatically try to reconnect on connection loss

    }
  }

  render() // websocket can be passed to child element as this.ws
  {
    return (
    <h2> 
      Web Sock
    </h2>
  )}
}

const Home = () => {
  return (
    <PageContainer>
      <div>
        <h1>Home Page</h1>
        <WebSocketTesting />
      </div>
    </PageContainer>
  );
};
  
export default Home;