import React from 'react';
import styles from "./Input.module.scss";

function Input(props) {
    function onChange(event) {
        props.onChangeInput(event);
    }
    
    return (
        <div className={styles.block}>
            <label htmlFor={props.id} className={styles.item}>{props.label}</label>
            <input id={props.id} name={props.name} className={styles.item} type={props.type} placeholder={props.placeholder} value={props.value} onChange={onChange}/>
        </div>
    );
}

Input.defaultProps = {
    label:"Input",
    type:"text", 
    placeholder:"Enter Input", 
}

export default Input;