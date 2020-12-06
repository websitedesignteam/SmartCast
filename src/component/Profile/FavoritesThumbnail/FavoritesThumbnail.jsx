import React from 'react'
import styles from '../FavoritesThumbnail/FavoritesThumbnail.module.scss'
function FavoritesThumbnail(props) {
       
       const userData = props.userData

       return (
              <div className={styles.thumbnailWrapper}>
                    <div className={styles.content}>
                           <p>{props.podcastName}</p>
                           <p onClick={props.unFavoritePodcast}>
                                  X
                           </p>
                    </div>
                    <div className={styles.fancyBottom}>
                    </div>
              </div>
       )
}

export default FavoritesThumbnail;
