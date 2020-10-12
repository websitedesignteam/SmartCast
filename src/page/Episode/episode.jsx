import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { getEpisode } from '../../utils/api';
import css from "./episode.scss";

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

    useEffect(() => {
        const getEpisodeAPI = () => {
            getEpisode(episodeId)
            .then((response) => {
                const episodeData = response.data;
                setCurrentEpisode(episodeData);
            })
            .catch((error) => {
                console.log(error);
            });
        };
        getEpisodeAPI();
    }, []);

    return (
        <div className={css["episode-container"]}>
            { (currentEpisode) 
            ? <> 
                <img src={process.env.PUBLIC_URL + currentEpisode.image} alt="Episode" />
                <span className={css["episode-title"]}>
                    {currentEpisode.episodeTitle}
                </span> 
                <span className={css["episode-publisher"]}>
                    {currentEpisode.publisher}
                </span> 
                <span className={css["episode-description"]}>
                    {currentEpisode.description}
                </span> 
            </>
            : <div className={css["loading"]}>Loading...</div>
            }
        </div>
        
    );
}

export default Episode;