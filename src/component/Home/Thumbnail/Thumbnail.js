import React from 'react';
import styles from '../Thumbnail/Thumbnail.module.css'

function Thumbnail(props) {
  return (    <div className={styles.thumbnailWrapper}>
                     <div className={styles.mainThumbnailContainer}>
                            <img className={styles.thumbnailImg} src={process.env.PUBLIC_URL + "/assets/playlist-placeholder.png"} alt="Default Podcast Thumbnail"/>
                            <p>{props.id}</p>
                     </div>
                     <p>{props.title}</p>
              </div>
  );
}

export default Thumbnail;
