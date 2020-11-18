import React, { useEffect, useState } from 'react';
import './App.css';
import Podcast from './page/Podcast/Podcast';
import Episode from './page/Episode/Episode';
import Home from './page/Home/Home';
import Genres from './page/Genres/Genres';
import Navbar from './component/Navbar/Navbar';
import SearchPage from './page/Search/SearchPage';
import Auth from './page/Auth/Auth';
import Search from './component/Search/Search';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { withSearchContext } from "state/Search/withSearchContext";
import AudioFooter from './component/AudioFooter/audioFooter';

function App() {
  //global app states
  const [isLoading, setIsLoading] = useState(true);
  const [audio, setAudio] = useState(() => JSON.parse(localStorage.getItem('audio')) || {}); // audio = {podcastName, episodeName, podcastPublisher, audio}
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {}); //user = {username, authToken, refreshToken}

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

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="App-content">
        <Search />
        {audio.audioUrl && 
          <AudioFooter audio={audio} closeAudioPlayer={closeAudioPlayer} />}
        <Switch>

          <Route exact path="/">
            {/* <img className="logo" src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="Podcast Logo" /> */}
            <Home />
          </Route>

          <Route exact path="/login">
            { !!user.username 
            ? <Redirect to="/" /> 
            : <Auth loginUser={loginUser} type="login" />}
          </Route>

          <Route exact path="/signup">
            { !!user.username 
            ? <Redirect to="/" /> 
            : <Auth loginUser={loginUser} type="signup" />}
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

          <Route exact path="/podcast/:podcastID/episode/:episodeID"> 
            <Episode openAudioPlayer={openAudioPlayer} />
          </Route> 

          <Route exact path="/podcast/:podcastID">
            <Podcast />
          </Route>
        </Switch>
        </div>
      </Router>
    </div>
  );
}

export default withSearchContext(App);
