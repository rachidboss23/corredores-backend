// backend/src/services/tiposDocumentoServicio.js
const supabase = require("../config/supabaseClient");

async function listarTiposDocumentoServicio() {
  const { data, error } = await supabase
    .from("tipos_documento")
    .select("id, nombre, es_obligatorio")
    .order("nombre", { ascending: true });

  if (error) throw new Error("Error obteniendo tipos de documentos");
  return data || [];
}

module.exports = {
  listarTiposDocumentoServicio,
};
