// src/components/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useUser } from "../context/UserContext"; // Importar el hook

import "./Login.css"; // Importar el archivo de estilo

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { setUser, setRole } = useUser(); // Acceder a setUser y setRole desde el contexto

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const roles = {
                "morellic99@hotmail.com": "admin_costos",
                "aradiaturnos@hotmail.com": "admin_turnos",
            };

            const role = roles[user.email] || "usuario_normal"; // Asigna un rol predeterminado si no hay coincidencia

            setUser({ uid: user.uid, email: user.email }); // Guardar el usuario en el contexto
            setRole(role); // Guardar el rol en el contexto

            // Guardar el usuario y el rol en localStorage para persistencia
            localStorage.setItem("user", JSON.stringify({ uid: user.uid, email: user.email }));
            localStorage.setItem("userRole", role);
        } catch (err) {
            setError("Correo o contraseña incorrectos.");
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
