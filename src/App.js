import React, { useEffect, useState } from 'react';
import './App.css';
import Podcast from './page/Podcast/podcast';
import Episode from './page/Episode/episode';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import AudioFooter from './component/AudioFooter/audioFooter';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // TODO: clean up by making this into a custom hook
  const [audioPlayerOpen, setAudioPlayerOpen] = useState(false); 
  const [audioUrl, setAudioUrl] = useState(""); 

  const openAudioPlayer = (newAudioUrl) => {
    setAudioUrl(newAudioUrl);
    setAudioPlayerOpen(true);
    localStorage.setItem('audioUrl', newAudioUrl);
  }

  const closeAudioPlayer = () => {
    setAudioPlayerOpen(false);
    setAudioUrl(null);
    localStorage.removeItem("audioUrl");
  }

  useEffect(() => {
    const currentAudioUrl = localStorage.getItem("audioUrl") || "";
    
    if (!!currentAudioUrl) {
      setAudioUrl(currentAudioUrl);
      setAudioPlayerOpen(true);
    }

    setIsLoading(false);
  }, [audioUrl]);

  if (isLoading) return null;

  return (
    <div className="App">
    <Router>
      {/* This route is temporarily used for episode while not using a modal popup */}
      <Route exact path="/podcast/:podcastID/episode/:episodeID"> 
        <Episode openAudioPlayer={openAudioPlayer} />
      </Route> 

      <Route exact path="/podcast/:podcastID">
        <Podcast />
      </Route>

      {audioPlayerOpen && 
      <AudioFooter audioUrl={audioUrl} closeAudioPlayer={closeAudioPlayer} />}

      <Route exact path="/">
        <img className="logo" src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="Podcast Logo" />
      </Route>
    </Router>
    </div>
  );
}

export default App;
