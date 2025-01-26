const express = require('express');
const bcrypt = require('bcryptjs'); // Import bcrypt
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const Elector = require('../models/elector');
const Candidate = require('../models/Candidate');
const { web3, voteContract } = require('../web3');  // Connexion à la blockchain
const auth = require('../middleware/authMiddleware');  // Middleware pour l'authentification
const router = express.Router();

// Âge légal pour voter
const LEGAL_AGE = 18;

// Calculer l'âge à partir de la date de naissance
function calculateAge(dob) {
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

// Route d'inscription des électeurs
router.post('/register', async (req, res) => {
  const { NIP, nom, prenom, dob, email, province, ville, arrondissement, bureauVote, password } = req.body;

  try {
    // Vérifier l'âge
    const age = calculateAge(dob);
    if (age < LEGAL_AGE) return res.status(400).json({ message: `Vous devez avoir au moins ${LEGAL_AGE} ans pour voter` });

    // Vérifier si le NIP existe déjà
    const existingElector = await Elector.findOne({ NIP });
    if (existingElector) return res.status(400).json({ message: "NIP déjà enregistré" });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel électeur
    const newElector = new Elector({
      NIP, nom, prenom, dob, email, province, ville, arrondissement, bureauVote, password: hashedPassword
    });

    await newElector.save();
    res.status(201).json({ message: "Inscription réussie" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour voter
router.post('/vote', auth, async (req, res) => {
  const { candidateId, electionId } = req.body;

  try {
    // Extraire l'email de l'utilisateur à partir du token JWT
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    // Récupérer l'utilisateur à partir de son email
    const user = await Elector.findOne({ email: userEmail });

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Vérifier si l'utilisateur a déjà voté
    if (user.hasVoted) {
      return res.status(400).json({ message: 'Vous avez déjà voté' });
    }

    // Vérifier si l'utilisateur a l'âge légal pour voter
    const age = calculateAge(user.dob);
    if (age < LEGAL_AGE) {
      return res.status(403).json({ message: `Vous devez avoir au moins ${LEGAL_AGE} ans pour voter` });
    }

    // Vérifier si le candidat existe et appartient à l'élection donnée
    const candidate = await Candidate.findOne({ _id: candidateId, electionId });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidat non trouvé ou non associé à cette élection' });
    }

    // Enregistrer le vote sur la blockchain
    const accounts = await web3.eth.getAccounts();  // Récupérer les comptes depuis Ganache
    await voteContract.methods.vote(candidate.blockchainId).send({ from: accounts[0], gas: 3000000 });

    // Mettre à jour l'utilisateur comme ayant voté
    user.hasVoted = true;
    await user.save();

    res.status(200).json({ message: 'Votre vote a été enregistré avec succès sur la blockchain' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du vote' });
  }
});

// Route pour vérifier le vote
router.get('/verify-vote', auth, async (req, res) => {
  try {
      // Extraire l'email de l'utilisateur à partir du token JWT
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userEmail = decoded.email;

      // Récupérer l'utilisateur à partir de son email
      const user = await Elector.findOne({ email: userEmail });

      if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

      // Vérifier si l'utilisateur a voté
      if (!user.hasVoted) {
          return res.status(400).json({ message: 'Vous n\'avez pas encore voté' });
      }

      // Récupérer l'ID du candidat voté à partir de la blockchain
      const voteData = await voteContract.methods.getVoteForElector(user.address).call();  // Utilisation de l'adresse pour récupérer le vote
      const candidate = await Candidate.findOne({ blockchainId: voteData });

      if (!candidate) {
          return res.status(404).json({ message: 'Candidat non trouvé pour ce vote' });
      }

      // Envoyer les détails du candidat voté
      res.status(200).json({
          message: 'Votre vote a été vérifié avec succès',
          candidate: {
              name: candidate.name,
              party: candidate.party,
              description: candidate.description
          }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la vérification du vote' });
  }
});

module.exports = router;
