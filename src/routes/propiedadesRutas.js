// backend/src/routes/propiedadesRutas.js

const express = require("express");
const router = express.Router();

const { listarPropiedades } = require("../controllers/propiedadesControlador");

// GET /api/propiedades
router.get("/", listarPropiedades);

module.exports = router;
