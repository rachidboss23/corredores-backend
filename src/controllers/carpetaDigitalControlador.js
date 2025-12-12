// backend/src/controllers/carpetaDigitalControlador.js
<<<<<<< HEAD

=======
>>>>>>> 2459c4b (carpeta digital funcionando al 100)
const {
  obtenerCarpetaDigitalServicio,
} = require("../services/carpetaDigitalServicio");

async function obtenerCarpetaDigital(req, res) {
  const { propiedad_id } = req.params;

  try {
    const data = await obtenerCarpetaDigitalServicio(propiedad_id);

    return res.json({
      ok: true,
<<<<<<< HEAD
      ...data,
=======
      data, // 👈 IMPORTANTÍSIMO: el frontend espera datos.data
>>>>>>> 2459c4b (carpeta digital funcionando al 100)
    });
  } catch (error) {
    console.error("Error en carpeta digital:", error.message);

    return res.status(500).json({
      ok: false,
<<<<<<< HEAD
      error: error.message,
=======
      error: error.message || "Error cargando carpeta digital",
>>>>>>> 2459c4b (carpeta digital funcionando al 100)
    });
  }
}

module.exports = {
  obtenerCarpetaDigital,
};
