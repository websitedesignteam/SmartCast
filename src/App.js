import React from 'react'
import './App.css'
import Podcast from './page/Podcast/Podcast'
import Episode from './page/Episode/Episode'
import Home from './page/Home/Home'
import Genres from './page/Genres/Genres'
import Navbar from './component/Navbar/Navbar'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
           <Navbar />
       <Switch>
       <Route exact path="/">
        <Home />
      </Route>
      <Route path="/genres">
        <Genres />
      </Route>
      <Route path="/podcast/:podcastId">
        <Podcast />
      </Route>
      <Route path="/episode/:episodeId">
        <Episode />
      </Route> 
      </Switch>
    </Router>
  );
}

export default App;
