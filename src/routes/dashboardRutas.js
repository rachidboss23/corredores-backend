const express = require("express");
const router = express.Router();
const { resumenDashboard, recent } = require("../controllers/dashboardControlador");

router.get("/summary", resumenDashboard);
router.get("/recent", recent);

module.exports = router;
