// Test : npm run test-email
require('dotenv').config();
const { sendReservationEmail } = require('./utils/mailer');

console.log('SMTP_USER :', process.env.SMTP_USER || '(vide)');
console.log('SMTP_PASS :', process.env.SMTP_PASS ? 'renseigné' : '(vide)');

sendReservationEmail({
  category: 'soiree', eventType: 'mariage',
  options: { cameras: 2, drone: 1, girafe: 0, regie: 0 }, price: 900,
  day: '2026-12-01', lieu: 'TEST', nom: 'Test', prenom: 'Email',
  telephone: '12345678', cin: '12345678', message: 'Email de test',
}).then(() => process.exit(0));
