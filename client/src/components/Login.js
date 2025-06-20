import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        if (username.trim() && password.trim()) {
            e.preventDefault();
            console.log({ username, password });
            setPassword("");
            setUsername("");
        }
    };

    return (
        <main className='login'>
            <form className='login__form' onSubmit={handleSubmit}>
                <h2 className='login__title'>Connectez-vous à votre compte</h2>
                <label htmlFor='username'>Identifiant</label>
                <input
                    id='username'
                    name='username'
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='username'
                />
                <label htmlFor='password'>Mot de passe</label>
                <input
                    id='password'
                    type='password'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='password'
                />
                <button className='loginButton'>Connexion
                </button>
                <p style={{ textAlign: "center", marginTop: "30px" }}>
                    Vous n'avez pas de compte ?{" "}
                    <Link className='link' to='/register'>
                        Créer un compte
                    </Link>
                </p>
            </form>
        </main>
    );
};

export default Login