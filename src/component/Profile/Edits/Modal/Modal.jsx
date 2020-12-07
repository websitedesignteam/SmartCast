import React from 'react'
import styles from '../Modal/Modal.module.css'
const Modal=(props)=> {

       const exitModal=()=>{
              props.exitModal()
       }

       const handleChoice=(choice)=>{
              props.handleChoice(choice)
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
                                   <div dangerouslySetInnerHTML={{__html: props.afterText}} className={styles.afterContainer}>
                                   </div>
                            </div>
                            <div className={styles.buttons}>
                                   <div className={styles.acceptContainer} onClick={()=> handleChoice('accept')}>
                                          Accept ✓
                                   </div>
                                   <div className={styles.rejectContainer} onClick={()=> handleChoice('reject')}>
                                          Reject 𐄂
                                   </div>
                            </div>
                   </div>
              </div>
       )
}

export default Modal;
