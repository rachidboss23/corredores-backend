// backend/src/services/carpetaDigitalServicio.js

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
}

module.exports = {
  obtenerCarpetaDigitalServicio,
};
