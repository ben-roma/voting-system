const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Vérifier le token
    req.user = decoded; // Ajouter les infos de l'utilisateur au `req`
    next(); // Passer au prochain middleware ou route
  } catch (err) {
    res.status(401).json({ message: 'Token invalide ou expiré. Veuillez vous reconnecter.' });
  }
};

module.exports = verifyToken;
