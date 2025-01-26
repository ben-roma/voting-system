const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  blockchainId: {
    type: Number,  // ID de l'élection sur la blockchain
    required: true  // Assurez-vous que ce champ est rempli lors de la création de l'élection
  },
  candidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  }],
  isClosed: {
    type: Boolean,
    default: true
  },
  resultsAvailable: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Election = mongoose.model('Election', electionSchema);

module.exports = Election;
