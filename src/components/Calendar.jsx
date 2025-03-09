import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, startOfWeek, addDays, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import '../App.css';
import styles from './Calendar.module.css';
import { useUser } from "../context/UserContext";  // Aquí se importa el hook para acceder al contexto

// Importamos las funciones de Firestore y la instancia de la base de datos desde nuestro archivo de configuración
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firestore"; // Ajusta la ruta según la ubicación de tu archivo firebase.js

// Servicios
const services = [
    { name: "Masajes reductores", detail: "Masaje de 30 minutos", price: 2650 },
    { name: "Drenaje linfatico", detail: "Masaje de 60 minutos", price: 4000 },
    { name: "Maderoterapia", detail: "Masaje de 60 minutos", price: 5040 },
    { name: "Electrodos", detail: "Maquina para tonificar 30 min", price: 2250 },
    { name: "Radiofrecuencia", detail: "Maquina 30/40 minutos", price: 5000 },
    { name: "Ultracavitacion", detail: "Maquina 30 minutos", price: 2250 },
    { name: "Truflex", detail: "Maquina 60 minutos", price: 3000 },
    { name: "Trufat", detail: "Maquina 60 minutos", price: 3000 },
    { name: "Depilacion Completa", detail: "Jornada Completa", price: 30000 },
    { name: "Depilacion Semi", detail: "Jornada Semi-completa", price: 15000 },
    { name: "Exilis", detail: "Maquina 30 min", price: 3000 }
];

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [date, setDate] = useState(new Date());
    const [eventTitle, setEventTitle] = useState("");
    const [selectedService, setSelectedService] = useState(services[0]);
    const [total, setTotal] = useState(null);
    const [showWeekDetail, setShowWeekDetail] = useState(false); // Para controlar la visibilidad del detalle de la semana

    const { role } = useUser(); // Acceder al rol y al usuario
    const [error, setError] = useState("");  // Estado para manejar el error

    const handleTimeChange = (e) => {
        const value = e.target.value;
        const [hour, minute] = value.split(":");

        // Validar que la hora esté entre 10:00 y 20:00
        if (parseInt(hour) >= 10 && (parseInt(hour) < 20 || (parseInt(hour) === 20 && parseInt(minute) === 0))) {
            setEventTime(value); // Solo actualizar si está en el rango permitido
            setError(""); // Limpiar mensaje de error
        } else {
            setError("El horario debe estar entre las 10:00 hs y las 20:00 hs.");
        }
    };

    // Cargamos los eventos desde Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setEvents(eventsData);
        });
        return () => unsubscribe();
    }, []); 
    

    // Función para agregar eventos (además de actualizar el estado local, se guarda en Firestore)
    const [eventTime, setEventTime] = useState('');
    const addEvent = async (date) => {
        if (eventTitle === "" || eventTime === "") return; // Validar que la hora no esté vacía
        
        // Convertir la hora del evento en un objeto Date para poder compararlo
        const eventDate = new Date(date);
        const [hour, minute] = eventTime.split(":");
        eventDate.setHours(hour);
        eventDate.setMinutes(minute);
        eventDate.setSeconds(0);
        eventDate.setMilliseconds(0);
        
        // Comprobamos si ya existe un evento dentro de la franja horaria de 30 minutos
        const conflict = events.some(event => {
            const existingEventDate = new Date(event.date);
            const existingEventStart = new Date(existingEventDate);
            const existingEventEnd = new Date(existingEventDate);
            
            // Ajustar el tiempo de inicio y fin de cada evento
            existingEventStart.setHours(existingEventDate.getHours());
            existingEventStart.setMinutes(existingEventDate.getMinutes());
            existingEventStart.setSeconds(0);
            existingEventStart.setMilliseconds(0);
            
            existingEventEnd.setHours(existingEventDate.getHours());
            existingEventEnd.setMinutes(existingEventDate.getMinutes() + 30); // Suponemos que los eventos duran 30 minutos
            
            // Verificamos si la hora del nuevo evento está dentro de los 30 minutos de cualquier otro evento
            return (
                (eventDate >= existingEventStart && eventDate < existingEventEnd) ||  // El evento empieza en el rango
                (eventDate < existingEventEnd && new Date(eventDate.getTime() + 30 * 60000) > existingEventStart) // O el evento termina en el rango
            );
        });
        
        if (conflict) {
            setError("Ya existe un evento en esa franja horaria. Elija otro horario.");
            return; // Si hay conflicto, no añadimos el evento
        }
        
        // Si no hay conflicto, procedemos a agregar el evento
        const newEvent = {
            date: eventDate.toISOString(),
            time: eventTime, // Agregar la hora seleccionada
            title: eventTitle,
            service: selectedService
        };
    
        try {
            // Verificar si la conexión a Firestore es exitosa
            const docRef = await addDoc(collection(db, "events"), newEvent);
            // Actualizar estado local
            setEvents([...events, { ...newEvent, id: docRef.id }]);
            setEventTitle("");
            setEventTime("");
            setError("");  // Limpiar el error si el evento se agrega correctamente
        } catch (error) {
            console.error("Error al agregar el evento: ", error);
        }
    };
    

    // Función para eliminar evento
    const deleteEvent = async (eventId) => {
        try {
            // Eliminar evento de Firestore
            const eventDocRef = doc(db, "events", eventId);
            await deleteDoc(eventDocRef);
            console.log("Evento eliminado de Firestore");

            // Actualizar estado local
            setEvents(events.filter(event => event.id !== eventId));
        } catch (error) {
            console.error("Error al eliminar el evento de Firestore: ", error);
        }
    };

    const checkEvent = (date) => {
        return events.some(event => new Date(event.date).toDateString() === date.toDateString());
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Calcula el total para el día seleccionado
    const calculateTotal = () => {
        const totalForDay = events
            .filter(event => new Date(event.date).toDateString() === date.toDateString())
            .reduce((sum, event) => sum + event.service.price, 0);
        setTotal(totalForDay);
    };

    // Calcula el total de la semana (de lunes a viernes)
    const calculateWeekTotal = () => {
        const monday = startOfWeek(date, { weekStartsOn: 1 });
        const saturday = addDays(monday, 6);

        const totalForWeek = events
            .filter(event => {
                const eventDate = new Date(event.date);
                return isWithinInterval(eventDate, { start: monday, end: saturday });
            })
            .reduce((sum, event) => sum + event.service.price, 0);

        setTotal(totalForWeek);
        setShowWeekDetail(prevState => !prevState); // Alterna la visibilidad del detalle de la semana
    };

    return (
        <div className="calendarContainer">
            <Calendar
                onChange={setDate}
                value={date}
                locale="es-ES"
                formatMonthYear={(locale, date) =>
                    capitalizeFirstLetter(format(date, "MMMM yyyy", { locale: es }))
                }
                tileClassName={({ date }) => checkEvent(date) ? "eventDay" : ""}
            />

            <div className={styles.eventForm}>
                <input
                    type="text"
                    placeholder="Agregar Turno"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                />

                <div>
                    {/* Mostrar mensaje de error si existe */}
                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <input
                        type="time"
                        value={eventTime}
                        onChange={handleTimeChange} // Usamos la función de validación
                        required
                        min="10:00"
                        max="20:00"
                    />
                </div>

                <select
                    className={styles.selectStyled}
                    value={selectedService.name}
                    onChange={(e) => setSelectedService(services.find(s => s.name === e.target.value))}
                >
                    {services.map((service, index) => (
                        <option key={index} value={service.name}>
                            {service.name}
                        </option>
                    ))}
                </select>

                <button onClick={() => addEvent(date)}>Agregar Turno</button>
            </div>

            <div className={styles.eventsList}>
                <h3>
                    {format(date, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es })
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <ul>
                    {events
                        .filter(event => new Date(event.date).toDateString() === date.toDateString())
                        .map((event, index) => (
                            <li key={index} className="eventItem">
                                {event.title} - {event.service.name} - {event.time}hs {/* Mostrar la hora del evento */}
                                <button 
                                    onClick={() => deleteEvent(event.id)}
                                    
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
            <div>
                {role === "admin_costos" && (
                    <div className={styles.totalContainer}>
                        <button className={styles.totalButton} onClick={calculateTotal}>
                            Calcular Total Día
                        </button>
                        <button className={styles.totalButton} onClick={calculateWeekTotal}>
                            Calcular Total Semana (Lun-Sab)
                        </button>
                        {total !== null && (
                            <p className={styles.totalDisplay}>Total: ${total}</p>
                        )}
                    </div>
                )}
                {/* Mostrar el detalle de la semana solo cuando se calcule */}
                {showWeekDetail && (
                    <div className={`${styles.weekDetail} ${showWeekDetail ? styles.show : ''}`}>
                        <h4>Resumen de la Semana (Lunes a Sabados)</h4>
                        <ul>
                            {events
                                .filter(event => {
                                    const monday = startOfWeek(date, { weekStartsOn: 1 });
                                    const saturday = addDays(monday, 6);
                                    const eventDate = new Date(event.date);

                                    return isWithinInterval(eventDate, { start: monday, end: saturday });
                                })
                                .map((event, index) => (
                                    <li key={index}>
                                        {event.title} - {event.service.name} (${event.service.price})
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarComponent;