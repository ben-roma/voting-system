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
    adminMenu(); // Afficher le menu administrateur après la connexion
  } catch (error) {
    console.error("Erreur lors de la vérification de l'OTP:", error.message);
    mainMenu(); // Retour au menu principal en cas d'erreur
  }
};

const createElection = async () => {
  if (!token) {
    console.log("Vous devez vous connecter pour créer une élection.");
    return;
  }

  const { name } = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Entrez le nom de l\'élection:' }
  ]);

  try {
    const response = await axios.post(
      'http://localhost:5000/api/elections/create', 
      { name }, 
      { headers: { Authorization: `Bearer ${token}` } } 
    );

    console.log(response.data.message); 
    console.log("ID de l'élection:", response.data.election._id);
    console.log("Nom de l'élection:", response.data.election.name);
    console.log("Blockchain ID:", response.data.election.blockchainId); 
  } catch (error) {
    console.error("Erreur lors de la création de l'élection:", error.message);
  }
  adminMenu(); // Retour au menu administrateur
};

const openElection = async () => {
    if (!token) {
      console.log("Vous devez vous connecter pour ouvrir une élection.");
      return;
    }
  
    const { electionId } = await inquirer.prompt([
      { type: 'input', name: 'electionId', message: 'Entrez l\'ID de l\'élection à ouvrir:' }
    ]);
  
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/elections/${electionId}/open`, 
        {}, // Pas de données à envoyer dans le corps de la requête
        { headers: { Authorization: `Bearer ${token}` } } 
      );
  
      console.log(response.data.message); 
      console.log("ID de l'élection:", response.data.election._id);
      console.log("Nom de l'élection:", response.data.election.name);
      console.log("Statut:", response.data.election.isClosed ? "Fermée" : "Ouverte");
    } catch (error) {
      console.error("Erreur lors de l'ouverture de l'élection:", error.message);
    }
    adminMenu();
};
  
const closeElection = async () => {
    if (!token) {
      console.log("Vous devez vous connecter pour fermer une élection.");
      return;
    }
  
    const { electionId } = await inquirer.prompt([
      { type: 'input', name: 'electionId', message: 'Entrez l\'ID de l\'élection à fermer:' }
    ]);
  
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/elections/${electionId}/close`, 
        {}, // Pas de données à envoyer dans le corps de la requête
        { headers: { Authorization: `Bearer ${token}` } } 
      );
  
      console.log(response.data.message); 
      console.log("ID de l'élection:", response.data.election._id);
      console.log("Nom de l'élection:", response.data.election.name);
      console.log("Statut:", response.data.election.isClosed ? "Fermée" : "Ouverte");
    } catch (error) {
      console.error("Erreur lors de la fermeture de l'élection:", error.message);
    }
    adminMenu();
  };

  const addCandidate = async () => {
    if (!token) {
      console.log("Vous devez vous connecter pour ajouter un candidat.");
      return;
    }
  
    const { electionId, name, party, description } = await inquirer.prompt([
      { type: 'input', name: 'electionId', message: 'Entrez l\'ID de l\'élection:' },
      { type: 'input', name: 'name', message: 'Entrez le nom du candidat:' },
      { type: 'input', name: 'party', message: 'Entrez le parti du candidat:' },
      { type: 'input', name: 'description', message: 'Entrez la description du candidat:' }
    ]);
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/candidates/${electionId}/add`, 
        { name, party, description }, 
        { headers: { Authorization: `Bearer ${token}` } } 
      );
  
      console.log(response.data.message); 
      console.log("ID du candidat:", response.data.candidate._id);
      console.log("Nom du candidat:", response.data.candidate.name);
      console.log("Parti:", response.data.candidate.party);
      console.log("Blockchain ID:", response.data.candidate.blockchainId); 
    } catch (error) {
      console.error("Erreur lors de l'ajout du candidat:", error.message);
    }
    adminMenu();
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

const adminMenu = async () => {
  const { option } = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: '--- Menu Administrateur ---',
      choices: [
        { name: '1. Créer une élection', value: 'create-election' },
        { name: '2. Ouvrir une élection', value: 'open-election' },
        { name: '3. Fermer une election', value: 'close-election' }, // Nouvelle option
        { name: '4. Ajouter un candidat', value: 'add-candidate' }, // Nouvelle option
        { name: '5. Déconnexion', value: 'logout' },
      ],
    },
  ]);

  switch (option) {
    case 'create-election':
      createElection();
      break;
    case 'open-election': // Nouveau cas
      openElection();
      break;
    case 'close-election': // Nouveau cas
      closeElection();
      break;
    case 'add-candidate': // Nouveau cas
      addCandidate();
      break;
    case 'logout':
      token = null; // Réinitialiser le token
      console.log("Vous avez été déconnecté.");
      mainMenu(); // Retour au menu principal
      break;
  }
};

mainMenu();