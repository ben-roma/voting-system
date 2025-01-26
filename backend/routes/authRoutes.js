const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Elector = require('../models/elector');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Fonction pour générer un OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Générer un OTP de 6 chiffres
}

// Stockage temporaire des OTPs en mémoire (en production, utiliser Redis ou similaire)
let otpStore = {};

// Route pour l'authentification et l'envoi de l'OTP
router.post('/login', async (req, res) => {
  const { NIP, password } = req.body;

  try {
    // Trouver l'électeur par son NIP
    const user = await Elector.findOne({ NIP });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    // Générer et stocker l'OTP
    const otpCode = generateOTP();
    otpStore[user.email] = otpCode;

    // Configurer le transporteur d'e-mail
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Options de l'e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Votre code OTP',
      text: `Votre code OTP est : ${otpCode}`
    };

    // Envoyer l'e-mail avec l'OTP
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'OTP' });
      }
      res.status(200).json({ message: 'OTP envoyé à votre adresse e-mail' });
    });

  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour vérifier l'OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Vérifier si l'OTP est correct
  if (otpStore[email] && otpStore[email].toString() === otp.toString()) {
    // Supprimer l'OTP après validation pour éviter toute réutilisation
    delete otpStore[email];

    // Générer un token JWT
    const token = jwt.sign(
      { email },  // Payload
      process.env.JWT_SECRET,  // Clé secrète
      { expiresIn: '1h' }  // Durée de validité
    );

    // Retourner le token JWT
    return res.status(200).json({ message: 'Authentification réussie', token });
  } else {
    return res.status(400).json({ message: 'OTP incorrect ou expiré' });
  }
});

module.exports = router;
