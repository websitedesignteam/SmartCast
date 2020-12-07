import React from 'react';
import styles from '../Navbar/Navbar.module.scss';
import { Link, matchPath, useLocation } from "react-router-dom";
import { baseUrl } from 'utils/constants';

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
			<Link className={styles.appLink} to='/home'>
				<strong>SmartCast</strong>
				<img src={baseUrl+"/assets/logo.png"} alt="" />
			</Link>
			<div className={styles.linksContainer}>
				<Link className={styles.link} to='/' title="Go to Home">
					<img className={styles.navIcon} src={baseUrl+"/assets/nav/home.svg"} alt="" />
				</Link>
				{ !!user.access_token && 
					<Link to='/profile' className={styles.link} title="Go to Profile">
						<img className={styles.navIcon} src={baseUrl+"/assets/nav/user.svg"} alt="" />
					</Link>
				}
				{ (!user.access_token && !isAuthActive)
				? <button className={styles.userAction} onClick={onClickLogin} title="Login">
					<img className={styles.navIcon} src={baseUrl+"/assets/nav/login.svg"} alt="" />
				</button>
				: !!isAuthActive 
				? <></>  
				: <button className={styles.userAction} onClick={onClickLogout} title="Logout">
					<img className={styles.navIcon} src={baseUrl+"/assets/nav/logout.svg"} alt="" />
				</button>
				}
			</div>
		</div>
  	);
}

export default Navbar;