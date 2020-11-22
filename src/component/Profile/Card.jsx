import React from 'react'
import styles from '../Profile/Card.module.css'

const Card =()=> {
       return (
              <div className={styles.cardContainer}>
                     <div>
                            <div className={styles.avatar}>
                            </div>       
                            <div>
                                   Ali Belaj
                            </div>
                            <div>
                                   <h5>Bio</h5>
                                   <div className={styles.bio}>Hi! My name's Ali and I'm a senior @ the City College of New York. I am interning at Dolphin Jobs, a small startup. I have a passion for cars,like to hang out with friends, try new food, travel, and play video games.</div>
                            </div>
                     </div>
              </div>
       )
}

export default Card;

