import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from "react-router-dom";
import { getPodcast, postFavoritePodcast, getUser } from '../../utils/api';
import { useIsActive, useOnClickOutside } from 'hooks';
import styles from "./Podcast.module.scss";
import { isInFavoritePodcasts, getNameInFavoritePodcasts } from "../../utils/helper";
import { podcastCommands, podcastDisclaimer, errorFavoritePodcast, errorTooBusy } from "../../utils/constants"; 
import { Modal, EpisodeCard, SectionContainer } from "../../component/Podcast";
import { baseUrl, errorPodcast } from "../../utils/constants";

function Podcast({user, validateToken, setUser, ...props}) {
	//vars
	const { podcastID } = useParams();
	const { access_token, favoritePodcasts } = user;

	//states
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
	
	const [inputFavoritePodcast, setInputFavoritePodcast] = useState({podcastName: "", command: ""});
	const [currentPodcast, setCurrentPodcast] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const showDescription = useIsActive(true);
	const showEpisodes = useIsActive(true);
	const favoritePodcast = useIsActive();
	const inputModalState = useIsActive();
	const [errorInputMessage, setErrorInputMessage] = useState("");

	//make into custom hook
	const [episodePageList, setEpisodePageList] = useState([]); 
	const [currentEpisodePageIndex, setCurrentEpisodePageIndex] = useState(-1);

	//refs
	const inputModalRef = useRef();
	useOnClickOutside(inputModalRef, () => {
		inputModalState.deactivate();
		setErrorInputMessage("");
	});

	//api call to get podcast metadata
	const getPodcastAPI = () => {
		const data = { podcastID, nextPage : episodePageList[currentEpisodePageIndex] }
		getPodcast(data)
		.then((response) => {
			setIsLoading(false);
			const podcastData = response.data.Data;
			setEpisodePageList(episodePageList.concat([podcastData.nextPageNumber]));
			const podcastCommand = isInFavoritePodcasts(podcastID, favoritePodcasts) ? "unfavorite" : "favorite";
			const podcastNameInFavorites = getNameInFavoritePodcasts(podcastID, favoritePodcasts);
			setInputFavoritePodcast({
				podcastName: podcastNameInFavorites ?? podcastData.podcastTitle,
				command: podcastCommands[podcastCommand],
			});
			(podcastCommand === "unfavorite") ? favoritePodcast.activate() : favoritePodcast.deactivate();
			setCurrentPodcast(podcastData);
		})
		.catch((error) => {
			console.log(error);
			if (error?.data?.message === "Too Many Requests") {
				alert(errorTooBusy);
			} else {
				setErrorMessage(errorPodcast);
			}
		});
	};

	const postFavoritePodcastAPI = () => {
		setIsLoadingFavorite(true);
		const data = {
			access_token,
			podcastID,
			...inputFavoritePodcast,
		}
		postFavoritePodcast(data)
		.then((response) => {
			setIsLoadingFavorite(false);
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
			setIsLoadingFavorite(false);
			if (error?.data?.Error) {
				alert(error.data.Error);
			} else {
				alert(error);
			}
		})
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
        })
        .catch((error) => {
        	console.log(error);
        });
	}

	//util functions
	const gotoLastPage = () => {
		if (currentEpisodePageIndex > -1) {
			setCurrentEpisodePageIndex(currentEpisodePageIndex-1)
		}
		else {
			return;
		}
	}

	const gotoNextPage = () => {
		if (currentEpisodePageIndex < episodePageList.length-1) {
			setCurrentEpisodePageIndex(currentEpisodePageIndex+1)
		}
		else {
			return;
		}
	}

	const onClickFavorite = () => {
		inputModalState.activate();
	}

	const onSubmitFavorite = () => {
		if (currentPodcast.podcastTitle !== inputFavoritePodcast.podcastName) {
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

	useEffect(() => {
		if (!!access_token) {
			validateToken();
			getUserAPI();
		}
	}, [access_token]);

	useEffect(() => {
		getPodcastAPI();
	}, [currentEpisodePageIndex]);

	useEffect(() => {
        if (!isLoading) return;
		getPodcastAPI();
    }, [isLoading]);

	return (
		<>
			{(inputModalState.isActive) && 
			<div className={styles.podcastModal} ref={inputModalRef}>
				<Modal 
					input={inputFavoritePodcast.podcastName} 
					onChangeInput={onChangeInput} 
					isLoading={isLoadingFavorite} 
					onSubmitFavorite={onSubmitFavorite}
					errorInputMessage={errorInputMessage}
					podcastDisclaimer={podcastDisclaimer}
				/>
			</div>}
			<div className={styles.podcastContainer}>
				{ (currentPodcast && !errorMessage) 
				? <> 
					<div className={styles.desktopLeft}>
						<img className={styles.podcastImage} src={currentPodcast.podcastImage} alt="podcast cover" />
						<div className={styles.podcastHeader}>
							<div className={styles.podcastTitle}>
								<strong>{currentPodcast.podcastTitle}</strong>
							</div> 
							<button 
								className={styles.podcastFavorite} 
								onClick={favoritePodcast.isActive ? postFavoritePodcastAPI : onClickFavorite}
								title={(!access_token) 
									? "Sign in to add to your Favorites" 
									: favoritePodcast.isActive
									? "Remove from Favorites" 
									: "Favorite Podcast"
								}
								disabled={!access_token || !!isLoadingFavorite}
							>
								<img 
									src={baseUrl + ((favoritePodcast.isActive && inputFavoritePodcast["command"] === "remove") ? "/assets/button/heart-fill.svg" : "/assets/button/heart.svg")} 
									alt=""
								/>
							</button>
						</div>
					</div>

					<div className={styles.desktopRight}>
						<SectionContainer label="Publisher">
							{currentPodcast.podcastPublisher}
						</SectionContainer> 
						<div className={styles.podcastDescription}>
							<SectionContainer label="Description">
								{/* <div className={styles.subHeader}>
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
								<p dangerouslySetInnerHTML={{__html: currentPodcast.podcastDescription}} /> }
							</SectionContainer>
						</div> 
						
						<div className={styles.podcastEpisodes}>
							<SectionContainer label="Episodes">
							{/* <div className={styles.subHeader}>
								<button className={styles.showMore} onClick={()=> showEpisodes.toggle()}>
									<img 
										src={baseUrl + "/assets/button/show-more.png"} 
										alt={showEpisodes.isActive ? "Hide Episodes" : "Show Episodes"}
										className={showEpisodes.isActive && styles.rotate}  
									/>
								</button>
								<strong>Episodes</strong> 
							</div> */}
							{ showEpisodes.isActive && 
							<>
								<ul className={styles.episodeList}>
								{ currentPodcast.episodes.map((episode, index) => 
									<li key={index} className={styles.episodeLink}>
										<Link to={`/podcast/${podcastID}/episode/${episode.episodeID}`}>
											<EpisodeCard episode={episode} />
										</Link>
									</li> 
								)}
								</ul> 

								<div className={styles.episodePageButtons}>
									{ currentEpisodePageIndex > -1 &&
									<button onClick={gotoLastPage}><img src={baseUrl + "/assets/button/page-back.png"} alt="Previous Page" title="Go to previous page"/></button>}
									{ currentEpisodePageIndex < episodePageList.length-1 &&
									<button onClick={gotoNextPage}><img src={baseUrl + "/assets/button/page-next.png"} alt="Next Page" title="Go to next page"/></button>}
								</div>
							</>}
							</SectionContainer>
						</div>
					</div>
				</>
				: (errorMessage) 
				? <div className={styles.error}>{errorMessage}</div>
				: <div className="loader" />
				}
			</div>
		</>
	);
}

export default Podcast;
