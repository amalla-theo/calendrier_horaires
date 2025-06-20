import React, { useState, useEffect } from 'react';
import WeeklyCalendar from './WeeklyCalendar';

const Calendrier = () => {
  const [serverMessage, setServerMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employees, setEmployees] = useState([]);
  const [workSchedule, setWorkSchedule] = useState(null);

  useEffect(() => {
    // Test de connexion
    fetch('http://localhost:3001/api/test')
      .then(response => response.json())
      .then(data => setServerMessage(data.message))
      .catch(err => setError(err.message));

    // Chargement des données employés
    fetch('http://localhost:3001/api/employees')
      .then(response => response.json())
      .then(data => setEmployees(data.employees))
      .catch(err => setError('Erreur lors du chargement des employés: ' + err.message));
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleEmployeeChange = (event) => {
    const employeeId = parseInt(event.target.value);
    setSelectedEmployee(employeeId);
    
    // Trouver l'employé sélectionné et son planning
    const selectedEmp = employees.find(emp => emp.id === employeeId);
    if (selectedEmp) {
      setWorkSchedule(selectedEmp.schedule);
    } else {
      setWorkSchedule(null);
    }
  };

  return (
    <div className="calendar-page">
      <div className="employee-selector">
        <select 
          value={selectedEmployee} 
          onChange={handleEmployeeChange}
          className="employee-select"
        >
          <option value="">Sélectionner un employé</option>
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <div className="server-test">
        <h3>Test de connexion serveur</h3>
        {serverMessage && <p className="success-message">{serverMessage}</p>}
        {error && <p className="error-message">Erreur: {error}</p>}
      </div>

      <div className="calendar-container">
        <WeeklyCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          workSchedule={workSchedule}
        />
      </div>
    </div>
  );
};

export default Calendrier;