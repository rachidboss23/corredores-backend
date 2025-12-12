const supabase = require("../config/supabaseClient");

exports.obtenerDocumentos = async () => {
  // Si no existe documentos_propiedad, cámbialo por tu tabla real
  const { data, error } = await supabase
    .from("documentos_propiedad")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};
