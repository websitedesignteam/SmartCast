import React, {props} from 'react'
import {postTranscribeEpisode} from '../../../utils/api'
import styles from '../../Profile/Transcriptions/Transcriptions.module.css'

const Transcriptions=(props)=> {


       const handleChoice =(choice)=>{
              let body = {"episodeID":props.episodeID,
                            "podcastID": props.podcastID,
                            "decision": choice,
                            "access_token": props.access_token}
                     console.log(body)
              if (choice === 'accept'){
                     postTranscribeEpisode(body)
                     window.location.reload()
              }else if (choice === 'deny'){
                     postTranscribeEpisode(body)
                     window.location.reload()
              }
       }

       return (
              <div className={styles.transcriptionsContainer}>
                    <div className={styles.contentContainer}>
                           <div className={styles.middleContent}>
                                   <span>Transcription Time: {props.time}</span>
                           </div>
                           <div className={styles.rightContent}>
                                  <div className={styles.acceptContainer} onClick={()=>handleChoice('accept')}>
                                          ✓
                                  </div>
                                  <div className={styles.rejectContainer} onClick={()=>handleChoice('deny')}>
                                          X
                                   </div>
                           </div>
                    </div>
              </div>
       )
}

export default Transcriptions;
