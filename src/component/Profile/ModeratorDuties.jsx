import React from 'react'
import Edits from '../../component/Profile/Edits/Edits'
import Transcriptions from '../../component/Profile/Transcriptions/Transcripions'
import TabViewer from './TabViewer/TabViewer'
import styles from '../Profile/ModeratorDuties.module.css'
// import beePodcastImg from '/public/assets/temporaryIcons'
// import sportsPodcastImg from window.location.origin + '/assets/temporaryIcons/sportsPodcastImg.png'
// import foodPodcastImg from '/temporaryIcons'
// import techPodcastImg1 from '/temporaryIcons'
// import techPodcastImg2 from '/temporaryIcons'

const Moderatorduties=(props)=> {
       const transcriptionData = [ 
       {userName: 'abelaj', podcast: 'Joe Rogan', podcastEp: 'Space', img: window.location.origin + '/assets/temporaryIcons/sportsPodcastImg.png', podcastLength: '1m32s'},
       {userName: 'bbelaj', podcast: 'Joe Rogan', podcastEp: 'Politics', img: window.location.origin + '/assets/temporaryIcons/foodPodcastImg.png', podcastLength: '1m55s'},
       {userName: 'cbelaj', podcast: 'Joe Rogan', podcastEp: 'Aliens', img: window.location.origin + '/assets/temporaryIcons/techPodcastImg1.png', podcastLength: '12m58s'},
       {userName: 'dbelaj', podcast: 'Joe Rogan', podcastEp: 'Aliens', img: window.location.origin + '/assets/temporaryIcons/techPodcastImg2.png', podcastLength: '52m11s'},
       {userName: 'ebelaj', podcast: 'Joe Rogan', podcastEp: 'Aliens', img: window.location.origin + '/assets/temporaryIcons/beePodcastImg.png', podcastLength: '4m49s'}]

       const editData = [ 
              {userName: 'abelaj', podcast: 'Joe Rogan', podcastEp: 'Space' },
              {userName: 'bbelaj', podcast: 'Joe Rogan', podcastEp: 'Politics' },
              {userName: 'cbelaj', podcast: 'Joe Rogan', podcastEp: 'Aliens' },
              {userName: 'dbelaj', podcast: 'Joe Rogan', podcastEp: 'Aliens' },
              {userName: 'ebelaj', podcast: 'Joe Rogan', podcastEp: 'Aliens'}]
       return (
              <div className={styles.ModeratorDutiesContainer}>
                   <div className={styles.header}>
                     Moderator Actions
                   </div>
                   <div>
                          <TabViewer transcriptionData={transcriptionData} editData={editData} />
                   </div>
              </div>
       )
}

export default Moderatorduties;
