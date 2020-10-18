import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { getPodcast } from '../../utils/api';
import css from "./podcast.scss";

function Podcast(props) {
	//vars
	const { podcastId } = useParams();
	const podcastDummyData = {
		"podcastId": 21367687,
		"podcastTitle": "Podcast Title",
		"podcastImage": `${process.env.PUBLIC_URL}/assets/playlist-placeholder.png`,
		"podcastThumbnail": `${process.env.PUBLIC_URL}/assets/playlist-placeholder.png`,
		"podcastPublisher": "podcastPublisher Name",
		"episodes": [{
			"episodeId": 1,
			"episodeTitle": "Episode 1"
		}, 
		{
			"episodeId": 2,
			"episodeTitle": "Episode 2"
		},
		{
			"episodeId": 3,
			"episodeTitle": "Episode 3"
		}, ],
		"description": "Podcast description blah blah blah"
	}

	//states
	const [currentPodcast, setCurrentPodcast] = useState(podcastDummyData);

	//api call to be confirmed
	useEffect(() => {
		// const headers = {
		// 	'X-API-KEY': API_KEY,
		// 	'Authorization': API_KEY,
		// }
		const data = {
			"podcastID": podcastId,
		}
		const getPodcastAPI = () => {
			getPodcast(data)
			.then((response) => {
				const podcastData = response.data.Data;
				setCurrentPodcast(podcastData);
				console.log(podcastData);
			})
			.catch((error) => {
				console.log(error);
			});
		};
		getPodcastAPI();
	}, [podcastId]);

	return (
		<div className={css["podcast-container"]}>
				{ (currentPodcast) 
				? <> 
					<img src={currentPodcast.podcastImage} alt="Podcast" />
					<span className={css["podcast-title"]}>
						Title: {currentPodcast.podcastTitle}
					</span> 
					<span className={css["podcast-podcastPublisher"]}>
					 	Publisher: {currentPodcast.podcastPublisher}
					</span> 
					<span className={css["podcast-description"]}>
						Description: {currentPodcast.podcastDescription}
					</span> 
					<ul className={css["episode-list"]}>
						Episodes: { currentPodcast.episodes.map((episode, index) => 
						<li key={index} className={css["episode-link"]}>
							<Link to={`/episode/${episode.episodeID}`}>{episode.episodeTitle}</Link>
						</li>
					)}
					</ul>
				</>
				: <div className={css["loading"]}>Loading...</div>
				}
		</div>
	);
}

export default Podcast;