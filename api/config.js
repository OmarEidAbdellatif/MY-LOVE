export default function handler(req, res) {
 const data = { musicUploadsEnabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN && process.env.UPLOAD_PASSWORD?.length >= 12) };
 if (res && res.setHeader && res.status) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(data);
 }
 return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

