import React from 'react'
import styles from '../Body/Body.module.scss'
import Settings from '../Body/Settings/Settings'
import ModeratorDashboard from '../ModeratorDuties'
const Body=(props)=> {

       if (props.currentTab === 'Settings'){
              return (
                     <div>
                     <Settings />   
                     </div>
              )
       }else if (props.currentTab === 'Moderator Dashboard'){
              return (
                     <div>
                            <ModeratorDashboard />   
                     </div>
              )
              }
}

export default Body;
