import React, {useState, useEffect} from 'react'
import Navbar from '../../component/Navbar/Navbar'
import { Link, useParams } from "react-router-dom"
import { getGenrePodcasts } from '../../utils/api'
import styles from '../Genres/Genres.module.css'
import PodcastContainer from '../../component/PodcastContainer/PodcastContainer'
function Genres(props) {
       const [podcasts, setPodcasts] = useState()
       let {genreName} = useParams()
       let {genreName2} = useParams()


       useEffect(() => {
              let body = {
                     "genreID": 143,
                     "page": 1
                 }
              getGenrePodcasts(body)
              .then((response) => {
                     const podcastData = response.data.Data;
                     setPodcasts(podcastData.podCasts)
              })
              .catch((error) => {
                     console.log(error);
              });
       }, []) 

 
       if(podcasts){
              return (
              <div className={styles.genresContainer}>
                     <h3>Podcasts for: "{genreName2}"</h3>
                     <div className="resultsContainer">
                            {podcasts.map((podcasts)=>{
                            return <PodcastContainer podcastTitle={podcasts.podcastTitle}
                                                        podcastDescription={podcasts.podcastDescription}
                                                        imgSrc={podcasts.podcastImage}/>
                            })}
                      </div>
              </div>)
       } else{
              return (<div className={styles.genresContainer}>
                     <div className="resultsContainer">
                            Loading...
                     </div>
                </div>)
       }
}

export default Genres;