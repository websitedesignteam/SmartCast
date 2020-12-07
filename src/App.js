import React, { useState, useRef, useEffect } from 'react';
import './App.scss';
import Navbar from './component/Navbar/Navbar';
import Auth from './component/Auth/Auth';
import Search from './component/Search/Search';
import Podcast from './page/Podcast/Podcast';
import Episode from './page/Episode/Episode';
import Home from './page/Home/Home';
import Landing from './page/Landing/Landing'
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
import { baseUrl, errorSessionExpired } from 'utils/constants';
import { EpisodeCard } from 'component/Podcast';

function App() {
  //global app states
  const [isLoading, setIsLoading] = useState(true);
  const [appHeight, setAppHeight] = useState(null);
  const [audio, setAudio] = useState(() => JSON.parse(localStorage.getItem('audio')) || {}); // audio = {podcastName, episodeName, podcastPublisher, audio}
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {}); //user = {username, authToken, refreshToken}
  const authModalState = useIsActive();
  const stayLoggedIn = useIsActive();

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
          if (stayLoggedIn.isActive) {
            const data = {
              refresh_token,
              username,
            };

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
              stayLoggedIn.deactivate();
              localStorage.removeItem("user");
            })
          } else {
            alert(errorSessionExpired);
            setUser({});
            localStorage.removeItem("user");
          }
        })
    }
  }

  //modal
  const openAuthModal = () => {
    authModalState.activate();
    // document.body.style.position = 'fixed';
    // document.body.style.overflowY = "scroll";
  }

  const closeAuthModal = () => {
    authModalState.deactivate();
    // document.body.style.position = 'static';
    // document.body.style.overflowY = 'auto';
  }

  //refs
  const authModalRef = useRef();
  useOnClickOutside(authModalRef, closeAuthModal);
  const appRef = useRef();

  const getAppHeight = () => {
    const el = appRef.current;
    if (!el) return
    const currentAppHeight = el.scrollHeight;
    setAppHeight(currentAppHeight);
  }

  useEffect(()=> {
    getAppHeight();
  }, [])



  return (
    <div className="App">
      <Router>
        <div className="App-content" ref={appRef}>  
          {(authModalState.isActive && !user.access_token) && 
            <>
            <div className="App-modal" ref={authModalRef}>
              <Auth loginUser={getUserAPI} type="login" onSuccessVerification={closeAuthModal} stayLoggedIn={stayLoggedIn} /> 
            </div>
            <div className="App-blur" style={{height: appHeight}} />
            </>
          }

          <Switch>
          <Route exact path="/home"
              render={routeProps =>
              <>
              <Navbar logoutUser={logoutUser} openAuthModal={openAuthModal} user={user}/>
        
        {audio.audioUrl && 
            <AudioFooter audio={audio} closeAudioPlayer={closeAudioPlayer} />}
                <Search {...routeProps} /> 
                <Home {...routeProps} />
              </>
            }/>

            <Route exact path="/" render={routeProps => 
              <>
                <Redirect {...routeProps} to="/welcome" /> 
              </>
            } />
            <Route exact path="/welcome" render={routeProps => 
              <> 
                <Landing {...routeProps}/>
              </>
            } />

            <Route exact path="/auth/:authType"
              render={routeProps =>
              <>
              <Navbar logoutUser={logoutUser} openAuthModal={openAuthModal} user={user}/>
        
        {audio.audioUrl && 
            <AudioFooter audio={audio} closeAudioPlayer={closeAudioPlayer} />}
                {!!user.access_token 
                ? <Redirect {...routeProps} to="/" /> 
                :<div className="App-background">
                  <Auth {...routeProps} />
                </div>}
              </>
              }/>

            <Route exact path="/profile" 
             render={routeProps =>
              <>
              <Navbar logoutUser={logoutUser} openAuthModal={openAuthModal} user={user}/>
        
        {audio.audioUrl && 
            <AudioFooter audio={audio} closeAudioPlayer={closeAudioPlayer} />}
              {!user.access_token ? <Redirect {...routeProps} to="/" /> : <UserProfile {...routeProps} />}
              </>
             }
            />

            <Route exact path="/genres"
              render={routeProps =>
              <>
              <Navbar logoutUser={logoutUser} openAuthModal={openAuthModal} user={user}/>
        
        {audio.audioUrl && 
            <AudioFooter audio={audio} closeAudioPlayer={closeAudioPlayer} />}
                <Search {...routeProps} />
                <Genres {...routeProps} />
              </>
            }/>

            <Route exact path="/genres/:genreName2/:genreName" component={Genres}
              render={routeProps =>
              <>
              <Navbar logoutUser={logoutUser} openAuthModal={openAuthModal} user={user}/>
        
        {audio.audioUrl && 
            <AudioFooter audio={audio} closeAudioPlayer={closeAudioPlayer} />}
              <Search {...routeProps} />
              <Genres {...routeProps} />
              </>
            }/>

            <Route exact path="/search/results/:searchTerm/:searchType"
              render={routeProps =>
              <>
              <Navbar logoutUser={logoutUser} openAuthModal={openAuthModal} user={user}/>
        
        {audio.audioUrl && 
            <AudioFooter audio={audio} closeAudioPlayer={closeAudioPlayer} />}
              <Search {...routeProps}/>
              <SearchPage {...routeProps}/>
              </>
            }/>

            <Route exact path="/podcast/:podcastID/episode/:episodeID" 
              render={routeProps =>
              <>
              <Navbar logoutUser={logoutUser} openAuthModal={openAuthModal} user={user}/>
        
        {audio.audioUrl && 
            <AudioFooter audio={audio} closeAudioPlayer={closeAudioPlayer} />}
                <Search {...routeProps} />
                <Episode {...routeProps} setUser={setUser} openAudioPlayer={openAudioPlayer} user={user} validateToken={validateToken} />
              </>
            }/> 

            <Route exact path="/podcast/:podcastID"
              render={routeProps =>
              <>
              <Navbar logoutUser={logoutUser} openAuthModal={openAuthModal} user={user}/>
        
        {audio.audioUrl && 
            <AudioFooter audio={audio} closeAudioPlayer={closeAudioPlayer} />}
              <Search {...routeProps} />
              <Podcast {...routeProps} user={user} validateToken={validateToken} setUser={setUser} />
              </>
            }/> 
            <Route exact path="/episodeBox" component={EpisodeCard} />
          </Switch>
      </div>
      <div className={audio.audioUrl ? "App-footer-audio" : "App-footer"}>
        <img className="listenNotesLogo" src={baseUrl+"/assets/listen-api-logo.png"} alt="This site is powered by Listen Notes" />
      </div>
  
      </Router>
    </div>
  );
}

export default withSearchContext(App);
