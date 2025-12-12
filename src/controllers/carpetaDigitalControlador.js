// backend/src/controllers/carpetaDigitalControlador.js
const { obtenerCarpetaDigitalServicio } = require("../services/carpetaDigitalServicio");

async function obtenerCarpetaDigital(req, res) {
  const { propiedad_id } = req.params;

  console.log('HTTP /api/carpeta-digital called with propiedad_id=', propiedad_id);
  try {
    const data = await obtenerCarpetaDigitalServicio(propiedad_id);

    return res.json({ ok: true, data });
  } catch (error) {
    console.error("Error en carpeta digital:", error?.message || error);

    return res.status(500).json({ ok: false, error: error?.message || "Error cargando carpeta digital" });
  }
}

module.exports = { obtenerCarpetaDigital };
