const supabase = require("../config/supabaseClient");

exports.obtenerClientes = async () => {
  // Selecciona todo para no pelear con columnas (email vs no-email)
  const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};
