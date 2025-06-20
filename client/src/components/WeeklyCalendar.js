import React, { useState } from "react";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const dayMapping = {
  "Lundi": "monday",
  "Mardi": "tuesday",
  "Mercredi": "wednesday",
  "Jeudi": "thursday",
  "Vendredi": "friday",
  "Samedi": "saturday",
  "Dimanche": "sunday"
};
const hours = Array.from({ length: 14 }, (_, i) => i + 7);

// Helper functions
const getStartOfWeek = (date) => {
  const day = date.getDay() || 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const addDays = (date, daysToAdd) => {
  const result = new Date(date);
  result.setDate(result.getDate() + daysToAdd);
  return result;
};

const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isWorkingTime = (schedule, day, hour, minute) => {
  if (!schedule || !schedule[day]) return false;
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const daySchedule = schedule[day];
  const isMorning = time >= daySchedule.startAM && time < daySchedule.endAM;
  const isAfternoon = time >= daySchedule.startPM && time < daySchedule.endPM;
  return isMorning || isAfternoon;
};

const WeeklyCalendar = ({ selectedDate, onDateSelect, workSchedule }) => {
  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));
  const today = new Date();

  // Navigation functions
  const goToPreviousWeek = () => setCurrentWeek(addDays(currentWeek, -7));
  const goToNextWeek = () => setCurrentWeek(addDays(currentWeek, 7));

  // Style objects
  const headerStyles = {
    container: {
      maxWidth: 1100,
      margin: "40px auto",
      padding: "0 20px",
    },
    title: {
      fontSize: "2.4em",
      letterSpacing: 1.2,
      color: "#c58940",
      marginBottom: 16,
      fontWeight: 600,
    },
    navigation: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    button: {
      padding: "10px 24px",
      background: "white",
      border: "2px solid #c58940",
      borderRadius: 8,
      color: "#c58940",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "1.1em",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    weekInfo: {
      fontSize: "1.2em",
      color: "#666",
    }
  };

  const tableStyles = {
    wrapper: {
      overflowX: "auto",
      borderRadius: 12,
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      background: "white",
      padding: "20px",
    },
    table: {
      width: "100%",
      minWidth: 900,
      borderCollapse: "separate",
      borderSpacing: 0,
      fontSize: "1em",
    },
    timeColumn: {
      width: 80,
      padding: "12px 8px",
      background: "#f8f9fa",
      borderBottom: "1px solid #eee",
      color: "#666",
      fontWeight: 500,
    },
    dayHeader: {
      padding: "16px 8px",
      background: "#f8f9fa",
      borderBottom: "2px solid #c58940",
      color: "#333",
      fontSize: "1.1em",
      fontWeight: 600,
    },
    timeSlot: (isWorking) => ({
      padding: "8px 4px",
      background: isWorking ? "rgba(197,137,64,0.1)" : "white",
      borderBottom: "1px solid #eee",
      transition: "background 0.2s",
      cursor: isWorking ? "pointer" : "default",
      height: 30,
    }),
  };

  // Generate time slots
  const timeSlots = hours.reduce((slots, hour) => {
    slots.push({ hour, minute: 0 });
    slots.push({ hour, minute: 30 });
    return slots;
  }, []);

  return (
    <div style={headerStyles.container}>
      <header>
        <h2 style={headerStyles.title}>Emploi du temps hebdomadaire</h2>
        <div style={headerStyles.navigation}>
          <button 
            onClick={goToPreviousWeek}
            style={headerStyles.button}
          >
            ← Semaine précédente
          </button>
          <div style={headerStyles.weekInfo}>
            Semaine du <strong>{currentWeek.toLocaleDateString()}</strong>
          </div>
          <button 
            onClick={goToNextWeek}
            style={headerStyles.button}
          >
            Semaine suivante →
          </button>
        </div>
      </header>

      <div style={tableStyles.wrapper}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              <th style={tableStyles.timeColumn}>Horaire</th>
              {days.map((day, idx) => {
                const date = addDays(currentWeek, idx);
                const isToday = isSameDay(date, today);
                return (
                  <th
                    key={day}
                    style={{
                      ...tableStyles.dayHeader,
                      background: isToday ? "#fff3e6" : "#f8f9fa",
                      color: isToday ? "#c58940" : "#333",
                    }}
                  >
                    <div style={{ marginBottom: 4 }}>{day}</div>
                    <div style={{ fontSize: "0.9em", color: "#888" }}>
                      {date.toLocaleDateString()}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, i) => (
              <tr key={i}>
                <td style={tableStyles.timeColumn}>
                  {slot.minute === 0 && `${slot.hour}:00`}
                </td>
                {days.map((day, idx) => {
                  const isWorking = workSchedule &&
                    isWorkingTime(workSchedule, dayMapping[day], slot.hour, slot.minute);
                  return (
                    <td
                      key={`${day}-${slot.hour}-${slot.minute}`}
                      style={tableStyles.timeSlot(isWorking)}
                    >
                      {isWorking && (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <span style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#c58940",
                          }} />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyCalendar;