import React from 'react';
import { Input } from "../../element"
import styles from "./Modal.module.scss";
import { baseUrl } from "../../utils/constants";

function Modal({
	input, 
	onChangeInput,
	isLoading, 
	onSubmitFavorite, 
	errorInputMessage,
	podcastDisclaimer,
	...props}) {

	return (
		
		<div className={styles.modalContainer}>
			<div className={styles.modalHeader}>
				Enter a nickname for your favorite podcast!
				<div className={styles.errorDisclaimer} >
					<img 
						className={styles.errorDisclaimerImage} 
						src={baseUrl + "/assets/button/disclaimer.svg"} 
						alt="disclaimer" 
					/>
					<div className={styles.errorDisclaimerText}>{podcastDisclaimer}</div>
				</div>
			</div>
			{(errorInputMessage) &&
				<div className={styles.error}>
					{errorInputMessage}
				</div>}
			<Input
				id="favoritePodcast-name" 
				name="name" 
				value={input} 
				label="" 
				placeholder="Enter Podcast Nickname" 
				onChangeInput={onChangeInput} 
			/>
			<div className={styles.footerContainer}>
				{!isLoading
					? <button className={styles.submit} onClick={onSubmitFavorite}>
				Confirm
			</button>
			: <div className="loaderTiny"></div>}
			</div>
		</div>
	);
}

export default Modal;