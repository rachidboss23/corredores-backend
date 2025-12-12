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
// backend/src/services/carpetaDigitalServicio.js
const supabase = require("../config/supabaseClient");
const { listarTiposDocumentoServicio } = require("./tiposDocumentoServicio");
/**
 * Retorna:
 * {
 *   propiedad: {...},
 *   checklist: [{ tipo_documento_id, nombre, es_obligatorio, cargado, archivo_url }],
 *   completitud: number (0-100)
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

  // 2) Tipos documento (sin filtro por tipo_operacion para evitar errores de columna inexistente)
  const tiposDocumento = await listarTiposDocumentoServicio();

  // 3) Documentos cargados para la propiedad (si existe tabla documentos_propiedad)
  const { data: docs, error: errorDocs } = await supabase
    .from("documentos_propiedad")
  .select("id, tipo_documento_id, archivo_url, created_at")
  .eq("propiedad_id", propiedad_id);

  // Si tu tabla se llama distinto, aquí caerá
  if (errorDocs) {
    // No rompemos todo: devolvemos checklist solo con tipos_documento
    const completitudFallback = calcularCompletitud(checklistFallback);
    return { propiedad, checklist: checklistFallback, completitud: completitudFallback };
  }
  const docsPorTipo = new Map();
  (docs || []).forEach((d) => {
    if (d?.tipo_documento_id) docsPorTipo.set(d.tipo_documento_id, d);
  // 4) Checklist final
  const checklist = (tiposDocumento || []).map((t) => {
    const doc = docsPorTipo.get(t.id);
  // 5) Completitud (solo obligatorios)
  const completitud = calcularCompletitud(checklist);

  return { propiedad, checklist, completitud };
}

function calcularCompletitud(checklist) {
  const obligatorios = checklist.filter((i) => i.es_obligatorio);
  return Math.round((cargados / obligatorios.length) * 100);
}

module.exports = { obtenerCarpetaDigitalServicio };
// backend/src/services/carpetaDigitalServicio.js
<<<<<<< HEAD

const supabase = require("../config/supabaseClient");

// Servicio principal de carpeta digital
async function obtenerCarpetaDigitalServicio(propiedad_id) {
  // 1. Obtener propiedad
  const { data: propiedad, error: errorProp } = await supabase
    .from("propiedades")
    .select("*")
    .eq("id", propiedad_id)
    .single();

  if (errorProp || !propiedad) {
    throw new Error("Propiedad no encontrada");
  }

  const tipoOperacion = propiedad.tipo_operacion;

  // 2. Obtener tipos de documento requeridos para esta operación (venta / arriendo / administra…)
  const { data: tiposDocumento, error: errorTipos } = await supabase
    .from("tipos_documento")
    .select("*")
    .eq("tipo_operacion", tipoOperacion);

  if (errorTipos) {
    throw new Error("Error obteniendo tipos de documentos");
  }

  // 3. Obtener documentos reales subidos por la propiedad
  const { data: documentosSubidos, error: errorDocs } = await supabase
    .from("documentos_propiedad")
    .select("*")
    .eq("propiedad_id", propiedad_id);

  if (errorDocs) {
    throw new Error("Error obteniendo documentos de la propiedad");
  }

  // 4. Mezclar: tipos_documento + documentos_subidos
  const carpetaDigital = tiposDocumento.map((tipo) => {
    const documentoActual = documentosSubidos.find(
      (doc) => doc.tipo_documento_id === tipo.id
    );

    return {
      id_tipo: tipo.id,
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
      obligatorio: tipo.es_obligatorio,
      subido: !!documentoActual,
      archivo_url: documentoActual ? documentoActual.archivo_url : null,
      documento_id: documentoActual ? documentoActual.id : null,
    };
  });

  return {
    propiedad,
    carpetaDigital,
  };
=======
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

  // 2) Tipos documento (sin filtro por tipo_operacion para evitar errores de columna inexistente)
  const tiposDocumento = await listarTiposDocumentoServicio();

  // 3) Documentos cargados para la propiedad (si existe tabla documentos_propiedad)
  const { data: docs, error: errorDocs } = await supabase
    .from("documentos_propiedad")
    .select("id, tipo_documento_id, archivo_url, created_at")
    .eq("propiedad_id", propiedad_id);

  // Si tu tabla se llama distinto, aquí caerá
  if (errorDocs) {
    // No rompemos todo: devolvemos checklist solo con tipos_documento
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
>>>>>>> 2459c4b (carpeta digital funcionando al 100)
}

module.exports = {
  obtenerCarpetaDigitalServicio,
};
