import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Login.css'; // Importa el archivo de estilo

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Aquí redirigir a la página principal o la que necesites
        } catch (err) {
            setError('Correo o contraseña incorrectos.');
        }
    };

    return (
        <div className="loginContainer">
            <form className="loginForm" onSubmit={handleLogin}>
                <h2>Iniciar sesión</h2>
                <input
                    type="email"
                    className="inputField"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="inputField"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit" className="loginButton">Iniciar sesión</button>
            </form>
        </div>
    );
};

export default Login;
