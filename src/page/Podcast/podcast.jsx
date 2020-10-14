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
		"image": "/assets/playlist-placeholder.png",
		"thumbnail": "/assets/playlist-placeholder.png",
		"publisher": "Publisher Name",
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
	// useEffect(() => {
	// 	const getPodcastAPI = () => {
	// 		getPodcast(podcastId)
	// 		.then((response) => {
	// 			const podcastData = response.data;
	// 			setCurrentPodcast(podcastData);
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// 	};
	// 	getPodcastAPI();
	// }, [podcastId]);

	return (
		<div className={css["podcast-container"]}>
				{ (currentPodcast) 
				? <> 
					<img src={process.env.PUBLIC_URL + currentPodcast.image} alt="Podcast" />
					<span className={css["podcast-title"]}>
						{currentPodcast.podcastTitle}
					</span> 
					<span className={css["podcast-publisher"]}>
						{currentPodcast.publisher}
					</span> 
					<span className={css["podcast-description"]}>
						{currentPodcast.description}
					</span> 
					<ul className={css["episode-list"]}>
					{ currentPodcast.episodes.map((episode) => 
						<li key={episode} className={css["episode-link"]}>
							<Link to={`/episode/${episode.episodeId}`}>{episode.episodeTitle}</Link>
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