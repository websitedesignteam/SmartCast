import React from 'react'
import styles from '../Settings/Settings.module.scss'
import SectionContainer from '../../SectionContainer/SectionContainer'


const Settings=(props)=> {
       return (
              <div className={styles.container}>
                     <SectionContainer label='Edit Profile'>
                            <div className={styles.avatarContainer}>
                                   <div className={styles.avatar}></div>
                            </div>
                            <div className={styles.formContainer}>
                                   <div className={styles.form}>
                                          <div>  
                                                 <label className={styles.labels}>First Name:</label>
                                                 <input></input>
                                                 <label className={styles.labels}>Last Name:</label>
                                                 <input></input>
                                          </div>
                                          <div>
                                                 <label className={styles.labels}>Bio:</label>
                                                 <input className={styles.bioInput} placeholder={props.bio}></input>
                                          </div>
                                   </div>
                            </div>
                     </SectionContainer>
                     <SectionContainer label="Change Password">

                     </SectionContainer>
              </div>
       )
}

export default Settings;
