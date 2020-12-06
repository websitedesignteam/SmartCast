import React, {useEffect, useState}from 'react'
import { baseUrl } from 'utils/constants';
import styles from '../ChangePassModal/ChangePassModal.module.scss'
import {changePassword} from '../../../../../utils/api'
import {getUser} from '../../../../../utils/api'
import {useHistory} from 'react-router-dom'

function ChangePassModal(props) {

       const [passInput, setPassInput]=useState('')
       const [codeInput, setCodeInput]=useState('')
       const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
       const [userData, setUserData] = useState({})
       let history = useHistory();

       const closeModal = () => {
              props.closeModal()
       }

       const changePass = () =>{
              let body = {
                            "email": userData.email,
                            "password": passInput,
                            "code": codeInput}

              console.log(body)
              changePassword(body)
              .then((response)=>{
                    console.log(response)
              })
              .catch((error)=>{
                     console.log(error)
              })
       }

       useEffect(()=>{
              let body = {"access_token": user.access_token}
              getUser(body)
              .then((response)=>{
                     setUserData(response.data)
              })
       }, [])



       return (
              <div className={styles.container}>
                     <div className={styles.border}>
                            <div className={styles.innerContainer}>
                                   <div className={styles.upperPart}>
                                          <div>
                                          Change password:
                                          </div>
                                          <div className={styles.closeButton} onClick={()=>closeModal()}>
                                          X
                                          </div>
                                   </div>
                                   <div className={styles.lowerPart}>
                                          <div className={styles.innerContent}>
                                                 <img className={styles.logo} src={baseUrl + "/assets/logo.png"} alt="" />
                                                 <p className={styles.instructions}>We've sent you a code via email. Enter the code below, along with your new password.</p>
                                                 <div className={styles.form}>
                                                        <div>
                                                               <label>New Password:</label>
                                                               <input onChange={(e)=>setPassInput(e.target.value)}></input>
                                                        </div>
                                                        <div>
                                                               <label>Code:</label>
                                                               <input onChange={(e)=>setCodeInput(e.target.value)}></input>
                                                        </div>
                                                        <div onClick={()=>changePass()}className={styles.submitButton}>
                                                               Change Password
                                                        </div>
                                                 </div>

                                          </div>
                                   </div>
                            </div>
                     </div>
              </div>
       )
}

export default ChangePassModal;