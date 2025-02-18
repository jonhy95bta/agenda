import React, { useState, useEffect } from 'react';
import MyCalendar from './components/Calendar'; // Asegúrate de que la ruta sea correcta
import Login from './components/Login'; // Asegúrate de tener este componente creado
import Logout from './components/Logout'; // Asegúrate de tener este componente creado
import './App.css'; // Si tienes un archivo global de estilos

import { auth } from './firebaseConfig'; // Importa la configuración de Firebase

const App = () => {
  const [user, setUser] = useState(null);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe(); // Limpia el observador cuando el componente se desmonta
  }, []);

  return (
    <div className="App">
      <h1 className="appTitle">¡Bienvenido a la Agenda de Turnos!</h1>

      {!user ? (
        <div>
          <Login />
        </div>
      ) : (
        <div>
          <MyCalendar />
          <Logout />
        </div>
      )}
    </div>
  );
};

export default App;
