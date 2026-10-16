// DNS public (utile en local si votre box ne résout pas mongodb+srv://)
if (!process.env.VERCEL) {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB réutilisée entre les appels (nécessaire en serverless)
let connecting = null;
function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connecting) {
    connecting = mongoose
      .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/milanostudio')
      .then(() => console.log('MongoDB connecté'))
      .catch((err) => {
        connecting = null;
        throw err;
      });
  }
  return connecting;
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api', async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Erreur MongoDB :', err.message);
    res.status(503).json({ message: 'Base de données indisponible (vérifiez MONGO_URI et Network Access dans Atlas)' });
  }
});

app.use('/api/reservations', require('./routes/reservations'));

// Toute erreur non gérée renvoie du JSON avec un "message" lisible par le site
app.use((err, _req, res, _next) => {
  console.error('Erreur serveur :', err);
  res.status(500).json({ message: 'Erreur serveur : ' + (err.message || 'inconnue') });
});

// Local : on écoute sur un port. Sur Vercel : on exporte juste l'app.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`API Milano Studio sur http://localhost:${PORT}`));
}

module.exports = app;
