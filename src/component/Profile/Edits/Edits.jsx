import React, {useState} from 'react'
import styles from '../../Profile/Edits/Edits.module.css'
import Modal from '../Edits/Modal/Modal'
const baseUrl = process.env.PUBLIC_URL;
const Edits=(props)=> {

       const [isExpand, setExpand] = useState(false)
       const expand=()=>{
              setExpand(true)
       }

       const exitModal=()=>{
              setExpand(false)
       }
       if (isExpand === true){
              return (
                     <div >
                            <Modal exitModal={()=>exitModal()} beforeText={props.beforeText} afterText={props.afterText}/>
                     </div>
                     // <div className={styles.editsContainer}>
                     //        <div className={styles.contentContainer}>
                     //               <div className={styles.textContainer}>
                     //                      <p>User: {props.user} </p>
                     //                      <p>Podcast: {props.podcast}</p>
                     //                      <p>Podcast Episode: {props.episode}</p>
                     //               </div>
                     //               <div className={styles.iconContainer}>
                     //                      <img className={styles.expandIcon} src={baseUrl + "/assets/Profile/expand.svg"} onClick={()=> expand()}/>
                     //               </div>
                     //       </div>
                     // </div>
              )
       } else{
              return (
                     <div>
                            <div className={styles.editsContainer}>
                                   <div className={styles.contentContainer}>
                                          <div className={styles.textContainer}>
                                                 <p>User: {props.user} </p>
                                                 <p>Podcast: {props.podcast}</p>
                                                 <p>Podcast Episode: {props.episode}</p>
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
