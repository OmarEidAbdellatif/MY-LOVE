import { handleUpload } from '@vercel/blob/client';
import { createHash } from 'node:crypto';

export function authorizeUpload(pathname, clientPayload, secret = process.env.UPLOAD_PASSWORD) {
 const cleanSecret = String(secret || '').trim();
 if (!cleanSecret || cleanSecret.length < 12) throw new Error('Las subidas aún no están activadas.');
 let supplied = '';
 try {
  if (typeof clientPayload === 'string') {
   supplied = JSON.parse(clientPayload).password || '';
  } else if (clientPayload && typeof clientPayload === 'object') {
   supplied = clientPayload.password || '';
  }
 } catch {}
 const cleanSupplied = String(supplied || '').trim();
 if (cleanSupplied.length > 300) throw new Error('Clave incorrecta.');
 const digest = s => createHash('sha256').update(String(s)).digest('hex');
 if (digest(cleanSupplied) !== digest(cleanSecret)) throw new Error('Clave incorrecta.');
 const photo = /^photos\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(pathname);
 if (!photo && !/^songs\/[a-z0-9-]+\.(mp3|m4a|wav|ogg|aac|flac)$/i.test(pathname)) throw new Error('Archivo no permitido.');
 return {
  allowedContentTypes: photo ? ['image/jpeg', 'image/png', 'image/webp'] : ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/aac', 'audio/flac'],
  maximumSizeInBytes: (photo ? 10 : 15) * 1024 * 1024,
  addRandomSuffix: true,
  allowOverwrite: false,
  validUntil: Date.now() + 15 * 60 * 1000
 };
}


async function parseReqBody(req) {
 if (req.body) {
  if (typeof req.body === 'string') {
   try { return JSON.parse(req.body); } catch { return req.body; }
  }
  return req.body;
 }
 if (typeof req.json === 'function') {
  try { return await req.json(); } catch {}
 }
 return new Promise((resolve) => {
  let data = '';
  if (typeof req.on !== 'function') return resolve({});
  req.on('data', chunk => { data += chunk; });
  req.on('end', () => {
   try { resolve(JSON.parse(data)); } catch { resolve({}); }
  });
  req.on('error', () => resolve({}));
 });
}

export default async function handler(req, res) {
 if (req.method !== 'POST') {
  if (res.status) return res.status(405).json({ error: 'Método no permitido' });
  return Response.json({ error: 'Método no permitido' }, { status: 405 });
 }
 if (!process.env.BLOB_READ_WRITE_TOKEN) {
  if (res.status) return res.status(503).json({ error: 'Activa el almacenamiento de música para subir archivos.' });
  return Response.json({ error: 'Activa el almacenamiento de música para subir archivos.' }, { status: 503 });
 }
 try {
  const body = await parseReqBody(req);
  const jsonResponse = await handleUpload({
   body,
   request: req,
   onBeforeGenerateToken: async (pathname, payload) => authorizeUpload(pathname, payload),
   onUploadCompleted: async () => {}
  });
  if (res.status) return res.status(200).json(jsonResponse);
  return Response.json(jsonResponse);
 } catch (error) {
  if (res.status) return res.status(400).json({ error: error.message || 'No se pudo subir la foto o canción.' });
  return Response.json({ error: error.message || 'No se pudo subir la foto o canción.' }, { status: 400 });
 }
}



