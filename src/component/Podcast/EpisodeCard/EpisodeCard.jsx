import React from "react";
import styles from "./EpisodeCard.module.scss";
import StarRatings from 'react-star-ratings'
import { formatEpisodeLength } from "../../../utils/helper";

function EpisodeCard({episode, ...props}) {
    return (
        <div className={styles["episode"]}>
            <div className={styles["episode-img"]}>
                <img src = {episode.episodeThumbnail} alt="" />
            </div>
            <div className={styles["episode-content"]}>
                <div className={styles["episode-header"]}>
                    <div className={styles["episode-header--title"]}>
                        {episode.episodeTitle}
                    </div>
                    <div className={styles["episode-header--audiolength"]}>
                        {formatEpisodeLength(episode.episodeLengthSeconds)}
                    </div>

                </div>
                <div className={styles["episode-rating"]}>
                    <StarRatings rating={episode.averageRating} starRatedColor="gold" starDimension="16px" starSpacing=".5px" />
                    ({episode.totalReviews})
                </div>
            </div>
        </div>
    );
}

export default EpisodeCard;