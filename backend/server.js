const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const electorRoutes = require('./routes/electorRoutes'); // Importer les routes
const authRoutes = require('./routes/authRoutes'); // Importer les routes d'authentification
const electionRoutes = require('./routes/electionRoutes');
const candidateRoutes = require('./routes/candidateRoutes'); // Importer les routes
const listRoutes = require('./routes/listRoutes');
//const voteRoutes = require('./routes/voteRoutes');

const app = express();
app.use(express.json());

console.log("MONGO_URI:", process.env.MONGO_URI); // Afficher l'URL pour vérifier qu'elle est bien chargée

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connecté à MongoDB');
}).catch((err) => {
  console.error('Erreur de connexion MongoDB', err);
});

app.use(cors({
  origin: 'http://localhost:3000',  // Permets uniquement les requêtes venant du frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Utiliser les routes
app.use('/api/electors', electorRoutes);
app.use('/api/auth', authRoutes);
// Utiliser les routes des candidats
app.use('/api/candidates', candidateRoutes);
app.use(express.json()); 
app.use('/api/elections', electionRoutes);  // Utilise les routes pour les élections
app.use('/api/', listRoutes);
//app.use('/api/vote', voteRoutes);
// Route de test
app.get('/', (req, res) => {
  res.send('Système de vote en ligne');
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
