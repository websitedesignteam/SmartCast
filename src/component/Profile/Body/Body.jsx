import React, {useState, useEffect} from 'react'
import styles from '../Body/Body.module.scss'
import Settings from '../Body/Settings/Settings'
import ModeratorDashboard from '../ModeratorDuties'
import ProfileContent from '../Body/Profile/ProfileContent'
const Body=({user, validateToken, getUserAPI, ...props})=> {
       const { access_token } = user;

       useEffect(()=>{
		if (!!access_token) {
			validateToken();
			getUserAPI();
		}
       }, [])

       if (props.currentTab === 'Settings'){
              return (
                     <div className={styles.link}>
                            <Settings user={user} />   
                     </div>
              )
       }else if (props.currentTab === 'Moderator Dashboard'){
              return (
                     <div className={styles.link}>
                            <ModeratorDashboard user={user} />   
                     </div>
              )
       }else if (props.currentTab === 'My Profile'){
              return(<div classname={styles.profileContent}>
                            <ProfileContent user={user} />
                     </div>)
       }
}

export default Body;
