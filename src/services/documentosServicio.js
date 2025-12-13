const supabase = require("../config/supabaseClient");

exports.obtenerDocumentos = async () => {
  try {
    // Si no existe documentos_propiedad, cámbialo por tu tabla real
    const { data, error } = await supabase
      .from("documentos_propiedad")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (e) {
    console.error('supabase documentos error:', e && (e.stack || e));
    // Intentar usar datos de ejemplo exportados por el cliente mock/real
    try {
      const sample = supabase.__SAMPLE?.documentos_propiedad;
      if (Array.isArray(sample)) return sample;
    } catch (e2) {
      console.error('Error al obtener sample fallback documentos:', e2);
    }
    // Si no hay fallback, propaga el error
    throw e;
  }
};
