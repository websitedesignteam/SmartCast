import React from 'react'
import styles from '../Body/Body.module.scss'
import Settings from '../Body/Settings/Settings'
import ModeratorDashboard from '../ModeratorDuties'
const Body=(props)=> {

       if (props.currentTab === 'Settings'){
              return (
                     <div>
                            <Settings bio={props.bio}/>   
                     </div>
              )
       }else if (props.currentTab === 'Moderator Dashboard'){
              return (
                     <div>
                            <ModeratorDashboard />   
                     </div>
              )
       }else if (props.currentTab === 'My Profile'){
              return(<div>
                     i am your profile
              </div>)
       }
}

export default Body;
