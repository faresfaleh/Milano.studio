const nodemailer = require('nodemailer');

// Destinataire des notifications (modifiable dans .env avec NOTIFY_EMAIL)
const notifyTo = () => process.env.NOTIFY_EMAIL || 'faresfaleh47@gmail.com';

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: (parseInt(process.env.SMTP_PORT, 10) || 465) === 465,
    auth: { user: process.env.SMTP_USER.trim(), pass: process.env.SMTP_PASS.replace(/\s/g, '') }, // Google affiche le mot de passe avec des espaces : on les retire
  });
  return transporter;
}

const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const LABELS = {
  mariage: 'Mariage', soiree_homme: 'Soirée homme', soiree_femme: 'Soirée femme',
  normale: 'Normale', medium: 'Medium', pro: 'Pro',
  individuel: 'Shooting individuel',
  photo: 'Appareil photo', photo_video: 'Photo + vidéo', preparation: 'Préparation', preparation_photo: 'Préparation + shooting photo',
};
const L = (k) => LABELS[k] || k || '';

function soireeText(o = {}) {
  const c = o.cameras || 1;
  const parts = [`${c} caméra${c > 1 ? 's' : ''} vidéo`, 'appareil photo', 'parasols & lumières'];
  if (o.drone) parts.push('drone');
  if (o.girafe) parts.push('girafe');
  if (o.regie) parts.push('régie et écran');
  return parts.join(' + ');
}

function serviceText(r) {
  if (r.category === 'soiree') {
    return r.options ? `${L(r.eventType)} – ${soireeText(r.options)}` : `${L(r.eventType)} – Formule ${L(r.pack)}`;
  }
  const type = r.shootingType === 'mariage' ? 'Shooting de mariage' : 'Shooting individuel';
  return `${type} – ${L(r.shootingOption)}`;
}

const CONTACT = process.env.STUDIO_SMS_PHONE || '92 343 403';

// Message « réservation bien reçue » destiné au client
function receivedText(r) {
  const price = r.price ? ` Prix : ${r.price} DT (sans transport).` : '';
  return (
    `Bonjour ${r.prenom}, Milano Studio a bien reçu votre réservation : ${serviceText(r)}, ` +
    `le ${r.day.split('-').reverse().join('/')} à ${r.lieu}.${price} Nous vous contacterons pour la confirmer. Contact : ${CONTACT}`
  );
}

// Lien WhatsApp : ouvre la discussion avec le client, message déjà écrit
const whatsappLink = (r) => `https://wa.me/216${r.telephone}?text=${encodeURIComponent(receivedText(r))}`;

// Envoie un email au studio à chaque nouvelle réservation.
// Ne bloque jamais la réservation : en cas d'erreur, on l'écrit seulement dans la console.
async function sendReservationEmail(r) {
  const t = getTransporter();
  if (!t) {
    console.warn('Email non envoyé : SMTP_USER / SMTP_PASS manquants dans .env');
    return;
  }
  const service = serviceText(r);
  const price = r.price ? `${r.price} DT (sans transport)` : 'Sur devis';
  const rows = [
    ['Service', service],
    ['Prix', price],
    ['Date', r.day.split('-').reverse().join('/')],
    ['Lieu', r.lieu],
    ['Nom', `${r.nom} ${r.prenom}`],
    ['Téléphone', `+216 ${r.telephone}`],
    ['CIN', r.cin],
    ['Message', r.message || '—'],
  ];
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="margin:0 0 12px">Nouvelle réservation – Milano Studio</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows.map(([k, v]) => `<tr><td style="padding:8px;border:1px solid #ddd;background:#f6f6f6;width:130px"><b>${esc(k)}</b></td><td style="padding:8px;border:1px solid #ddd">${esc(v)}</td></tr>`).join('')}
      </table>
      <p style="margin:16px 0"><a href="${esc(whatsappLink(r))}" style="background:#25D366;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">Répondre au client sur WhatsApp</a></p>
      <p style="color:#777;font-size:13px">Statut : en attente. Confirmez ou annulez depuis la page /admin.</p>
    </div>`;
  const text = rows.map(([k, v]) => `${k} : ${v}`).join('\n') + `\n\nRépondre au client sur WhatsApp : ${whatsappLink(r)}`;

  try {
    await t.sendMail({
      from: `"Milano Studio" <${process.env.SMTP_USER.trim()}>`,
      to: notifyTo(),
      subject: `Nouvelle réservation : ${service} – ${r.nom} ${r.prenom}`,
      text: `Nouvelle réservation\n\n${text}`,
      html,
    });
    console.log(`Email envoyé à ${notifyTo()}`);
  } catch (e) {
    console.error('Erreur envoi email :', e.message);
    if (e.code === 'EAUTH') {
      console.error('→ Identifiants refusés : SMTP_PASS doit être un "mot de passe d\'application" Google (pas le mot de passe normal), et la validation en 2 étapes doit être activée.');
    }
  }
}

module.exports = { sendReservationEmail, serviceText, receivedText, CONTACT, whatsappLink };
