import React from 'react';
import css from './App.scss';
import Podcast from './page/Podcast/podcast';
import Episode from './page/Episode/episode';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className={css["app"]}>
          FLORENCE BRANCH
      </div>
      
      {/* <Route path="/genre/:genreId">
        <GenreList />
      </Route> */}

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
