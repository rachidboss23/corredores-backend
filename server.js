// backend/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const carpetaDigitalRutas = require("./src/routes/carpetaDigitalRutas");
const propiedadesRutas = require("./src/routes/propiedadesRutas");

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
