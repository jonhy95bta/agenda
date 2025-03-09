import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import '../App.css';
import { useState, useEffect } from "react";


const Logout = () => {

    const [useradmin, setUseradmin] = useState("");

useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUseradmin(
        role === "admin_turnos"
            ? "Jessi"
            : role === "admin_costos"
                ? "Camila"
                : ""
    );
}, []);

    const handleLogout = async () => {

        try {
            // Cerrar sesión de Firebase
            await signOut(auth);

            // Eliminar el rol del usuario de localStorage
            localStorage.removeItem('userRole');
            setUseradmin("")


        } catch (err) {
            console.error("Error al cerrar sesión", err.message);
        }
    };

    return (

        <div>
            <span className='userAdmin'>Bienvenida {useradmin}</span>
            <button onClick={handleLogout}>Cerrar sesión</button>


        </div>
    );
};

export default Logout;
