require('dotenv').config();

const express = require('express');
const cors = require('cors');

const carpetaDigitalRutas = require('./src/routes/carpetaDigitalRutas');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SERVER REAL CARGADO');
});

// ✅ montar rutas
app.use('/api/carpeta-digital', carpetaDigitalRutas);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
