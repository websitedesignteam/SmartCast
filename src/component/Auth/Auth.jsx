import React, { useState } from 'react';
import { baseUrl } from 'utils/constants';
import { Login, Signup, ConfirmSignup, ForgotPassword, ResetPassword } from './Types';
import styles from './Auth.module.scss';
import { useParams, useHistory } from "react-router-dom";
import { useEffect } from 'react';

function Auth(props) {
    //vars
    const history = useHistory();
    const { authType } = useParams();
    
    //state
    const [type, setType] = useState(props.type || authType || "login");

    //change state
    const onClickLogin = () => {
        if (authType) {
            history.push("/auth/login");
            history.go(0);
        }
        else {
            setType("login");
        }
    }
    
    const onClickSignup = () => {
        if (authType) {
            history.push("/auth/signup");
            history.go(0);
        }
        else {
            setType("signup");
        }
    }

    const onClickForgotPassword = () => {
        setType("forgotPassword");
    }

    const onSuccesSignup = () => {
        if (authType) {
            history.push("/auth/confirm");
            history.go(0);
        }
        else {
            setType("confirm");
        }
    }

    const onSuccessForgotPassword = () => {
        if (authType) {
            history.push("/auth/reset");
            history.go(0);
        }
        else {
            setType("reset");
        } 
    }

    const onSuccessReset = () => {
        if (authType) {
            history.push("/auth/login");
            history.go(0);
        }
        else {
            setType("login");
        } 
    }

    return (
        <div className={!!authType ? styles.authContainer : styles.authModal}>
            <div className={styles.logo}><img src={baseUrl + "/assets/logo.png"} alt="" /></div>
            {type === "login" && 
                <Login loginUser={props.loginUser} onClickForgotPassword={onClickForgotPassword} stayLoggedIn={props.stayLoggedIn} />}
            {type === "signup" && 
                <Signup onSuccessSignup={onSuccesSignup} />}
            {type === "confirm" && 
                <ConfirmSignup onSuccessVerification={props.onSuccessVerification}/>}
            {type === "forgotPassword" &&
                <ForgotPassword onSuccessForgotPassword={onSuccessForgotPassword} onClickBack={onClickLogin} />}
            {type === "reset" &&
                <ResetPassword onSuccessReset={onSuccessReset} />}
            {type === "login" 
            ?   <button className={styles.authButton} onClick={onClickSignup}>
                    Don't have an account yet? Sign up here
                </button>
            : type === "signup"
            ?   <button className={styles.authButton} onClick={onClickLogin}>
                    Already have an account? Log in here
                </button>
            : <></>
            }
        </div>
    );
}

export default Auth;