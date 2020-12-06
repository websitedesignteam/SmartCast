import React, {useEffect, useState}from 'react'
import ResultsPill from '../../Home/ResultsPill/ResultsPill'
import styles from '../SearchResults/SearchResults.module.scss'
import {useHistory} from 'react-router-dom'

function SearchResults(props) {
       
       const [episodeData, setEpisodeData] = useState(props.episodeData)
       let history = useHistory();

       const closeModal = () => {
              props.closeModal()
       }

       const sendToEpisode = (podcastID, episodeID) =>{
              history.push(`/podcast/${podcastID}/episode/${episodeID}`)
       }
       const sendToPodcast = (podcastID) =>{
              history.push(`/podcast/${podcastID}`)
       }


       return (
              <div className={styles.container}>
                     <div className={styles.border}>
                            <div className={styles.innerContainer}>
                                   <div className={styles.upperPart}>
                                          <div>
                                          Podcast Results: ({episodeData.length})
                                          </div>
                                          <div className={styles.closeButton} onClick={()=>closeModal()}>
                                          X
                                          </div>
                                   </div>
                                   <div className={styles.lowerPart}>
                                          {episodeData.map((episode, index)=><div className={styles.resultsPill}onClick={()=>sendToPodcast(episode.podcastID)}><ResultsPill podcastTitle={episode.podcastTitle} label={episode.episodeTitle} episodeThumbnail={episode.episodeThumbnail}/></div>)}
                                   </div>
                            </div>
                     </div>
              </div>
       )
}

export default SearchResults;
