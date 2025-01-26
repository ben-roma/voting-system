const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const email = decoded.email;

    // Vérifier si l'email correspond à un administrateur
    if (email === process.env.ADMIN_EMAIL_1 || email === process.env.ADMIN_EMAIL_2) {
      req.user = decoded;
      next(); // L'utilisateur est un administrateur, continuer
    } else {
      res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas administrateur' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = verifyAdmin;
