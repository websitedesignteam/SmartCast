import React, {useState} from 'react'
import NavButton from '../NavTabs/NavButton/NavButton'
import styles from '../NavTabs/NavTabs.module.scss'

const NavTabs=({user, changeTab, ...props})=> {

       if (user.status){
              if (user.status === 'admin'){
                     return (
                     <div className={styles.container}>
                            <div className={styles.avatarContainer}>
                                   <div>
                                          <img className={styles.profilePic} src={user.profilePicture} />
                                   </div>
                                   <div>
                                          {user.name}
                                   </div>
                                   <div className={styles.bio}>
                                          {user.bio}
                                   </div>
                            </div>
                            <div className={styles.navButtons}>
                                   <div className={styles.profileButton} onClick={()=> changeTab('My Profile')}>
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
       }else if (user.status === 'moderator'){
              return (
              <div className={styles.container}>
                     <div className={styles.avatarContainer}>
                            <div>
                                   <img className={styles.profilePic} src={user.profilePicture} />
                            </div>
                            <div>
                                   {user.name}
                            </div>
                            <div className={styles.bio}>
                                   {user.bio}
                            </div>
                     </div>
                     <div className={styles.navButtons}>
                            <div className={styles.profileButton} onClick={()=> changeTab('My Profile')}>
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
} else if (user.status === 'standard') {
                     return( <div className={styles.container}>
                     <div className={styles.avatarContainer}>
                            <div>
                                   <img className={styles.profilePic} src={user.profilePicture} />
                            </div>
                                   <div>
                                          {user.name}
                                   </div>
                                   <div className={styles.bio}>
                                          {user.bio}
                                   </div>
                            </div>
                            <div className={styles.navButtons}>
                                   <div className={styles.profileButton} onClick={()=> changeTab('My Profile')}>
                                          <NavButton label="My Profile" />
                                   </div>
                                   <div className={styles.settingsButton} onClick={()=> changeTab('Settings')}>
                                          <NavButton label="Settings" />
                                   </div>
                            </div>
                     </div>
                     )
              }
       }else{
              return (null)
       }
}

export default NavTabs
