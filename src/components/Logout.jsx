import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Logout = () => {
    const handleLogout = async () => {
        try {
            await signOut(auth);

            // Puedes redirigir a la página de login si es necesario
        } catch (err) {
            console.error("Error al cerrar sesión", err.message);
        }
    };

    return <div>
        <button onClick={handleLogout}>Cerrar sesión</button>
    </div>;
};

export default Logout;
