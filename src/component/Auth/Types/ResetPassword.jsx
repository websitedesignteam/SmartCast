import React, { useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import AuthInput from '../AuthInput/AuthInput';
import styles from '../Auth.module.scss';
import { postConfirmPasswordReset } from '../../../utils/api';
import { isFormComplete } from '../../../utils/helper';
import { errorDefault } from "../../../utils/constants";

function ResetPassword(props) {
    //states
    const [input, setInput] = useState({email: "", password: "", code: ""});
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
        postConfirmPasswordReset(input)
        .then((response) => {
            alert(response.data.Success);
            props.onSuccessReset();
        })
        .catch((error) => {
            setInput({...input, code: ""});
            (error.response?.data?.Error) 
            ? setErrorMessage(error.response.data.Error)
            : setErrorMessage(errorDefault)
            setIsLoading(false);
        });
    }

    return (
        <form id="confirm-form" onSubmit={handleSubmit} className="container">
            <div className={styles.formContainer}> 
                <p>Last step to reset your password!<br/>Please retrieve the code from your email</p>
                {/* display any error msgs */}
                { (errorMessage) && <div className={styles.error}>{errorMessage}</div> }     

                <AuthInput 
                    id="confirm-reset-email" 
                    name="email" 
                    value={input.email} 
                    label="Email" 
                    placeholder="Enter Email" 
                    type="email" 
                    onChangeInput={onChangeInput} 
                />
                <AuthInput 
                    id="confirm-reset-password" 
                    name="password" 
                    value={input.password} 
                    label="Password" 
                    placeholder="Enter New Password" 
                    type="password" 
                    onChangeInput={onChangeInput} 
                />
                <AuthInput 
                    id="confirm-reset-code" 
                    name="code" 
                    value={input.code} 
                    label="Code" 
                    placeholder="Enter Code" 
                    type="text" 
                    onChangeInput={onChangeInput} 
                />
                <div className={styles.footerContainer}>
                    {!isLoading
                    ? <button 
                        className={styles.submit} 
                        type="submit" 
                        disabled={!isFormComplete(input)}
                    >
                        Reset password
                    </button>
                    : <div className="loaderTiny"></div>}
                </div>
            </div>
        </form>
    );
}

export default ResetPassword;