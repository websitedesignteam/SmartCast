import React, {useState, useEffect} from 'react';
import Navbar from '../../component/Navbar/Navbar.js'
import styles from '../Home/Home.module.css'
import Thumbnail from '../../component/Home/Thumbnail/Thumbnail'
import Search from '../../component/Search/Search'
import { getGenres } from '../../utils/api';
import axios from 'axios';
import Axios from 'axios';
import {Link} from 'react-router-dom'
function Home() {

       const [genres, setGenres] = useState({});

       const APIKEY = process.env.REACT_APP_SMARTCAST_API_KEY
       //PROXY URL TO GET AROUND CORS ISSUE
       const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'
       const URL ='https://g0rjpqharl.execute-api.us-east-1.amazonaws.com/test/getallgenres/'

       let config = {
              'X-API-KEY': APIKEY,
              'Authorization': APIKEY,
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'http://localhost:3000',
       }
       useEffect(() => {
		const getGenresAPI = () => {
			getGenres()
			.then((response) => {
                            console.log(response)
				const genreData = response.data;
				setGenres(genreData);
			})
			.catch((error) => {
				console.log(error);
			});
		};
		getGenresAPI();
       });
       
  return ( 
         <div className={styles.homeContainer}>
              <p>Hi, I'm the home page</p>
              <Search/>
              <div className={styles.genreSection}>
                     <div className={styles.genreHeading}>
                            <h5>Genres</h5>
                     </div>
                     {/* <div className={styles.thumbnailContainer}>
                     {Object.keys(genres).map(function (key){
                            return <Link to={`/genre/${key}`}><Thumbnail title={key}/></Link>
                     })}
                     </div> */}
              </div>
         </div>
  );
}

export default Home;