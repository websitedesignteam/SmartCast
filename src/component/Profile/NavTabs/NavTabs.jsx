import React, {useState} from 'react'
import NavButton from '../NavTabs/NavButton/NavButton'
import styles from '../NavTabs/NavTabs.module.scss'

const NavTabs=(props)=> {

       const changeTab=(tab)=>{
              props.changeTab(tab)
       }

       return (
              <div className={styles.container}>
                     <div className={styles.avatarContainer}>
                            <div className={styles.avatar}>
                            </div>
                            <div>
                                   Ali Belaj
                            </div>
                            <div className={styles.bio}>
                                   {props.bio}
                            </div>
                     </div>
                     <div className={styles.navButtons}>
                            <div className={styles.settingsButton} onClick={()=> changeTab('My Profile')}>
                                   <NavButton label="My Profile" />
                            </div>
                            <div className={styles.settingsButton} onClick={()=> changeTab('Settings')}>
                                   <NavButton label="Settings" />
                            </div>
                            <div className={styles.moderatorDashboardButton} onClick={()=> changeTab('Moderator Dashboard')}>
                                   <NavButton label="Moderator Dashboard" />
                            </div>
                     </div>
              </div>
       )
}

export default NavTabs
