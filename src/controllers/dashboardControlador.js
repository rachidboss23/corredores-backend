const { obtenerPropiedades } = require("../services/propiedadesServicio");
const { obtenerCarpetaDigitalServicio } = require("../services/carpetaDigitalServicio");

exports.resumenDashboard = async (req, res) => {
  try {
    const propiedades = await obtenerPropiedades();

    // Calcular métricas
    let total = propiedades.length;
    let venta = 0;
    let arriendo = 0;
    let incompletas = 0;
    let sumaCompletitud = 0;

    // Para mostrar "recent", guardamos pequeñas tuplas
    const recent = [];

    for (const p of propiedades) {
      if (p.tipo_operacion === "Venta") venta++;
      else if (p.tipo_operacion === "Arriendo" || p.tipo_operacion === "Alquiler") arriendo++;

      // Obtener completitud (servicio devolverá fallback si falla)
      try {
        const carpeta = await obtenerCarpetaDigitalServicio(p.id);
        const comp = Number(carpeta?.completitud ?? 0);
        sumaCompletitud += comp;
        if (comp < 100) incompletas++;
        recent.push({ id: p.id, titulo: p.titulo, completitud: comp });
      } catch (e) {
        // Si falla, contar como incompleta y agregar recent con 0
        incompletas++;
        recent.push({ id: p.id, titulo: p.titulo, completitud: 0 });
      }
    }

    const promedio = total === 0 ? 0 : Math.round(sumaCompletitud / total);

    // Ordenar recent por completitud asc (más urgentes primero) y tomar 8
    recent.sort((a, b) => a.completitud - b.completitud);

    return res.json({
      ok: true,
      data: {
        total,
        venta,
        arriendo,
        incompletas,
        promedio_completitud: promedio,
        recent: recent.slice(0, 8),
      },
    });
  } catch (error) {
    console.error("Error resumenDashboard:", error);
    return res.status(500).json({ ok: false, error: "Error generando resumen" });
  }
};

exports.recent = async (req, res) => {
  try {
    const propiedades = await obtenerPropiedades();
    const recent = [];
    for (const p of propiedades) {
      try {
        const carpeta = await obtenerCarpetaDigitalServicio(p.id);
        recent.push({ id: p.id, titulo: p.titulo, completitud: Number(carpeta?.completitud ?? 0) });
      } catch (e) {
        recent.push({ id: p.id, titulo: p.titulo, completitud: 0 });
      }
    }
    recent.sort((a, b) => a.completitud - b.completitud);
    return res.json({ ok: true, recent: recent.slice(0, 20) });
  } catch (error) {
    console.error("Error recentDashboard:", error);
    return res.status(500).json({ ok: false, error: "Error obteniendo recientes" });
  }
};
