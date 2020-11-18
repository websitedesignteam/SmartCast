import React, {useState, useEffect} from 'react';
import styles from '../Home/Home.module.css'
import Thumbnail from '../../component/Home/Thumbnail/Thumbnail'
import { getGenres } from '../../utils/api';
import {Link, useParams} from 'react-router-dom'

function Home(props) {

	const [genres, setGenres] = useState({});

	useEffect(() => {
		getGenres()
		.then((response) => {
			const genreData = response.data.Data;
			setGenres(genreData);
		})
		.catch((error) => {
			console.log(error);
		});
	}, []) 

	return ( 
		<div className={styles.homeContainer}>
			<div className={styles.genreSection}>
				<div className={styles.subGenre}>
					<div className={styles.genreHeading}>
						<h3>Genres</h3>
					</div>
					<div className={styles.thumbnailContainer}>
					{Object.entries(genres).map(([key, val]) =>{
						return <Link to={`/genres/${key}/${val}`} key={key}><Thumbnail title={key} id={val} /></Link>
					})}
					</div>
				</div>
				<div className={styles.subGenre}>
					<h3>Top Podcasts</h3>
				</div>
			</div>
		</div>
);
}

export default Home;