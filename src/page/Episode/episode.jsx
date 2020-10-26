import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { getEpisode, postTranscribeEpisode, getTranscribeUpdate } from '../../utils/api';
import styles from "./Episode.module.scss";

function Episode(props) {
    //vars
    const { episodeID, podcastID } = useParams();
    const errorEpisodeMessageText = "Sorry! We couldn't find that episode.";
    const errorTranscribeMessageText = "Sorry! We couldn't transcribe that episode.";
    const baseUrl = process.env.PUBLIC_URL;

    //states
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    //api calls
    const getEpisodeAPI = () => {
        const data = { episodeID, podcastID };
        getEpisode(data)
        .then((response) => {
            const episodeData = response.data.Data;
            setCurrentEpisode(episodeData);
        })
        .catch((error) => {
            console.log(error);
            setErrorMessage(errorEpisodeMessageText);
        });
    };

    const getTranscribeUpdateAPI = () => {
        const data = { episodeID, podcastID }
        getTranscribeUpdate(data)
        .then((response) => {
            const transcribeUpdateData = response.data.Data;

            const transcribedStatus = transcribeUpdateData.transcribedStatus;
            
            setCurrentEpisode({
                ...currentEpisode,
                transcribedStatus,
            });

            if (transcribedStatus === "IN PROGRESS") {
                setTimeout(getTranscribeUpdateAPI, 3000);
            } 
            else if (transcribedStatus === "COMPLETED") {
                const transcribedText = transcribeUpdateData.transcribedText;

                setCurrentEpisode({ 
                    ...currentEpisode, 
                    transcribedText,
                    transcribedStatus,
                })
            } 
            else {
                return;
            }
        })
        .catch((error) => {
            console.log(error);
            setErrorMessage(error.message);
        });        
    }
    
    const postTranscribeEpisodeAPI = (audioLink) => {
        const data = { episodeID, podcastID, audioLink }
        postTranscribeEpisode(data)
        .then((response) => {
            if (response.data.Success) {
                getTranscribeUpdateAPI();
            }
            else if (response.data.Error) {
                setErrorMessage(errorTranscribeMessageText);
            }
        })
        .catch((error) => {
            console.log(error);
            setErrorMessage(error.message);
        });
    }

    //utils 
    const formatEpisodeLength = (episodeAudioLength) => {
        const episodeMin = Math.floor(episodeAudioLength/60);
        const episodeSec = episodeAudioLength%60;
        return `${episodeMin}:${episodeSec}`;
    }

    //api call to get episode
    useEffect(() => {
        getEpisodeAPI();
    }, []);

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
                                <img src={baseUrl + "/assets/button/play.svg"} alt="play episode button" title="Play Episode"/>
                            </button>
                            
                            { currentEpisode.transcribedStatus === "NOT TRANSCRIBED" && 
                            <button className={styles.episodeTranscribeButton} onClick={() => postTranscribeEpisodeAPI(currentEpisode.episodeAudioLink)}> 
                                <img src={baseUrl + "/assets/button/transcribe.png"} alt="transcribe episode button" title="Transcribe Episode"/>
                            </button>}

                            { currentEpisode.transcribedStatus === "IN PROGRESS" && 
                            <div className={styles.loaderSmall}></div>}
                        </div>
                    </div>

                    <div className={styles.podcastTitle}>
                        <strong>Podcast</strong>
                        <br/>
                        {currentEpisode.podcastTitle}
                    </div>

                    { currentEpisode.podcastPublisher &&
                    <div className={styles.episodePublisher}>
                        <strong>Publisher</strong>
                        <br/>
                        {currentEpisode.podcastPublisher}
                    </div>}

                    <div className={styles.episodeAudioLength}>
                        <strong>Length</strong>
                        <br/>
                        {formatEpisodeLength(currentEpisode.episodeAudioLength)}
                    </div>

                    <div className={styles.episodeDescription}>
                        <strong>Description</strong>
                        <br/>
                        {currentEpisode.episodeDescription}
                    </div> 

                    { currentEpisode.transcribedText &&    
                    <div>
                        <strong>Transcription</strong>
                        <br/>
                        {currentEpisode.transcribedText}                        
                    </div>}
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