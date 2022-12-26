import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppWithRouterAccess from '../AppWithRouterAccess';


const App = () => {
  return (
    <Router basename={"hestia"}>
      <AppWithRouterAccess/>
    </Router>
  );
}
export default App;
