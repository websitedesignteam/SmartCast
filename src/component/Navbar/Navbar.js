import React from 'react';
import styles from '../Navbar/Navbar.module.css'
import { Link} from "react-router-dom"
function Navbar() {
  	return ( 
		<div className={styles.navbarContainer}>
			<Link className={styles.link} to='/'>SmartCast</Link>
			<div className={styles.linksContainer}>
				<Link className={styles.link} to='/'>Home</Link>
				<Link className={styles.link} to='/login'>Login</Link>
			</div>
		</div>
  	);
}

export default Navbar;