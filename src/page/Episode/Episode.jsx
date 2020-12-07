import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
    getEpisode, 
    getTranscribeUpdate, 
    postRequestTranscription, 
    postEditTranscription, 
    putSubmitReview,
    getUser,
    postFavoritePodcast,
} from '../../utils/api';
import { useIsActive, useOnClickOutside } from '../../hooks';
import { Review, ReviewFeed } from "../../component/Episode"
import { Modal, SectionContainer } from "../../component/Podcast"
import { 
    baseUrl, 
    errorEpisode, 
    podcastCommands, 
    podcastDisclaimer, 
    errorFavoritePodcast 
} from "../../utils/constants";
import { 
    formatEpisodeLength, 
    isInFavoritePodcasts, 
    getNameInFavoritePodcasts 
} from "../../utils/helper";
import styles from "./Episode.module.scss";

function Episode({validateToken, user, setUser, ...props}) {
    //vars
    const { episodeID, podcastID } = useParams();
    const { access_token, ratings, favoritePodcasts } = user;

    //states
    const [isLoading, setIsLoading] = useState(false);
    const [submittedReview, setSubmittedReview] = useState(false);
    const [isLoadingReview, setIsLoadingReview] = useState(false);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [editTranscription, setEditTranscription] = useState("");
    const showDescription = useIsActive(true);
    const showTranscription = useIsActive(true);
    const favoritePodcast = useIsActive();
    const inputModalState = useIsActive();
    const [inputFavoritePodcast, setInputFavoritePodcast] = useState({podcastName: "", command: ""});
    const [errorInputMessage, setErrorInputMessage] = useState("");
    const openEditor = useIsActive();

    	//refs
	const inputModalRef = useRef();
	useOnClickOutside(inputModalRef, () => {
		inputModalState.deactivate();
		setErrorInputMessage("");
	});

    //api calls
    const getEpisodeAPI = () => {
        const data = { episodeID, podcastID };
        getEpisode(data)
        .then((response) => {
            const episodeData = response.data.Data;
            const podcastCommand = isInFavoritePodcasts(podcastID, favoritePodcasts) ? "unfavorite" : "favorite";
            const podcastNameInFavorites = getNameInFavoritePodcasts(podcastID, favoritePodcasts);
			setInputFavoritePodcast({
				podcastName: podcastNameInFavorites ?? episodeData.podcastTitle,
				command: podcastCommands[podcastCommand],
            });
            (podcastCommand === "unfavorite") ? favoritePodcast.activate() : favoritePodcast.deactivate();
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

    const postFavoritePodcastAPI = () => {
		setIsLoading(true);
		const data = {
			access_token,
			podcastID,
			...inputFavoritePodcast,
		}
		postFavoritePodcast(data)
		.then((response) => {
			setIsLoading(false);
			const podcastCommand = (inputFavoritePodcast.command === "favorite") ? "unfavorite" : "favorite";
			setInputFavoritePodcast({
				...inputFavoritePodcast,
				command: podcastCommands[podcastCommand]
			})
			alert(response.data.Data);
			favoritePodcast.toggle();
			inputModalState.deactivate();
		})
		.catch((error) => {
			setIsLoading(false);
			if (error?.data?.Error) {
				alert(error.data.Error);
			} else {
				alert(error);
			}
		})
	}

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
        setSubmittedReview(true);
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

    const getUserAPI = () => {
		getUser({access_token})
        .then((response) => {
            const userData = response.data;
            const allUserData = { 
                ...user,
                ...userData, 
            }
            localStorage.setItem("user", JSON.stringify(allUserData));
            setUser(allUserData);
            // history.go(0);
        })
        .catch((error) => {
        	console.log(error);
        });
	}

    //utils 
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

    const onClickFavorite = () => {
		inputModalState.activate();
	}

    const onSubmitFavorite = () => {
		if (currentEpisode.podcastTitle !== inputFavoritePodcast.podcastName) {
			postFavoritePodcastAPI();
		}
		else {
			setErrorInputMessage(errorFavoritePodcast);
		}
    }
    
    function onChangeInput(event) {
        setInputFavoritePodcast({
			...inputFavoritePodcast, 
			podcastName: event.target.value
		});
    }

    //api call to get episode
    useEffect(() => {
        getEpisodeAPI();
    }, []);

	useEffect(() => {
		if (!!access_token) {
			validateToken();
			getUserAPI();
		}
    }, [access_token]);
    
    useEffect(()=> {
        if (!isLoading || !access_token) return;
        getUserAPI();
	}, [isLoading])

    useEffect(() => {
        if (!isLoadingReview) return;
        if (!!currentEpisode?.transcribedStatus && 
            (currentEpisode?.transcribedStatus !== "NOT TRANSCRIBED" 
            && currentEpisode?.transcribedStatus !== "COMPLETED")){ 
            getTranscribeUpdateAPI();
        }
    }, [currentEpisode, isLoadingReview]);

    useEffect(()=> {
        if (!submittedReview || !access_token) return;
        getUser({access_token})
        .then((response) => {
            const userData = response.data;
            const allUserData = { 
                ...user,
                ...userData, 
            }
            localStorage.setItem("user", JSON.stringify(allUserData));
            props.setUser(allUserData);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [submittedReview, access_token])

    return (
        <div className={styles.episodeContainer}>
            {(inputModalState.isActive) && 
			<div className={styles.podcastModal} ref={inputModalRef}>
				<Modal 
					input={inputFavoritePodcast.podcastName} 
					onChangeInput={onChangeInput} 
					isLoading={isLoading} 
					onSubmitFavorite={onSubmitFavorite}
					errorInputMessage={errorInputMessage}
					podcastDisclaimer={podcastDisclaimer}
				/>
			</div>}
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
                            {currentEpisode.episodeTitle}
                        </div> 

                        <SectionContainer label="Podcast">
                            <div className={styles.podcastTitle}>
                                <Link to={`/podcast/${currentEpisode.podcastID}`} className={styles.link}>{currentEpisode.podcastTitle}</Link>
                                <button 
                                    className={styles.podcastFavorite} 
                                    onClick={favoritePodcast.isActive ? postFavoritePodcastAPI : onClickFavorite}
                                    title={(!access_token) 
                                        ? "Sign in to add to your Favorites" 
                                        : favoritePodcast.isActive 
                                        ? "Remove from Favorites" 
                                        : "Favorite Podcast"
                                    }
                                    disabled={!access_token || !!isLoading}
                                >
                                    <img 
                                        src={baseUrl + (favoritePodcast.isActive ? "/assets/button/heart-fill.svg" : "/assets/button/heart.svg")} 
                                        alt=""
                                    />
                                </button>
                            </div>
                        </SectionContainer>

                        { currentEpisode.podcastPublisher &&
                        <SectionContainer label="Publisher">
                            {currentEpisode.podcastPublisher}
                        </SectionContainer>}

                        <SectionContainer label="Length">
                            {formatEpisodeLength(currentEpisode.episodeAudioLength)}
                        </SectionContainer>

                        <SectionContainer label="Description">
                            {/* <div className={styles.dataTitle}>
                                <button className={styles.showMore} onClick={()=> showDescription.toggle()}>
									<img 
										src={baseUrl + "/assets/button/show-more.png"} 
										alt={showDescription.isActive ? "Hide Description" : "Show Description"}
										className={showDescription.isActive && styles.rotate}  
									/>
								</button>
                                <strong>Description</strong>
                            </div> */}
                            { showDescription.isActive &&
                                <p dangerouslySetInnerHTML={{__html: currentEpisode.episodeDescription}}></p>
                            }
                        </SectionContainer> 
                    
                        <SectionContainer label="Transcription">
                            <div className={styles.dataTitleTranscription}>
                                <div className={styles.dataTitleRight} />
                                {(!!currentEpisode.transcribedText) && 
                                    <div className={styles.editTranscriptionButtons}>
                                    {(!!currentEpisode.transcribedText && openEditor.isActive && !!user.access_token)
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
                                        disabled={!user.access_token || currentEpisode.transcribedStatus === "EDIT IN PROGRESS"} 
                                        title={(!user.access_token) 
                                            ? "Login to Edit Transcription" 
                                            : (currentEpisode.transcribedStatus === "EDIT IN PROGRESS") 
                                            ? "Transcription Edit in Progress Already"
                                            : "Edit Episode Transcription"}
                                    >
                                        Edit 
                                        <img className={(!user.access_token || currentEpisode.transcribedStatus === "EDIT IN PROGRESS") && styles.disabled} src={baseUrl + "/assets/button/edit.svg"} alt=""/>
                                    </button> 
                                    }
                                    </div>
                                }
                            </div>
                            { (showTranscription.isActive && !openEditor.isActive) && 
                                <p className={styles.episodeTranscription} dangerouslySetInnerHTML={{__html: currentEpisode.transcribedText || "No Transcription Available Yet" }}></p>
                            }                       

                            { (openEditor.isActive && !!user.access_token) &&
                            <div className = {styles.transcriptionEditor}>
                            <ReactQuill 
                                name="editTranscription"
                                value={editTranscription}
                                onChange={onChangeEditTranscription} /> 
                            </div>
                            }
                        </SectionContainer>
                    </div>
                </div>
                
                {(!!access_token && !ratings.includes(String(podcastID+episodeID))) &&
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
