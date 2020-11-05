import React, {useState, useEffect} from 'react';
import Navbar from '../../component/Navbar/Navbar.js'
import styles from '../Home/Home.module.css'
import Thumbnail from '../../component/Home/Thumbnail/Thumbnail'
import Search from '../../component/Search/Search'
import { getGenres } from '../../utils/api';
import axios from 'axios';
import Axios from 'axios';
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
              <Search/>
              <div className={styles.genreSection}>
                     <div className={styles.subGenre}>
                            <div className={styles.genreHeading}>
                                   <h5>Genres</h5>
                            </div>
                            <div className={styles.thumbnailContainer}>
                            {/* {Object.entries(genres).map(([key, val]) =>{
                                   return <Link to={`/genres/${key}/${val}`}><Thumbnail title={key} id={val}/></Link>
                            })} */}genre results
                            </div>
                     </div>
                     <div className={styles.subGenre}>
                                   <h5>Top</h5>
                     </div>
              </div>
         </div>
  );
}

export default Home;