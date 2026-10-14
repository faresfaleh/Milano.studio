// DNS public (utile si votre box ne résout pas les adresses mongodb+srv://)
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { securityHeaders, rateLimit } = require('./utils/security');

/* ---------- Vérification des mots de passe au démarrage ---------- */
const WEAK = ['changez-cette-cle-secrete', 'cle-du-monteur-differente', 'monteur-2026', 'admin', 'password', '123456'];
function checkKey(name, required) {
  const v = process.env[name];
  if (!v) {
    if (required) { console.error(`✖ ${name} manquant dans backend/.env`); process.exit(1); }
    return;
  }
  if (v.length < 12 || WEAK.includes(v.toLowerCase())) {
    console.error(`✖ ${name} est trop faible. Choisissez un mot de passe d'au moins 12 caractères (lettres, chiffres, symboles), différent de l'exemple.`);
    process.exit(1);
  }
}
checkKey('ADMIN_KEY', true);
checkKey('MONTEUR_KEY', false);
if (process.env.MONTEUR_KEY && process.env.MONTEUR_KEY === process.env.ADMIN_KEY) {
  console.error('✖ MONTEUR_KEY doit être différent de ADMIN_KEY.');
  process.exit(1);
}

const app = express();
app.disable('x-powered-by');
// Derrière un hébergeur (Render, etc.) : TRUST_PROXY=1 pour lire la vraie adresse IP des visiteurs
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);

app.use(securityHeaders);

/* ---------- CORS : seuls les sites autorisés peuvent appeler l'API depuis un navigateur ---------- */
// ALLOWED_ORIGINS=https://monsite.com,https://www.monsite.com  (en local : http://localhost:4200 est autorisé)
const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
if (process.env.NODE_ENV !== 'production') allowed.push('http://localhost:4200', 'http://127.0.0.1:4200');
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)), // sans « origin » = appel serveur / même domaine
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-admin-key'],
    maxAge: 600,
  })
);

app.use(express.json({ limit: '20kb' })); // les réservations sont petites : on refuse les gros envois
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 })); // limite générale par IP

app.use('/api/reservations', require('./routes/reservations'));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', (_req, res) => res.status(404).json({ message: 'Introuvable' }));

// Gestionnaire d'erreurs : jamais de détails techniques envoyés au visiteur
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Requête invalide' });
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Requête trop volumineuse' });
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
});

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/milanostudio')
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(PORT, () => console.log(`API Milano Studio sur http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Erreur MongoDB :', err.message);
    process.exit(1);
  });
