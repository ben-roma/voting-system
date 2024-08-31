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