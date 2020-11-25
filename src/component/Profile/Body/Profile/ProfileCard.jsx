import React from 'react'
import styles from '../Profile/ProfileCard.module.scss'
function ProfileCard(props) {
       return (
              <div className={styles.innerContainer}>
                     <div className={styles.wrapper}>
                            <div className={styles.leftSide}>
                            </div>
                            <div className={styles.rightSide}>
                                   <p>Name:</p>
                                   <p>Joined Date:</p>
                                   <p>Bio:</p>
                            </div>
                     </div>
              </div> 
       )
}

export default ProfileCard;
