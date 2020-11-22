import React, {useState} from 'react'
import Transcriptions from '../Transcriptions/Transcripions'
import Edits from '../Edits/Edits'
import styles from '../TabViewer/TabViewer.module.css'

const TabViewer=(props)=> {
       const [tab, setTab] = useState('Transcription Requests')
       const [opacityReq, setOpacityReq] = useState(.6)
       const [opacityEdits, setOpacityEdits] = useState(.6)

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

       if (tab === 'Transcription Requests'){
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
                                   {props.transcriptionData.map((transcriptionRequest, index)=>{return <Transcriptions key={index} user={transcriptionRequest.userName} podcast={transcriptionRequest.podcast} episode={transcriptionRequest.podcastEp} time={props.transcriptionData.podcastLength}/>})}
                                   </div>
                            </div>
                   </div>
                     </div>
              </div>
       )
       }else if (tab ==='Transcription Edits'){
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
                                   {props.editData.map((edit, index)=>{return <Edits key={index} user={edit.userName} podcast={edit.podcast} episode={edit.podcastEp}/>})}
                                   </div>
                            </div>
                   </div>
                     </div>
              )
       }
}

export default TabViewer;