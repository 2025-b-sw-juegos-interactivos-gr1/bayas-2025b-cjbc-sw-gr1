# bayas-2025b-cjbc-sw-gr1

Proyecto de ejemplo para usar Babylon.js con assets locales (texturas, modelos).

Estructura mínima generada:

- `index.html` — ejemplo de página que carga Babylon.js desde CDN y `src/scene.js`.
- `src/scene.js` — código de escena adaptado para cargar texturas desde `assets/textures/`.
- `package.json` — script `start` que usa `npx http-server` para servir la carpeta en el puerto 8080.

Dónde colocar tus assets:

  - Coloca las texturas en `assets/textures/` (por ejemplo `cesped.jpg`, `lines.png`, `ball.png`, `stand.jpg`).

Cómo ejecutar localmente (Windows PowerShell):

1. Instala dependencias (opcional si usarás `npx` directamente):

```powershell
npm install
```

2. Inicia el servidor (usa `npm run start` o `npx http-server`):

```powershell
npm run start
# o, sin instalar dependencias:
npx http-server -c-1 . -p 8080
```

3. Abre en tu navegador:

  http://localhost:8080

Notas rápidas:

- El ejemplo usa rutas relativas como `assets/textures/grass.jpg` — eso requiere que sirvas los archivos por HTTP (no abrír `index.html` con file://).
- Para modelos glTF usa `BABYLON.SceneLoader.ImportMesh` y coloca los archivos `.gltf/.glb` y texturas en una carpeta accesible. Si necesitas, te doy un ejemplo de carga glTF.
- Si prefieres usar bundlers/ESM imports en vez de CDN, puedo convertir el ejemplo a un proyecto con Vite/parcel/webpack.
# bayas-2025b-cjbc-sw-gr1
Carlos Julio Bayas Chaves cjbc
- Hola mundo 