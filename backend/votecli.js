const { Command } = require('commander');
const axios = require('axios');
const inquirer = require('inquirer');
const program = new Command();

let token = null; // Variable pour stocker le token

const login = async () => {
  const { NIP, password } = await inquirer.prompt([
    { type: 'input', name: 'NIP', message: 'Entrez votre NIP:' },
    { type: 'password', name: 'password', message: 'Entrez votre mot de passe:' , mask: '*' } 
  ]);

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', { NIP, password });
    console.log(response.data.message); 

    // Appeler verify après la connexion réussie
    await verify(); 
  } catch (error) {
    console.error("Erreur lors de la connexion:", error.message);
    mainMenu(); // Retour au menu principal en cas d'erreur
  }
};

const verify = async () => {
  const { email, otp } = await inquirer.prompt([
    { type: 'input', name: 'email', message: 'Entrez votre email:' },
    { type: 'input', name: 'otp', message: 'Entrez l\'OTP:' }
  ]);

  try {
    const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
    console.log(response.data.message); 
    token = response.data.token; // Stocker le token
    console.log("Token:", token);
    voterMenu(); // Afficher le menu de vote après la connexion
  } catch (error) {
    console.error("Erreur lors de la vérification de l'OTP:", error.message);
    mainMenu(); // Retour au menu principal en cas d'erreur
  }
};

const viewOngoingElections = async () => {
  if (!token) {
    console.log("Vous devez vous connecter pour voir les élections en cours.");
    return;
  }

  try {
    const response = await axios.get(
      'http://localhost:5000/api/elections/ongoing',
      { headers: { Authorization: `Bearer ${token}` } } 
    );

    if (response.data.length === 0) {
      console.log("Aucune élection en cours.");
      return;
    }

    console.log("Élections en cours:");
    response.data.forEach((election) => {
      console.log(`- ${election.name} (ID: ${election._id})`);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des élections en cours:", error.message);
  }
  voterMenu();
};

const vote = async () => {
    if (!token) {
      console.log("Vous devez vous connecter pour voter.");
      return;
    }
  
    const { electionId, candidateId, voterAddress } = await inquirer.prompt([
      { type: 'input', name: 'electionId', message: 'Entrez l\'ID de l\'élection:' },
      { type: 'input', name: 'candidateId', message: 'Entrez l\'ID du candidat:' },
      { type: 'input', name: 'voterAddress', message: 'Entrez votre adresse de votant:' }
    ]);
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/elections/${electionId}/vote`, 
        { candidateId, voterAddress }, 
        { headers: { Authorization: `Bearer ${token}` } } 
      );
  
      console.log(response.data.message); 
    } catch (error) {
      console.error("Erreur lors du vote:", error.message);
    }
    voterMenu();
  };

  const viewElectionResults = async () => {
    if (!token) {
      console.log("Vous devez vous connecter pour voir les résultats d'une élection.");
      return;
    }
  
    const { electionId } = await inquirer.prompt([
      { type: 'input', name: 'electionId', message: 'Entrez l\'ID de l\'élection:' }
    ]);
  
    try {
      const response = await axios.get(
        `http://localhost:5000/api/elections/${electionId}/results`,
        { headers: { Authorization: `Bearer ${token}` } } 
      );
  
      console.log(response.data.message);
  
      const results = response.data.results;
      console.log("Gagnant:", results.winnerName);
      console.log("Nombre de votes du gagnant:", results.winnerVoteCount);
      console.log("Nombre total de votes:", results.totalVotes);
  
      console.log("\nRésultats par candidat:");
      results.candidates.forEach((candidate) => {
        console.log(`- ${candidate.name}: ${candidate.voteCount} votes (${candidate.percentage}%)`);
      });
  
    } catch (error) {
      console.error("Erreur lors de la récupération des résultats de l'élection:", error.message);
    }
    voterMenu();
  };

const voterMenu = async () => {
  const { option } = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: '--- Menu de Vote ---',
      choices: [
        { name: '1. Voir les élections en cours', value: 'view-ongoing-elections' },
        { name: '2. Voter', value: 'vote' },
        { name: '3. Voir les résultats', value: 'view-election-results' },
        { name: '4. Déconnexion', value: 'logout' },
      ],
    },
  ]);

  switch (option) {
    case 'view-ongoing-elections':
      viewOngoingElections();
      break;
    case 'vote':
      vote();
      break;
    case 'view-election-results': // Nouveau cas
      viewElectionResults();
      break;
    case 'logout':
      token = null; 
      console.log("Vous avez été déconnecté.");
      mainMenu(); 
      break;
  }
};

const mainMenu = async () => {
  const { option } = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: '--- Menu Principal ---',
      choices: [
        { name: '1. Connexion', value: 'login' },
        { name: '2. Quitter', value: 'exit' },
      ],
    },
  ]);

  switch (option) {
    case 'login':
      login(); 
      break;
    case 'exit':
      console.log('Au revoir !');
      process.exit(0); 
  }
};

mainMenu();