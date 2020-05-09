import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import Dashboard from './Dashboard';
import videoIcon from './data/video.svg'

function App() {
  return (
    <div className="App" style={{
      minHeight: window.innerHeight,
      backgroundColor: 'rgb(0, 0, 0, 0.96)',
      backgroundImage: `url(${videoIcon})`,
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'scroll',
      backgroundPosition: 'right bottom',
    }}>
      <Dashboard/>
    </div>
  );
}

export default App;
