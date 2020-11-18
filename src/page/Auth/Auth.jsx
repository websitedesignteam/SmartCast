import React, { useState } from 'react';
import { Login, Signup } from '../../component/Auth'

function Auth(props) {
    const [type, setType] = useState(props.type || "login");

    const onClickLogin = () => {
        setType("login");
    }
    
    const onClickSignup = () => {
        setType("signup");
    }

    return (
        <div className="auth-container">
            <button onClick={onClickLogin}>Login</button>
            <button onClick={onClickSignup}>Signup</button>
            {type === "login" && <Login />}
            {type === "signup" && <Signup />}
        </div>
    );
}

export default Auth;