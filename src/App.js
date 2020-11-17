import React, { useEffect, useState } from 'react';
import './App.css';
import Podcast from './page/Podcast/Podcast'
import Episode from './page/Episode/Episode'
import Home from './page/Home/Home'
import Genres from './page/Genres/Genres'
import Navbar from './component/Navbar/Navbar'
import SearchPage from './page/Search/SearchPage'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {withSearchContext} from "state/Search/withSearchContext"
import AudioFooter from './component/AudioFooter/audioFooter';

function App() {
  //global app states
  const [isLoading, setIsLoading] = useState(true);
  const [audio, setAudio] = useState({}); // audio = {podcastName, episodeName, podcastPublisher, audio}

  const openAudioPlayer = (newAudio) => {
    setAudio(newAudio);
    localStorage.setItem("audio", JSON.stringify(newAudio));
  }

  const closeAudioPlayer = () => {
    setAudio({});
    localStorage.removeItem("audio");
  }

  useEffect(() => {
    const currentAudio = JSON.parse(localStorage.getItem("audio")) || {};
    
    if (!!currentAudio) {
      setAudio(currentAudio);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) return null;

  return (
    <div className="App">
    <Router>
      <Navbar />
      {audio.audioUrl && 
        <AudioFooter audio={audio} closeAudioPlayer={closeAudioPlayer} />}
      <Switch>

        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/genres">
          <Genres />
        </Route>

        <Route exact path="/genres/:genreName2/:genreName" component={Genres}>
          <Genres />
        </Route>

        <Route exact path="/searchPage">
          <SearchPage />
        </Route>

        {/* This route is temporarily used for episode while not using a modal popup */}
        <Route exact path="/podcast/:podcastID/episode/:episodeID"> 
          <Episode openAudioPlayer={openAudioPlayer} />
        </Route> 

        <Route exact path="/podcast/:podcastID">
          <Podcast />
        </Route>

        <Route exact path="/">
          <img className="logo" src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="Podcast Logo" />
        </Route>
      </Switch>
    </Router>
    </div>
  );
}

export default withSearchContext(App);
