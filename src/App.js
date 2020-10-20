import React from 'react';
import './App.css';
import Podcast from './page/Podcast/Podcast';
import Episode from './page/Episode/Episode';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

function App() {
  return (
<<<<<<< HEAD
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          ALI BRANCH
        </p>
      </header>
    </div>
=======
    <Router>
      <Route path="/podcast/:podcastId">
        <Podcast />
      </Route>

      <Route path="/episode/:episodeId">
        <Episode />
      </Route> 
    </Router>
>>>>>>> florence
  );
}

export default App;
