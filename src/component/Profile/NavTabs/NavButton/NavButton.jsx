import React from 'react'
import styles from '../NavButton/NavButton.module.scss'
const NavButton=(props)=> {
       return (
              <div className={styles.container}>
                  {props.label}   
              </div>
       )
}
export default NavButton;