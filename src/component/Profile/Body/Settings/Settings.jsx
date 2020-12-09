import React, {useState, useEffect} from 'react'
import styles from '../Settings/Settings.module.scss'
import SectionContainer from '../../SectionContainer/SectionContainer'
import ChangePassModal from '../Settings/ChangePassModal/ChangePassModal'
import ProfilePicture from '../../ProfilePicture/ProfilePicture'
import { updateBio, updateProfilePicture } from '../../../../utils/api'


const Settings=({user, props})=> {
       const { access_token } = user;
       const [isModalOpen, setIsModalOpen] = useState(false)
       const [updatedBio, setUpdatedBio] = useState('')
       const [message, setMessage]= useState('')

       const forgotPassword=()=>{
              setIsModalOpen(true)
       }

       const closeModal=()=>{
              setIsModalOpen(false)
       }

       const updateUserBio = ()=>{
              let body = {access_token, "bio": updatedBio}
              updateBio(body)
              .then((response)=>{
                     console.log(response)
                     window.location.reload();
              })
              .catch((error)=>{
                     console.log(error)
              })
       }

       const changeProfilePicture =(b64, type)=>{
              let profilePicBody = {access_token, "b64image": b64, "extension": type}
              updateProfilePicture(profilePicBody)
              .then((response)=>{
                     console.log(response)
                     window.location.reload();
              })
              .catch((error)=>{
                     console.log(error.response)
              })
       }

       const changeErrorMsg=(message)=>{
              setMessage(message)
       }

       useEffect(()=>{
       }, [])

       if (isModalOpen === false){
              if(message !== ''){
                     return (
                            <div className={styles.container}>
                                   <SectionContainer label='Edit Profile'>
                                          <div className={styles.editProfileContainer}>
                                                 <div className={styles.avatarContainer}>
                                                        <ProfilePicture profilePicture={user.profilePicture} grabB64={changeProfilePicture} updateError={changeErrorMsg}/>
                                                 </div> 
                                                 <div>
                                                        <div className={styles.form}>
                                                               <label className={styles.labels}>Bio:</label>
                                                               <input onChange={(e)=>setUpdatedBio(e.target.value)}className={styles.bioInput} placeholder={user.bio}></input>
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
                                                 <p  onClick={forgotPassword} className={styles.changePassText}>Click here to change your password.</p>
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
                                                               <ProfilePicture profilePicture={user.profilePicture} grabB64={changeProfilePicture} updateError={changeErrorMsg}/>
                                                        </div> 
                                                        <div>
                                                               <div className={styles.form}>
                                                                      <label className={styles.labels}>Bio:</label>
                                                                      <input onChange={(e)=>setUpdatedBio(e.target.value)}className={styles.bioInput} placeholder={user.bio}></input>
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
                                                        <p  onClick={forgotPassword} className={styles.changePassText}>Click here to change your password.</p>
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
                                                 <img className={styles.profilePic} src={user.profilePicUrl}/>
                                          </div> 
                                          <div>
                                                 <div className={styles.form}>
                                                        <label className={styles.labels}>Bio:</label>
                                                        <input onChange={(e)=>setUpdatedBio(e.target.value)}className={styles.bioInput} placeholder={user.bio}></input>
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
                                          <ChangePassModal email={user.email} closeModal={()=> closeModal()}/>
                                   </div>
                            </SectionContainer>
                     </div>
              )
       }
}

export default Settings;
