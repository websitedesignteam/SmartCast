import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import AuthInput from './AuthInput';
import { postLogin } from '../../utils/api';
import { isFormComplete } from '../../utils/helper';

function Login({loginUser}) {
    //vars 
    const history = useHistory();

    //states
    const [input, setInput] = useState({username: "", password: ""});
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
            loginUser(response.data.token, response.data.name, response.data.userId);
            history.push('/');
        })
        .catch((error) => {
            setInput({...input, password: ""});
            error.response.data 
            ? setErrorMessage(error.response.data.message)
            : setErrorMessage(error.toString())
        });
    }

    return (
        <form id="login-form" onSubmit={handleSubmit} className="container">
            <div className="form-container">
                <h1>Log in</h1>
                {/* display any error msgs */}
                { (!isFormComplete(input) && !errorMessage) &&
                    <div className="error-msg">Please fill in all fields</div> }
                { (errorMessage) && <div className="error-msg">{errorMessage}</div> }     
                
                <AuthInput id="login-username" name="username" value={input.username} label="Username" placeholder="Enter Username" onChangeInput={onChangeInput} />
                <AuthInput id="login-password" name="password" value={input.password} label="Password" placeholder="Enter Password" type="password" onChangeInput={onChangeInput} />
                
                <button className="login-submit" type="submit" disabled={!isFormComplete(input)}>Login</button>
            </div>
        </form>
    );
}

export default Login;