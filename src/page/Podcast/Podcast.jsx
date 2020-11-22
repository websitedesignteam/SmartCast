import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { getPodcast } from '../../utils/api';
import { useIsActive } from 'hooks';
import styles from "./Podcast.module.scss";
import { baseUrl, errorPodcast } from "../../utils/constants";

function Podcast(props) {
	//vars
	const { podcastID } = useParams();

	//states
	const [currentPodcast, setCurrentPodcast] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const showDescription = useIsActive(true);
	const showEpisodes = useIsActive(true);
	const favoritePodcast = useIsActive(); //temp state to be replaced with API call

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
			setErrorMessage(errorPodcast);
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
				<button className={styles.podcastFavorite} onClick={()=> favoritePodcast.toggle()}>
					<img 
						src={baseUrl + (favoritePodcast.isActive ? "/assets/button/heart-fill.svg" : "/assets/button/heart.svg")} 
						alt={showDescription.isActive ? "Unfavorite Podcast" : "Favorite Podcast"}
					/>
				</button>
				<div className={styles.podcastPodcastPublisher}>
					<strong>Publisher</strong>
					<br/>
					{currentPodcast.podcastPublisher}
				</div> 
				<div className={styles.podcastDescription}>
					<button className={styles.showMore} onClick={()=> showDescription.toggle()}>
						<img 
							src={baseUrl + "/assets/button/show-more.png"} 
							alt={showDescription.isActive ? "Hide Description" : "Show Description"}
							className={showDescription.isActive && styles.rotate} 
						/>
					</button>
					<strong>Description</strong> 
					<br/>
					{ showDescription.isActive && 
					<p dangerouslySetInnerHTML={{__html: currentPodcast.podcastDescription}} /> }
				</div> 
				
				<div className={styles.podcastEpisodes}>
					<button className={styles.showMore} onClick={()=> showEpisodes.toggle()}>
						<img 
							src={baseUrl + "/assets/button/show-more.png"} 
							alt={showEpisodes.isActive ? "Hide Episodes" : "Show Episodes"}
							className={showEpisodes.isActive && styles.rotate}  
						/>
					</button>
					<strong>Episodes</strong> 
					<br/>
					{ showEpisodes.isActive && 
					<ul className={styles.episodeList}>
					{ currentPodcast.episodes.map((episode, index) => 
						<li key={index} className={styles.episodeLink}>
							<Link to={`/podcast/${podcastID}/episode/${episode.episodeID}`}>{episode.episodeTitle}</Link>
						</li> 
					)}
					</ul> }
				</div>
				<div className={styles.episodePageButtons}>
					{ currentEpisodePageIndex > -1 &&
					<button onClick={gotoLastPage}><img src={baseUrl + "/assets/button/page-back.png"} alt="Previous Page" title="Go to previous page"/></button>}
					{ currentEpisodePageIndex < episodePageList.length-1 &&
					<button onClick={gotoNextPage}><img src={baseUrl + "/assets/button/page-next.png"} alt="Next Page" title="Go to next page"/></button>}

				</div>
			</>
			: (errorMessage) 
			? <div className={styles.error}>{errorMessage}</div>
			: <div className="loader" />
			}
		</div>
	);
}

export default Podcast;
