import React from 'react';
import styles from '../Navbar/Navbar.module.css'
import { Link} from "react-router-dom"
function Navbar() {
  return ( 
              <div className={styles.navbarContainer}>
                     <Link to='/'><h3 className={styles.logoText}>SmartCast</h3></Link>
                     <div className={styles.linksContainer}>
                             <Link to='/'><h5 className={styles.linkText}>Home</h5></Link>
                             <Link to='/genres'><h5 className={styles.linkText}>Genres</h5></Link>
                     </div>
              </div>
  );
}

export default Navbar;