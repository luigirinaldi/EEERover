import React, { startTransition } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { IpContext } from './context/ip-context';

import Home from './pages/Home';
import Debug from './pages/Debug';
import ErrorLogs from './pages/ErrorLogs';
import MotorControl from './pages/MotorControl';
import Settings from './pages/Settings';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.updateIP = (newIP) => {
      this.setState({roverIP: newIP});
    }

    this.state = {
      roverIP: "192.168.0.16",
      changeIP: this.updateIP,
    };
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
