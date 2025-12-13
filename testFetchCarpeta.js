const { obtenerCarpetaDigitalServicio } = require('./src/services/carpetaDigitalServicio');

(async ()=>{
  try{
    const r = await obtenerCarpetaDigitalServicio('prop_1');
    console.log('RESULT:', JSON.stringify(r, null, 2));
  }catch(e){
    console.error('ERRORCALL:', e);
  }
})();