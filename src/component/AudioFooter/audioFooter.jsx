import React, { useState, useEffect } from 'react';
import styles from "./audioFooter.module.css";

function AudioFooter({audioUrl, closeAudioPlayer}) {
    const onClick = () => {
        closeAudioPlayer();
    }
    return (
        <>
        <button className={styles.closeAudioPlayer} onClick={onClick}>✖</button>
        <audio controls preload="auto" className={styles.audio}>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
        </audio>
        </>
    );
}

export default AudioFooter;