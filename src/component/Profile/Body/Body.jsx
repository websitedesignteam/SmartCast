import React, {useState, useEffect} from 'react'
import styles from '../Body/Body.module.scss'
import Settings from '../Body/Settings/Settings'
import ModeratorDashboard from '../ModeratorDuties'
import ProfileContent from '../Body/Profile/ProfileContent'
import {getUser} from '../../../utils/api'
const Body=(props)=> {

       const [userData, setUserData]=  useState({})

       useEffect(()=>{
              let body = {"access_token": props.access_token}
              getUser(body)
              .then((response)=>{
                     setUserData(response.data)
              })
              .catch((error)=>{
                     console.log(error)
              })
       }, [])

       if (props.currentTab === 'Settings'){
              return (
                     <div className={styles.link}>
                            <Settings access_token={props.access_token} email={userData.email} bio={props.bio} profilePicture={props.profilePicUrl}/>   
                     </div>
              )
       }else if (props.currentTab === 'Moderator Dashboard'){
              return (
                     <div className={styles.link}>
                            <ModeratorDashboard />   
                     </div>
              )
       }else if (props.currentTab === 'My Profile'){
              return(<div classname={styles.profileContent}>
                            <ProfileContent name={props.name} dateJoined={props.dateJoined} bio={props.bio} userData={props.userData} />
                     </div>)
       }
}

export default Body;
