import { handleUpload } from '@vercel/blob/client';
import { createHash, timingSafeEqual } from 'node:crypto';
export function authorizeUpload(pathname,clientPayload,secret=process.env.UPLOAD_PASSWORD){
 if(!secret||secret.length<12)throw new Error('Las subidas aún no están activadas.');
 let supplied='';try{supplied=JSON.parse(clientPayload||'{}').password||''}catch{}
 if(typeof supplied!=='string'||supplied.length>300)throw new Error('Clave incorrecta.');
 const digest=s=>createHash('sha256').update(s).digest();
 if(!timingSafeEqual(digest(supplied),digest(secret)))throw new Error('Clave incorrecta.');
 const photo=/^photos\/[a-z0-9-]+\.(jpg|png|webp)$/.test(pathname);
 if(!photo&&!/^songs\/[a-z0-9-]+\.(mp3|m4a|wav|ogg|aac|flac)$/.test(pathname))throw new Error('Archivo no permitido.');
 return {allowedContentTypes:photo?['image/jpeg','image/png','image/webp']:['audio/mpeg','audio/mp4','audio/wav','audio/x-wav','audio/ogg','audio/aac','audio/flac'],maximumSizeInBytes:(photo?4:15)*1024*1024,addRandomSuffix:true,allowOverwrite:false,validUntil:Date.now()+15*60*1000};
}
export default async function handler(request){
 if(request.method!=='POST')return Response.json({error:'Método no permitido'},{status:405});
 if(!process.env.BLOB_READ_WRITE_TOKEN)return Response.json({error:'Activa el almacenamiento de música para subir archivos.'},{status:503});
 try{
 const body=await request.json();
 const result=await handleUpload({body,request,onBeforeGenerateToken:async(pathname,payload)=>authorizeUpload(pathname,payload),onUploadCompleted:async()=>{}});
 return Response.json(result);
 }catch(error){return Response.json({error:error.message||'No se pudo subir la canción.'},{status:400})}
}

