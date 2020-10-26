import React from 'react';
import styles from '../Thumbnail/Thumbnail.module.css'

function Thumbnail(props) {
  return (    <div className={styles.thumbnailWrapper}>
                     <div className={styles.mainThumbnailContainer}>
                            <p>this is the thumbnail</p>
                            <p>{props.id}</p>
                     </div>
                     <p>{props.title}</p>
              </div>
  );
}

export default Thumbnail;
