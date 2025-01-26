const Web3 = require('web3');
const path = require('path');
const fs = require('fs');

// Configuration de la connexion à Ganache (ou un autre fournisseur)
const web3 = new Web3('http://127.0.0.1:7545');

// Chemin vers l'ABI et l'adresse du contrat déployé (à ajuster selon ton projet)
const contractABIPath = path.resolve(__dirname, '../smart-contracts/build/contracts/ElectionContract.json');
const contractABI = JSON.parse(fs.readFileSync(contractABIPath, 'utf8')).abi;

// Adresse du contrat déployé (à mettre à jour après le déploiement)
const contractAddress = '0x05C5895DC89e44B901B2e26cE7fE4aB588F631cC';

// Initialiser le contrat avec l'ABI et l'adresse
const electionContract = new web3.eth.Contract(contractABI, contractAddress);

// Fonction pour créer une nouvelle élection sur la blockchain
async function createElection(name) {
    try {
        const accounts = await web3.eth.getAccounts();
        return await electionContract.methods.createElection(name).send({ from: accounts[0], gas: 3000000 });
    } catch (error) {
        console.error('Erreur lors de la création de l\'élection :', error);
        throw error;
    }
}

// Fonction pour ouvrir une élection sur la blockchain
async function openElection(electionId) {
    try {
        const accounts = await web3.eth.getAccounts();
        return await electionContract.methods.openVoting(electionId).send({ from: accounts[0], gas: 3000000 });
    } catch (error) {
        console.error('Erreur lors de l\'ouverture de l\'élection :', error);
        throw error;
    }
}

// Fonction pour fermer une élection sur la blockchain
async function closeElection(electionId) {
    try {
        const accounts = await web3.eth.getAccounts();
        return await electionContract.methods.closeVoting(electionId).send({ from: accounts[0], gas: 3000000 });
    } catch (error) {
        console.error('Erreur lors de la fermeture de l\'élection :', error);
        throw error;
    }
}

// Fonction pour ajouter un candidat à une élection
// async function addCandidateToElection(electionId, candidateName) {
//     try {
//         const accounts = await web3.eth.getAccounts();
//         const receipt = await electionContract.methods.addCandidate(candidateName).send({ from: accounts[0], gas: 3000000 });
//         const candidateId = receipt.events.CandidateAdded.returnValues.id;
//         return await electionContract.methods.addCandidateToElection(electionId, candidateId).send({ from: accounts[0], gas: 3000000 });
//     } catch (error) {
//         console.error('Erreur lors de l\'ajout du candidat à l\'élection :', error);
//         throw error;
//     }
// }

// Fonction pour ajouter un candidat à une élection
async function addCandidateToElection(electionId, candidateName) {
  const accounts = await web3.eth.getAccounts();
  console.log("Accounts:", accounts);
  console.log("Election ID:", electionId);
  console.log("Candidate Name:", candidateName);

  try {
      // Ajouter un candidat
      const addCandidateReceipt = await electionContract.methods.addCandidate(candidateName).send({ from: accounts[0], gas: 3000000 });
      console.log("Add Candidate Receipt:", addCandidateReceipt);

      // Extraire candidateId à partir de l'événement
      const candidateId = addCandidateReceipt.events.CandidateAdded?.returnValues?.id;
      if (!candidateId) {
          console.error("Structure de returnValues :", addCandidateReceipt.events.CandidateAdded?.returnValues);
          throw new Error("Erreur lors de la récupération de candidateId");
      }
      console.log("Candidate ID:", candidateId);

      // Associer le candidat à l'élection
      const associateReceipt = await electionContract.methods.addCandidateToElection(electionId, candidateId).send({ from: accounts[0], gas: 3000000 });
      console.log("Associate Candidate Receipt:", associateReceipt);

      return associateReceipt;
  } catch (error) {
      console.error("Erreur lors de l'ajout du candidat à l'élection :", error);
      throw error;
  }
}

const { BigNumber } = require("ethers");

// Dans la fonction voteForCandidate
async function voteForCandidate(electionId, candidate, voterAddress) {
  const candidateBlockchainId = web3.utils.toBN(candidate.blockchainId); // Conversion en BigNumber si nécessaire
  const electionBlockchainId = web3.utils.toBN(electionId); // Conversion de l'ID de l'élection en BigNumber si nécessaire

  if (!web3.utils.isAddress(voterAddress)) {
    console.error("Adresse du votant invalide");
    return;
  }

  console.log("Voter Address:", voterAddress);
  console.log("Election Blockchain ID:", electionBlockchainId.toString());
  console.log("Candidate Blockchain ID:", candidateBlockchainId.toString());

  return electionContract.methods.vote(electionBlockchainId, candidateBlockchainId).send({
      from: voterAddress,
      gas: 3000000
  });
}

function listenToTotalVotesEvent(electionId, callback) {
  const event = electionContract.events.LogTotalVotes({
    filter: { electionId: web3.utils.toBN(electionId) },
    fromBlock: 0 // Vous pouvez spécifier le bloc de départ approprié
  })
  .on('data', event => {
    const totalVotes = event.returnValues.totalVotes;
    console.log(`Total votes for election ${electionId}: ${totalVotes}`);
    if (callback) {
      callback(totalVotes);
    }
  })
  .on('error', console.error);
}

async function getPastTotalVotes(electionId) {
  const events = await electionContract.getPastEvents('LogTotalVotes', {
    filter: { electionId: web3.utils.toBN(electionId) },
    fromBlock: 0, // Bloc de départ approprié
    toBlock: 'latest'
  });

  if (events.length > 0) {
    // Le dernier événement aura le totalVotes le plus récent
    const latestEvent = events[events.length - 1];
    const totalVotes = latestEvent.returnValues.totalVotes;
    console.log(`Nombre total de votes récupéré : ${totalVotes}`);
    return totalVotes;
  } else {
    console.log('Aucun vote trouvé pour cette élection.');
    return 0;
  }
}


// Fonction pour obtenir les résultats de l'élection depuis la blockchain
async function getElectionResults(electionId) {
  const electionBlockchainId = web3.utils.toBN(electionId);
  const accounts = await web3.eth.getAccounts();

  if (!accounts || accounts.length === 0) {
    throw new Error("Aucun compte Ethereum disponible.");
  }

  const voterAddr = accounts[0];

  try {
    const results = await electionContract.methods.getElectionResults(electionBlockchainId).call({
      from: voterAddr,
    });

    // Les résultats renvoyés sont : winnerName, winnerVoteCount, candidateNames, candidateVotes, candidatePercentages
    console.log("Résultats récupérés de la blockchain:", {
      winnerName: results[0],
      winnerVoteCount: results[1],
      candidateNames: results[2],
      candidateVotes: results[3],
      candidatePercentages: results[4],
      totalVotes: results[5],  // Assure-toi de loguer `totalVotes` également.
    });

    return {
      winnerName: results[0],
      winnerVoteCount: results[1],
      candidateNames: results[2],
      candidateVotes: results[3],
      candidatePercentages: results[4],
      totalVotes: results[5], // Assure-toi de renvoyer aussi `totalVotes`
    };
  } catch (error) {
    console.error("Erreur lors de l'appel à la blockchain:", error);
    throw error;
  }
}



// Export des fonctions pour les utiliser dans les routes API
module.exports = {
    createElection,
    openElection,
    closeElection,
    voteForCandidate,
    addCandidateToElection,
    getElectionResults,
    listenToTotalVotesEvent,
    getPastTotalVotes

};
