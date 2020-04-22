import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="App" style={{backgroundColor: 'black', height: window.innerHeight}}>
      <Dashboard/>
    </div>
  );
}

export default App;
