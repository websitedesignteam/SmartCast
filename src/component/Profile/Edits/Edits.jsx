import React, {useState} from 'react'
import styles from '../../Profile/Edits/Edits.module.css'
import Modal from '../Edits/Modal/Modal'
import {approveEdits} from '../../../utils/api'
const baseUrl = process.env.PUBLIC_URL;
const Edits=(props)=> {

       const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
       const [isExpand, setExpand] = useState(false)
       const expand=()=>{
              setExpand(true)
       }

       const exitModal=()=>{
              setExpand(false)
       }

       const handleSelection = (choice) =>{
              let body = {"podcastID": props.podcastID,
                            "episodeID": props.episodeID,
                            "decision": choice,
                            "access_token": user.access_token}
              approveEdits(body)
              .then((response)=>{
                     console.log(response)
                     window.location.reload()
              })
              .catch((error)=>{
                     console.log(error)
              })
       }
       if (isExpand === true){
              return (
                     <div>
                            <div>
                                   <Modal exitModal={()=>exitModal()} beforeText={props.beforeText} afterText={props.afterText} handleChoice={handleSelection}/>
                            </div>
                            <div className={styles.editsContainer}>
                                   <div className={styles.contentContainer}>
                                          <div className={styles.textContainer}>
                                                 <p>Click to expand: {props.user} </p>
                                                 {/* <p>Podcast: {props.podcast}</p>
                                                 <p>Podcast Episode: {props.episode}</p> */}
                                          </div>
                                          <div className={styles.iconContainer}>
                                                 <img className={styles.expandIcon} src={baseUrl + "/assets/Profile/expand.svg"} onClick={()=> expand()}/>
                                          </div>
                            </div>
                            </div>
                     </div>
              )
                                   
       } else{
              return (
                     <div>
                            <div className={styles.editsContainer}>
                                   <div className={styles.contentContainer}>
                                          <div className={styles.textContainer}>
                                                 <p>Click to expand: {props.user} </p>
                                                 {/* <p>Podcast: {props.podcast}</p>
                                                 <p>Podcast Episode: {props.episode}</p> */}
                                          </div>
                                          <div className={styles.iconContainer}>
                                                 <img className={styles.expandIcon} src={baseUrl + "/assets/Profile/expand.svg"} onClick={()=> expand()}/>
                                          </div>
                            </div>
                            </div>
                     </div>
              )
       }
}

export default Edits;
