import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { getEpisode } from '../../utils/api';
import styles from "./episode.module.scss";

function Episode(props) {
    //vars
    const { episodeID, podcastID } = useParams();
    const errorMessageText = "Sorry! We couldn't find that episode.";
    const baseUrl = process.env.PUBLIC_URL;

    //states
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    //api call to get episode
    useEffect(() => {
        const data = { episodeID, podcastID };
        const getEpisodeAPI = () => {
            getEpisode(data)
            .then((response) => {
                const episodeData = response.data.Data;
                setCurrentEpisode(episodeData);
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage(errorMessageText);
            });
        };
        getEpisodeAPI();
    }, [episodeID, podcastID]);

    return (
        <div className={styles.episodeContainer}>
            { (currentEpisode && !errorMessage) 
            ? <> 
                <img className={styles.episodeImage} src={currentEpisode.episodeImage} alt="Episode" />
                
                <div className={styles.episodeData}>
                    <div className={styles.header}>
                        <div className={styles.episodeTitle}>
                            <strong>{currentEpisode.episodeTitle}</strong>
                        </div> 

                        <div className={styles.episodeButtons}>
                            <button className={styles.episodePlayButton} onClick={() => props.openAudioPlayer(currentEpisode.episodeAudioLink)}>
                                <img src={baseUrl + "/assets/button/play.svg"} alt="play episode button"/>
                            </button>
                            <button className={styles.episodeTranscribeButton}>
                                <img src={baseUrl + "/assets/button/transcribe.png"} alt="transcribe episode button"/>
                            </button>
                        </div>
                    </div>

                    <div className={styles.podcastTitle}>
                        <strong>Podcast</strong>
                        <br/>
                        {currentEpisode.podcastTitle}
                    </div>

                    {currentEpisode.publisher &&
                    <div className={styles.episodePublisher}>
                        <strong>Publisher</strong>
                        <br/>
                        {currentEpisode.publisher}
                    </div>}

                    <div className={styles.episodeDescription}>
                        <strong>Description</strong>
                        <br/>
                        {currentEpisode.episodeDescription}
                    </div> 
                </div>
            </>
            : (errorMessage) 
			? <div className={styles.errorMessage}>{errorMessage}</div>
			: <div className={styles.loader}></div>
            }
        </div>
        
    );
}

export default Episode;