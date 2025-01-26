const mongoose = require('mongoose');

const electorSchema = new mongoose.Schema({
  NIP: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  province: { type: String, required: true },
  ville: { type: String, required: true },
  arrondissement: { type: String, required: true },
  bureauVote: { type: String, required: true },
  password: { type: String, required: true },  // Hashed password
  hasVoted: { type: Boolean, default: false },
}, { timestamps: true });

const bcrypt = require('bcrypt');
electorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Si le mot de passe n'est pas modifié, on passe à l'étape suivante
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // Hashage du mot de passe
  next();
});


const Elector = mongoose.model('Elector', electorSchema);
module.exports = Elector;
