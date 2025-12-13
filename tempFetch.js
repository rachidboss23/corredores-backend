const http = require('http');
const url = 'http://localhost:4000/api/carpeta-digital/prop_1';
http.get(url, (res) => {
  let d = '';
  res.on('data', (c) => d += c);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    try { console.log('BODY', JSON.parse(d)); }
    catch(e){ console.log('BODY_RAW', d); }
    process.exit(0);
  });
}).on('error', (err) => { console.error('REQ_ERR', err); process.exit(1); });
