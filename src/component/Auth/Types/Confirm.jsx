import React, { useState } from 'react';
import AuthInput from '../AuthInput/AuthInput';
import styles from '../Auth.module.scss';
import { postConfirmSignup } from '../../../utils/api';
import { isFormComplete } from '../../../utils/helper';

function Confirm(props) {
    //states
    const [input, setInput] = useState({email: "", code: ""});
    const [errorMessage, setErrorMessage] = useState("");

    //set states
    function onChangeInput(event) {
        setInput({...input, [event.target.name]: event.target.value});
    }

    //submit login form
    const handleSubmit = (event) => {
        event.preventDefault();
        postConfirmSignup(input)
        .then((response) => {
            alert(response.data.Success);

        })
        .catch((error) => {
            setInput({...input, code: ""});
            (error.response?.data?.Error) 
            ? setErrorMessage(error.response.data.Error)
            : setErrorMessage("We're sorry, but something wrong happened!")
        });
    }

    return (
        <form id="confirm-form" onSubmit={handleSubmit} className="container">
            <div className={styles.formContainer}> 
                <p>Last step before joining SmartCast!<br/>Please verify your email</p>
                {/* display any error msgs */}
                { (errorMessage) && <div className={styles.error}>{errorMessage}</div> }     

                <AuthInput id="confirm-email" name="email" value={input.email} label="Email" placeholder="Enter Email" type="email" onChangeInput={onChangeInput} />
                <AuthInput id="confirm-code" name="code" value={input.code} label="Code" placeholder="Enter Verification Code" type="text" onChangeInput={onChangeInput} />
                <div className={styles.footerContainer}>
                	<button className={styles.submit} type="submit" disabled={!isFormComplete(input)}>Verify email</button>
                </div>
            </div>
        </form>
    );
}

export default Confirm;