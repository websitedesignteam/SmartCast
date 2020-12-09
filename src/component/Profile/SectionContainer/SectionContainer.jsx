import React from 'react'
import styles from '../SectionContainer/SectionContainer.module.scss'

const SectionContainer=(props)=> {

       return (
              <div className={styles.container}>
                     <div className={styles.topPortion}>
                            {props.label}
                     </div>    
                     <div className={styles.bottomPortion}>
                            {props.children}   
                     </div>
              </div>
       )
}

export default SectionContainer;
