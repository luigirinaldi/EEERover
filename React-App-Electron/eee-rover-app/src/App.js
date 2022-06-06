import logo from './logo.svg';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from './components/Sidebar';

import Home from './pages/Home';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Sidebar />

        <Routes>
          <Route exact path="/" component={Home} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
