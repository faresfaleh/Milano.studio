const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ['soiree', 'shooting'], required: true },
    // Soirée
    eventType: { type: String, enum: ['mariage', 'soiree_homme', 'soiree_femme'] },
    // Mariage : prénoms du marié (homme) et de la mariée (femme), utilisés pour « Mon flash »
    mariePrenomHomme: { type: String, trim: true },
    mariePrenomFemme: { type: String, trim: true },
    pack: { type: String, enum: ['normale', 'medium', 'pro'] }, // anciennes réservations
    options: {
      cameras: { type: Number, enum: [1, 2, 3] },
      drone: { type: Number, enum: [0, 1] },
      girafe: { type: Number, enum: [0, 1] },
      regie: { type: Number, enum: [0, 1] },
    },
    price: { type: Number },
    // Shooting
    shootingType: { type: String, enum: ['individuel', 'mariage'] },
    shootingOption: { type: String, enum: ['photo', 'photo_video', 'preparation', 'preparation_photo'] },
    // Coordonnées
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    cin: { type: String, required: true, match: /^\d{8}$/ },
    telephone: { type: String, required: true, match: /^\d{8}$/ },
    lieu: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    day: { type: String, required: true, index: true }, // "YYYY-MM-DD" (sert au calcul de disponibilité)
    message: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['en_attente', 'confirmee', 'annulee'], default: 'en_attente' },
    // Flash de soirée (montage) : mis à jour par le monteur
    flashReady: { type: Boolean, default: false },
    flashReadyAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
