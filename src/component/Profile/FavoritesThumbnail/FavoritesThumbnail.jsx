import React from 'react'
import { baseUrl } from '../../../utils/constants'
import styles from '../FavoritesThumbnail/FavoritesThumbnail.module.scss'
function FavoritesThumbnail(props) {
       
       const userData = props.userData

       return (
              <div className={styles.thumbnailWrapper}>
                    <div className={styles.content}>
                           <p className={styles.podcastName} onClick={props.sendToPodcast}>{props.podcastName}</p>
                           <div className={styles.removeButton} onClick={props.unFavoritePodcast}>
                                  <div className={styles.trashCanContainer}>
                                          <img id={styles.trashCan}src={baseUrl+"/assets/trash.svg"}/>
                                  </div>
                            </div>
                    </div>
                    <div className={styles.fancyBottom}>
                    </div>
              </div>
       )
}

export default FavoritesThumbnail;
