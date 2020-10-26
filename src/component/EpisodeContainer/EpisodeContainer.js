import React from 'react'
import styles from '../EpisodeContainer/EpisodeContainer.module.css'

function EpisodeContainer(props) {
       return (
              <div className={styles.EpisodeContainer}>
                     <div className={styles.img}>
                            <img src={props.imgSrc}></img>
                     </div>
                     <div className={styles.textContainer}>
                            <h4>{props.episodeTitle}</h4>
                            <p dangerouslySetInnerHTML={{__html: props.episodeDescription}}></p>
                     </div>
              </div>
       )
}

export default EpisodeContainer;