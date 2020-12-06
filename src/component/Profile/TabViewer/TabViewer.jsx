import React, {useState, useEffect} from 'react'
import Transcriptions from '../Transcriptions/Transcripions'
import Edits from '../Edits/Edits'
import styles from '../TabViewer/TabViewer.module.css'
import {getRequestedTranscriptions, getRequestedEdits} from '../../../utils/api'
const TabViewer=(props)=> {
       const [tab, setTab] = useState('Transcription Requests')
       const [opacityReq, setOpacityReq] = useState(.6)
       const [opacityEdits, setOpacityEdits] = useState(.6)
       const [transcriptionRequests, setTranscriptionRequests] = useState([{}])
       const [requestedEdits, setRequestedEdits] = useState([{}])
       const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')))
       const [isLoading, setIsLoading] = useState(true)
       const changeTab=(tabName)=>{
              setTab(tabName)
              if(tabName ==='Transcription Requests'){
                     setOpacityReq(1)
              } else {
                     setOpacityReq(.6)
              }
              if (tabName === 'Transcription Edits'){
                     setOpacityEdits(1)
              } else {
                     setOpacityEdits(.6)
              }
       }

       useEffect(()=>{
              let body = {"access_token": user.access_token}
              getRequestedTranscriptions(body)
              .then((response) => {
                     setTranscriptionRequests(response.data.Data)
                     setIsLoading(false)
              })
              .catch((error)=>{
                     console.log(error)
              });

              getRequestedEdits(body)
              .then((response) => {
                     setRequestedEdits(response.data.Data)
                     // console.log
                     setIsLoading(false)
              })
              .catch((error)=>{
                     console.log(error)
              });
       }, [])



       if (tab === 'Transcription Requests'){
              if(isLoading === false){
                     return (
                            <div className={styles.tabViewerContainer}>
                                   <div className={styles.tabs}>
                                   <div style={{opacity: opacityReq}} className={styles.singleTab} onClick={() => changeTab('Transcription Requests')}>
                                          Transcription Requests
                                   </div>
                                   <div style={{opacity: opacityEdits}} className={styles.singleTab} onClick={() => changeTab('Transcription Edits')}>
                                          Transcription Edits
                                   </div>
                                   </div>  
                                   <div className={styles.body}>
                                          <div className={styles.transcriptionContentBody}>
                                                 <div className={styles.contentContainer}>
                                                 <div className={styles.transcriptionRequests}>
                                                 {transcriptionRequests.map((transcriptionRequest, index)=>{return <Transcriptions key={index} time={transcriptionRequest.episodeLength} episodeID={transcriptionRequest.episodeID} podcastID={transcriptionRequest.podcastID} access_token={user.access_token}/>})}
                                                 </div>
                                          </div>
                            </div>
                                   </div>
                            </div>
              )}else{
                     return (
                            <div className={styles.tabViewerContainer}>
                                   <div className={styles.tabs}>
                                   <div style={{opacity: opacityReq}} className={styles.singleTab} onClick={() => changeTab('Transcription Requests')}>
                                          Transcription Requests
                                   </div>
                                   <div style={{opacity: opacityEdits}} className={styles.singleTab} onClick={() => changeTab('Transcription Edits')}>
                                          Transcription Edits
                                   </div>
                                   </div>  
                                   <div className={styles.body}>
                                          <div className={styles.transcriptionContentBody}>
                                                 <div className={styles.contentContainer}>
                                                 <div className={styles.transcriptionRequests}>
                                                 Loading...
                                                 </div>
                                          </div>
                            </div>
                                   </div>
                            </div>
                     )
              }
       }else if (tab ==='Transcription Edits'){
              if(isLoading === false){
                     return(
                            <div className={styles.tabViewerContainer}>
                            <div className={styles.tabs}>
                            <div className={styles.singleTab} onClick={() => changeTab('Transcription Requests')}>
                                   Transcription Requests
                            </div>
                            <div className={styles.singleTab} onClick={() =>changeTab('Transcription Edits')}>
                                   Transcription Edits
                            </div>
                            </div>  
                            <div className={styles.body}>
                                   <div>
                                          <div>
                                          {requestedEdits.map((edit, index)=>{return <Edits key={index} beforeText={edit.transcribedText} afterText={edit.requestedEdit}/>})}
                                          </div>
                                   </div>
                     </div>
                            </div>
                     )
              }else{
                     return(
                            <div className={styles.tabViewerContainer}>
                            <div className={styles.tabs}>
                            <div className={styles.singleTab} onClick={() => changeTab('Transcription Requests')}>
                                   Transcription Requests
                            </div>
                            <div className={styles.singleTab} onClick={() =>changeTab('Transcription Edits')}>
                                   Transcription Edits
                            </div>
                            </div>  
                            <div className={styles.body}>
                                   <div>
                                          <div>
                                                 Loading...
                                          </div>
                                   </div>
                     </div>
                            </div>
                     )  
              }
       }
}

export default TabViewer;