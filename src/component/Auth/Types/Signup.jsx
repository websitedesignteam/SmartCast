import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import AuthInput from '../AuthInput/AuthInput';
import { postSignup } from '../../../utils/api';
import { isFormComplete } from '../../../utils/helper';
import styles from "../Auth.module.scss";

function Signup(props) {
    //vars
    const history = useHistory();

    //states
    const [errorMessage, setErrorMessage] = useState("");
    const [input, setInput] = useState({name: "", email: "", password: ""});

    //util function
    function onChangeInput(event) {
        setInput({...input, [event.target.name]: event.target.value});
    }

    //submit signup form
    const handleSubmit = (event) => {
        event.preventDefault();
        postSignup(input)
        .then((response) => {
            alert(response.data.Success);
            props.onSuccessSignup();
        })
        .catch((error) => {
            (error.response.data.Error) 
            ? setErrorMessage(error.response.data.Error)
            : setErrorMessage("We're sorry, but something wrong happened!")
        });
    }

    return (
        <form id="signup-form" onSubmit={handleSubmit} className="container">
            <div className={styles.formContainer}>
                <p>Sign up to join our SmartCast community!</p>
                {/* display any error msgs */}
                {/* { (!isFormComplete(input) && !errorMessage) &&
                    <div className={styles.error}>Please fill in all fields</div> } */}
                { (errorMessage) && <div className={styles.error}>{errorMessage}</div> }     
                
                <AuthInput id="signup-name" name="name" value={input.name} label="Name" placeholder="Enter Name" onChangeInput={onChangeInput} />
                <AuthInput id="signup-email" name="email" value={input.email} label="Email" placeholder="Enter Email" type="email" onChangeInput={onChangeInput} />
                <AuthInput id="signup-password" name="password" value={input.password} label="Password" placeholder="Enter Password" type="password" onChangeInput={onChangeInput} />

                <div className={styles.footerContainer}>
                	<button className={styles.submit} type="submit" disabled={!isFormComplete(input)}>Sign up</button>
                </div>
            </div>
        </form>
    );
}

export default Signup;