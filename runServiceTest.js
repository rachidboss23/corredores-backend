const { obtenerCarpetaDigitalServicio } = require('./src/services/carpetaDigitalServicio');

async function test() {
  try {
    const r = await obtenerCarpetaDigitalServicio('prop_1');
    console.log('SERVICE RESULT:', JSON.stringify(r, null, 2));
  } catch (e) {
    console.error('SERVICE ERROR:', e && (e.stack || e));
  }
}

test().then(()=>process.exit(0));
