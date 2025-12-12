# Backend (corredores_app/backend)

Instrucciones rápidas para ejecutar el servidor localmente:

1. Copia el ejemplo de variables de entorno:

```bash
cp .env.example .env
# o edita .env manualmente y coloca tus valores reales
```

2. Rellena `SUPABASE_SERVICE_ROLE_KEY` con la clave de servicio desde tu proyecto Supabase.

3. Instala dependencias e inicia el servidor:

```bash
cd backend
npm install
npm run dev
```

4. Prueba endpoints:

```bash
curl http://localhost:4000/api/clientes
curl http://localhost:4000/api/propiedades
curl http://localhost:4000/api/carpeta-digital/test
```

Seguridad: si ya subiste una clave real al repositorio, rótala (genera una nueva en Supabase) y elimina la anterior. No compartas la `SERVICE_ROLE_KEY` en público.
