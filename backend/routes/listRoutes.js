const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const auth = require('../middleware/authMiddleware'); // Middleware d'authentification

// Route pour lister tous les candidats, protégée par authMiddleware
router.get('/candidates', auth, async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('electionId'); // Populer avec l'élection associée
    res.status(200).json({ candidates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des candidats' });
  }
});

// Route pour lister toutes les élections, protégée par authMiddleware
router.get('/elections', auth, async (req, res) => {
  try {
    const elections = await Election.find();
    res.status(200).json({ elections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des élections' });
  }
});

module.exports = router;
