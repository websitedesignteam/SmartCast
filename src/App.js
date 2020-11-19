import React, { useState, useRef } from 'react';
import './App.scss';
import Navbar from './component/Navbar/Navbar';
import Auth from './component/Auth/Auth';
import Search from './component/Search/Search';
import Routes from './Routes';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { withSearchContext } from "state/Search/withSearchContext";
import AudioFooter from './component/AudioFooter/audioFooter';
import { useIsActive, useOnClickOutside } from 'hooks';

function App() {
  //global app states
  const [isLoading, setIsLoading] = useState(true);
  const [audio, setAudio] = useState(() => JSON.parse(localStorage.getItem('audio')) || {}); // audio = {podcastName, episodeName, podcastPublisher, audio}
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {}); //user = {username, authToken, refreshToken}
  const authModalState = useIsActive();

  //util functions for states
  const openAudioPlayer = (newAudio) => {
    setAudio(newAudio);
    localStorage.setItem("audio", JSON.stringify(newAudio));
  }

  const closeAudioPlayer = () => {
    setAudio({});
    localStorage.removeItem("audio");
  }

  const loginUser = (newUser) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  }

  const logoutUser = () => {
    setUser({});
    localStorage.removeItem("user");
  }

  const openAuthModal = () => {
    authModalState.activate();
  }

  //refs
  const authModalRef = useRef();
  useOnClickOutside(authModalRef, authModalState.deactivate);

  return (
    <div className="App">
      <Router>
        <Navbar logoutUser={logoutUser} openAuthModal={openAuthModal} user={user}/>
        
        {audio.audioUrl && 
            <AudioFooter audio={audio} closeAudioPlayer={closeAudioPlayer} />}

        <div className="App-content">  
          {(authModalState.isActive && !user.username) && 
            <>
            <div className="App-modal" ref={authModalRef}>
              <Auth loginUser={loginUser} type="login" /> 
            </div>
            <div className="App-blur" />
            </>
          }
          <Search />
          <Routes user={user} openAudioPlayer={openAudioPlayer} />
          
        </div>
      </Router>
    </div>
  );
}

export default withSearchContext(App);
