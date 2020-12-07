import React from 'react'
import styles from '../UserPill/UserPill.module.scss'

const UserPill=(props)=> {

       const redContainer ={border: "1px solid red", "padding": "0px 5px 0px 5px", "align-self": "flex-end", "cursor": "pointer", "border-radius": "5px", "font-size": "14px"}
       const greenContainer = {border: "1px solid green", "padding": "0px 5px 0px 5px", "align-self": "flex-end", "cursor": "pointer", "border-radius": "5px", "font-size": "14px"}
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
                            <div onClick={props.changeStatus} style={props.command === 'PROMOTE'? greenContainer:redContainer}>
                                  {props.command}
                            </div>
                     </div>
              </div>
       )
}

export default UserPill;
