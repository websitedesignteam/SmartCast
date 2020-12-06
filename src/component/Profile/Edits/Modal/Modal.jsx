import React from 'react'
import styles from '../Modal/Modal.module.css'
const Modal=(props)=> {

       const exitModal=()=>{
              props.exitModal()
       }

       const handleAccept=()=>{
              exitModal()
       }
       const handleReject=()=>{
              exitModal()
       }

       return (
              <div className={styles.modalContainer}>
                   <div className={styles.innerModalContainer}>
                            <div className={styles.upperPortion} onClick={()=> exitModal()}>
                            X
                            </div>
                            <div className={styles.editsContainer}>
                                   <div className={styles.beforeContainer}>
                                          {props.beforeText}
                                   </div>
                                   <div className={styles.afterContainer}>
                                          {props.afterText}
                                   </div>
                            </div>
                            <div className={styles.buttons}>
                                   <div className={styles.acceptContainer} onClick={()=> handleAccept()}>
                                          Accept ✓
                                   </div>
                                   <div className={styles.rejectContainer} onClick={()=> handleReject()}>
                                          Reject 𐄂
                                   </div>
                            </div>
                   </div>
              </div>
       )
}

export default Modal;
