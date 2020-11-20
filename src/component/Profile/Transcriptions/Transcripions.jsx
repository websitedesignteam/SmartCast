import React, {props} from 'react'
import styles from '../../Profile/Transcriptions/Transcriptions.module.css'

const Transcripions=(props)=> {

       return (
              <div className={styles.transcriptionsContainer}>
                    <div className={styles.contentContainer}>
                            <div className={styles.leftContent}>
                                   <img className={styles.icon}src={window.location.origin + '/assets/temporaryIcons/sportsPodcastImg.png'}/>
                           </div>
                           <div className={styles.middleContent}>
                                   <span>User: {props.user}</span>
                                   <span>Podcast: {props.podcast}</span>
                                   <span>Podcast Episode: {props.episode} </span>
                                   <span>Transcription Time: {props.time}</span>
                           </div>
                           <div className={styles.rightContent}>
                                  <div className={styles.acceptContainer}>
                                          ✓
                                  </div>
                                  <div className={styles.rejectContainer}>
                                         𐄂
                                   </div>
                           </div>
                    </div>
              </div>
       )
}

export default Transcripions;
