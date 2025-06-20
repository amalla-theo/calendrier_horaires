import React, { useState } from "react";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const correspondanceJours = {
  "Lundi": "lundi",
  "Mardi": "mardi",
  "Mercredi": "mercredi",
  "Jeudi": "jeudi",
  "Vendredi": "vendredi",
  "Samedi": "samedi",
  "Dimanche": "dimanche"
};
const heures = Array.from({ length: 14 }, (_, i) => i + 7);

// Fonctions utilitaires
const debutSemaine = (date) => {
  const jour = date.getDay() || 7;
  const lundi = new Date(date);
  lundi.setDate(date.getDate() - jour + 1);
  lundi.setHours(0, 0, 0, 0);
  return lundi;
};

const ajouterJours = (date, nbJours) => {
  const resultat = new Date(date);
  resultat.setDate(resultat.getDate() + nbJours);
  return resultat;
};

const memeJour = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const estHeureTravail = (planning, jour, heure, minute) => {
  if (!planning || !planning[jour]) return false;
  const heureMinute = `${heure.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const jourPlanning = planning[jour];
  const matin = heureMinute >= jourPlanning.debutMatin && heureMinute < jourPlanning.finMatin;
  const apresMidi = heureMinute >= jourPlanning.debutAprem && heureMinute < jourPlanning.finAprem;
  return matin || apresMidi;
};

// Numéro de semaine
const numeroSemaine = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const jourNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - jourNum);
  const debutAnnee = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const numSemaine = Math.ceil((((d - debutAnnee) / 86400000) + 1)/7);
  return numSemaine;
};

// Jours fériés France métropolitaine avec nom (correction Pentecôte/Lundi de Pentecôte)
function getJoursFeriesAvecNom(year) {
  // Calcul de Pâques (algorithme de Meeus/Jones/Butcher)
  const f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    moisPaques = 3 + f((L + 40) / 44),
    jourPaques = L + 28 - 31 * f(moisPaques / 4);

  function dateFerie(mois, jour) {
    return new Date(year, mois, jour);
  }

  // Jours fixes
  const jours = [
    { date: dateFerie(0, 1), nom: "Jour de l'an" },
    { date: dateFerie(4, 1), nom: "Fête du Travail" },
    { date: dateFerie(4, 8), nom: "Victoire 1945" },
    { date: dateFerie(6, 14), nom: "Fête nationale" },
    { date: dateFerie(7, 15), nom: "Assomption" },
    { date: dateFerie(10, 1), nom: "Toussaint" },
    { date: dateFerie(10, 11), nom: "Armistice" },
    { date: dateFerie(11, 25), nom: "Noël" },
  ];

  // Jours mobiles
  const paques = new Date(year, moisPaques - 1, jourPaques);
  const lundiPaques = new Date(paques); lundiPaques.setDate(paques.getDate() + 1);
  const ascension = new Date(paques); ascension.setDate(paques.getDate() + 39);
  const pentecote = new Date(paques); pentecote.setDate(paques.getDate() + 49); // Dimanche de Pentecôte
  const lundiPentecote = new Date(paques); lundiPentecote.setDate(paques.getDate() + 50); // Lundi de Pentecôte

  jours.push(
    { date: paques, nom: "Pâques" },
    { date: lundiPaques, nom: "Lundi de Pâques" },
    { date: ascension, nom: "Ascension" },
    { date: pentecote, nom: "Pentecôte" },
    { date: lundiPentecote, nom: "Lundi de Pentecôte" }
  );

  // On retourne un objet { 'YYYY-MM-DD': nom }
  const map = {};
  jours.forEach(j => {
    map[j.date.toISOString().slice(0, 10)] = j.nom;
  });
  return map;
}

function getNomJourFerie(date) {
  const feries = getJoursFeriesAvecNom(date.getFullYear());
  const dateStr = date.toISOString().slice(0, 10);
  return feries[dateStr] || null;
}

const CalendrierHebdo = ({ dateSelectionnee, onDateSelect, planningTravail, isMobile }) => {
  const [semaineCourante, setSemaineCourante] = useState(debutSemaine(new Date()));
  const aujourdHui = new Date();

  // Parité de la semaine
  const numSemaine = numeroSemaine(semaineCourante);
  const pariteSemaine = numSemaine % 2 === 0 ? "paire" : "impaire";

  // Navigation
  const semainePrecedente = () => setSemaineCourante(ajouterJours(semaineCourante, -7));
  const semaineSuivante = () => setSemaineCourante(ajouterJours(semaineCourante, 7));

  // Styles compacts et responsive
  const stylesEntete = {
    conteneur: {
      maxWidth: isMobile ? '100vw' : 900,
      margin: isMobile ? "0 auto" : "16px auto",
      padding: isMobile ? "0 2vw" : "0 6px",
    },
    titre: {
      fontSize: isMobile ? "1.08em" : "1.3em",
      letterSpacing: 0.5,
      color: "#c58940",
      marginBottom: 8,
      fontWeight: 600,
      textAlign: isMobile ? "center" : "left",
    },
    navigation: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    bouton: {
      padding: isMobile ? "3px 8px" : "4px 10px",
      background: "white",
      border: "1.5px solid #c58940",
      borderRadius: 6,
      color: "#c58940",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: isMobile ? "0.93em" : "0.95em",
      transition: "all 0.2s ease",
      boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
    },
    infoSemaine: {
      fontSize: isMobile ? "0.93em" : "0.98em",
      color: "#666",
      textAlign: isMobile ? "center" : "left",
    }
  };

  const stylesTableau = {
    wrapper: {
      overflowX: "auto",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      background: "white",
      padding: isMobile ? "4px" : "8px",
      width: isMobile ? "98vw" : "auto",
      maxWidth: "100vw",
    },
    tableau: {
      width: "100%",
      minWidth: isMobile ? 520 : 700,
      borderCollapse: "separate",
      borderSpacing: 0,
      fontSize: isMobile ? "0.90em" : "0.93em",
    },
    colonneHeure: {
      width: isMobile ? 38 : 55,
      padding: isMobile ? "2px 1px" : "4px 2px",
      background: "#f8f9fa",
      borderBottom: "1px solid #eee",
      color: "#666",
      fontWeight: 500,
      fontSize: isMobile ? "0.93em" : "0.95em",
    },
    enteteJour: {
      padding: isMobile ? "4px 1px" : "7px 2px",
      background: "#f8f9fa",
      borderBottom: "2px solid #c58940",
      color: "#333",
      fontSize: isMobile ? "0.93em" : "0.98em",
      fontWeight: 600,
    },
    caseHeure: (travail) => ({
      padding: isMobile ? "1px 0px" : "2px 1px",
      background: travail ? "rgba(197,137,64,0.13)" : "white",
      borderBottom: "1px solid #eee",
      transition: "background 0.2s",
      cursor: travail ? "pointer" : "default",
      height: isMobile ? 13 : 18,
      minWidth: isMobile ? 18 : 30,
    }),
  };

  // Création des créneaux horaires
  const creneaux = heures.reduce((slots, heure) => {
    slots.push({ heure, minute: 0 });
    slots.push({ heure, minute: 30 });
    return slots;
  }, []);

  return (
    <div style={stylesEntete.conteneur}>
      <header>
        <h2 style={stylesEntete.titre}>Emploi du temps hebdomadaire</h2>
        <div style={stylesEntete.navigation}>
          <button 
            onClick={semainePrecedente}
            style={stylesEntete.bouton}
          >
            ←
          </button>
          <div style={stylesEntete.infoSemaine}>
            Semaine du <strong>{semaineCourante.toLocaleDateString()}</strong>
            {" "}({pariteSemaine === "paire" ? "paire" : "impaire"})
          </div>
          <button 
            onClick={semaineSuivante}
            style={stylesEntete.bouton}
          >
            →
          </button>
        </div>
      </header>

      <div style={stylesTableau.wrapper}>
        <table style={stylesTableau.tableau}>
          <thead>
            <tr>
              <th style={stylesTableau.colonneHeure}>Heure</th>
              {jours.map((jour, idx) => {
                const date = ajouterJours(semaineCourante, idx);
                const estAujourdhui = memeJour(date, aujourdHui);
                const nomFerie = getNomJourFerie(date);
                const estFerie = !!nomFerie;
                let bg = "#f8f9fa";
                let color = "#333";
                if (estAujourdhui) {
                  bg = "#fff3e6";
                  color = "#c58940";
                } else if (estFerie) {
                  bg = "#ffeaea";
                  color = "#d32f2f";
                }
                return (
                  <th
                    key={jour}
                    style={{
                      ...stylesTableau.enteteJour,
                      background: bg,
                      color: color,
                    }}
                  >
                    <div style={{ marginBottom: 2 }}>{jour}</div>
                    <div style={{ fontSize: isMobile ? "0.80em" : "0.85em", color: estFerie ? "#d32f2f" : "#888" }}>
                      {date.toLocaleDateString()}
                      {estFerie && <span style={{ marginLeft: 4, fontWeight: 600 }}>🎉</span>}
                    </div>
                    {estFerie && (
                      <div style={{ fontSize: isMobile ? "0.77em" : "0.85em", color: "#d32f2f", fontWeight: 500 }}>
                        {nomFerie}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {creneaux.map((slot, i) => (
              <tr key={i}>
                <td style={stylesTableau.colonneHeure}>
                  {slot.minute === 0 && `${slot.heure}:00`}
                </td>
                {jours.map((jour, idx) => {
                  // Sélectionne le planning selon la parité
                  const planningPourSemaine = planningTravail ? planningTravail[pariteSemaine] : null;
                  const travail = planningPourSemaine &&
                    estHeureTravail(planningPourSemaine, correspondanceJours[jour], slot.heure, slot.minute);
                  return (
                    <td
                      key={`${jour}-${slot.heure}-${slot.minute}`}
                      style={stylesTableau.caseHeure(travail)}
                    >
                      {travail && (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <span style={{
                            width: isMobile ? 3 : 4,
                            height: isMobile ? 3 : 4,
                            borderRadius: "50%",
                            background: "#c58940",
                            display: "inline-block"
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

export default CalendrierHebdo;