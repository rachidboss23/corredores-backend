// backend/src/config/supabaseClient.js
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Leer variables de entorno
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Decidir si usamos el cliente real o un mock.
// Por seguridad y para desarrollo local, usamos el mock a menos que
// la variable de entorno `USE_REAL_SUPABASE` esté establecida a 'true'.
const isPlaceholderKey = !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === "REPLACE_WITH_YOUR_SERVICE_ROLE_KEY";
const useReal = process.env.USE_REAL_SUPABASE === "true" && !isPlaceholderKey;

if (useReal) {
  // Cliente real
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  module.exports = supabase;
} else {
  console.warn("⚠️ Supabase no configurado: usando cliente MOCK con datos de ejemplo. Rellena backend/.env con SUPABASE_SERVICE_ROLE_KEY real para usar la base real.");

  // Datos de ejemplo simples
  const SAMPLE = {
    clientes: [
      { id: "cli_1", nombre: "Juan Pérez", telefono: "+34123456789", created_at: new Date().toISOString() },
      { id: "cli_2", nombre: "María Gómez", telefono: "+34111222333", created_at: new Date().toISOString() },
    ],
    propiedades: [
      { id: "prop_1", titulo: "Departamento céntrico", tipo_operacion: "Venta", precio: 120000, direccion: "Calle Falsa 123" },
      { id: "prop_2", titulo: "Casa en las afueras", tipo_operacion: "Alquiler", precio: 800, direccion: "Camino Real 45" },
    ],
    documentos_propiedad: [
      { id: "doc_1", tipo_documento_id: "t1", propiedad_id: "prop_1", archivo_url: null, created_at: new Date().toISOString() },
    ],
    tipos_documento: [
      { id: "t1", nombre: "Contrato", es_obligatorio: true },
      { id: "t2", nombre: "Ficha técnica", es_obligatorio: false },
    ],
  };

  function sampleFor(table) {
    return SAMPLE[table] || [];
  }

  // Thenable que permite encadenar .select().order().eq().maybeSingle()
  function makeThenable(table, single = false) {
    const result = { data: single ? (sampleFor(table)[0] ?? null) : sampleFor(table), error: null };

    const thenable = {
      select() { return thenable; },
      order() { return thenable; },
      eq() { return thenable; },
      maybeSingle() { return makeThenable(table, true); },
      // Compatibilidad con await / Promise.resolve
      then(onFulfilled, onRejected) {
        try {
          if (typeof onFulfilled === "function") return onFulfilled(result);
          return result;
        } catch (err) {
          if (typeof onRejected === "function") return onRejected(err);
          throw err;
        }
      },
    };

    return thenable;
  }

  const mockSupabase = {
    from(table) {
      // Normalizar nombres comunes
      const t = String(table);
      return makeThenable(t);
    },
  };

  module.exports = mockSupabase;
}
