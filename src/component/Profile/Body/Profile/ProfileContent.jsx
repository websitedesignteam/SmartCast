import React from 'react'
import SectionContainer from '../../SectionContainer/SectionContainer'
import ProfileCard from '../Profile/ProfileCard'
import styles from '../Profile/ProfileContentContainer.module.scss'
function ProfileContent(props) {

       return (
              <div className={styles.container}>
                     <SectionContainer label='Profile Card'>
                            <ProfileCard />
                     </SectionContainer>
                     <SectionContainer label='My Favorites'>
                            <div className={styles.disclaimerContainer}>
                                   <p>You have no favorites :(</p>
                                   <p> Browse our transcribed podcasts, here.</p>
                            </div>
                     </SectionContainer>
              </div>
       )
}

export default ProfileContent;
