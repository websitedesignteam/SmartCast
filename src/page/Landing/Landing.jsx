import React, {useState, useEffect} from 'react'
import styles from '../Landing/Landing.module.scss'
import {getSiteStats} from '../../utils/api'
import { baseUrl } from 'utils/constants';
import {useHistory} from 'react-router-dom';

const Landing=()=> {
       const [siteStats, setSiteStats]= useState({})
       let history= useHistory()
       const sendToHome=()=>{
              history.push('/home')
       }

       useEffect(()=>{
              getSiteStats()
              .then((response)=>{
                     setSiteStats(response.data)
              })
              .catch((error)=>{
                     console.log(error)
              })
       }, [])
       
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
                                   <div id={styles.descriptionTwo}>
                                          <div>Transcribed Podcasts:  {siteStats.transcribed}</div>
                                          <div>Transcriptions Awaiting Approval:  {siteStats.beingTranscribed}</div>
                                          <div>Transcriptions Being Edited:  {siteStats.beingEditedByCommunity}</div>
                                          <div>Requested Transcriptions:  {siteStats.requestingTranscription}</div>
                                          <div>Registered Users:  {siteStats.registeredUsers}</div>
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
