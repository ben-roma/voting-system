const express = require('express');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const router = express.Router();

// Fonction pour générer un Blockchain ID unique
function generateBlockchainId() {
  return Math.floor(Math.random() * 1000000);  // Exemple simple : un nombre aléatoire entre 0 et 999999
}

// Route pour ajouter un candidat à une élection (admin seulement)
router.post('/add-candidate', async (req, res) => {
  const { nom, programme, electionId } = req.body;

  try {
    // Générer un Blockchain ID pour le candidat
    const blockchainId = generateBlockchainId();

    // Créer le candidat avec le Blockchain ID
    const newCandidate = new Candidate({
      nom,
      programme,
      electionId,
      blockchainId  // Ajouter l'ID blockchain généré
    });

    await newCandidate.save();

    // Ajouter le candidat à l'élection
    const election = await Election.findById(electionId);
    election.candidates.push(newCandidate._id);
    await election.save();

    res.status(201).json({ message: 'Candidat ajouté avec succès', candidate: newCandidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du candidat' });
  }
});

module.exports = router;
