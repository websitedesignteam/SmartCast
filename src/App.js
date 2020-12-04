import React, { useState, useRef, useEffect } from 'react';
import './App.scss';
import Navbar from './component/Navbar/Navbar';
import Auth from './component/Auth/Auth';
import Search from './component/Search/Search';
import Podcast from './page/Podcast/Podcast';
import Episode from './page/Episode/Episode';
import Home from './page/Home/Home';
import Genres from './page/Genres/Genres';
import SearchPage from './page/Search/SearchPage';
import UserProfile from './page/Profile/UserProfile'
import {
  BrowserRouter as Router,
  Route,
  Switch,
	Redirect,
} from "react-router-dom";
import { withSearchContext } from "state/Search/withSearchContext";
import AudioFooter from './component/AudioFooter/audioFooter';
import { useIsActive, useOnClickOutside } from 'hooks';
import { getUser, getTokenValidation, getNewToken } from "./utils/api";

function App() {
  //global app states
  const [isLoading, setIsLoading] = useState(true);
  const [audio, setAudio] = useState(() => JSON.parse(localStorage.getItem('audio')) || {}); // audio = {podcastName, episodeName, podcastPublisher, audio}
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {}); //user = {username, authToken, refreshToken}
  const authModalState = useIsActive();

  //audioplayer
  const openAudioPlayer = (newAudio) => {
    setAudio(newAudio);
    localStorage.setItem("audio", JSON.stringify(newAudio));
  }

  const closeAudioPlayer = () => {
    setAudio({});
    localStorage.removeItem("audio");
  }

  //auth
  const getUserAPI = (currentUser) => {
    if (!currentUser) currentUser = user;
    const { access_token } = currentUser;
    getUser({access_token})
    .then((response) => {
      closeAuthModal();
      const userData = response.data;
      const allUserData = { 
        ...currentUser,
        ...userData, 
      }
      localStorage.setItem("user", JSON.stringify(allUserData));
      setUser(allUserData);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const logoutUser = () => {
    setUser({});
    localStorage.removeItem("user");
  }

  const validateToken = () => {
    const { access_token, refresh_token, username } = user;
    if (!!access_token && !!refresh_token && !!username) {
      getTokenValidation({access_token})
        .catch(() => {
          const data = {
            refresh_token,
            username,
          }

          //if user wants to stay logged in for 30 days
          getNewToken(data)
          .then((response) => {
              const allUserData = {
                ...user,
                ...response.data,
              }
              localStorage.setItem("user", JSON.stringify(allUserData));
              setUser(allUserData);
          })
          .catch((error)=> {
            console.log(error);
            setUser({});
            localStorage.removeItem("user");
          })
        })
    }
  }

  //modal
  const openAuthModal = () => {
    authModalState.activate();
  }

  const closeAuthModal = () => {
    authModalState.deactivate();
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
          {(authModalState.isActive && !user.access_token) && 
            <>
            <div className="App-modal" ref={authModalRef}>
              <Auth loginUser={getUserAPI} type="login" onSuccessVerification={closeAuthModal} /> 
            </div>
            <div className="App-blur" />
            </>
          }
          <Search />
          <Switch>
			<Route exact path="/">
				{/* <img className="logo" src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="Podcast Logo" /> */}
				<Home />
			</Route>

			<Route exact path="/auth/:authType">
				{!!user.access_token ? <Redirect to="/" /> : 
				<div className="App-background">
					<Auth />
				</div>}
			</Route>

			<Route exact path="/profile">
				{!user.access_token ? <Redirect to="/" /> : <UserProfile />}
			</Route>

			<Route exact path="/genres">
				<Genres />
			</Route>

			<Route exact path="/genres/:genreName2/:genreName" component={Genres}>
				<Genres />
			</Route>

			<Route exact path="/search/results/:searchTerm/:searchType">
				<SearchPage />
			</Route>

			<Route exact path="/podcast/:podcastID/episode/:episodeID"> 
				<Episode openAudioPlayer={openAudioPlayer} user={user} validateToken={validateToken} />
			</Route> 

			<Route exact path="/podcast/:podcastID">
				<Podcast user={user} validateToken={validateToken} getUserAPI={getUserAPI} />
			</Route>
		</Switch>
          
        </div>
      </Router>
    </div>
  );
}

export default withSearchContext(App);
