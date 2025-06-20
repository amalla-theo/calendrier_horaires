import React, { useState, useEffect } from 'react';
import CalendrierHebdo from './CalendrierHebdo';

const Calendrier = () => {
  const [serverMessage, setServerMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employees, setEmployees] = useState([]);
  const [workSchedule, setWorkSchedule] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

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

    // Gestion du redimensionnement pour le responsive
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      setWorkSchedule(selectedEmp.planning);
    } else {
      setWorkSchedule(null);
    }
  };

  // Styles pour aligner les blocs horizontalement ou verticalement selon la taille d'écran
  const styles = {
    page: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f6f6f6',
      padding: '0',
    },
    topBar: {
      width: '100%',
      maxWidth: 1100,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: isMobile ? 'center' : 'space-between',
      alignItems: isMobile ? 'stretch' : 'flex-start',
      margin: isMobile ? '10px auto 0 auto' : '24px auto 0 auto',
      gap: isMobile ? '12px' : '32px',
    },
    employeeSelector: {
      marginBottom: isMobile ? 6 : 0,
      width: isMobile ? '95vw' : 'auto',
      maxWidth: 400,
    },
    serverTest: {
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      padding: isMobile ? '10px 8px' : '16px 18px',
      minWidth: isMobile ? 'unset' : 220,
      maxWidth: isMobile ? 'unset' : 260,
      width: isMobile ? '100%' : 'auto',
      marginBottom: 0,
      fontSize: isMobile ? '0.95em' : '0.97em',
    },
    calendarContainer: {
      flex: 1,
      minWidth: 0,
      marginBottom: 0,
      width: isMobile ? '100%' : 'auto',
    },
    select: {
      padding: isMobile ? '4px 8px' : '5px 10px',
      borderRadius: 5,
      border: '1px solid #c58940',
      fontSize: isMobile ? '0.98em' : '1em',
      marginBottom: 0,
      background: '#fff',
      color: '#333',
      width: isMobile ? '100%' : 'auto',
    },
    success: { color: '#2e7d32', margin: 0, fontWeight: 500 },
    error: { color: '#c62828', margin: 0, fontWeight: 500 },
  };

  return (
    <div style={styles.page}>
      <div style={styles.employeeSelector}>
        <select
          value={selectedEmployee}
          onChange={handleEmployeeChange}
          style={styles.select}
        >
          <option value="">Sélectionner un employé</option>
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      <div style={styles.topBar}>
        <div style={styles.serverTest}>
          <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: '1.08em', color: '#c58940' }}>Test de connexion serveur</h3>
          {serverMessage && <p style={styles.success}>{serverMessage}</p>}
          {error && <p style={styles.error}>Erreur: {error}</p>}
        </div>
        <div style={styles.calendarContainer}>
          <CalendrierHebdo
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            planningTravail={workSchedule}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendrier;