const express = require('express');
const Reservation = require('../models/Reservation');
const { sendReservationEmail } = require('../utils/mailer');
const { sendConfirmationSms, sendReceivedSms } = require('../utils/sms');

const router = express.Router();
// Prix d'une soirée : base (1 caméra vidéo + 1 appareil photo) + options
const SOIREE = { base: 400, camera: 150, drone: 350, girafe: 500, regie: 1400 };
const EVENT_TYPES = ['mariage', 'soiree_homme', 'soiree_femme'];
const SHOOTING_TYPES = ['individuel', 'mariage'];
// Prix des shootings (identiques pour le shooting individuel et le shooting de mariage)
const SHOOTING_PRICES = { photo: 150, photo_video: 300, preparation: 150, preparation_photo: 300 };
const STATUSES = ['en_attente', 'confirmee', 'annulee'];

// Nombre max de soirées par jour (modifiable dans .env)
const maxPerDay = () => parseInt(process.env.MAX_SOIREES_PER_DAY, 10) || 3;

const todayTunis = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Tunis' });
const isValidDay = (d) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d || '')) return false;
  const dt = new Date(d + 'T00:00:00Z');
  return !isNaN(dt) && dt.toISOString().slice(0, 10) === d;
};

// Une soirée annulée ne compte pas dans la limite
const countSoirees = (day) =>
  Reservation.countDocuments({ category: 'soiree', day, status: { $ne: 'annulee' } });

// Nettoie les clés : retire espaces, retours à la ligne et guillemets accidentels
const clean = (v) => String(v || '').trim().replace(/^["']|["']$/g, '').trim();

function adminOnly(req, res, next) {
  const adminKey = clean(process.env.ADMIN_KEY);
  if (!adminKey || clean(req.header('x-admin-key')) !== adminKey) {
    return res.status(401).json({ message: 'Clé admin incorrecte' });
  }
  next();
}

// Accès « monteur » : la clé admin OU la clé monteur (MONTEUR_KEY) donnent accès au suivi des flashs
function roleOf(req) {
  const k = clean(req.header('x-admin-key'));
  if (!k) return null;
  if (clean(process.env.ADMIN_KEY) && k === clean(process.env.ADMIN_KEY)) return 'admin';
  if (clean(process.env.MONTEUR_KEY) && k === clean(process.env.MONTEUR_KEY)) return 'monteur';
  return null;
}
function editorOrAdmin(req, res, next) {
  if (!roleOf(req)) return res.status(401).json({ message: 'Clé incorrecte' });
  next();
}

// Type choisi par le client sur la page « Mon flash » -> type de soirée enregistré
const FLASH_TYPES = { homme: 'soiree_homme', femme: 'soiree_femme', mariage: 'mariage' };
// Comparaison de noms : sans accents, sans majuscules, espaces simplifiés
const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

/* ---------- PUBLIC ---------- */

// Mon flash : le client indique le type (homme / femme / mariage) et la date de la soirée
// Réponse : { found, ready } ou { found:true, multiple:true } si plusieurs soirées le même jour (il faut alors son nom)
router.get('/flash/check', async (req, res) => {
  try {
    const eventType = FLASH_TYPES[req.query.type];
    const day = req.query.day;
    if (!eventType) return res.status(400).json({ message: 'Type invalide' });
    if (!isValidDay(day)) return res.status(400).json({ message: 'Date invalide' });

    let rows = await Reservation.find({
      category: 'soiree', eventType, day, status: { $ne: 'annulee' },
    }).select('nom prenom mariePrenomHomme mariePrenomFemme flashReady');
    if (!rows.length) return res.json({ found: false });

    // Mariage : le client donne le prénom de l'homme et de la femme (+ la date)
    if (eventType === 'mariage') {
      const h = norm(req.query.prenomHomme), f = norm(req.query.prenomFemme);
      if (!h || !f) return res.status(400).json({ message: 'Indiquez le prénom de l’homme et de la femme' });
      rows = rows.filter((r) =>
        r.mariePrenomHomme && r.mariePrenomFemme
          ? norm(r.mariePrenomHomme) === h && norm(r.mariePrenomFemme) === f
          : [h, f].includes(norm(r.prenom)) // anciennes réservations : prénom du client
      );
      if (!rows.length) return res.json({ found: false });
      return res.json({ found: true, ready: rows.every((r) => r.flashReady) });
    }

    // Homme / femme : le client donne son nom (obligatoire sur le site) ; sans nom et avec plusieurs soirées, on le demande
    const nom = norm(req.query.nom);
    if (rows.length > 1 && !nom) return res.json({ found: true, multiple: true });
    if (nom) {
      rows = rows.filter((r) => norm(r.nom) === nom || norm(r.prenom) === nom || norm(r.nom + ' ' + r.prenom) === nom || norm(r.prenom + ' ' + r.nom) === nom);
      if (!rows.length) return res.json({ found: false });
    }
    // Plusieurs soirées avec le même nom ce jour-là : « prête » seulement si toutes le sont
    res.json({ found: true, ready: rows.every((r) => r.flashReady) });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Disponibilité : ?day=2026-10-20  ou  ?month=2026-10
router.get('/availability', async (req, res) => {
  try {
    const max = maxPerDay();
    if (req.query.day) {
      if (!isValidDay(req.query.day)) return res.status(400).json({ message: 'Date invalide' });
      const count = await countSoirees(req.query.day);
      return res.json({ day: req.query.day, count, max, available: count < max });
    }
    if (/^\d{4}-\d{2}$/.test(req.query.month || '')) {
      const rows = await Reservation.aggregate([
        { $match: { category: 'soiree', status: { $ne: 'annulee' }, day: { $regex: '^' + req.query.month } } },
        { $group: { _id: '$day', count: { $sum: 1 } } },
      ]);
      return res.json({ max, fullDays: rows.filter((r) => r.count >= max).map((r) => r._id).sort() });
    }
    res.status(400).json({ message: 'Paramètre day ou month requis' });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Réservations du panier (par identifiants) – sans CIN ni téléphone
router.get('/mine', async (req, res) => {
  try {
    const ids = String(req.query.ids || '')
      .split(',')
      .map((x) => x.trim())
      .filter((x) => /^[a-f\d]{24}$/i.test(x))
      .slice(0, 20);
    if (!ids.length) return res.json([]);
    const rows = await Reservation.find({ _id: { $in: ids } }).select(
      'category eventType pack options price shootingType shootingOption lieu day status nom prenom createdAt'
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer une réservation
router.post('/', async (req, res) => {
  try {
    const b = req.body || {};
    const errors = [];

    if (!['soiree', 'shooting'].includes(b.category)) errors.push('Catégorie invalide');
    if (!b.nom?.trim()) errors.push('Nom obligatoire');
    if (!b.prenom?.trim()) errors.push('Prénom obligatoire');
    if (!/^\d{8}$/.test(b.cin || '')) errors.push('CIN invalide (8 chiffres)');
    if (!/^\d{8}$/.test(b.telephone || '')) errors.push('Téléphone invalide (8 chiffres)');
    if (!b.lieu?.trim()) errors.push('Lieu obligatoire');
    if (!isValidDay(b.date) || b.date < todayTunis()) errors.push('Date invalide');

    const data = {
      category: b.category,
      nom: b.nom, prenom: b.prenom, cin: b.cin, telephone: b.telephone,
      lieu: b.lieu, day: b.date, date: new Date(b.date + 'T00:00:00Z'), message: b.message || '',
    };

    if (b.category === 'soiree') {
      if (!EVENT_TYPES.includes(b.eventType)) errors.push('Type de soirée invalide');
      const o = b.options || {};
      const cameras = Number(o.cameras), drone = Number(o.drone), girafe = Number(o.girafe), regie = Number(o.regie);
      if (![1, 2, 3].includes(cameras)) errors.push('Nombre de caméras invalide');
      if (![0, 1].includes(drone) || ![0, 1].includes(girafe) || ![0, 1].includes(regie)) errors.push('Options invalides');
      data.eventType = b.eventType;
      if (b.eventType === 'mariage') {
        if (!b.mariePrenomHomme?.trim()) errors.push('Prénom du marié obligatoire');
        if (!b.mariePrenomFemme?.trim()) errors.push('Prénom de la mariée obligatoire');
        data.mariePrenomHomme = b.mariePrenomHomme;
        data.mariePrenomFemme = b.mariePrenomFemme;
      }
      data.options = { cameras, drone, girafe, regie };
      // Le prix est toujours recalculé côté serveur
      data.price = SOIREE.base + (cameras - 1) * SOIREE.camera + drone * SOIREE.drone + girafe * SOIREE.girafe + regie * SOIREE.regie;
    } else if (b.category === 'shooting') {
      if (!SHOOTING_TYPES.includes(b.shootingType)) errors.push('Type de shooting invalide');
      if (!SHOOTING_PRICES[b.shootingOption]) errors.push('Option shooting invalide');
      data.shootingType = b.shootingType;
      data.shootingOption = b.shootingOption;
      data.price = SHOOTING_PRICES[b.shootingOption];
    }

    if (errors.length) return res.status(400).json({ message: errors.join(' • ') });

    // Limite de soirées par jour
    if (data.category === 'soiree') {
      const count = await countSoirees(data.day);
      if (count >= maxPerDay()) {
        return res.status(409).json({ message: 'Cette date est complète. Veuillez choisir une autre date.' });
      }
    }

    const created = await Reservation.create(data);
    // IMPORTANT sur Vercel (serverless) : la fonction est gelée dès que la réponse part.
    // Il faut donc ATTENDRE l'envoi de l'email avant de répondre, sinon il n'est jamais envoyé.
    // Ces fonctions ne lèvent jamais d'erreur : la réservation n'est jamais bloquée.
    await Promise.allSettled([
      sendReservationEmail(created), // email au studio (faresfaleh47@gmail.com)
      sendReceivedSms(created),      // SMS au client : « réservation bien reçue »
    ]);
    res.status(201).json({ message: 'Réservation enregistrée', id: created._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/* ---------- MONTEUR (et admin) : suivi des flashs ---------- */

// Qui suis-je ? -> 'admin' ou 'monteur'
router.get('/flash/whoami', editorOrAdmin, (req, res) => res.json({ role: roleOf(req) }));

// Soirées (non annulées) avec l'état du flash
router.get('/flash/list', editorOrAdmin, async (_req, res) => {
  try {
    const items = await Reservation.find({ category: 'soiree', status: { $ne: 'annulee' } })
      .select('eventType nom prenom mariePrenomHomme mariePrenomFemme lieu day status flashReady flashReadyAt')
      .sort({ day: -1, createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Marquer le flash prêt / pas prêt
router.patch('/:id/flash', editorOrAdmin, async (req, res) => {
  try {
    if (typeof req.body?.ready !== 'boolean') return res.status(400).json({ message: 'Valeur invalide' });
    const r = await Reservation.findOne({ _id: req.params.id, category: 'soiree' });
    if (!r) return res.status(404).json({ message: 'Introuvable' });
    r.flashReady = req.body.ready;
    r.flashReadyAt = req.body.ready ? new Date() : undefined;
    await r.save();
    res.json({ _id: r._id, flashReady: r.flashReady, flashReadyAt: r.flashReadyAt });
  } catch (e) {
    res.status(400).json({ message: 'Identifiant invalide' });
  }
});

/* ---------- ADMIN ---------- */

// Liste des réservations + limite par jour
router.get('/', adminOnly, async (_req, res) => {
  try {
    const items = await Reservation.find().sort({ day: 1, createdAt: -1 });
    res.json({ max: maxPerDay(), items });
  } catch (e) {
    console.error('Erreur liste réservations :', e);
    res.status(500).json({ message: 'Erreur lecture base : ' + e.message });
  }
});

// Changer le statut
router.patch('/:id/status', adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Statut invalide' });

    const r = await Reservation.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Introuvable' });

    // Réactiver une soirée annulée : vérifier que la date n'est pas pleine
    if (r.category === 'soiree' && r.status === 'annulee' && status !== 'annulee') {
      if ((await countSoirees(r.day)) >= maxPerDay()) {
        return res.status(409).json({ message: 'Impossible : cette date est déjà complète.' });
      }
    }
    const wasConfirmed = r.status === 'confirmee';
    r.status = status;
    await r.save();
    // Réservation acceptée : SMS de confirmation au numéro du client (une seule fois)
    const sms = status === 'confirmee' && !wasConfirmed ? await sendConfirmationSms(r) : null;
    res.json({ ...r.toObject(), sms });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer
router.delete('/:id', adminOnly, async (req, res) => {
  await Reservation.findByIdAndDelete(req.params.id);
  res.json({ message: 'Supprimée' });
});

module.exports = router;
