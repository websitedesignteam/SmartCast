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
    <Router>
      <Route path="/podcast/:podcastId">
        <Podcast />
      </Route>

      <Route path="/episode/:episodeId">
        <Episode />
      </Route> 
    </Router>
  );
}

export default App;
