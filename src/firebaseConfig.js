import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDSSyF-cGxonY0aAaTvdm5VYqrKWKOt818",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "agendacmm", // Este ID debe ser el correcto
    storageBucket: "agendacmm.appspot.com",
    messagingSenderId: "338906345791",
    appId: "1:338906345791:web:b8c46839caffeefdbf638a",
    measurementId: "G-00XDMCSBT2"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firebase Authentication
const auth = getAuth(app);

// Inicializa Firebase Analytics
const analytics = getAnalytics(app);

// Exporta los módulos necesarios
export { app, auth, analytics };
