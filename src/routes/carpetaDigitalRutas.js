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
// Log middleware para confirmar que la ruta fue alcanzada
router.use((req, res, next) => {
  if (req.path && req.path !== "/test") console.log("ROUTE /api/carpeta-digital hit:", req.method, req.path);
  next();
});

router.get("/:propiedad_id", obtenerCarpetaDigital);

module.exports = router;
