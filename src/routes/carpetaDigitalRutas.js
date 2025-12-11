const express = require("express");
const router = express.Router();

const {
  obtenerCarpetaDigital,
} = require("../controllers/carpetaDigitalControlador");

// Test
router.get("/test", (req, res) =>
  res.json({ ok: true, mensaje: "Ruta carpeta-digital funcionando" })
);

// Carpeta digital real
router.get("/:propiedad_id", obtenerCarpetaDigital);

module.exports = router;
