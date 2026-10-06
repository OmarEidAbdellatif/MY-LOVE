import { put } from '@vercel/blob';
import { handleUpload } from '@vercel/blob/client';
import { createHash } from 'node:crypto';

export function authorizeUpload(pathname, password, secret = process.env.UPLOAD_PASSWORD) {
 const cleanSecret = String(secret || '').trim();
 if (!cleanSecret || cleanSecret.length < 12) throw new Error('Uploads are not enabled yet.');
 const cleanSupplied = String(password || '').trim();
 if (cleanSupplied.length > 300) throw new Error('Incorrect key.');
 const digest = s => createHash('sha256').update(String(s)).digest('hex');
 if (digest(cleanSupplied) !== digest(cleanSecret)) throw new Error('Incorrect key.');
 const photo = /^photos\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(pathname);
 if (!photo && !/^songs\/[a-z0-9-]+\.(mp3|m4a|wav|ogg|aac|flac)$/i.test(pathname)) throw new Error('File type not allowed.');
 return { photo };
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
  if (res.status) return res.status(405).json({ error: 'Method not allowed' });
  return Response.json({ error: 'Method not allowed' }, { status: 405 });
 }
 if (!process.env.BLOB_READ_WRITE_TOKEN) {
  if (res.status) return res.status(503).json({ error: 'Please enable Vercel Blob storage to upload files.' });
  return Response.json({ error: 'Please enable Vercel Blob storage to upload files.' }, { status: 503 });
 }
 try {
  const body = await parseReqBody(req);
  if (body && (body.action === 'direct' || body.fileData)) {
   const { filename, password, contentType, fileData } = body;
   authorizeUpload(filename, password);
   let buffer;
   if (typeof fileData === 'string' && fileData.includes(',')) {
    buffer = Buffer.from(fileData.split(',')[1], 'base64');
   } else if (typeof fileData === 'string') {
    buffer = Buffer.from(fileData, 'base64');
   } else {
    throw new Error('Invalid file format.');
   }
   let blob;
   try {
    blob = await put(filename, buffer, {
     access: 'public',
     contentType: contentType || 'image/jpeg',
     token: process.env.BLOB_READ_WRITE_TOKEN
    });
   } catch (err) {
    if (err.message && (err.message.includes('private store') || err.message.includes('Private'))) {
     blob = await put(filename, buffer, {
      access: 'private',
      contentType: contentType || 'image/jpeg',
      token: process.env.BLOB_READ_WRITE_TOKEN
     });
    } else {
     throw err;
    }
   }
   const responseData = { url: blob.url };
   if (res.status) return res.status(200).json(responseData);
   return Response.json(responseData);
  }
  const jsonResponse = await handleUpload({
   body,
   request: req,
   onBeforeGenerateToken: async (pathname, payload) => {
    let supplied = '';
    try {
     if (typeof payload === 'string') supplied = JSON.parse(payload).password || '';
     else if (payload && typeof payload === 'object') supplied = payload.password || '';
    } catch {}
    authorizeUpload(pathname, supplied);
    return {
     allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/aac', 'audio/flac'],
     maximumSizeInBytes: 25 * 1024 * 1024,
     addRandomSuffix: true,
     allowOverwrite: false,
     validUntil: Date.now() + 15 * 60 * 1000
    };
   },
   onUploadCompleted: async () => {}
  });
  if (res.status) return res.status(200).json(jsonResponse);
  return Response.json(jsonResponse);
 } catch (error) {
  if (res.status) return res.status(400).json({ error: error.message || 'Could not upload file.' });
  return Response.json({ error: error.message || 'Could not upload file.' }, { status: 400 });
 }
}




