// backend/src/services/carpetaDigitalServicio.js
const supabase = require("../config/supabaseClient");
const { listarTiposDocumentoServicio } = require("./tiposDocumentoServicio");

/**
 * Retorna:
 * {
 *   propiedad: {...},
 *   checklist: [{ tipo_documento_id, nombre, es_obligatorio, cargado, archivo_url }],
 *   completitud: number (0-100)
 * }
 */
async function obtenerCarpetaDigitalServicio(propiedad_id) {
  // 1) Propiedad
  const { data: propiedad, error: errorProp } = await supabase
    .from("propiedades")
    .select("id, titulo, tipo_operacion, precio, direccion")
    .eq("id", propiedad_id)
    .maybeSingle();

  if (errorProp) throw new Error("Error obteniendo propiedad");
  if (!propiedad) throw new Error("Propiedad no encontrada");

  // 2) Tipos documento (sin filtrar por tipo_operacion para evitar errores si la columna no existe)
  const tiposDocumento = await listarTiposDocumentoServicio();

  // 3) Documentos cargados para la propiedad (si existe tabla documentos_propiedad)
  const { data: docs, error: errorDocs } = await supabase
    .from("documentos_propiedad")
    .select("id, tipo_documento_id, archivo_url, created_at")
    .eq("propiedad_id", propiedad_id);

  // Si la consulta falla, devolvemos checklist basado en tiposDocumento
  if (errorDocs) {
    const checklistFallback = (tiposDocumento || []).map((t) => ({
      tipo_documento_id: t.id,
      nombre: t.nombre,
      es_obligatorio: !!t.es_obligatorio,
      cargado: false,
      archivo_url: null,
    }));

    const completitudFallback = calcularCompletitud(checklistFallback);
    return { propiedad, checklist: checklistFallback, completitud: completitudFallback };
  }

  const docsPorTipo = new Map();
  (docs || []).forEach((d) => {
    if (d?.tipo_documento_id) docsPorTipo.set(d.tipo_documento_id, d);
  });

  // 4) Checklist final
  const checklist = (tiposDocumento || []).map((t) => {
    const doc = docsPorTipo.get(t.id);
    return {
      tipo_documento_id: t.id,
      nombre: t.nombre,
      es_obligatorio: !!t.es_obligatorio,
      cargado: !!doc,
      archivo_url: doc?.archivo_url ?? null,
    };
  });

  // 5) Completitud (solo obligatorios)
  const completitud = calcularCompletitud(checklist);

  return { propiedad, checklist, completitud };
}

function calcularCompletitud(checklist) {
  const obligatorios = checklist.filter((i) => i.es_obligatorio);
  if (obligatorios.length === 0) return 0;

  const cargados = obligatorios.filter((i) => i.cargado).length;
  return Math.round((cargados / obligatorios.length) * 100);
}

module.exports = { obtenerCarpetaDigitalServicio };
