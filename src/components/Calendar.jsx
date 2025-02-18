import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, startOfWeek, addDays, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import styles from './Calendar.module.css';

// Importamos las funciones de Firestore y la instancia de la base de datos desde nuestro archivo de configuración
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firestore"; // Ajusta la ruta según la ubicación de tu archivo firebase.js

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

    // Cargamos los eventos desde Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setEvents(eventsData);
        });
        return () => unsubscribe();
    }, []);

    // Función para agregar eventos (además de actualizar el estado local, se guarda en Firestore)
    const addEvent = async (date) => {
        if (eventTitle === "") return;
        const newEvent = {
            date: date.toISOString(),
            title: eventTitle,
            service: selectedService
        };

        try {
            // Verificar si la conexión a Firestore es exitosa
            const docRef = await addDoc(collection(db, "events"), newEvent);

            // Actualizar estado local
            setEvents([...events, { ...newEvent, id: docRef.id }]);
            setEventTitle("");
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
        const friday = addDays(monday, 4);

        const totalForWeek = events
            .filter(event => {
                const eventDate = new Date(event.date);
                return isWithinInterval(eventDate, { start: monday, end: friday });
            })
            .reduce((sum, event) => sum + event.service.price, 0);

        setTotal(totalForWeek);
    };

    return (
        <div className={styles.calendarContainer}>
            <Calendar
                onChange={setDate}
                value={date}
                locale="es-ES"
                formatMonthYear={(locale, date) =>
                    capitalizeFirstLetter(format(date, "MMMM yyyy", { locale: es }))
                }
                tileClassName={({ date }) => checkEvent(date) ? styles.eventDay : ""}
            />

            <div className={styles.eventForm}>
                <input
                    type="text"
                    placeholder="Agregar Turno"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                />
                <select
                    className={styles.selectStyled}
                    value={selectedService.name}
                    onChange={(e) => setSelectedService(services.find(s => s.name === e.target.value))}
                >
                    {services.map((service, index) => (
                        <option key={index} value={service.name}>
                            {service.name} - ${service.price}
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
                            <li key={index} className={styles.eventItem}>
                                {event.title} - {event.service.name} (${event.service.price})
                                <button
                                    onClick={() => deleteEvent(event.id)} // Usamos el ID del evento
                                    style={{ marginLeft: "10px", color: "red" }}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                </ul>
            </div>

            <div className={styles.totalContainer}>
                <button className={styles.totalButton} onClick={calculateTotal}>
                    Calcular Total Día
                </button>
                <button className={styles.totalButton} onClick={calculateWeekTotal}>
                    Calcular Total Semana (Lun-Vie)
                </button>
                {total !== null && (
                    <p className={styles.totalDisplay}>Total: ${total}</p>
                )}
            </div>
        </div>
    );
};

export default CalendarComponent;
