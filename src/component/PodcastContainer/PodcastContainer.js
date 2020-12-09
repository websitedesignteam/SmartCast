import React from 'react'
import styles from '../PodcastContainer/PodcastContainer.module.scss'

function PodcastContainer(props) {
	return (
		<div className={styles.PodcastContainer}>
			<div className={styles.img}>
				<img src={props.imgSrc} alt="" />
			</div>
			<div className={styles.textContainer}>
				<div className={styles.textTitleHeader}>
					<strong className={styles.textTitle}>{props.podcastTitle}</strong>
					{props.podcastTotalEpisodes && 
						<span className={styles.textTotalEpisodes}>
						<strong className={styles.textTotalEpisodesTitle}>Total Episodes</strong>
						{props.podcastTotalEpisodes}
					</span>}
				</div>
				<p className={styles.textDescription} dangerouslySetInnerHTML={{__html: props.podcastDescription}}></p>
			</div>
		</div>
	)
}

export default PodcastContainer;