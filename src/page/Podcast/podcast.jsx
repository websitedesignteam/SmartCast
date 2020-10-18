import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { getPodcast } from '../../utils/api';
import css from "./podcast.scss";

function Podcast(props) {
	//vars
	const { podcastId } = useParams();

	//states
	const [currentPodcast, setCurrentPodcast] = useState(null);

	//api call to be confirmed
	useEffect(() => {
		const data = {
			"podcastID": podcastId,
		}
		const getPodcastAPI = () => {
			getPodcast(data)
			.then((response) => {
				const podcastData = response.data.Data;
				setCurrentPodcast(podcastData);
			})
			.catch((error) => {
				console.log(error);
			});
		};
		getPodcastAPI();
	}, [podcastId]);

	return (
		<div className="podcast-container">
			{ (currentPodcast) 
			? <> 
				<img src={currentPodcast.podcastImage} alt="podcast cover" />
				<div className="podcast-title">
					<strong>{currentPodcast.podcastTitle}</strong>
				</div> 
				<div className="podcast-podcastPublisher">
					<strong>Publisher</strong>
					<br/>
					{currentPodcast.podcastPublisher}
				</div> 
				<div className="podcast-description">
					<strong>Description</strong> 
					<br/>
					{currentPodcast.podcastDescription}
				</div> 
				<ul className="episode-list">
					<strong>Episodes</strong> 
					<br/>
					{ currentPodcast.episodes.map((episode, index) => 
					<li key={index} className={css["episode-link"]}>
						<Link to={`/episode/${episode.episodeID}`}>{episode.episodeTitle}</Link>
					</li>
				)}
				</ul>
			</>
			: <div class="loader"></div>
			}
		</div>
	);
}

export default Podcast;