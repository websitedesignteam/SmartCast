import React, {useEffect, useState}from 'react'
import { baseUrl } from 'utils/constants';
import styles from '../ChangePassModal/ChangePassModal.module.scss'
import {changePassword, emailPassword, getUser} from '../../../../../utils/api'
import {useHistory} from 'react-router-dom'

function ChangePassModal(props) {

       const [passInput, setPassInput]=useState('')
       const [confirmPassInput, setConfirmPassInput]=useState('')
       const [errorMessage, setErrorMessage]= useState('')
       const [codeInput, setCodeInput]=useState('')
       const [errorResponse, setErrorResponse]=useState('')
       const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
       const [userData, setUserData] = useState({})
       let history = useHistory();

       const closeModal = () => {
              props.closeModal()
       }

       const sendCode =(email)=>{
              console.log(props.email)
              let body={"email": email}
              console.log(body)
              emailPassword(body)
              .then((response)=>{
                     console.log(response.data)
              })
              .catch((error)=>{
                     setErrorMessage(error.response)
              })
       }

       const validateForm = (passInput, confirmPassInput, codeInput)=>{
              if ( codeInput == '' || confirmPassInput == '' || passInput == ''){
                     setErrorMessage('Please fill in all required fields.')
              }else{
                     if (passInput !== confirmPassInput){
                            setErrorMessage('Passwords must match.')
                     }else{
                            setErrorMessage('')
                            changePass()
                     }
              }
       }

       const changePass = () =>{
              let body = {
                            "email": userData.email,
                            "password": passInput,
                            "code": codeInput}
              changePassword(body)
              .then((response)=>{
                    console.log(response)
                    window.location.reload()
              })
              .catch((error)=>{
                     setErrorResponse(error.response.data.Error)
              })
       }

       useEffect(()=>{
              sendCode(props.email)
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
                                                        <div className={styles.containers}>
                                                               <label>New Password:</label>
                                                               <input onChange={(e)=>setPassInput(e.target.value)} type="password"></input>
                                                        </div>
                                                        <div className={styles.containers}>
                                                               <label>Confirm Password:</label>
                                                               <input onChange={(e)=>setConfirmPassInput(e.target.value)} type="password"></input>
                                                        </div>
                                                        <div className={styles.containers}>
                                                               <label>Code:</label>
                                                               <input onChange={(e)=>setCodeInput(e.target.value)}></input>
                                                        </div>
                                                        <div>
                                                               {errorMessage?<div>{errorMessage}</div>:null}
                                                               {errorResponse?<div>{errorResponse}</div>:null}
                                                        </div>
                                                        <div className={styles.buttonContainer}>
                                                               <div onClick={()=>validateForm(passInput, confirmPassInput, codeInput)}className={styles.submitButton}>
                                                                      Change Password
                                                               </div>
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