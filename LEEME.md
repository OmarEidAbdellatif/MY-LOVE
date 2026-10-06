# Para ti · Galaxia romántica para Vercel

Proyecto preparado para Vercel. Incluye nombre formado por partículas 3D, corazón y flor, rosas realistas, corazones flotantes, carta personal, música, hasta 6 fotos orbitando en 3D y enlaces de dedicatoria.

## 1. Publicar la página

1. Descomprime `para-ti-vercel.zip`.
2. Crea un repositorio en GitHub y sube **el contenido de la carpeta**, incluyendo `package.json`, `package-lock.json`, `vercel.json`, `public`, `src`, `api` y `build.mjs`. No subas el ZIP como único archivo.
3. En Vercel elige **Add New → Project** e importa ese repositorio.
4. Usa **Framework Preset: Other**. La carpeta raíz debe ser donde está `package.json`.
5. El proyecto ya configura **Build Command: npm run build** y **Output Directory: public**.
6. Publica y abre la dirección de producción que Vercel te asigne.

No necesitas Supabase ni Cloudflare. No se incluyen contraseñas o credenciales reales. Este paquete no está publicado en tu cuenta: hay que importarlo.

Para que ella pueda abrir el enlace sin una cuenta, usa la dirección de **producción** y comprueba que Deployment Protection no exija inicio de sesión para esa dirección. Prueba el enlace desde una ventana de incógnito antes de enviarlo.

## 2. Crear y enviar una dedicatoria

1. Abre tu página publicada y toca **Personalizar**.
2. Escribe el nombre, dedicatoria, frases, firma y carta.
3. Elige el color y activa o desactiva las flores y los corazones.
4. Añade música si quieres.
5. Agrega hasta 6 fotos en **Nuestros recuerdos**.
6. Pulsa **Compartir dedicatoria** para abrir el menú de compartir del teléfono, o **Copiar enlace**.
7. Envíalo por WhatsApp u otra aplicación.

El enlace conserva el nombre, carta, color, detalles florales, fotos y dirección de la canción. Los datos personalizados viajan en el fragmento del enlace, después de #; al copiarlo, conserva la dirección completa. Quien lo abre ve una pantalla de sorpresa y luego la animación, sin el editor. El sonido empieza al tocar **Abrir mi sorpresa**, si el navegador lo permite; siempre queda disponible el botón ▶.

**Importante:** después de cambiar la dedicatoria, crea y envía el nuevo enlace. Los enlaces ya enviados conservan los textos originales; no hay una base de datos que reescriba enlaces anteriores. Cualquier persona con el enlace puede ver la dedicatoria. La carta y el nombre forman parte de ese enlace.

## 3. Música: dos opciones

### Opción A: enlace directo de audio

En Personalizar, abre **O usar un enlace de audio** y pega una dirección HTTPS pública de un archivo MP3, M4A u otro audio que el navegador reproduzca. Pulsa **Usar este audio** y comprueba con ▶ antes de compartir.

Debe apuntar al archivo, no a una página de YouTube, Spotify, Google Drive o una página con inicio de sesión. El archivo debe seguir disponible para que el enlace compartido pueda reproducirlo.

Esta opción no requiere activar almacenamiento en Vercel.

### Opción B: subir una canción desde el teléfono

1. En el proyecto de Vercel, abre **Storage** y crea/conecta un almacén **Vercel Blob de acceso Public**.
2. Comprueba que el proyecto tenga la variable **BLOB_READ_WRITE_TOKEN** en Production.
3. En **Settings → Environment Variables**, añade **UPLOAD_PASSWORD** con una clave propia de al menos 12 caracteres. Es la clave que usarás para subir canciones; no se entrega a quien recibe la dedicatoria.
4. Haz **Redeploy** para aplicar las variables.
5. En la página, escribe esa clave en **Clave para subir música**, toca **Elegir una canción** y espera a que termine la subida.
6. Comprueba que suene y comparte el enlace.

El tamaño máximo es **15 MB**. Los archivos se suben directamente a Blob; no pasan por el límite de tamaño del cuerpo de las funciones de Vercel. La clave se verifica en el servidor y no se guarda en el enlace. El audio subido es público por enlace.

Formatos admitidos: MP3, M4A, WAV, OGG, AAC y FLAC. La compatibilidad depende del navegador; **MP3 es la opción más práctica entre teléfonos**.

Quitar una canción de una dedicatoria no borra el archivo de Blob, para no romper enlaces anteriores. Puedes eliminar archivos desde Storage cuando ya no se necesiten. Al trasladarte desde la versión anterior, vuelve a subir las canciones: sus archivos no se migran automáticamente.

## 4. Agregar fotos

- Puedes subir hasta **6 fotos** JPG, PNG o WebP de **10 MB** por archivo. Se optimizan en el teléfono antes de enviarse.
- Las fotos usan el mismo almacén público de Vercel Blob y la misma **UPLOAD_PASSWORD** que la música.
- También puedes pegar un enlace HTTPS directo de imagen, sin configurar Blob.
- Las fotos flotan alrededor del corazón y viajan en el enlace de la dedicatoria.
- Puedes quitar una foto con ×. Eso no borra el archivo de Blob ni cambia enlaces que ya enviaste.
- Las fotos subidas se sirven mediante URL pública; no subas imágenes que no quieras compartir con quien tenga la dirección.

## 5. Comprobaciones antes de enviarlo

- Abre el enlace en incógnito y verifica que no solicite acceso.
- Revisa el nombre y abre la carta.
- Toca la sorpresa y comprueba la canción.
- Prueba en el teléfono de destino cuando sea posible.

La versión móvil reduce partículas, limita resolución de dibujo y frecuencia de actualización, respeta movimiento reducido y detiene el dibujo al ocultar la pestaña. Las flores usan una imagen WebP de aproximadamente 135 KB.

## Desarrollo y validación

- Instalar dependencias: `npm ci`
- Preparar la web: `npm run build`
- Ejecutar comprobaciones: `npm test`
- Para probar funciones en el entorno de Vercel: `npx vercel dev`

Las pruebas del proyecto comprueban generación del enlace, preservación de textos, fotos y música, vista de destinataria y autorización de subida. La carga real en Blob se comprueba después de conectar tu propio almacén. No se ha probado en un teléfono físico.

## Fuentes técnicas

- [Vercel Blob: configuración y SDK](https://vercel.com/docs/vercel-blob/using-blob-sdk)
- [Subidas desde el cliente y autorización](https://vercel.com/docs/vercel-blob/client-upload)
- [Protección de despliegues](https://vercel.com/docs/deployment-protection)

La imagen floral fue generada para esta página. No se incluyen canciones.

