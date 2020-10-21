import React, { useState, useEffect } from 'react';
import styles from "./audioFooter.module.css";

function AudioFooter(props) {
    return (
        <audio controls className={styles.audio}>
            <source src={props.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
        </audio>
    );
}

export default AudioFooter;