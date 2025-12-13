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

async function crearTipoDocumento(payload) {
  const { data, error } = await supabase.from('tipos_documento').insert([payload]).select().maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

async function actualizarTipoDocumento(id, payload) {
  const { data, error } = await supabase.from('tipos_documento').update(payload).eq('id', id).select().maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

async function eliminarTipoDocumento(id) {
  const { data, error } = await supabase.from('tipos_documento').delete().eq('id', id).select();
  if (error) throw new Error(error.message);
  return data;
}

module.exports = {
  listarTiposDocumentoServicio,
  crearTipoDocumento,
  actualizarTipoDocumento,
  eliminarTipoDocumento,
};
