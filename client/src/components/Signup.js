import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim() && password.trim() && email.trim()) {
            console.log(email, username, password);
            setPassword("");
            setUsername("");
            setEmail("");
        }
    };

    return (
        <main className='signup'>
            <form className='signup__form' onSubmit={handleSubmit}>
                <h2 className='signup__title'>Créer un compte</h2>
                <label htmlFor='email'>Courriel</label>
                <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor='username'>Identifiant</label>
                <input
                    id='username'
                    name='username'
                    required
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor='password'>Mot de passe</label>
                <input
                    id='password'
                    type='password'
                    name='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='signupButton'>Enregistrer</button>
                <p style={{ textAlign: "center", marginTop: "30px" }}>
                    Vous avez déjà un compte ?{" "}
                    <Link className='link' to='/login'>
                        Connexion
                    </Link>
                </p>
            </form>
        </main>
    );
};

export default Signup;