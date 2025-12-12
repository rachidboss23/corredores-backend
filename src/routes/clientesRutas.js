const express = require("express");
const router = express.Router();

const { listarClientes } = require("../controllers/clientesControlador");

router.get("/", listarClientes);

module.exports = router;
