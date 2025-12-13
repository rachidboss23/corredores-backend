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
  let propiedad;
  const fs = require('fs');

  // Si el id no tiene formato UUID (por ejemplo 'prop_1' de datos de prueba),
  // evitamos hacer la consulta que falla en Postgres por tipo UUID inválido.
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  const isUuid = typeof propiedad_id === 'string' && uuidRegex.test(propiedad_id);

  if (isUuid) {
    try {
      const resp = await supabase
        .from("propiedades")
        .select("id, titulo, tipo_operacion, precio, direccion")
        .eq("id", propiedad_id)
        .maybeSingle();

      // Log para diagnóstico
      try { fs.mkdirSync('logs', { recursive: true }); fs.appendFileSync('logs/carpeta_debug.log', `\n[PROP_REQ] ${new Date().toISOString()} - resp: ${JSON.stringify(resp)}\n`); } catch (e) {}

      propiedad = resp?.data ?? resp;
      if (resp?.error) {
        console.error("supabase error fetching propiedad:", resp.error);
        throw new Error("Error obteniendo propiedad");
      }
    } catch (e) {
      console.error("Exception fetching propiedad:", e && (e.stack || e));
      try { fs.appendFileSync('logs/carpeta_debug.log', `\n[PROP_ERR] ${new Date().toISOString()} - ${e && (e.stack || e)}\n`); } catch(e2){}
      throw new Error("Error obteniendo propiedad");
    }
  } else {
    // id no es UUID: no intentamos consultar la tabla real (es dato de demo)
    console.warn('Propiedad id no es UUID, omitiendo consulta a Supabase:', propiedad_id);
    propiedad = null;
  }

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
