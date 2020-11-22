import React, { useState } from 'react';
import AuthInput from '../AuthInput/AuthInput';
import { useHistory, useParams } from "react-router-dom";
import { postLogin } from '../../../utils/api';
import { isFormComplete } from '../../../utils/helper';
import { errorDefault } from "../../../utils/constants";
import styles from "../Auth.module.scss";

function Login({loginUser, onClickForgotPassword}) {
    //vars
    const history = useHistory();
    const { authType } = useParams();

    //states
    const [input, setInput] = useState({email: "", password: ""});
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    //set states
    function onChangeInput(event) {
        setInput({...input, [event.target.name]: event.target.value});
    }

    //submit login form
    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        postLogin(input)
        .then((response) => {
            const data = response.data;
            loginUser(data);
            authType && history.push("/");
        })
        .catch((error) => {
            (error?.response?.data?.Error) 
            ? setErrorMessage(error.response.data.Error)
            : setErrorMessage(errorDefault)
            setIsLoading(false);
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
                
                <AuthInput 
                    id="login-email" 
                    name="email" 
                    value={input.email} 
                    label="Email" 
                    placeholder="Enter Email" 
                    type="email" 
                    onChangeInput={onChangeInput} 
                />
                <AuthInput 
                    id="login-password" 
                    name="password" 
                    value={input.password} 
                    label="Password" 
                    placeholder="Enter Password" 
                    type="password" 
                    onChangeInput={onChangeInput} 
                />

                <button className={styles.forgotPassword} onClick={onClickForgotPassword}>Forgot password?</button>
                
                <div className={styles.footerContainer}>
                {!isLoading
                    ? <button 
                        className={styles.submit} 
                        type="submit" disabled={!isFormComplete(input)}
                    >
                        Login
                    </button>
                : <div className="loaderTiny"></div>}
                </div>
            </div>
        </form>
    );
}

export default Login;