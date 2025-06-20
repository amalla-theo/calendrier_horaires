import React from 'react';

const EventList = ({ events, onDeleteEvent }) => {
  return (
    <div className="event-list">
      <h3>Événements</h3>
      {events.length === 0 ? (
        <p>Aucun événement</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id} className="event-item">
              <div className="event-details">
                <h4>{event.title}</h4>
                <p>Début: {new Date(event.start).toLocaleString()}</p>
                <p>Fin: {new Date(event.end).toLocaleString()}</p>
                {event.description && <p>{event.description}</p>}
              </div>
              <button 
                onClick={() => onDeleteEvent(event.id)}
                className="delete-button"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;