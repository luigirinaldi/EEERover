import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// Contexts
import { IpContext } from './context/ip-context';

import Home from './pages/Home';
import Debug from './pages/Debug';
import ErrorLogs from './pages/ErrorLogs';
import Settings from './pages/Settings';
import MotorControl from './pages/MotorControl';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class App extends React.Component {

  constructor(props) {
    super(props);

    this.updateIP = (newRoverIP, newLocalIP) => {
      this.setState({
        roverIP: newRoverIP,
      });
    }

    this.state = {
      roverIP: "172.20.10.5",
      changeIP: this.updateIP,
    };
  }

  componentDidMount(){
    // Page wide listener for messages coming from main process
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      console.log("Main: " + arg)
    })
  }

  componentWillUnmount(){
  //  ipcRenderer.sendSync('update-logs', {test: '192.2', port: 5112});
    ipcRenderer.removeAllListeners('asynchronous-reply');
  }

  render(){
    return (
        <Router>
          <Navbar />
          <IpContext.Provider value={this.state}>
            <Routes>
              <Route exact path='/' element={<Home/>} />
              <Route path='/Debug' element={<Debug/>} />
              <Route path='/MotorControl' element={<MotorControl/>} />
              <Route path='/ErrorLogs' element={<ErrorLogs/>} />
              <Route path='/Settings' element={<Settings/>} />
            </Routes>
          </IpContext.Provider>
        </Router>
    );
  }
}
  
export default App;
