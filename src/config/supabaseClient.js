// backend/src/config/supabaseClient.js
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// URL y KEY desde .env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validación
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ ERROR: Variables de entorno Supabase no cargadas");
}

// Crear cliente Supabase (FORMATO COMMONJS CORRECTO)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Exportarlo correctamente para require()
module.exports = supabase;
