import React, { useState, useEffect } from "react";
import MyCalendar from "./components/Calendar"; // Asegúrate de que la ruta sea correcta
import Login from "./components/Login";
import Logout from "./components/Logout";
import { auth } from "./firebaseConfig";
import { FaSun, FaMoon } from "react-icons/fa";
import "./App.css";
import { UserProvider } from "./context/UserContext";


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
    <UserProvider>
      <div className={`App ${darkMode ? "dark" : ""}`}>
        <header><button
          className="theme-toggle"
          onClick={() => setDarkMode((prevMode) => !prevMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
          {user ? (
            <Logout />
          ) : (
            ""
          )}
        </header>
        {user ? (
        <h1 className="appTitle">Aradia Turnos</h1> ) : ("")}

        {!user ? (
          <Login />
        ) : (
          <>
            <MyCalendar />

          </>
        )}
      </div>
    </UserProvider>
  );
};

export default App;
