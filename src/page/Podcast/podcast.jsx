import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { getPodcast } from '../../utils/api';
import styles from "./podcast.module.scss";

function Podcast(props) {
	//vars
	const { podcastID } = useParams();
	const errorMessageText = "Sorry! We couldn't find that podcast.";

	//states
	const [currentPodcast, setCurrentPodcast] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

	//api call to be confirmed
	useEffect(() => {
		const data = { podcastID };
		const getPodcastAPI = () => {
			getPodcast(data)
			.then((response) => {
				const podcastData = response.data.Data;
				setCurrentPodcast(podcastData);
			})
			.catch((error) => {
				console.log(error);
				setErrorMessage(errorMessageText);
			});
		};
		getPodcastAPI();
	}, [podcastID, errorMessage]);

	return (
		<div className={styles.podcastContainer}>
			{ (currentPodcast && !errorMessage) 
			? <> 
				<img className={styles.podcastImage} src={currentPodcast.podcastImage} alt="podcast cover" />
				<div className={styles.podcastTitle}>
					<strong>{currentPodcast.podcastTitle}</strong>
				</div> 
				<div className={styles.podcastPodcastPublisher}>
					<strong>Publisher</strong>
					<br/>
					{currentPodcast.podcastPublisher}
				</div> 
				<div className={styles.podcastDescription}>
					<strong>Description</strong> 
					<br/>
					{currentPodcast.podcastDescription}
				</div> 
				<ul className={styles.episodeList}>
					<strong>Episodes</strong> 
					<br/>
					{ currentPodcast.episodes.map((episode, index) => 
					<li key={index} className={styles.episodeLink}>
						<Link to={`/podcast/${podcastID}/episode/${episode.episodeID}`}>{episode.episodeTitle}</Link>
					</li>
				)}
				</ul>
			</>
			: (errorMessage) 
			? <div className={styles.errorMessage}>{errorMessage}</div>
			: <div className={styles.loader}></div>
			}
		</div>
	);
}

export default Podcast;