const { obtenerClientes } = require('./src/services/clientesServicio');

async function test() {
  try {
    const r = await obtenerClientes();
    console.log('SERVICE RESULT:', JSON.stringify(r, null, 2));
  } catch (e) {
    console.error('SERVICE ERROR:', e && (e.stack || e));
  }
}

test().then(()=>process.exit(0));
