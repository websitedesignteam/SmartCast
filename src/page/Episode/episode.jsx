import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { getEpisode } from '../../utils/api';
import styles from "./Episode.module.css";

function Episode(props) {
    //vars
    const { episodeId } = useParams();
    const episodeDummyData = {
        "episodeId": 1,
        "episodeTitle": "Episode Title",
        "podcast": {
          "podcastId": 21367687,
          "podcastTitle": "Podcast Title",
          "publisher": "Publisher Name"
        },
        "image": "/assets/playlist-placeholder.png",
        "thumbnail": "/assets/playlist-placeholder.png",
        "description": "Episode description blah blah blah",
        "audio": "https://audioSrcUrl.com"
      }

    //states
    const [currentEpisode, setCurrentEpisode] = useState(episodeDummyData);

    //api call to be confirmed
    // useEffect(() => {
    //     const getEpisodeAPI = () => {
    //         getEpisode(episodeId)
    //         .then((response) => {
    //             const episodeData = response.data;
    //             setCurrentEpisode(episodeData);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    //     };
    //     getEpisodeAPI();
    // }, []);

    return (
        <div className={styles.episodeContainer}>
            { (currentEpisode) 
            ? <> 
                <img src={process.env.PUBLIC_URL + currentEpisode.image} alt="Episode" />
                <span className={styles.episodeTitle}>
                    {currentEpisode.episodeTitle}
                </span> 
                <span className={styles.episodePublisher}>
                    {currentEpisode.publisher}
                </span> 
                <span className={styles.episodeDescription}>
                    {currentEpisode.description}
                </span> 
            </>
            : <div className={styles.loading}>Loading...</div>
            }
        </div>
        
    );
}

export default Episode;