import React from 'react';
import styles from '../Navbar/Navbar.module.scss'
import { Link, matchPath, useLocation } from "react-router-dom"
function Navbar({openAuthModal, logoutUser, user}) {
	const location = useLocation();

	const isAuthActive = !!matchPath(
		location.pathname, 
		'/auth/:authType'
	  ); 

	const onClickLogin = () => {
		openAuthModal();
	}

	const onClickLogout = () => {
		logoutUser();
	}

  	return ( 
		<div className={styles.navbarContainer}>
			<Link className={styles.link} to='/'><strong>SmartCast</strong></Link>
			<div className={styles.linksContainer}>
				<Link className={styles.link} to='/'>Home</Link>
				{ !!user.access_token && <Link to='/profile' className={styles.link}>My Profile</Link>}
				{ (!user.access_token && !isAuthActive)
				? <button className={styles.userAction} onClick={onClickLogin}>Login</button>
				: !!isAuthActive 
				? <></>  
				: <button className={styles.userAction} onClick={onClickLogout}>Logout</button>
				}
			</div>
		</div>
  	);
}

export default Navbar;