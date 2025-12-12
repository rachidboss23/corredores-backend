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

    // Fallback safety: si Supabase real falla, devolver datos de ejemplo
    const fallback = {
      propiedad: { id: propiedad_id || "demo", titulo: "Propiedad demo", tipo_operacion: "Venta", direccion: "Dirección de ejemplo", precio: null },
      checklist: [
        { tipo_documento_id: "t1", nombre: "Contrato", es_obligatorio: true, cargado: false, archivo_url: null },
        { tipo_documento_id: "t2", nombre: "Ficha técnica", es_obligatorio: false, cargado: false, archivo_url: null },
      ],
      completitud: 0,
    };

    return res.json({ ok: true, data: fallback, warning: "fallback" });
  }
}

module.exports = { obtenerCarpetaDigital };
