import React, {useState} from 'react'
import styles from '../Settings/Settings.module.scss'
import SectionContainer from '../../SectionContainer/SectionContainer'
import ChangePassModal from '../Settings/ChangePassModal/ChangePassModal'
import ProfilePicture from '../../ProfilePicture/ProfilePicture'
import { emailPassword, updateBio, updateProfilePicture } from '../../../../utils/api'


const Settings=(props)=> {

       const [isModalOpen, setIsModalOpen] = useState(false)
       const [updatedBio, setUpdatedBio] = useState('')
       const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
       const [message, setMessage]= useState('')
       const forgotPassword=()=>{
              let body = {"email":props.email}
              emailPassword(body)
              setIsModalOpen(true)
       }

       const closeModal=()=>{
              setIsModalOpen(false)
       }

       const updateUserBio = ()=>{

              let body = {"access_token": user.access_token, "bio": updatedBio}
              console.log(body)
              updateBio(body)
              .then((response)=>{
                     console.log(response)
                     window.location.reload();
              })
              .catch((error)=>{
                     console.log(error)
              })
       }

       const changeProfilePicture =(b64)=>{
              let profilePicBody = {"access_token": user.access_token, "b64image": b64, "extension": ".png"}
              console.log(profilePicBody)
              updateProfilePicture(profilePicBody)
              .then((response)=>{
                     console.log(response)
                     // window.location.reload();
              })
              .catch((error)=>{
                     console.log(error.response)
              })
       }

       const changeErrorMsg=(message)=>{
              setMessage(message)
       }

       if (isModalOpen === false){
              if(message != ''){
                     return (
                            <div className={styles.container}>
                                   <SectionContainer label='Edit Profile'>
                                          <div className={styles.editProfileContainer}>
                                                 <div className={styles.avatarContainer}>
                                                        <ProfilePicture profilePicture={props.profilePicture} grabB64={changeProfilePicture} updateError={changeErrorMsg}/>
                                                 </div> 
                                                 <div>
                                                        <div className={styles.form}>
                                                               <label className={styles.labels}>Bio:</label>
                                                               <input onChange={(e)=>setUpdatedBio(e.target.value)}className={styles.bioInput} placeholder={props.bio}></input>
                                                               <div className={styles.updateButtonContainer}>
                                                                      <div>
                                                                             {message}
                                                                      </div>
                                                                      <div onClick={()=> updateUserBio()}className={styles.submit}>
                                                                             Update Bio
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>  
                                          </div> 
                                   </SectionContainer>
                                   <SectionContainer label="Change Password">
                                          <div className={styles.changePasswordContainer}>
                                                 <p  onClick={()=>forgotPassword()} className={styles.changePassText}>Click here to change your password.</p>
                                          </div>
                                   </SectionContainer>
                            </div>
                     )
                     }else{

                            return (
                                   <div className={styles.container}>
                                          <SectionContainer label='Edit Profile'>
                                                 <div className={styles.editProfileContainer}>
                                                        <div className={styles.avatarContainer}>
                                                               <ProfilePicture profilePicture={props.profilePicture} grabB64={changeProfilePicture} updateError={changeErrorMsg}/>
                                                        </div> 
                                                        <div>
                                                               <div className={styles.form}>
                                                                      <label className={styles.labels}>Bio:</label>
                                                                      <input onChange={(e)=>setUpdatedBio(e.target.value)}className={styles.bioInput} placeholder={props.bio}></input>
                                                                      <div className={styles.updateButtonContainer}>
                                                                             <div onClick={()=> updateUserBio()}className={styles.submit}>
                                                                                    Update Bio
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                        </div>  
                                                 </div> 
                                          </SectionContainer>
                                          <SectionContainer label="Change Password">
                                                 <div className={styles.changePasswordContainer}>
                                                        <p  onClick={()=>forgotPassword()} className={styles.changePassText}>Click here to change your password.</p>
                                                 </div>
                                          </SectionContainer>
                                   </div>
                            )
                     }
       }else{
              return (
                     <div className={styles.container}>
                            <SectionContainer label='Edit Profile'>
                                   <div className={styles.editProfileContainer}>
                                          <div className={styles.avatarContainer}>
                                                 <img className={styles.profilePic} src={props.profilePicUrl}/>
                                          </div> 
                                          <div>
                                                 <div className={styles.form}>
                                                        <label className={styles.labels}>Bio:</label>
                                                        <input onChange={(e)=>setUpdatedBio(e.target.value)}className={styles.bioInput} placeholder={props.bio}></input>
                                                        <div className={styles.updateButtonContainer}>
                                                               <div onClick={()=> updateUserBio()}className={styles.submit}>
                                                                      Update Bio
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>  
                                   </div> 
                            </SectionContainer>
                            <SectionContainer label="Change Password">
                                   <div className={styles.changePasswordContainer}>
                                          <p className={styles.changePassText}>Click here to change your password.</p>
                                          <ChangePassModal closeModal={()=> closeModal()}/>
                                   </div>
                            </SectionContainer>
                     </div>
              )
       }
}

export default Settings;
