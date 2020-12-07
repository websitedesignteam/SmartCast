import React, {useState} from 'react'
import NavButton from '../NavTabs/NavButton/NavButton'
import styles from '../NavTabs/NavTabs.module.scss'

const NavTabs=(props)=> {

       const changeTab=(tab)=>{
              props.changeTab(tab)
       }

       // const [userStatus, setUserStatus] = useState(props.userStatus)

       if (props.userStatus){
              if (props.userStatus == 'admin'){
                     return (
                     <div className={styles.container}>
                            <div className={styles.avatarContainer}>
                                   <div>
                                          <img className={styles.profilePic} src={props.profilePicUrl} />
                                   </div>
                                   <div>
                                          {props.name}
                                   </div>
                                   <div className={styles.bio}>
                                          {props.bio}
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
       }else if (props.userStatus == 'moderator'){
              return (
              <div className={styles.container}>
                     <div className={styles.avatarContainer}>
                            <div>
                                   <img className={styles.profilePic} src={props.profilePicUrl} />
                            </div>
                            <div>
                                   {props.name}
                            </div>
                            <div className={styles.bio}>
                                   {props.bio}
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
} else if (props.userStatus == 'standard') {
                     return( <div className={styles.container}>
                            <div className={styles.avatarContainer}>
                                   <div className={styles.avatar}>
                                   </div>
                                   <div>
                                          {props.name}
                                   </div>
                                   <div className={styles.bio}>
                                          {props.bio}
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
              return (<div>Loading</div>)
       }
}

export default NavTabs
