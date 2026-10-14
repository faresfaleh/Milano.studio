// Outils de sécurité sans dépendance externe : en-têtes HTTP, limitation de débit, comparaison sûre, nettoyage des textes.
const crypto = require('crypto');

/* ---------- En-têtes de sécurité (équivalent simplifié de « helmet ») ---------- */
function securityHeaders(_req, res, next) {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  res.setHeader('Cache-Control', 'no-store'); // les réponses de l'API ne doivent pas être mises en cache
  next();
}

/* ---------- Limitation de débit (en mémoire, par adresse IP) ---------- */
const stores = [];
setInterval(() => {
  const now = Date.now();
  for (const s of stores) for (const [k, v] of s) if (v.reset <= now) s.delete(k);
}, 60 * 1000).unref();

function entryFor(store, key, windowMs) {
  const now = Date.now();
  let e = store.get(key);
  if (!e || e.reset <= now) {
    e = { count: 0, reset: now + windowMs };
    store.set(key, e);
  }
  return e;
}

function tooMany(res, e, message) {
  res.setHeader('Retry-After', Math.max(1, Math.ceil((e.reset - Date.now()) / 1000)));
  return res.status(429).json({ message });
}

// Au plus `max` requêtes par fenêtre et par IP
function rateLimit({ windowMs, max, message = 'Trop de requêtes, réessayez plus tard.' }) {
  const store = new Map();
  stores.push(store);
  return (req, res, next) => {
    const e = entryFor(store, req.ip, windowMs);
    if (++e.count > max) return tooMany(res, e, message);
    next();
  };
}

// Compte uniquement les ÉCHECS d'authentification (réponse 401) : après `max` échecs, l'IP est bloquée
function failLimiter({ windowMs, max, message = 'Trop de tentatives incorrectes. Réessayez plus tard.' }) {
  const store = new Map();
  stores.push(store);
  return (req, res, next) => {
    const e = entryFor(store, req.ip, windowMs);
    if (e.count >= max) return tooMany(res, e, message);
    res.on('finish', () => { if (res.statusCode === 401) e.count++; });
    next();
  };
}

/* ---------- Comparaison de secrets en temps constant ---------- */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/* ---------- Nettoyage des textes saisis ---------- */
// Retourne une chaîne propre (sans caractères de contrôle, espaces simplifiés) ou null si ce n'est pas du texte
function cleanStr(v, max = 200) {
  if (typeof v !== 'string') return null;
  // eslint-disable-next-line no-control-regex
  const s = v.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  return s.length <= max ? s : null;
}
// Pour le message (peut contenir des retours à la ligne)
function cleanText(v, max = 1000) {
  if (v === undefined || v === null || v === '') return '';
  if (typeof v !== 'string') return null;
  // eslint-disable-next-line no-control-regex
  const s = v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();
  return s.length <= max ? s : null;
}

// Enveloppe pour que toute erreur d'une route async soit transmise au gestionnaire d'erreurs (au lieu de faire planter le serveur)
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { securityHeaders, rateLimit, failLimiter, safeEqual, cleanStr, cleanText, wrap };
