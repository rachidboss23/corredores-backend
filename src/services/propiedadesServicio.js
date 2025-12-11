// backend/src/services/propiedadesServicio.js

const supabase = require("../config/supabaseClient");

/**
 * Obtiene todas las propiedades desde Supabase
 */
exports.obtenerPropiedades = async () => {
  const { data, error } = await supabase
    .from("propiedades")
    .select("id, titulo, tipo_operacion, precio, direccion");

  if (error) {
    console.error("Error Supabase obtenerPropiedades:", error.message);
    throw new Error("Error consultando propiedades");
  }

  return data || [];
};
