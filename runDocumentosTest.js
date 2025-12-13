const { obtenerDocumentos } = require('./src/services/documentosServicio');

async function test() {
  try {
    const r = await obtenerDocumentos();
    console.log('SERVICE RESULT:', JSON.stringify(r, null, 2));
  } catch (e) {
    console.error('SERVICE ERROR:', e && (e.stack || e));
  }
}

test().then(()=>process.exit(0));
