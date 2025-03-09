// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState("usuario_normal");
    const [role, setRole] = useState(localStorage.getItem("userRole") || "usuario_normal");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const value = {
        user,
        setUser,
        role,
        setRole,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
