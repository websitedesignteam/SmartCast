import React, { useState } from 'react';
import './App.css';
import Podcast from './page/Podcast/podcast';
import Episode from './page/Episode/episode';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import AudioFooter from './component/AudioFooter/audioFooter';

function App() {
  const [audioPlayerOpen, setAudioPlayerOpen] = useState(false); 
  const [audioUrl, setAudioUrl] = useState(null); 

  const openAudioPlayer = (newAudioUrl) => {
    setAudioUrl(newAudioUrl);
    setAudioPlayerOpen(true);
  }

  const closeAudioPlayer = () => {
    setAudioPlayerOpen(false);
    setAudioUrl(null);
  }

  return (
    <div className="app">
    <Router>
      {/* This route is temporarily used for episode while not using a modal popup */}
      <Route path="/podcast/:podcastID/episode/:episodeID"> 
        <Episode openAudioPlayer={openAudioPlayer}/>
      </Route> 

      <Route exact path="/podcast/:podcastID">
        <Podcast />
      </Route>

      {audioPlayerOpen && 
      <AudioFooter audioUrl={audioUrl}/>}
    </Router>
    </div>
  );
}

export default App;
