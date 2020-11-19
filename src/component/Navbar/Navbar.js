import React from 'react';
import styles from '../Navbar/Navbar.module.scss'
import { Link} from "react-router-dom"
function Navbar({openAuthModal, logoutUser, user}) {
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
				{ !user.username 
				? <button className={styles.userAction} onClick={onClickLogin}>Login</button>
				: <button className={styles.userAction} onClick={onClickLogout}>Logout</button>
				}
			</div>
		</div>
  	);
}

export default Navbar;