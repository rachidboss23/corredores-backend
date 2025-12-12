const { obtenerDocumentos } = require("../services/documentosServicio");

exports.listarDocumentos = async (req, res) => {
  try {
    const documentos = await obtenerDocumentos();
    return res.json({ ok: true, documentos });
  } catch (error) {
    console.error("Error listarDocumentos:", error);
    return res.status(500).json({ ok: false, error: "Error obteniendo documentos" });
  }
};
