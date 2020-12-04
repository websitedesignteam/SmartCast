import React, { useState } from 'react';
import Input from '../../../element/Input/Input';
import styles from '../Auth.module.scss';
import { postForgotPassword } from '../../../utils/api';
import { isFormComplete } from '../../../utils/helper';
import { errorDefault, baseUrl } from "../../../utils/constants";

function ForgotPassword(props) {
    //states
    const [input, setInput] = useState({email: ""});
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    //set states
    function onChangeInput(event) {
        setInput({...input, [event.target.name]: event.target.value});
    }

    //submit forgot password form
    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        postForgotPassword(input)
        .then((response) => {
            alert(response.data.Success);
            props.onSuccessForgotPassword();
        })
        .catch((error) => {
            (error.response?.data?.Error) 
            ? setErrorMessage(error.response.data.Error)
            : setErrorMessage(errorDefault)
            setIsLoading(false);
        });
    }

    return (
        <form id="forgot-form" onSubmit={handleSubmit} className="container">
            <div className={styles.formContainer}> 
                <p>Enter your email address to reset password</p>
                {/* display any error msgs */}
                { (errorMessage) && <div className={styles.error}>{errorMessage}</div> }     

                <Input 
                    id="forgot-email" 
                    name="email" 
                    value={input.email} 
                    label="" 
                    placeholder="Enter Email" 
                    type="email" 
                    onChangeInput={onChangeInput} 
                />
                <div className={styles.backButtonContainer}>
                    <button className={styles.backButton} onClick={props.onClickBack}>
                        <img src={baseUrl + "/assets/button/page-back.png"} alt="Previous Page" title="Go back"/>
                    </button>
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

export default ForgotPassword;