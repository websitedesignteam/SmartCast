import React from 'react'
import StarRatings from 'react-star-ratings';
import { formatEpisodeLength } from '../../utils/helper';
import styles from '../EpisodeContainer/EpisodeContainer.module.scss'

function EpisodeContainer(props) {
	return (
		<div className={styles.EpisodeContainer}>
			<div className={styles.img}>
				<img src={props.imgSrc} alt="" />
			</div>
			<div className={styles.textContainer}>
				<div className={styles.textTitleHeader}>
					<strong className={styles.textTitle}>{props.episodeTitle}</strong>
					<div className={styles.textHeaderRight}>
						<div className={styles.rating}>
							<StarRatings rating={props.rating} starRatedColor="gold" starDimension="16px" starSpacing=".5px"/>
							({props.totalReviews ?? 0})
						</div>
						<div className={styles.length}>
							{!!props.episodeAudioLength && formatEpisodeLength(props.episodeAudioLength)}
						</div>
					</div>
				</div>
				<p dangerouslySetInnerHTML={{__html: props.episodeDescription}}></p>
			</div>
		</div>
	)
}

export default EpisodeContainer;