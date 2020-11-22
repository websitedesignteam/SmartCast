import React from 'react'
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
				</div>
				<p dangerouslySetInnerHTML={{__html: props.episodeDescription}}></p>
			</div>
		</div>
	)
}

export default EpisodeContainer;