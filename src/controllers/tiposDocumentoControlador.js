const {
  obtenerTiposDocumento,
} = require("../services/tiposDocumentoServicio");

const listarTiposDocumento = async (req, res) => {
  try {
    const tipos = await obtenerTiposDocumento();

    res.json({
      ok: true,
      tipos,
    });
  } catch (error) {
    console.error("Error listarTiposDocumento:", error);
    res.status(500).json({
      ok: false,
      error: "Error obteniendo tipos de documentos",
    });
  }
};

module.exports = {
  listarTiposDocumento,
};
