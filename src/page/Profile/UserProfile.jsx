import React, {useState, useEffect} from 'react'
import Card from '../../component/Profile/Card'
import ModeratorDuties from '../../component/Profile/ModeratorDuties'
import NavTabs from '../../component/Profile/NavTabs/NavTabs'
import styles from '../Profile/UserProfile.module.css'
import Body from '../../component/Profile/Body/Body'

const UserProfile =({user, getUserAPI, validateToken, ...props})=> {
       const [tab, setTab]= useState('My Profile')
       const { access_token } = user;
       
       const getTab=(tab)=>{
              setTab(tab)
       }

       useEffect(()=>{
		if (!!access_token) {
			validateToken();
			getUserAPI();
		}
       }, [])

       return (
              <div>  
                     <div className={styles.profileContainer}>
                            <NavTabs changeTab={getTab} user={user} />
                                   {/* <Card /> */}
                            <div className={styles.moderatorDuties}>
                                   <Body currentTab={tab} user={user} getUserAPI={getUserAPI} validateToken={validateToken} />
                                   {/* <ModeratorDuties /> */}
                            </div>
                     </div>
              </div>
       )
}

export default UserProfile;