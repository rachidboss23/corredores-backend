/**
 * Cliente Supabase
 * Conexión centralizada a la base de datos
 * NO contiene lógica de negocio
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey
);
