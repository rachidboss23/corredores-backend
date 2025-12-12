const express = require("express");
const router = express.Router();

const { listarDocumentos } = require("../controllers/documentosControlador");

router.get("/", listarDocumentos);

module.exports = router;
