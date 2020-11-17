import React from 'react';
import styles from "./audioFooter.module.css";

function AudioFooter({audio, closeAudioPlayer}) {
    const onClick = () => {
        closeAudioPlayer();
    }

    return (
        <div className={styles.audioFooter}>
            <button className={styles.closeAudioPlayer} onClick={onClick}>✖</button>
            <div>
                {audio.podcastTitle} - {audio.episodeTitle}
            </div>
            <audio controls preload="auto" className={styles.audio}>
                <source src={audio.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio tag.
            </audio>
        </div>
    );
}

export default AudioFooter;