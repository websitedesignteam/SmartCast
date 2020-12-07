import React, {useState, useEffect } from 'react'
import Edits from '../../component/Profile/Edits/Edits'
import Transcriptions from '../../component/Profile/Transcriptions/Transcripions'
import TabViewer from './TabViewer/TabViewer'
import {getUser} from '../../utils/api'
import styles from '../Profile/ModeratorDuties.module.css'
import SpecialUserPanel from '../Profile/Body/SpecialUserPanel/SpecialUserPanel'
// import beePodcastImg from '/public/assets/temporaryIcons'
// import sportsPodcastImg from window.location.origin + '/assets/temporaryIcons/sportsPodcastImg.png'
// import foodPodcastImg from '/temporaryIcons'
// import techPodcastImg1 from '/temporaryIcons'
// import techPodcastImg2 from '/temporaryIcons'

const Moderatorduties=(props)=> {
       const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
       const [status,setStatus]= useState('')
       useEffect(()=>{
              let getUserBody = {"access_token": user.access_token}
              getUser(getUserBody)
              .then((response)=>{
                     setStatus(response.data.status)
              })
              .catch((error)=>{
                     console.log(error)
              })
       }, [])

       return (
              <div className={styles.specialDutiesContainer}>
                            <SpecialUserPanel userStatus={status}/>
                          {/* <TabViewer transcriptionData={transcriptionData} editData={editData} /> */}
              </div>
       )
}

export default Moderatorduties;
