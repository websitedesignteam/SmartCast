import React from 'react';
import { Link } from "react-router-dom";
import styles from "./audioFooter.module.scss";

function AudioFooter({audio, closeAudioPlayer}) {
    const onClick = () => {
        closeAudioPlayer();
    }

    return (
        <div className={styles.audioFooter}>
            <div className={styles.audioHeader}>
                <div className={styles.audioTitle}>
                    <Link className={styles.link} to={`/podcast/${audio.podcastID}/episode/${audio.episodeID}`}>{audio.podcastTitle} - {audio.episodeTitle}</Link>
                </div>
                <button className={styles.closeAudioPlayer} onClick={onClick}>✖</button>
            </div>
            <audio controls autoplay="" preload="auto" name="media" className={styles.audio}>
                <source src={audio.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio tag.
            </audio>
        </div>
    );
}

export default AudioFooter;