// backend/server.js
<<<<<<< HEAD

=======
>>>>>>> 2459c4b (carpeta digital funcionando al 100)
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const carpetaDigitalRutas = require("./src/routes/carpetaDigitalRutas");
const propiedadesRutas = require("./src/routes/propiedadesRutas");
<<<<<<< HEAD
=======
const tiposDocumentoRutas = require("./src/routes/tiposDocumentoRutas");
const clientesRutas = require("./src/routes/clientesRutas");
const documentosRutas = require("./src/routes/documentosRutas");
>>>>>>> 2459c4b (carpeta digital funcionando al 100)

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
<<<<<<< HEAD

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
=======
app.use("/api/tipos-documento", tiposDocumentoRutas);
app.use("/api/clientes", clientesRutas);
app.use("/api/documentos", documentosRutas);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
>>>>>>> 2459c4b (carpeta digital funcionando al 100)
});
