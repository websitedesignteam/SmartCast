import React, {useEffect, useState} from 'react'
import { Link, useParams } from "react-router-dom"
import { searchEpisodes, searchPodcasts, searchTags } from '../../utils/api'
import PodcastContainer from "component/PodcastContainer/PodcastContainer"
import EpisodeContainer from "component/EpisodeContainer/EpisodeContainer"
import styles from './SearchPage.module.scss'
import {baseUrl, errorSearch} from "../../utils/constants";

function SearchPage(props) {
	const { searchTerm, searchType } = useParams();

	const [episodes, setEpisodes] = useState([])
	const [podcasts, setPodcasts] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let body = {"searchString": searchTerm}
		if (searchType === 'episodes'){
			searchEpisodes(body, 1) 
			.then((response) => {
				setIsLoading(false)
				setEpisodes(response.data.Data.episodes)
			})
			.catch((error) => {
				console.log(error);
			});
		} else if (searchType === 'podcasts'){
			searchPodcasts(body, 1) 
			.then((response) => {
				setIsLoading(false);
				setPodcasts(response.data.Data.podcasts)
			})
			.catch((error) => {
				setIsLoading(false);
				console.log(error);
			});
		} else if (searchType === 'tags'){
			searchTags(body) 
			.then((response) => {
				setIsLoading(false);
				setPodcasts(response.data.Data)
			})
			.catch((error) => {
				setIsLoading(false);
				console.log(error);
			});
		}
	}, [searchTerm, searchType])

	if (isLoading === false){
		if (searchType === 'episodes'){
			return( <div>
				<h4>Episode Results for: "{searchTerm}"</h4>
				<p>{episodes.map((episode)=>{
					return (
						<Link to={`/podcast/${episode.podcastID}/episode/${episode.episodeID}`} className={styles.link}>
							<EpisodeContainer 
								episodeTitle={episode.episodeTitle}
								episodeDescription={episode.episodeDescription}
								imgSrc={episode.episodeImage}
							/>
						</Link> 
					)
				})}</p>
				</div>)
		}else if (searchType === 'podcasts'){
			return( <div>
				<h4>Podcast Results for: "{searchTerm}"</h4>
				<p>{podcasts.map((podcast)=>{
					return (
						<Link to={`/podcast/${podcast.podcastID}`} className={styles.link}>
							<PodcastContainer 
								podcastTitle={podcast.podcastTitle}
								podcastDescription={podcast.podcastDescription}
								imgSrc={podcast.podcastImage}
								podcastTotalEpisodes={podcast.totalEpisodes}
							/>
						</Link>
					)
				})}</p>
			</div>)

		} else {
			return (
			<div className={styles.error}>
				<div className={styles.errorText}>
					{errorSearch}
				</div>
				<img className={styles.errorImg} src={baseUrl+'/assets/empty_search.gif'} alt=""/>
			</div>
		);
		}
	} else {
		return (<div className="loader" />)
	}
}

export default SearchPage;
