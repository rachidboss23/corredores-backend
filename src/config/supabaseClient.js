// backend/src/config/supabaseClient.js
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Leer variables de entorno
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug: mostrar valores críticos (no imprimir la clave completa por seguridad)
console.log('DEBUG Supabase env:', {
  hasUrl: !!SUPABASE_URL,
  hasKey: !!SUPABASE_SERVICE_ROLE_KEY,
  useRealFlag: process.env.USE_REAL_SUPABASE,
});

// Decidir si usamos el cliente real o un mock.
// Por seguridad y para desarrollo local, usamos el mock a menos que
// la variable de entorno `USE_REAL_SUPABASE` esté establecida a 'true'.
const isPlaceholderKey = !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === "REPLACE_WITH_YOUR_SERVICE_ROLE_KEY";
const useReal = process.env.USE_REAL_SUPABASE === "true" && !isPlaceholderKey;

// Datos de ejemplo simples (siempre disponibles como fallback)
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

if (useReal) {
  // Cliente real
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  // Exponer SAMPLE también para permitir fallback desde servicios
  supabase.__SAMPLE = SAMPLE;
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

  // Mock sencillo con soporte básico de insert/update/delete/eq/select
  function makeQuery(table) {
    const collection = sampleFor(table);
    const state = { filters: {} };

    function match(item) {
      const keys = Object.keys(state.filters);
      if (keys.length === 0) return true;
      return keys.every((k) => String(item[k]) === String(state.filters[k]));
    }

    return {
      select() { return this; },
      order() { return this; },
      eq(column, value) { state.filters[column] = value; return this; },
      maybeSingle() {
        const found = collection.find(match) || null;
        return Promise.resolve({ data: found, error: null });
      },
      then(onFulfilled, onRejected) {
        // Return whole collection filtered
        try {
          const results = collection.filter(match);
          const res = { data: results, error: null };
          if (typeof onFulfilled === 'function') return onFulfilled(res);
          return Promise.resolve(res);
        } catch (err) {
          if (typeof onRejected === 'function') return onRejected(err);
          throw err;
        }
      },
      // insert accepts array or single
      insert(payload) {
        const items = Array.isArray(payload) ? payload : [payload];
        // push copies
        items.forEach((it) => {
          const id = it.id || `mock_${Date.now()}_${Math.floor(Math.random()*1000)}`;
          const item = { ...it, id };
          collection.push(item);
        });
        const inserted = items.map(i => ({ ...i, id: i.id || null }));
        return Promise.resolve({ data: inserted, error: null, maybeSingle: () => Promise.resolve({ data: inserted[0] }) });
      },
      update(payload) {
        const keys = Object.keys(state.filters);
        let updated = [];
        collection.forEach((item, idx) => {
          if (match(item)) {
            collection[idx] = { ...item, ...payload };
            updated.push(collection[idx]);
          }
        });
        return Promise.resolve({ data: updated, error: null, maybeSingle: () => Promise.resolve({ data: updated[0] || null }) });
      },
      delete() {
        const before = collection.length;
        for (let i = collection.length - 1; i >= 0; i--) {
          if (match(collection[i])) collection.splice(i, 1);
        }
        const removed = before - collection.length;
        return Promise.resolve({ data: { removed }, error: null });
      }
    };
  }

  const mockSupabase = {
    from(table) {
      const t = String(table);
      return makeQuery(t);
    },
  };
  // Exportar mock y los datos SAMPLE para que los servicios puedan usar fallback
  mockSupabase.__SAMPLE = SAMPLE;
  module.exports = mockSupabase;
}
