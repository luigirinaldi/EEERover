import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// Contexts
import { IpContext } from './context/ip-context';
import { GamepadsProvider } from 'react-gamepads';

import Home from './pages/Home';
import Debug from './pages/Debug';
import ErrorLogs from './pages/ErrorLogs';
import MotorControl from './pages/MotorControl';
import Settings from './pages/Settings';

const electron = window.require('electron');
const { ipcRenderer } = electron;

// Page wide listener for messages coming from main process
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log("Main: " + arg) // prints "pong"
})


class App extends React.Component {

  constructor(props) {
    super(props);

    this.updateIP = (newRoverIP, newLocalIP) => {
      this.setState({
        roverIP: newRoverIP,
        localIP: newLocalIP
      });
    }

    this.state = {
      roverIP: "172.20.10.5",
      localIP: "172.20.10.2",
      changeIP: this.updateIP,
    };
  }

  render(){
    return (
        <Router>
          <Navbar />
          <GamepadsProvider>
          <IpContext.Provider value={this.state}>
            <Routes>
              <Route exact path='/' element={<Home/>} />
              <Route path='/Debug' element={<Debug/>} />
              <Route path='/MotorControl' element={<MotorControl/>} />
              <Route path='/ErrorLogs' element={<ErrorLogs/>} />
              <Route path='/Settings' element={<Settings/>} />
            </Routes>
          </IpContext.Provider>
          </GamepadsProvider>
        </Router>
    );
  }
}
  
export default App;
