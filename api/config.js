export default function handler(){return Response.json({musicUploadsEnabled:Boolean(process.env.BLOB_READ_WRITE_TOKEN&&process.env.UPLOAD_PASSWORD?.length>=12)},{headers:{'Cache-Control':'no-store'}})}

