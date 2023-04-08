import React, { useContext, useState } from "react";
import { LoginContext } from "../contexts/LoginContext";
import Header from "./Header";
import Unloggined from "./Unloggined";
import { useNavigate } from "react-router-dom";

function Login() {

    const context = useContext(LoginContext);
    const [input, setInput] = useState({email: '', password: ''});
    const navigate = useNavigate();

    const onInputChange = (e) => {
        setInput({...input, [e.target.name]: e.target.value});
    }; 

    const handleSubmit = (e) => {
        e.preventDefault();
        const {email, password} = input;
        context.authApi.signIn(password, email)
        .then(res => {
            console.log(res);
            context.userLoggined();
            localStorage.setItem('jwt', res.token);
            navigate('/', {replace: true});
        })
        .catch(err => {
            console.log(err);
            setInput({email: '', password: ''});
        });
    };

    return (
        <>
            <Header loggedIn={context.loggedIn} link={{text: 'Регистрация', url: '/sign-up'}} />
            <Unloggined handleSubmit={handleSubmit} title="Вход" btnText="Войти">
                    <input required minLength="3" maxLength="40" value={input.email} onChange={onInputChange} placeholder="Email" className="unloggined__input" name="email" />
                    <input required minLength="3" maxLength="40" value={input.password} onChange={onInputChange} placeholder="Пароль" className="unloggined__input" name="password" />
            </Unloggined>
        </>
    );
}

export default Login;