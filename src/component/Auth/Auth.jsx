import React, { useState } from 'react';
import { baseUrl } from 'utils/constants';
import { Login, Signup, Confirm } from './Types';
import styles from './Auth.module.scss';

function Auth(props) {
    const [type, setType] = useState(props.type || "login");
    // const [type, setType] = useState("confirm");

    const onClickLogin = () => {
        setType("login");
    }
    
    const onClickSignup = () => {
        setType("signup");
    }

    const onSuccesSignup = () => {
        setType("confirm");
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.logo}><img src={baseUrl + "/assets/logo.png"} alt="" /></div>
            {type === "login" && <Login />}
            {type === "signup" && <Signup onSuccessSignup={onSuccesSignup} />}
            {type === "confirm" && <Confirm />}
            {type==="login" 
            ?   <button className={styles.authButton} onClick={onClickSignup}>
                    Don't have an account yet? Sign up here
                </button>
            : type==="signup"
            ?   <button className={styles.authButton} onClick={onClickLogin}>
                    Already have an account? Log in here
                </button>
            : <></>
            }
        </div>
    );
}

export default Auth;