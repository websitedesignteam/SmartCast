import React, { useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import Input from '../../../element/Input/Input';
import styles from '../Auth.module.scss';
import { postConfirmSignup } from '../../../utils/api';
import { isFormComplete } from '../../../utils/helper';
import { errorDefault } from "../../../utils/constants";

function ConfirmEmail(props) {
    //vars
    const history = useHistory();
    const { authType } = useParams();

    //states
    const [input, setInput] = useState({email: "", code: ""});
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
        postConfirmSignup(input)
        .then((response) => {
            alert(response.data.Success);
            props.onSuccessVerification();
            authType && history.push("/");
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
                <p>Last step before joining SmartCast!<br/>Please verify your email</p>
                {/* display any error msgs */}
                { (errorMessage) && <div className={styles.error}>{errorMessage}</div> }     

                <Input 
                    id="confirm-email" 
                    name="email" 
                    value={input.email} 
                    label="Email" 
                    placeholder="Enter Email" 
                    type="email" 
                    onChangeInput={onChangeInput} 
                />
                <Input 
                    id="confirm-code" 
                    name="code" 
                    value={input.code} 
                    label="Code" 
                    placeholder="Enter Verification Code" 
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
                        Verify email
                    </button>
                    : <div className="loaderTiny"></div>}
                </div>
            </div>
        </form>
    );
}

export default ConfirmEmail;