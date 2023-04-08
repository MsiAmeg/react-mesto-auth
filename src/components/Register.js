import { useContext, useState } from "react";
import { LoginContext } from "../contexts/LoginContext";
import Header from "./Header";
import Unloggined from "./Unloggined";
import { useNavigate } from "react-router-dom";
import InfoTooltip from './InfoTooltip.js';

function Register() {

    const context = useContext(LoginContext);
    const [input, setInput] = useState({email: '', password: ''});
    const [registrationPopup, setRegistrationPopup] = useState({isOpen: false, success: false});
    const navigate = useNavigate();

    const onInputChange = (e) => {
        setInput({...input, [e.target.name]: e.target.value});
    };

    const onClose = () => {
        setRegistrationPopup({...registrationPopup, isOpen: false});
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const {email, password} = input;
        context.authApi.registration(password, email)
        .then(res => {
            console.log(res);
            setRegistrationPopup({isOpen: true, success: true});
            navigate('/login-in', {replace: true});
        })
        .catch(err => {
            console.log(err);
            setInput({email: '', password: ''});
            setRegistrationPopup({isOpen: true, success: false});
        });
    };

    return (
        <>
            <Header loggedIn={context.loggedIn} link={{text: 'Войти', url: '/sign-in'}} />
            <Unloggined handleSubmit={handleSubmit} title="Регистрация" btnText="Зарегистрироваться">
                    <input required minLength="3" maxLength="40" value={input.email} onChange={onInputChange} placeholder="Email" className="unloggined__input" name="email" />
                    <input required minLength="3" maxLength="40" value={input.password} onChange={onInputChange} placeholder="Пароль" className="unloggined__input" name="password" />
            </Unloggined>
            
            <InfoTooltip onClose={onClose} success={registrationPopup.success} isOpen={registrationPopup.isOpen} />
        </>
    );
}

export default Register;