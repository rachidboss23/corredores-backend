const supabase = require('./src/config/supabaseClient');

async function test() {
  try {
    console.log('SUPABASE CLIENT TYPE:', typeof supabase);
    // Try a simple call. If mock, may support maybeSingle; if real, should return { data, error }
    if (typeof supabase.from === 'function') {
      const resp = await supabase.from('propiedades').select('id,titulo').limit(1);
      console.log('RESP:', resp && (resp.data || resp));
    } else {
      console.log('Supabase client not usable');
    }
  } catch (e) {
    console.error('TEST ERROR:', e && (e.stack || e));
  }
}

test().then(()=>process.exit(0));
