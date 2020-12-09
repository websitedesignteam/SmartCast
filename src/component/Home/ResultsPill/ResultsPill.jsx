import React from 'react'
import styles from '../ResultsPill/ResultsPill.module.scss'
import StarRatings from 'react-star-ratings'
const ResultsPill=(props)=> {
       
       if (props.count){
              return (
                     <div className={styles.pillContainerResult}>
                            <div className={styles.contentContainerResult}>
                                   <div className={styles.label}>
                                          {props.label}
                                   </div>
                                   <div className={styles.countResult}>
                                          Ep Count: {props.count}
                                   </div>
                            </div>
                     </div>
              )
       } else if (!props.count && !props.podcastTitle){
              return (
                     <div className={styles.pillContainer}>
                            <div className={styles.contentContainer}>
                                   <div className={styles.label}>
                                          {props.label}
                                   </div>
                            </div>
                     </div>
              )
       } if (props.podcastTitle){
              return (
                     <div className={styles.pillContainerResult}>
                            <div className={styles.contentContainerResult}>
                                   <div className={styles.image}>
                                          <img id={styles.thumbnail}src={props.episodeThumbnail}/>
                                   </div>
                                   <div className={styles.text}>
                                          <div className={styles.label}>
                                                 Podcast: {props.podcastTitle}
                                          </div>
                                          <div className={styles.countResult}>
                                                 Episode: {props.label}
                                          </div>
                                          <div className={styles.countResult}>
                                                <StarRatings rating={props.avgRating} starRatedColor="gold" starDimension="16px" starSpacing=".5px" /> ({props.totalReviews} Total reviews)
                                          </div>
                                   </div>
                            </div>
                     </div>
                     )
       }
}

export default ResultsPill;