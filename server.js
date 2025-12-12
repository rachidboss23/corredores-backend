// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const carpetaDigitalRutas = require("./src/routes/carpetaDigitalRutas");
const propiedadesRutas = require("./src/routes/propiedadesRutas");
const tiposDocumentoRutas = require("./src/routes/tiposDocumentoRutas");
const clientesRutas = require("./src/routes/clientesRutas");
const documentosRutas = require("./src/routes/documentosRutas");

const app = express();

app.use(cors());
app.use(express.json());

// test
app.get("/", (req, res) => {
  res.send("SERVER REAL CARGADO");
});

// rutas API
app.use("/api/carpeta-digital", carpetaDigitalRutas);
app.use("/api/propiedades", propiedadesRutas);
app.use("/api/tipos-documento", tiposDocumentoRutas);
app.use("/api/clientes", clientesRutas);
app.use("/api/documentos", documentosRutas);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});

// Error handler (global) — log errores no capturados en rutas
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR HANDLER:', err && (err.stack || err));
  next(err);
});
