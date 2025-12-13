const {
  listarTiposDocumentoServicio,
  crearTipoDocumento,
  actualizarTipoDocumento,
  eliminarTipoDocumento,
} = require("../services/tiposDocumentoServicio");

async function obtenerTiposDocumento(req, res) {
  try {
    const tipos = await listarTiposDocumentoServicio();
    res.json({ ok: true, data: tipos });
  } catch (error) {
    console.error("Error obteniendo tipos documento:", error.message || error);
    res.status(500).json({ ok: false, error: "Error obteniendo tipos documento" });
  }
}

async function crearTipo(req, res) {
  try {
    const payload = req.body;
    const tipo = await crearTipoDocumento(payload);
    res.status(201).json({ ok: true, data: tipo });
  } catch (error) {
    console.error("Error creando tipo documento:", error.message || error);
    res.status(500).json({ ok: false, error: "Error creando tipo documento" });
  }
}

async function actualizarTipo(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const tipo = await actualizarTipoDocumento(id, payload);
    res.json({ ok: true, data: tipo });
  } catch (error) {
    console.error("Error actualizando tipo documento:", error.message || error);
    res.status(500).json({ ok: false, error: "Error actualizando tipo documento" });
  }
}

async function eliminarTipo(req, res) {
  try {
    const { id } = req.params;
    await eliminarTipoDocumento(id);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando tipo documento:", error.message || error);
    res.status(500).json({ ok: false, error: "Error eliminando tipo documento" });
  }
}

module.exports = {
  obtenerTiposDocumento,
  crearTipo,
  actualizarTipo,
  eliminarTipo,
};

