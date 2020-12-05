import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
    getEpisode, 
    getTranscribeUpdate, 
    postRequestTranscription, 
    postEditTranscription, 
    putSubmitReview,
} from '../../utils/api';
import { useIsActive } from '../../hooks';
import { Review, ReviewFeed } from "../../component/Episode"
import { baseUrl, errorEpisode } from "../../utils/constants";
import styles from "./Episode.module.scss";

function Episode({validateToken, ...props}) {
    //vars
    const { episodeID, podcastID } = useParams();
    const { access_token } = props.user;

    //states
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingReview, setIsLoadingReview] = useState(false);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [editTranscription, setEditTranscription] = useState("");
    const showDescription = useIsActive(true);
    const showTranscription = useIsActive(true);

    //util states 
    const openEditor = useIsActive();

    //api calls
    const getEpisodeAPI = () => {
        const data = { episodeID, podcastID };
        getEpisode(data)
        .then((response) => {
            const episodeData = response.data.Data;
        
            if (episodeData?.transcribedStatus === "COMPLETED") {
                setEditTranscription(episodeData.transcribedText);
            }
            setCurrentEpisode(episodeData);
        })
        .catch((error) => {
            console.log(error);
            setErrorMessage(errorEpisode);
        });
    };

    const getTranscribeUpdateAPI = () => {
        const data = { episodeID, podcastID }
        getTranscribeUpdate(data)
        .then((response) => {
            const transcribeUpdateData = response.data.Data;

            const transcribedStatus = transcribeUpdateData.transcribedStatus;
            
            if (transcribedStatus !== currentEpisode?.transcribedStatus) {
                setCurrentEpisode({
                    ...currentEpisode,
                    transcribedStatus,
                });
            }

            if (transcribedStatus === "AWAITING TRANSCRIPTION APPROVAL") {
                setTimeout(getTranscribeUpdateAPI, 90000);
            } 
            else if (transcribedStatus === "TRANSCRIBING") {
                setTimeout(getTranscribeUpdateAPI, 5000);
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

    const requestTranscriptionAPI = () => {
        setIsLoading(true);

        const data = { 
            podcastID, 
            episodeID, 
            episodeLength : currentEpisode.episodeAudioLength, 
            access_token 
        }

        postRequestTranscription(data)
        .then((response) => {
            setIsLoading(false);
            if (response.data.Success) {
                setCurrentEpisode({
                    ...currentEpisode,
                    transcribedStatus : "AWAITING TRANSCRIPTION APPROVAL",
                });
            }
            else if (response?.data?.Error) {
                alert(response.data.Error);
            }
        })
        .catch((error) => {
            setIsLoading(false);
            console.log(error);
            if (error?.data?.Error) {
                alert(error.data.Error);
            }
        });
    }

    const requestEditTranscriptionAPI = () => {
        openEditor.deactivate();
        setCurrentEpisode({
            ...currentEpisode,
            transcribedStatus : "EDIT IN PROGRESS",
        });
        const data = { 
            podcastID, 
            episodeID, 
            editedTranscriptionText: editTranscription,
            access_token, 
        }

        postEditTranscription(data)
        .then((response) => {
            if (response?.data?.Success) {
                alert(response.data.Success);
            }
            else if (response?.data?.Error) {
                alert(response.data.Error);
            }
        })
        .catch((error) => {
            console.log(error);
            if (error?.Error) {
                alert(error.Error);
            }
        });
    }

    const putSubmitReviewAPI = (userReview) => {
        setIsLoadingReview(true);
        const data = {
            ...userReview,
            access_token,
            podcastID,
            episodeID,
        }

        putSubmitReview(data)
        .then((response) => {
            setIsLoadingReview(false);
            if (response?.data?.Success) {
                alert(response.data.Success);
            }
            else if (response?.data?.Error) {
                alert(response.data.Error);
            }
        })
        .catch((error) => {
            setIsLoadingReview(false);
            console.log(error);
            if (error?.Error) {
                alert(error.Error);
            }
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

    const saveTranscription = () => {
        setCurrentEpisode({ 
            ...currentEpisode, 
            transcribedText : editTranscription,
        });
        openEditor.deactivate();
    }

    const closeTranscription = () => {
        openEditor.deactivate();
     }

    const onChangeEditTranscription = (value) => {
        setEditTranscription(value);
    }

    const openAudio = () => {
        const audio = {
            podcastID: currentEpisode.podcastID,
            episodeID: currentEpisode.episodeID,
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

    useEffect(() => {
		if (!!access_token) {
			validateToken();
		}
	}, [access_token]);

    useEffect(() => {
        if (!!currentEpisode?.transcribedStatus && 
            (currentEpisode?.transcribedStatus !== "NOT TRANSCRIBED" 
            && currentEpisode?.transcribedStatus !== "COMPLETED")){ 
            getTranscribeUpdateAPI();
        }
    }, [currentEpisode]);

    return (
        <div className={styles.episodeContainer}>
            { (currentEpisode && !errorMessage) 
            ? <> 
                <div className={styles.desktopTop}>
                    <div className={styles.desktopLeft}>
                        <img className={styles.episodeImage} src={currentEpisode.episodeImage} alt="Episode" />
                        
                        <div className={styles.episodeData}>
                            <div className={styles.episodeButtons}>
                                <button className={styles.episodePlayButton} onClick={openAudio} title="Play Episode">
                                    <img src={baseUrl + "/assets/button/play.svg"} alt="play episode button" />
                                </button>
                                
                                { (currentEpisode.transcribedStatus === "NOT TRANSCRIBED" && isLoading === false) && 
                                <button className={styles.episodeTranscribeButton} onClick={requestTranscriptionAPI} title="Request Episode Transcription"> 
                                    <img src={baseUrl + "/assets/button/transcribe.png"} alt="transcribe episode button" />
                                </button>}

                                { (currentEpisode.transcribedStatus === "AWAITING TRANSCRIPTION APPROVAL") && 
                                <div className={styles.episodeStatus} title="Episode Transcription Requested, Awaiting Approval" >
                                    <img src={baseUrl + "/assets/button/wait.png"} alt="waiting for transcription approval" />
                                </div>}

                                { (currentEpisode.transcribedStatus === "TRANSCRIBING" || isLoading === true) && 
                                <div className="loaderSmall"></div>}
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.desktopRight}>
                        <div className={styles.episodeTitle}>
                            <strong>{currentEpisode.episodeTitle}</strong>
                        </div> 

                        <div className={styles.dataSection}>
                            <div className={styles.dataTitle}><strong>Podcast</strong></div>
                            <Link to={`/podcast/${currentEpisode.podcastID}`} className={styles.link}>{currentEpisode.podcastTitle}</Link>
                        </div>

                        { currentEpisode.podcastPublisher &&
                        <div className={styles.dataSection}>
                            <div className={styles.dataTitle}><strong>Publisher</strong></div>
                            {currentEpisode.podcastPublisher}
                        </div>}

                        <div className={styles.dataSection}>
                            <div className={styles.dataTitle}><strong>Length</strong></div>
                            {formatEpisodeLength(currentEpisode.episodeAudioLength)}
                        </div>

                        <div className={styles.dataSection}>
                            <div className={styles.dataTitle}>
                                <button className={styles.showMore} onClick={()=> showDescription.toggle()}>
									<img 
										src={baseUrl + "/assets/button/show-more.png"} 
										alt={showDescription.isActive ? "Hide Description" : "Show Description"}
										className={showDescription.isActive && styles.rotate}  
									/>
								</button>
                                <strong>Description</strong>
                            </div>
                            { showDescription.isActive &&
                                <p dangerouslySetInnerHTML={{__html: currentEpisode.episodeDescription}}></p>
                            }
                        </div> 
                    
                        <div className={styles.dataSection}>
                            <div className={styles.dataTitle}>
                                <button className={styles.showMore} onClick={()=> showTranscription.toggle()}>
									<img 
										src={baseUrl + "/assets/button/show-more.png"} 
										alt={showTranscription.isActive ? "Hide Transcription" : "Show Transcription"}
										className={showTranscription.isActive && styles.rotate}  
									/>
								</button>
                                <strong>Transcription</strong>
                            </div>
                                {(!!currentEpisode.transcribedText) && 
                                <>
                                <div className={styles.editTranscriptionButtons}>
                                {(!!currentEpisode.transcribedText && openEditor.isActive && !!props.user.access_token)
                                ? <>
                                    <button className={styles.editTranscription} onClick={closeTranscription} title="Close Editor and Remove Changes">Cancel</button> 
                                    <button className={styles.editTranscription} onClick={saveTranscription} title="Save Your Current Changes on This Page">Save <img src={baseUrl + "/assets/button/save.svg"} alt=""/></button> 
                                    <button className={styles.editTranscription} onClick={requestEditTranscriptionAPI} title="Submit Your Edit Request">Submit 
                                        <img src={baseUrl + "/assets/button/submit.svg"} alt=""/>
                                    </button> 
                                </>
                                : <button 
                                    className={styles.editTranscription} 
                                    onClick={openTranscription} 
                                    disabled={!props.user.access_token || currentEpisode.transcribedStatus === "EDIT IN PROGRESS"} 
                                    title={(!props.user.access_token) 
                                        ? "Login to Edit Transcription" 
                                        : (currentEpisode.transcribedStatus === "EDIT IN PROGRESS") 
                                        ? "Transcription Edit in Progress Already"
                                        : "Edit Episode Transcription"}
                                >
                                    Edit 
                                    <img src={baseUrl + "/assets/button/edit.svg"} alt=""/>
                                </button> 
                                }
                                </div>
                                </>}
                            { (showTranscription.isActive && !openEditor.isActive) && 
                                <p className={styles.episodeTranscription} dangerouslySetInnerHTML={{__html: currentEpisode.transcribedText || "No Transcription Available Yet" }}></p>
                            }                       

                            { (openEditor.isActive && !!props.user.access_token) &&
                            <ReactQuill 
                                name="editTranscription"
                                value={editTranscription}
                                onChange={onChangeEditTranscription} /> 
                            }
                        </div>
                    </div>
                </div>
                
                {!!access_token &&
                    <Review submitReview={putSubmitReviewAPI} isLoadingReview={isLoadingReview} />
                }   
                <ReviewFeed podcastID={podcastID} episodeID={episodeID} />
            </>
            : (errorMessage) 
			? <div className={styles.error}>{errorMessage}</div>
			: <div className="loader" />
            }
        </div>
    );
}

export default Episode;
