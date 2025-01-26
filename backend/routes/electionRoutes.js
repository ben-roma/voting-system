const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const { createElection, openElection, closeElection, voteForCandidate, getElectionResults } = require('../web3');
const verifyAdmin = require('../middleware/adminMiddleware');
const auth = require('../middleware/authMiddleware');
const electionContract = require('../web3'); // Assurez-vous d'importer les fonctions Web3 nécessaires

// Route pour créer une élection
router.post('/create', async (req, res) => {
    const { name } = req.body;

    try {
        // Appel à la blockchain pour créer l'élection
        const receipt = await createElection(name);
        const electionIdOnBlockchain = receipt.events.ElectionCreated.returnValues.electionId;

        // Enregistrement de l'élection dans MongoDB
        const newElection = new Election({ name, blockchainId: electionIdOnBlockchain, isClosed: true });
        await newElection.save();

        res.status(201).json({ message: 'Élection créée avec succès', election: newElection });
    } catch (error) {
        console.error('Erreur lors de la création de l\'élection:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'élection' });
    }
});

// Route pour ajouter un candidat à une élection
router.post('/:id/candidates/add', verifyAdmin, async (req, res) => {
    const { id: electionId } = req.params;
    const { candidateName } = req.body;

    try {
        // Ajout du candidat dans la blockchain
        const receipt = await electionContract.addCandidateToElection(electionId, candidateName);
        const candidateIdOnBlockchain = receipt.events.CandidateAdded.returnValues.candidateId;

        // Association du candidat à l'élection dans MongoDB
        const election = await Election.findById(electionId);
        const candidate = new Candidate({ name: candidateName, blockchainId: candidateIdOnBlockchain });
        await candidate.save();

        election.candidates.push(candidate._id);
        await election.save();

        res.status(201).json({ message: 'Candidat ajouté avec succès', candidateId: candidateIdOnBlockchain });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du candidat:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du candidat' });
    }
});

// Route pour ouvrir une élection
router.patch('/:id/open', async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si l'élection existe
    const election = await Election.findById(id);
    if (!election) return res.status(404).json({ message: 'Élection non trouvée' });

    // Ouvrir l'élection sur la blockchain
    const blockchainResponse = await openElection(election.blockchainId);
    if (blockchainResponse.status) {
      // Mettre à jour l'état de l'élection dans MongoDB
      election.isClosed = false;
      await election.save();
      res.status(200).json({ message: 'Élection ouverte avec succès', election });
    } else {
      res.status(500).json({ message: 'Erreur lors de l\'ouverture de l\'élection sur la blockchain' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'ouverture de l\'élection', error });
  }
});

// Route pour fermer une élection
router.patch('/:id/close', async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si l'élection existe
    const election = await Election.findById(id);
    if (!election) return res.status(404).json({ message: 'Élection non trouvée' });

    // Fermer l'élection sur la blockchain
    const blockchainResponse = await closeElection(election.blockchainId);
    if (blockchainResponse.status) {
      // Mettre à jour l'état de l'élection dans MongoDB
      election.isClosed = true;
      await election.save();
      res.status(200).json({ message: 'Élection fermée avec succès', election });
    } else {
      res.status(500).json({ message: 'Erreur lors de la fermeture de l\'élection sur la blockchain' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la fermeture de l\'élection', error });
  }
});

// GET /api/elections/ongoing
router.get('/ongoing', async (req, res) => {
  try {
    const ongoingElections = await Election.find({ isClosed: false })
      .populate('candidates'); // Remplacez 'candidates' par le nom correct de votre champ s'il est différent

    res.json(ongoingElections);
    console.log("Elections en cours:", ongoingElections); 
  } catch (error) {
    console.error('Erreur lors de la récupération des élections en cours :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des élections en cours' });
  }
});

// Route pour voter pour un candidat
router.post('/:electionId/vote', auth, async (req, res) => {
  const { electionId } = req.params;
  const { candidateId, voterAddress } = req.body;

  if (!voterAddress) {candida
    return res.status(400).json({ message: "Adresse du votant requise" });
  }
  try {
    // Récupérez le candidat depuis MongoDB pour obtenir son `blockchainId`
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidat non trouvé" });

    // Utilisez le `blockchainId` pour l'envoi du vote à la blockchain
    const blockchainResponse = await voteForCandidate(electionId, candidate, voterAddress);

    res.status(200).json({ message: "Vote enregistré avec succès", blockchainResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement du vote", error });
  }
  console.log("Voter address:", voterAddress);

});

// Route pour récupérer les résultats d'une élection
router.get('/:electionId/results', async (req, res) => {
  const { electionId } = req.params;

  try {
    // Récupérer l'élection depuis MongoDB pour obtenir l'ID sur la blockchain
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Élection non trouvée" });
    }

    // Récupérer l'ID de la blockchain pour l'élection
    const electionIdOnBlockchain = election.blockchainId;

    // Récupérer les résultats depuis la blockchain
    const results = await getElectionResults(electionIdOnBlockchain);

    console.log("Résultats récupérés de la blockchain:", results);

    const {
      winnerName,
      winnerVoteCount,
      candidateNames,
      candidateVotes,
      candidatePercentages,
      totalVotes: totalVotesFromBlockchain,
    } = results;

    // Vérifier si totalVotes est correct, sinon le recalculer
    let totalVotes = parseInt(totalVotesFromBlockchain);
    if (isNaN(totalVotes) || totalVotes === 0) {
      // Recalculer totalVotes en sommant les votes des candidats
      totalVotes = candidateVotes.reduce((acc, voteCount) => acc + parseInt(voteCount), 0);
    }

    // Construire les informations sur les candidats en recalculant les pourcentages
    const candidates = candidateNames.map((name, index) => {
      const voteCount = parseInt(candidateVotes[index]);
      const percentage = totalVotes > 0 ? ((voteCount * 100) / totalVotes).toFixed(2) : "0.00";
      return {
        name,
        voteCount: voteCount.toString(),
        percentage: percentage,
      };
    });

    // Mettre à jour winnerVoteCount si nécessaire
    const maxVoteCount = Math.max(...candidateVotes.map(vote => parseInt(vote)));
    const winnerIndices = candidateVotes
      .map((vote, index) => (parseInt(vote) === maxVoteCount ? index : -1))
      .filter(index => index !== -1);

    let finalWinnerName = winnerName;
    if (winnerIndices.length > 1) {
      finalWinnerName = "Égalité entre les candidats";
    } else {
      finalWinnerName = candidateNames[winnerIndices[0]];
    }

    res.status(200).json({
      message: "Résultats de l'élection récupérés avec succès",
      results: {
        winnerName: finalWinnerName,
        winnerVoteCount: maxVoteCount.toString(),
        totalVotes: totalVotes.toString(),
        candidates: candidates,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des résultats:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des résultats", error });
  }
});



// Route pour lister toutes les élections
router.get('/', async (req, res) => {
    try {
        const elections = await Election.find();
        res.status(200).json({ elections });
    } catch (error) {
        console.error('Erreur lors de la récupération des élections:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des élections' });
    }
});

// Route pour lister les élections en cours
router.get('/ongoing', async (req, res) => {
    try {
        const ongoingElections = await Election.find({ isClosed: false });
        res.status(200).json({ elections: ongoingElections });
    } catch (error) {
        console.error('Erreur lors de la récupération des élections en cours:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des élections en cours' });
    }
});

// Route pour afficher une élection spécifique
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const election = await Election.findById(id).populate('candidates');
        if (!election) return res.status(404).json({ message: 'Élection non trouvée' });

        res.status(200).json({ election });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'élection:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'élection' });
    }
});

// Route pour supprimer une élection
router.delete('/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const election = await Election.findByIdAndDelete(id);
        if (!election) return res.status(404).json({ message: 'Élection non trouvée' });

        res.status(200).json({ message: 'Élection supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'élection:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'élection' });
    }
});

module.exports = router;
