import React, { useState } from 'react';
import AuthInput from '../AuthInput/AuthInput';
import { postLogin } from '../../../utils/api';
import { isFormComplete } from '../../../utils/helper';
import styles from "../Auth.module.scss";

function Login({loginUser}) {
    //states
    const [input, setInput] = useState({email: "", password: ""});
    const [errorMessage, setErrorMessage] = useState("");

    //set states
    function onChangeInput(event) {
        setInput({...input, [event.target.name]: event.target.value});
    }

    //submit login form
    const handleSubmit = (event) => {
        event.preventDefault();
        postLogin(input)
        .then((response) => {
            const data = response.data;
            loginUser(data.access_token, data.id_token, data.refresh_token);
        })
        .catch((error) => {
            (error?.response?.data?.Error) 
            ? setErrorMessage(error.response.data.Error)
            : setErrorMessage("We're sorry, but something wrong happened!")
        });
    }

    return (
        <form id="login-form" onSubmit={handleSubmit} className="container">
            <div className={styles.formContainer}>
                <p>Log in to your account</p>
                {/* display any error msgs */}
                {/* { (!isFormComplete(input) && !errorMessage) &&
                    <div className={styles.error}>Please fill in all fields</div> } */}
                { (errorMessage) && <div className={styles.error}>{errorMessage}</div> }     
                
                <AuthInput id="login-email" name="email" value={input.email} label="Email" placeholder="Enter Email" type="email" onChangeInput={onChangeInput} />
                <AuthInput id="login-password" name="password" value={input.password} label="Password" placeholder="Enter Password" type="password" onChangeInput={onChangeInput} />
                
                <div className={styles.footerContainer}>
                    <button className={styles.submit} type="submit" disabled={!isFormComplete(input)}>Login</button>
                </div>
            </div>
        </form>
    );
}

export default Login;