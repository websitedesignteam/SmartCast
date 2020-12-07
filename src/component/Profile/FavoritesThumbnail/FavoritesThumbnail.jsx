import React from 'react'
import styles from '../FavoritesThumbnail/FavoritesThumbnail.module.scss'
function FavoritesThumbnail(props) {
       
       const userData = props.userData

       return (
              <div className={styles.thumbnailWrapper}>
                    <div className={styles.content}>
                           <p className={styles.podcastName} onClick={props.sendToPodcast}>{props.podcastName}</p>
                           <p className={styles.removeButton} onClick={props.unFavoritePodcast}>
                                  X
                           </p>
                    </div>
                    <div className={styles.fancyBottom}>
                    </div>
              </div>
       )
}

export default FavoritesThumbnail;
