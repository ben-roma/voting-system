const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const { addCandidateToElection } = require('../web3');
const verifyAdmin = require('../middleware/adminMiddleware');

// Route pour ajouter un candidat
router.post('/:electionId/add', async (req, res) => {
  const { electionId } = req.params;
  const { name, party, description } = req.body;

  try {
    // Vérifier si l'élection existe dans MongoDB
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ message: 'Élection non trouvée' });

    // Utiliser l'ID blockchain de l'élection pour ajouter le candidat sur la blockchain
    const blockchainResponse = await addCandidateToElection(election.blockchainId, name);

    console.log("Blockchain Response Structure:", JSON.stringify(blockchainResponse, null, 2));

    // Récupérer `candidateId` dans `CandidateAssociatedToElection` si disponible
    if (blockchainResponse?.events?.CandidateAssociatedToElection?.returnValues) {
      const candidateId = blockchainResponse.events.CandidateAssociatedToElection.returnValues.candidateId;

      // Enregistrer le candidat dans MongoDB avec l'ID de la blockchain
      const newCandidate = new Candidate({
        name,
        party,
        description,
        electionId,
        blockchainId: candidateId,
      });

      await newCandidate.save();
      res.status(201).json({ message: 'Candidat ajouté avec succès', candidate: newCandidate });
    } else {
      return res.status(500).json({ message: 'Erreur lors de la récupération de candidateId depuis la blockchain', details: blockchainResponse });
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du candidat :", error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du candidat', error });
  }
});

module.exports = router;
