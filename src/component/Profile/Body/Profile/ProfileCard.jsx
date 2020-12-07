import React from 'react'
import styles from '../Profile/ProfileCard.module.scss'
function ProfileCard(props) {
       return (
              <div className={styles.innerContainer}>
                     <div className={styles.wrapper}>
                            <div className={styles.leftSide}>
                                   <img className={styles.profilePicture} src={props.profilePicture}/>
                            </div>
                            <div className={styles.rightSide}>
                                   <p>Name: {props.name}</p>
                                   <p>Joined Date: {props.dateJoined}</p>
                                   <p>Bio: {props.bio}</p>
                            </div>
                     </div>
              </div> 
       )
}

export default ProfileCard;
