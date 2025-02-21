// WeekDetail.jsx
import React from 'react';
import { format, startOfWeek, addDays, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './DetalleSemana.module.css';

const WeekDetail = ({ events, selectedDate }) => {
    const monday = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const friday = addDays(monday, 4);

    const weekEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return isWithinInterval(eventDate, { start: monday, end: friday });
    });

    const totalForWeek = weekEvents.reduce((sum, event) => sum + event.service.price, 0);

    return (
        <div className={styles.weekDetailContainer}>
            <h3>Detalle de Turnos de la Semana (Lunes - Viernes)</h3>
            <ul>
                {weekEvents.map((event, index) => (
                    <li key={index} className={styles.eventItem}>
                        <strong>{event.title}</strong> - {event.service.name} (${event.service.price})
                    </li>
                ))}
            </ul>
            <p className={styles.total}>Total de la semana: ${totalForWeek}</p>
        </div>
    );
};

export default WeekDetail;
