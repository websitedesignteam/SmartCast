import React from 'react'
import styles from '../UserPill/UserPill.module.scss'

const UserPill=(props)=> {
       return (
              <div className={styles.container}>
                     <div className={styles.leftSide}>
                            <img className={styles.profilePicture} src={props.profilePicture}/>
                            <div>
                                  {props.status} 
                            </div>
                     </div>
                     <div className={styles.rightSide}>
                            <div className={styles.infoContainer}>
                                   <div>
                                          {props.email} 
                                   </div>
                                   <div id={styles.transcriptionsEdited}>
                                          {props.editCount} Transcriptions Edited
                                   </div>
                            </div>
                            <div onClick={props.changeStatus}className={styles.button}>
                                  {props.command}
                            </div>
                     </div>
              </div>
       )
}

export default UserPill;
