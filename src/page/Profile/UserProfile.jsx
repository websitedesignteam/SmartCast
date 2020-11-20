import React, {useState} from 'react'
import Card from '../../component/Profile/Card'
import ModeratorDuties from '../../component/Profile/ModeratorDuties'
import NavTabs from '../../component/Profile/NavTabs/NavTabs'
import styles from '../Profile/UserProfile.module.css'
import Body from '../../component/Profile/Body/Body'

const UserProfile =()=> {
       const [tab, setTab]= useState('Settings')

       const getTab=(tab)=>{
              setTab(tab)
       }

       return (
              <div>  
                     <div className={styles.profileContainer}>
                            <div>
                                   <NavTabs changeTab={getTab}/>
                                   {/* <Card /> */}
                            </div>
                            <div className={styles.moderatorDuties}>
                                   <div>
                                          <Body currentTab={tab}/>
                                   </div>
                                   {/* <ModeratorDuties /> */}
                            </div>
                     </div>
              </div>
       )
}

export default UserProfile;