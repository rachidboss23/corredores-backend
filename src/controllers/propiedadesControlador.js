const { obtenerPropiedades } = require("../services/propiedadesServicio");

exports.listarPropiedades = async (req, res) => {
  try {
    const propiedades = await obtenerPropiedades();

    return res.json({
      ok: true,
      propiedades,
    });
  } catch (error) {
    console.error("Error listarPropiedades:", error);
    return res.status(500).json({
      ok: false,
      error: "Error obteniendo propiedades",
    });
  }
};
