import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getEpisode, postTranscribeEpisode, getTranscribeUpdate } from '../../utils/api';
import useIsActive from '../../hook/useIsActive';
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
    const [editTranscription, setEditTranscription] = useState("");

    //util states 
    const openEditor = useIsActive();

    //api calls
    const getEpisodeAPI = () => {
        const data = { episodeID, podcastID };
        getEpisode(data)
        .then((response) => {
            const episodeData = response.data.Data;
<<<<<<< Updated upstream
            setCurrentEpisode(episodeData);
=======
            const isTooLong = (episodeData.episodeAudioLength > 420);
            setCurrentEpisode({ 
                ...episodeData,
                isTooLong
            });
>>>>>>> Stashed changes
            if (episodeData.transcribedText) {
                setEditTranscription(episodeData.transcribedText);
            }
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

                setEditTranscription(transcribedText);
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
        setCurrentEpisode({
            ...currentEpisode,
            transcribedStatus : "IN PROGRESS",
        });
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
        return `${episodeMin}:${episodeSec > 9 ? episodeSec : `0`+episodeSec}`;
    }

    const openTranscription = () => {
       openEditor.activate();
    }

    const closeTranscription = () => {
        setCurrentEpisode({ 
            ...currentEpisode, 
            transcribedText : editTranscription,
        });
        openEditor.deactivate();
     }

    const onChangeEditTranscription = (value) => {
        setEditTranscription(value);
    }

    const openAudio = () => {
        const audio = {
            episodeTitle: currentEpisode.episodeTitle,
            podcastTitle: currentEpisode.podcastTitle,
            podcastPublisher: currentEpisode.podcastPublisher,
            audioUrl: currentEpisode.episodeAudioLink,
        }
        props.openAudioPlayer(audio);
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
                            <button className={styles.episodePlayButton} onClick={openAudio}>
                                <img src={baseUrl + "/assets/button/play.svg"} alt="play episode button" title="Play Episode"/>
                            </button>
                            
                            { currentEpisode.transcribedStatus === "NOT TRANSCRIBED" && 
                            <button className={styles.episodeTranscribeButton} onClick={() => postTranscribeEpisodeAPI(currentEpisode.episodeAudioLink)} disabled={currentEpisode.isTooLong} > 
                                <img src={baseUrl + "/assets/button/transcribe.png"} alt="transcribe episode button" title={currentEpisode.isTooLong ? "Episode is too long to transcribe" : "Transcribe Episode"}/>
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
                        <p dangerouslySetInnerHTML={{__html: currentEpisode.episodeDescription}}></p>
                    </div> 
                    
                    <div className={styles.episodeTranscription}>
                        <div className={styles.header}>
                            <strong>Transcription</strong>
                            { openEditor.isActive 
                            ? <button className={styles.editTranscription} onClick={closeTranscription}>Save <img src={baseUrl + "/assets/button/save.svg"} alt="" title="Save Episode Transcription"/></button> 
                            : <button className={styles.editTranscription} onClick={openTranscription}>Edit <img src={baseUrl + "/assets/button/edit.svg"} alt="" title="Edit Episode Transcription"/></button> }
                        </div>
                        {/* <br/> */}
                        { !openEditor.isActive && 
                            <p dangerouslySetInnerHTML={{__html: currentEpisode.transcribedText || "No Transcription Available" }}></p>
                        }                       
                    </div>

                    { openEditor.isActive &&
                    <ReactQuill 
                        name="editTranscription"
                        value={editTranscription}
                        onChange={onChangeEditTranscription} /> 
                    }
                </div>
            </>
            : (errorMessage) 
			? <div className={styles.errorMessage}>{errorMessage}</div>
			: <div className="loader" />
            }
        </div>
        
    );
}

export default Episode;
