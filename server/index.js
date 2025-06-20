const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test de route vérifiant la connexion au serveur
app.get("/api/test", (req, res) => {
  res.json({ message: "Connexion réussie avec le serveur !" });
});

// Route pour récupérer les données des employés
app.get("/api/employees", (req, res) => {
  try {
    // Lecture du fichier JSON avec le chemin absolu
    const filePath = path.join(__dirname, 'data.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const employeesData = JSON.parse(jsonData);
    res.json(employeesData);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ 
      message: "Erreur lors de la lecture des données",
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});