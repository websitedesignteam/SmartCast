import React from 'react'
import styles from '../TagPill/TagPill.module.css'
const TagPill=(props)=> {
       
       return (
              <div className={styles.pillContainer}>
                     <div className={styles.contentContainer}>
                            <div className={styles.label}>
                                   {props.label}
                            </div>
                            <div className={styles.count}>
                                   {props.count}
                            </div>
                     </div>
              </div>
       )
}

export default TagPill;