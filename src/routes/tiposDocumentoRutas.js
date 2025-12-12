const express = require("express");
const router = express.Router();

const {
  listarTiposDocumento,
} = require("../controllers/tiposDocumentoControlador");

// GET /api/tipos-documento
router.get("/", listarTiposDocumento);

module.exports = router;
