import React, {useState, useEffect} from 'react'
import {getRequestedTranscriptions, getRequestedEdits, getAllUsers, changeStatus} from '../../../../utils/api'
import Transcriptions from '../../Transcriptions/Transcriptions'
import Edits from '../../Edits/Edits'
import UserPill from '../SpecialUserPanel/UserPill/UserPill'
import Loader from 'react-loader-spinner'
import styles from '../SpecialUserPanel/SpecialUserPanel.module.scss'
const SpecialUserPanel=(props)=> {

       const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')))
       const [tab, setTab] = useState('Transcription Requests')
       const [transcriptionRequests, setTranscriptionRequests] = useState([{}])
       const [transcriptionEdits, setTranscriptionEdits] = useState([{}])
       const [isLoading, setIsLoading] =useState(false)
       const [allUsers,setAllUsers]=useState([{}])
       const changeTab = (tab)=>{
              setTab(tab)
       }

       useEffect(()=>{
              let body = {"access_token": user.access_token}
              getRequestedTranscriptions(body)
              .then((response) => {
                     setTranscriptionRequests(response.data.Data)
              })
              .catch((error)=>{
                     console.log(error)
              });

              getRequestedEdits(body)
              .then((response) => {
                     setTranscriptionEdits(response.data.Data)
              })
              .catch((error)=>{
                     console.log(error)
              });

              getAllUsers(body)
              .then((response)=>{
                    setAllUsers(response.data.Data)
              })
              .catch((error)=>{
                     console.log(error)
              })
       }, [])

       const changeUserStatus = (email, command)=>{
              let body = {"access_token": user.access_token, "email": email, "command": command}
              changeStatus(body)
              .then((response)=>{
                     console.log(response)
                     window.location.reload()
              })
              .catch((error)=>{
                     console.log(error)
              })
       }
       if (props.userStatus === 'admin'){
              if (tab === 'Transcription Requests'){
                     return (
                            <div className={styles.wrapper}>
                                   <div className={styles.topSection}>
                                   <div className={styles.buttons} onClick={()=>changeTab('Transcription Requests')}>
                                          Transcription Requests
                                   </div>
                                   <div className={styles.buttons} onClick={()=>changeTab('Transcription Edits')}>
                                          Transcription Edits
                                   </div>
                                   <div className={styles.buttons} onClick={()=>changeTab('Promote/Demote Users')}>
                                                 Promote/Demote Users
                                   </div>
                                   </div>
                                   <div className={styles.bottomSection}>
                                   {Object.keys(transcriptionRequests[0]).length !== 0 ? transcriptionRequests.map((transcriptionRequest, index)=>{return <Transcriptions key={index} time={transcriptionRequest.episodeLength} episodeID={transcriptionRequest.episodeID} podcastID={transcriptionRequest.podcastID} access_token={user.access_token}/>}):<div>No Transcription Requests</div>}
                                   </div>
                            </div>
                     )
              } else if (tab === 'Transcription Edits'){
                     return (

                            <div className={styles.wrapper}>
                                   <div className={styles.topSection}>
                                   <div className={styles.buttons} onClick={()=>changeTab('Transcription Requests')}>
                                          Transcription Requests
                                   </div>
                                   <div className={styles.buttons} onClick={()=>changeTab('Transcription Edits')}>
                                          Transcription Edits
                                   </div>
                                   <div className={styles.buttons} onClick={()=>changeTab('Promote/Demote Users')}>
                                                 Promote/Demote Users
                                   </div>
                                   </div>
                                   <div className={styles.bottomSection}>
                                   {Object.keys(transcriptionEdits[0]).length !== 0 ? transcriptionEdits.map((edit, index)=>{return <Edits key={index} podcastID={edit.podcastID} episodeID={edit.episodeID} beforeText={edit.transcribedText} afterText={edit.requestedEdit}/>}): <div>No Transcription Edits</div>}
                                   </div>
                            </div>
                     )
              } else if (tab === 'Promote/Demote Users'){
                     return (

                            <div className={styles.wrapper}>
                                   <div className={styles.topSection}>
                                   <div className={styles.buttons} onClick={()=>changeTab('Transcription Requests')}>
                                          Transcription Requests
                                   </div>
                                   <div className={styles.buttons} onClick={()=>changeTab('Transcription Edits')}>
                                          Transcription Edits
                                   </div>
                                   <div className={styles.buttons} onClick={()=>changeTab('Promote/Demote Users')}>
                                                 Promote/Demote Users
                                   </div>
                                   </div>
                                   <div className={styles.bottomSection}>
                                   {allUsers.map((user, index)=>{return <UserPill profilePicture={user.profilePicture} email={user.email} editCount={user.editCount} status={user.status} command={user.command} changeStatus={()=>changeUserStatus(user.email, user.command)}/>})}
                                   </div>
                            </div>
                     )
              }
       }else if (props.userStatus === 'moderator'){
              if (tab === 'Transcription Requests'){
                     return (
                            <div className={styles.wrapper}>
                                   <div className={styles.topSection}>
                                   <div className={styles.buttons} onClick={()=>changeTab('Transcription Requests')}>
                                          Transcription Requests
                                   </div>
                                   <div className={styles.buttons} onClick={()=>changeTab('Transcription Edits')}>
                                          Transcription Edits
                                   </div>
                                   </div>
                                   <div className={styles.bottomSection}>
                                   {transcriptionRequests? transcriptionRequests.map((transcriptionRequest, index)=>{return <Transcriptions key={index} time={transcriptionRequest.episodeLength} episodeID={transcriptionRequest.episodeID} podcastID={transcriptionRequest.podcastID} access_token={user.access_token}/>}): null}
                                   </div>
                            </div>
                     )
              } else if (tab === 'Transcription Edits'){
                     return (

                            <div className={styles.wrapper}>
                                   <div className={styles.topSection}>
                                   <div className={styles.buttons} onClick={()=>changeTab('Transcription Requests')}>
                                          Transcription Requests
                                   </div>
                                   <div className={styles.buttons} onClick={()=>changeTab('Transcription Edits')}>
                                          Transcription Edits
                                   </div>
                                   </div>
                                   <div className={styles.bottomSection}>
                                   {transcriptionEdits.map((edit, index)=>{return <Edits key={index} podcastID={edit.podcastID} episodeID={edit.episodeID} beforeText={edit.transcribedText} afterText={edit.requestedEdit}/>})}
                                   </div>
                            </div>
                     )
              }
       }else{
              return <div className={styles.loader}><Loader type="TailSpin" color="#00BFFF" height={30} width={30} /></div>
       }
              
}

export default SpecialUserPanel;
