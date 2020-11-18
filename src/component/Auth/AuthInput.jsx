import React from 'react';
import styles from "./AuthInput.module.css";

function AuthInput(props) {
    function onChange(event) {
        props.onChangeInput(event);
    }
    
    return (
        <div className={styles.block}>
            <label for={props.id} className={styles.item}>{props.label}</label>
            <input id={props.id} name={props.name} className={styles.item} type={props.type} placeholder={props.placeholder} value={props.value} onChange={onChange}/>
        </div>
    );
}

AuthInput.defaultProps = {
    label:"Input",
    type:"text", 
    placeholder:"Enter Input", 
}

export default AuthInput;