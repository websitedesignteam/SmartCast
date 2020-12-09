import React from 'react';
import StarRatings from 'react-star-ratings'
import styles from '../LiveFeedPill/LiveFeedPill.module.scss'

const LiveFeedPill=(props)=> {

	const rating = 2
	const numOfStars = 5

	return (
		<div className={styles.container}>
			<div className={styles.profilePictureContainer}>
				<img className={styles.profilePic} src={props.profilePicture} alt="" />
			</div>
			<div className={styles.content}>
				<div className={styles.nameAgeContainer}>
					<div className={styles.name}>
						{props.name}
					</div>
					<div className={styles.comment}>
						{props.comment}
					</div>
					<div className={styles.age}>
						{props.commentAge}
					</div>
				</div>
				<div className={styles.rating}>
					<StarRatings rating={props.rating} starRatedColor="gold" starDimension="16px" starSpacing=".5px"/>
				</div>
			</div>
		</div>
	)
}

export default LiveFeedPill;
