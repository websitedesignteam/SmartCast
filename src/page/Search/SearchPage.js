import React, {useEffect, useState} from 'react'
import { Link, useHistory, useParams } from "react-router-dom"
import { searchEpisodes, searchPodcasts, searchTags } from '../../utils/api'
import PodcastContainer from "component/PodcastContainer/PodcastContainer"
import EpisodeContainer from "component/EpisodeContainer/EpisodeContainer"
import styles from './SearchPage.module.scss'
import {baseUrl, errorSearch} from "../../utils/constants";
import {useSearchContext} from '../../state/Search/useSearchContext';

function SearchPage(props) {
	const { searchTerm, searchType } = useParams();
	const searchContext = useSearchContext();
	const [episodes, setEpisodes] = useState([]);
	const [podcasts, setPodcasts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [podcastPage, setPodcastPage] = useState(1);

	const history = useHistory();

	useEffect(() => {
		setIsLoading(true);
		let body = {"searchString": searchTerm}
		if (searchType === 'episodes'){
			searchEpisodes(body, 1) 
			.then((response) => {
				setIsLoading(false);
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
				setEpisodes(response.data.Data)
			})
			.catch((error) => {
				setIsLoading(false);
				console.log(error);
			});
		}
	}, [searchTerm, searchType, podcastPage])

	const onClickLastPage = () => {
		(podcastPage > 1) && setPodcastPage(podcastPage-1);
	}

	const onClickNextPage = () => {
		setPodcastPage(podcastPage+1);
		setIsLoading(true);
	}

	const onClickShowMore = () => {
		searchContext.setSearchType("episodes");
		history.push(`/search/results/${searchTerm}/episodes`);
		searchContext.setDisableCheckbox(false);
	}

	if (isLoading === false){
		if ((searchType === 'episodes' || searchType === 'tags') && episodes.length > 1){
			return( 
				<div className={styles.container}>
					<h4>{searchType === 'tags' && "Transcribed "}
						Episode Results for: "{searchTerm}"</h4>
					<div className={styles.cardContainer}>{episodes.map((episode)=>{
						return (
							(searchType === 'tags') 
							? <Link to={{
								pathname: `/podcast/${episode.podcastID}/episode/${episode.episodeID}`,
								episode,
								}} 
								className={styles.link}
							>
								<EpisodeContainer 
									episodeTitle={episode.episodeTitle}
									episodeDescription={episode.episodeDescription}
									imgSrc={episode.episodeImage}
								/>
							</Link> 
							: <Link to={`/podcast/${episode.podcastID}/episode/${episode.episodeID}`} className={styles.link}>
								<EpisodeContainer 
									episodeTitle={episode.episodeTitle}
									episodeDescription={episode.episodeDescription}
									imgSrc={episode.episodeImage}
								/>
							</Link> 
						)
					})}
					</div>
					{searchType === 'episodes' &&
					<div className={styles.pageButtons}>
					{ podcastPage > 1 &&
						<button onClick={onClickLastPage}><img className={styles.lastPage} src={baseUrl + "/assets/button/page-back.png"} alt="Previous Page" title="Go to previous page"/></button>}
						<button onClick={onClickNextPage}><img className={styles.nextPage} src={baseUrl + "/assets/button/page-next.png"} alt="Next Page" title="Go to next page"/></button>
					</div>
					}
					{!!searchContext.disableCheckbox && 
						<button className={styles.errorShowMore} onClick={onClickShowMore}>
							Not satisfied with the results? Click here to show more results
						</button>
					}
				</div>)
		} else if (searchType === 'podcasts' && podcasts.length > 1){
			return( <div className={styles.container}>
				<h4>Podcast Results for: "{searchTerm}"</h4>
				<div>{podcasts.map((podcast)=>{
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
				})}</div>
				<div className={styles.pageButtons}>
				{ podcastPage > 1 &&
					<button onClick={onClickLastPage}><img className={styles.lastPage} src={baseUrl + "/assets/button/page-back.png"} alt="Previous Page" title="Go to previous page"/></button>}
					<button onClick={onClickNextPage}><img className={styles.nextPage} src={baseUrl + "/assets/button/page-next.png"} alt="Next Page" title="Go to next page"/></button>
				</div>
				{!!searchContext.disableCheckbox && 
						<button className={styles.errorShowMore} onClick={onClickShowMore}>
							Not satisfied with the results? Click here to show more results
						</button>
				}
			</div>)

		} else {
			return (
			<div className={styles.error}>
				<div className={styles.errorContent}>
					<div className={styles.errorText}>{errorSearch}</div>
					{!!searchContext.disableCheckbox && 
						<button className={styles.errorShowMore} onClick={onClickShowMore}>
							Click here to show more results
						</button>
					}
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
