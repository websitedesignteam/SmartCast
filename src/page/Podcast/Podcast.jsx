import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { getPodcast } from '../../utils/api';
import styles from "./Podcast.module.scss";

function Podcast(props) {
	//vars
	const { podcastID } = useParams();
	const errorMessageText = "Sorry! We couldn't find that podcast.";
	const baseUrl = process.env.PUBLIC_URL;

	//states
	const [currentPodcast, setCurrentPodcast] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

	//make into custom hook
	const [episodePageList, setEpisodePageList] = useState([]); 
	const [currentEpisodePageIndex, setCurrentEpisodePageIndex] = useState(-1);

	//api call to get podcast metadata
	const getPodcastAPI = () => {
		const data = { podcastID, nextPage : episodePageList[currentEpisodePageIndex] }
		getPodcast(data)
		.then((response) => {
			const podcastData = response.data.Data;
			setCurrentPodcast(podcastData);
			setEpisodePageList(episodePageList.concat([podcastData.nextPageNumber]));
		})
		.catch((error) => {
			console.log(error);
			setErrorMessage(errorMessageText);
		});
	};

	//utils for button function
	const gotoLastPage = () => {
		if (currentEpisodePageIndex > -1) {
			setCurrentEpisodePageIndex(currentEpisodePageIndex-1)
		}
		else {
			return;
		}
	}

	const gotoNextPage = () => {
		if (currentEpisodePageIndex < episodePageList.length-1) {
			setCurrentEpisodePageIndex(currentEpisodePageIndex+1)
		}
		else {
			return;
		}
	}


	useEffect(() => {
		getPodcastAPI();
	}, [podcastID, errorMessage, currentEpisodePageIndex]);

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
					<p dangerouslySetInnerHTML={{__html: currentPodcast.podcastDescription}}></p>
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
				<div className={styles.episodePageButtons}>
					{ currentEpisodePageIndex > -1 &&
					<button onClick={gotoLastPage}><img src={baseUrl + "/assets/button/page-back.png"} alt="Previous Page" title="Go to previous page"/></button>}
					{ currentEpisodePageIndex < episodePageList.length-1 &&
					<button onClick={gotoNextPage}><img src={baseUrl + "/assets/button/page-next.png"} alt="Next Page" title="Go to next page"/></button>}

				</div>
			</>
			: (errorMessage) 
			? <div className={styles.errorMessage}>{errorMessage}</div>
			: <div className="loader" />
			}
		</div>
	);
}

export default Podcast;
