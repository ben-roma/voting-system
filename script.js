// Remplacez les placeholders par les vraies informations
document.getElementById('election-date').textContent = "1er Janvier 2025";
document.getElementById('eligibility').textContent = "Être citoyen gabonais âgé de 18 ans ou plus.";
document.getElementById('registration').textContent = "Rendez-vous dans un centre d'inscription avec votre carte d'identité nationale.";
document.getElementById('guarantees').textContent = "Nous utilisons la blockchain et la biométrie pour garantir la sécurité et la confidentialité de votre vote.";
document.getElementById('contact-info').textContent = "Contactez-nous au 1234 ou par email à contact@votegabon.ga";
document.getElementById('legal-framework').href = "https://www.exemple-legislation.ga"; 
document.getElementById('faq').href = "https://www.votegabon.ga/faq";

// Fonction pour ouvrir le modal
function openModal() {
    document.getElementById("otp-modal").style.display = "block";
}

// Fonction pour fermer le modal
function closeModal() {
    document.getElementById("otp-modal").style.display = "none";
}

// Gestionnaire d'événement pour le formulaire de connexion
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Ici, vous ajouteriez la logique pour envoyer le NIP et le mot de passe au backend,
    // puis ouvrir le modal si la première étape d'authentification est réussie.

    // Pour l'instant, on ouvre simplement le modal pour la démo
    openModal();
});

// Gestionnaire d'événement pour le formulaire OTP (à compléter)
document.getElementById("otp-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Ici, vous ajouteriez la logique pour vérifier le code OTP avec le backend
});

// Gestionnaire d'événement pour renvoyer le code OTP (à compléter)
document.getElementById("resend-otp").addEventListener("click", function() {
    // Ici, vous ajouteriez la logique pour demander un nouveau code OTP au backend
});
// Fonction pour ouvrir le modal de confirmation
function openModal() {
    // ... (similaire à la page de connexion)
}

// Fonction pour fermer le modal
function closeModal() {
    // ... (similaire à la page de connexion)
}

// Gestionnaire d'événement pour le formulaire de vote
document.getElementById("voting-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Ici, vous ajouteriez la logique pour :
    // - Récupérer le candidat sélectionné
    // - Ouvrir le modal de confirmation
    // - Envoyer le vote au backend après confirmation
    // - Afficher le message de succès et le lien pour le reçu (si applicable)
});

// ... (autres fonctions pour gérer le modal, le reçu, etc.)

// ... (fonctions openModal et closeModal de l'exemple précédent)

document.getElementById("voting-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const selectedCandidate = document.querySelector('input[name="vote"]:checked').value;
    document.getElementById("selected-candidate").textContent = selectedCandidate; 
    openModal(); 
});

// ... (autres fonctions pour gérer le modal, le reçu, l'envoi du vote au backend, etc.)

// Remplacez les placeholders par les vraies informations (reçues du backend après le vote)
document.getElementById('voter-nip').textContent = "[NIP de l'électeur]";
document.getElementById('vote-timestamp').textContent = "[Date et heure du vote]";
document.getElementById('selected-candidate').textContent = "[Nom du candidat sélectionné]";
document.getElementById('verification-code').textContent = "[Code de vérification unique]";

// Gestionnaire d'événement pour le bouton "Imprimer le reçu"
document.getElementById("print-receipt").addEventListener("click", function() {
    window.print(); 
});

// Fonction pour remplir le tableau des résultats (à compléter avec les données du backend)
function displayResults(electionId) {
    // ... Logique pour récupérer les résultats de l'élection sélectionnée depuis le backend ou la blockchain
    // ... Mettre à jour le contenu du tableau `results-table` avec les données récupérées
}

// Gestionnaire d'événement pour le menu déroulant de sélection de l'élection
document.getElementById("election-dropdown").addEventListener("change", function() {
    const selectedElection = this.value;
    displayResults(selectedElection);
});

// ... (autres fonctions pour gérer les filtres de recherche, la visualisation des résultats, le téléchargement et le partage)

// Fonctions pour remplir dynamiquement les listes, les graphiques et le tableau des résultats (à compléter)
function loadElections() {
    // ...
}

function searchVoters() {
    // ...
}

function displayParticipationChart() {
    // ...
}

function displayVotesByCandidateChart() {
    // ...
}

function displayResults() {
    // ...
}

// Appels des fonctions au chargement de la page
loadElections();
displayParticipationChart();
displayVotesByCandidateChart();
displayResults();

// ... (autres gestionnaires d'événements pour les boutons et les filtres de recherche)