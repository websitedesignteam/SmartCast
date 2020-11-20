import React, {useState} from 'react'
import Card from '../../component/Profile/Card'
import ModeratorDuties from '../../component/Profile/ModeratorDuties'
import NavTabs from '../../component/Profile/NavTabs/NavTabs'
import styles from '../Profile/UserProfile.module.css'
import Body from '../../component/Profile/Body/Body'

const UserProfile =()=> {
       const [tab, setTab]= useState('Settings')

       const [bio, setBio] = useState("Hi, my name's Ali and I'm a senior @ the City College of New York. I love to hang out with friends, eat food, and play video games.")

       const getTab=(tab)=>{
              setTab(tab)
       }

       return (
              <div>  
                     <div className={styles.profileContainer}>
                            <div>
                                   <NavTabs changeTab={getTab} bio={bio}/>
                                   {/* <Card /> */}
                            </div>
                            <div className={styles.moderatorDuties}>
                                   <div>
                                          <Body currentTab={tab} bio={bio}/>
                                   </div>
                                   {/* <ModeratorDuties /> */}
                            </div>
                     </div>
              </div>
       )
}

export default UserProfile;