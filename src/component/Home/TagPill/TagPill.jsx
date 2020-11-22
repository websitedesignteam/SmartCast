import React from 'react'
import styles from '../TagPill/TagPill.module.css'
const TagPill=(props)=> {
       
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
                                   <div className={styles.label}>
                                          Podcast: {props.podcastTitle}
                                   </div>
                                   <div className={styles.countResult}>
                                          Episode: {props.label}
                                   </div>
                            </div>
                     </div>
                     )
       }
}

export default TagPill;