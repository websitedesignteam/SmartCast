import React, {useState, useEffect } from 'react'
import Edits from '../../component/Profile/Edits/Edits'
import Transcriptions from './Transcriptions/Transcriptions'
import TabViewer from './TabViewer/TabViewer'
import {getUser} from '../../utils/api'
import styles from '../Profile/ModeratorDuties.module.css'
import SpecialUserPanel from '../Profile/Body/SpecialUserPanel/SpecialUserPanel'
// import beePodcastImg from '/public/assets/temporaryIcons'
// import sportsPodcastImg from window.location.origin + '/assets/temporaryIcons/sportsPodcastImg.png'
// import foodPodcastImg from '/temporaryIcons'
// import techPodcastImg1 from '/temporaryIcons'
// import techPodcastImg2 from '/temporaryIcons'

const Moderatorduties=({user, validateToken, getUserAPI, ...props})=> {

       useEffect(()=>{
       }, [])

       return (
              <div className={styles.specialDutiesContainer}>
                            <SpecialUserPanel userStatus={user.status}/>
                          {/* <TabViewer transcriptionData={transcriptionData} editData={editData} /> */}
              </div>
       )
}

export default Moderatorduties;
