import React, {useState, useEffect} from 'react'
import Card from '../../component/Profile/Card'
import ModeratorDuties from '../../component/Profile/ModeratorDuties'
import NavTabs from '../../component/Profile/NavTabs/NavTabs'
import styles from '../Profile/UserProfile.module.css'
import Body from '../../component/Profile/Body/Body'
import {getUser} from '../../utils/api'

const UserProfile =(props)=> {
       const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
       const [tab, setTab]= useState('My Profile')
       const [bio, setBio] = useState("Hi, my name's Ali and I'm a senior @ the City College of New York. I love to hang out with friends, eat food, and play video games.")
       const [userData, setUserData] = useState([{}])
       const getTab=(tab)=>{
              setTab(tab)
       }

       useEffect(()=>{
              let getUserBody = {"access_token": user.access_token}
              getUser(getUserBody)
              .then((response)=>{
                     setUserData(response.data)
              })
              .catch((error)=>{
                     console.log(error)
              })

       }, [])

       return (
              <div>  
                     <div className={styles.profileContainer}>
                            <div>
                                   <NavTabs changeTab={getTab}  name={userData.name} bio={userData.bio} userStatus={userData.status} profilePicUrl={userData.profilePicture}/>
                                   {/* <Card /> */}
                            </div>
                            <div className={styles.moderatorDuties}>
                                   <div>
                                          <Body currentTab={tab} name={userData.name} access_token={userData.access_token} dateJoined={userData.dateJoined} bio={userData.bio} userData={userData} profilePicUrl={userData.profilePicture}/>
                                   </div>
                                   {/* <ModeratorDuties /> */}
                            </div>
                     </div>
              </div>
       )
}

export default UserProfile;