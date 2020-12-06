import React from 'react';
import './App.scss';
import Podcast from './page/Podcast/Podcast';
import Episode from './page/Episode/Episode';
import Home from './page/Home/Home';
import Genres from './page/Genres/Genres';
import SearchPage from './page/Search/SearchPage';
import Auth from './component/Auth/Auth'
import UserProfile from './page/Profile/UserProfile'
import {
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

function Routes(props) {
	return (
		<Switch>
			<Route exact path="/">
				{/* <img className="logo" src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="Podcast Logo" /> */}
				<Home user={props.user}/>
			</Route>

			<Route exact path="/auth/:authType">
				{!!props.user.access_token ? <Redirect to="/" /> : 
				<div className="App-background">
					<Auth />
				</div>}
			</Route>

			<Route exact path="/profile">
				{!props.user.access_token ? <Redirect to="/" /> : <UserProfile userData={props.user} />}
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
				<Episode openAudioPlayer={props.openAudioPlayer} />
			</Route> 

			<Route exact path="/podcast/:podcastID">
				<Podcast user={props.user} />
			</Route>
		</Switch>
	);
}

export default Routes;