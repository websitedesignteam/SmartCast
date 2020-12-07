import React from 'react'
import styles from '../Landing/Landing.module.scss'
import { baseUrl } from 'utils/constants';
import {useHistory} from 'react-router-dom';

const Landing=()=> {
       let history= useHistory()
       const sendToHome=()=>{
              history.push('/')
       }
       
       return (
              <div className={styles.background}>
                     <div className={styles.contentContainer}>
                            <div className={styles.textContainer}>
                                   <div className={styles.headerText}>
                                          Welcome to SmartCast!
                                   </div>
                                   <div id={styles.description}>
                                          The ultimate destination for transcribed podcasts.
                                   </div>
                                   <div onClick={()=>sendToHome()}id={styles.getStartedButton}>
                                          Get started
                                   </div>
                            </div>
                            <div className={styles.imageContainer}>
                                   <img id={styles.image}src={baseUrl+"/assets/transcribeService.svg"}/>
                            </div>
                     </div>
              </div>
       )
}

export default Landing;
