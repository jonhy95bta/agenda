import React, { useState, useEffect } from "react";
import MyCalendar from "./components/Calendar"; // Asegúrate de que la ruta sea correcta
import Login from "./components/Login";
import Logout from "./components/Logout";
import { auth } from "./firebaseConfig";
import { FaSun, FaMoon } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <button
        className="theme-toggle"
        onClick={() => setDarkMode((prevMode) => !prevMode)}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h1 className="appTitle">¡Bienvenido a la Agenda de Turnos!</h1>

      {!user ? (
        <Login />
      ) : (
        <>
          <MyCalendar />
          <Logout />
        </>
      )}
    </div>
  );
};

export default App;
