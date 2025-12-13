const express = require("express");
const router = express.Router();

const {
  obtenerTiposDocumento,
  crearTipo,
  actualizarTipo,
  eliminarTipo,
} = require("../controllers/tiposDocumentoControlador");

// GET /api/tipos-documento
router.get("/", obtenerTiposDocumento);
router.post("/", crearTipo);
router.put("/:id", actualizarTipo);
router.delete("/:id", eliminarTipo);

module.exports = router;
