import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import AuthInput from './AuthInput';
import { postSignup } from '../../utils/api';
import { isFormComplete } from '../../utils/helper';

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
            alert(response.data.message);
            // history.push('/login');
        })
        .catch((error) => {
            setInput({name: "", email: "", password: ""});
            (error.response)
            ? setErrorMessage(error.response.data.message)
            : setErrorMessage(error.toString())
        });
    }

    return (
        <form id="signup-form" onSubmit={handleSubmit} className="container">
            <div className="form-container">
                <h1>Sign up</h1>
                {/* display any error msgs */}
                { (!isFormComplete(input) && !errorMessage) &&
                    <div className="error-msg">Please fill in all fields</div> }
                { (errorMessage) && <div className="error-msg">{errorMessage}</div> }     
                
                <AuthInput id="signup-name" name="name" value={input.name} label="Name" placeholder="Enter Name" onChangeInput={onChangeInput} />
                <AuthInput id="signup-email" name="email" value={input.email} label="Email" placeholder="Enter Email" type="email" onChangeInput={onChangeInput} />
                <AuthInput id="signup-password" name="password" value={input.password} label="Password" placeholder="Enter Password" type="password" onChangeInput={onChangeInput} />

                <button id="btn-signup" className="submit-btn" type="submit" disabled={!isFormComplete(input)}>Sign up</button>
            </div>
        </form>
    );
}

export default Signup;