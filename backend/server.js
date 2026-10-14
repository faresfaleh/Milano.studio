// DNS public (utile si votre box ne résout pas les adresses mongodb+srv://)
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/reservations', require('./routes/reservations'));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

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
