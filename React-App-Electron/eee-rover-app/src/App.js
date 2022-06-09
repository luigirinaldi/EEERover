
import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Debug from './pages/Debug';
import ErrorLogs from './pages/ErrorLogs';
import MotorControl from './pages/MotorControl';

function App() {
return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route path='/Debug' element={<Debug/>} />
        <Route path='/MotorControl' element={<MotorControl/>} />
        <Route path='/ErrorLogs' element={<ErrorLogs/>} />
      </Routes>
    </Router>
);
}
  
export default App;
