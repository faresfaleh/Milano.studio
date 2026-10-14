const { serviceText, receivedText, CONTACT } = require('./mailer');

/*
  Envoi automatique de SMS. Deux possibilités (au choix, dans .env) :
  1) Application "SMS Gateway for Android" sur VOTRE téléphone : le SMS part avec votre carte SIM (votre numéro).
     Variables : SMS_GATEWAY_USER, SMS_GATEWAY_PASS (et SMS_GATEWAY_URL si mode local)
  2) Twilio (payant) : TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM
*/
const GATEWAY_URL = () => process.env.SMS_GATEWAY_URL || 'https://api.sms-gate.app/3rdparty/v1/messages';

const gatewayOn = () => !!(process.env.SMS_GATEWAY_USER && process.env.SMS_GATEWAY_PASS);
const twilioOn = () => !!(process.env.TWILIO_SID && process.env.TWILIO_TOKEN && process.env.TWILIO_FROM);

const fmtDay = (r) => r.day.split('-').reverse().join('/');
const priceText = (r) => (r.price ? ` Prix : ${r.price} DT (sans transport).` : '');

// 2) Envoyé quand vous acceptez la réservation
function confirmationText(r) {
  return (
    `Bonjour ${r.prenom}, Milano Studio confirme votre réservation : ${serviceText(r)}, ` +
    `le ${fmtDay(r)} à ${r.lieu}.${priceText(r)} Merci de votre confiance ! Contact : ${CONTACT}`
  );
}

async function viaGateway(to, text) {
  const res = await fetch(GATEWAY_URL(), {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${process.env.SMS_GATEWAY_USER}:${process.env.SMS_GATEWAY_PASS}`).toString('base64'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ textMessage: { text }, phoneNumbers: [to], priority: 100, ttl: 3600 }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `HTTP ${res.status}`);
}

async function viaTwilio(to, text) {
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${process.env.TWILIO_SID}:${process.env.TWILIO_TOKEN}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: process.env.TWILIO_FROM, Body: text }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
}

// Retourne 'sent' | 'disabled' | 'failed:<raison>'
async function sendSms(phone, text) {
  if (!gatewayOn() && !twilioOn()) return 'disabled';
  const to = `+216${phone}`;
  try {
    await (gatewayOn() ? viaGateway(to, text) : viaTwilio(to, text));
    console.log(`SMS envoyé à ${to}`);
    return 'sent';
  } catch (e) {
    console.error('Erreur SMS :', e.message);
    return 'failed:' + e.message;
  }
}

// Ces fonctions ne lèvent jamais d'erreur : un SMS raté ne doit pas arrêter le serveur
const safe = (build) => async (r) => {
  try {
    return await sendSms(r.telephone, build(r));
  } catch (e) {
    console.error('Erreur SMS :', e.message);
    return 'failed:' + e.message;
  }
};
const sendReceivedSms = safe(receivedText);
const sendConfirmationSms = safe(confirmationText);

module.exports = { sendSms, sendReceivedSms, sendConfirmationSms, receivedText, confirmationText };
