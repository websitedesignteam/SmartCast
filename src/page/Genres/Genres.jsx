import React, {useState, useEffect} from 'react'
import Navbar from '../../component/Navbar/Navbar'
import { Link, useParams } from "react-router-dom"
import { getGenrePodcasts } from '../../utils/api'
import styles from '../Genres/Genres.module.scss'
import PodcastContainer from '../../component/PodcastContainer/PodcastContainer'
import { baseUrl } from "../../utils/constants";

function Genres(props) {
	const [isLoading, setIsLoading] = useState(false);
	const [podcasts, setPodcasts] = useState();
	const [podcastPage, setPodcastPage] = useState(1);
	const {genreName, genreName2} = useParams();

	useEffect(() => {
		setIsLoading(true);
		const body = {
			"genreID": genreName,
			"page": podcastPage,
		}
		getGenrePodcasts(body)
		.then((response) => {
			const podcastData = response.data.Data;
			setPodcasts(podcastData.podCasts)
			setIsLoading(false);
		})
		.catch((error) => {
			console.log(error);
		});
	}, [podcastPage]) 

	const onClickLastPage = () => {
		(podcastPage > 1) && setPodcastPage(podcastPage-1);
	}

	const onClickNextPage = () => {
		setPodcastPage(podcastPage+1);
		setIsLoading(true);
	}

	return (
		<div className={styles.genresContainer}>
			{isLoading 
			? <div className="loader" />
			: !!podcasts 
			? <>
			<h3>Podcasts for: "{genreName2}"</h3>
			<div className="resultsContainer">
				{podcasts.map((podcasts)=>{
				return (
					<Link to={`/podcast/${podcasts.podcastID}`} className={styles.link}>
						<PodcastContainer 
							podcastTitle={podcasts.podcastTitle}
							podcastDescription={podcasts.podcastDescription}
							imgSrc={podcasts.podcastImage}
							podcastTotalEpisodes={podcasts.podcastTotalEpisodes}
						/>
					</Link>
				)
				})}
			</div>
			<div className={styles.pageButtons}>
				{ podcastPage > 1 &&
				<button onClick={onClickLastPage}><img className={styles.lastPage} src={baseUrl + "/assets/button/page-back.png"} alt="Previous Page" title="Go to previous page"/></button>}
				<button onClick={onClickNextPage}><img className={styles.nextPage} src={baseUrl + "/assets/button/page-next.png"} alt="Next Page" title="Go to next page"/></button>
			</div>
			</>
			: <div>No Results</div>			
		}
		</div>
	)
}

export default Genres;