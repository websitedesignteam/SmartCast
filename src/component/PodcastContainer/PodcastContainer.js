import React from 'react'
import styles from '../PodcastContainer/PodcastContainer.module.css'

function PodcastContainer(props) {
       return (
              <div className={styles.PodcastContainer}>
                     <div className={styles.img}>
                            <img src={props.imgSrc}></img>
                     </div>
                     <div className={styles.textContainer}>
                            <h4>{props.podcastTitle}</h4>
                            <p dangerouslySetInnerHTML={{__html: props.podcastDescription}}></p>
                     </div>
              </div>
       )
}

export default PodcastContainer;