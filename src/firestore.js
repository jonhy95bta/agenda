import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { app } from "./firebaseConfig";  // Asegúrate de que la ruta sea correcta

// Inicializa Firestore
const db = getFirestore(app);

export { db };
