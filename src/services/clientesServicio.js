const supabase = require("../config/supabaseClient");

exports.obtenerClientes = async () => {
  try {
    // Selecciona todo para no pelear con columnas (email vs no-email)
    const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (e) {
    console.error('supabase clientes error:', e && (e.stack || e));
    // Si el cliente exporta datos de ejemplo (modo mock), úsalos como fallback
    try {
      const sample = supabase.__SAMPLE?.clientes;
      if (Array.isArray(sample)) return sample;
    } catch (e2) {
      console.error('Error al obtener sample fallback:', e2);
    }
    // Si no hay fallback, propaga el error para que el controlador devuelva 500
    throw e;
  }
};
