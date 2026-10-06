import {upload} from '@vercel/blob/client';
const $=s=>document.querySelector(s);
const MAX=10;
const localDemoMode=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
let photos=[];
const initial=new URLSearchParams(location.hash.slice(1)||location.search);
function validURL(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&u.href.length<2200?u.href:''}catch{return ''}}
function toDataURL(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('No se pudo preparar el archivo.'));reader.readAsDataURL(blob)})}
function preparePhoto(data){const item={url:data.url,name:String(data.name||'Nuestro recuerdo').slice(0,80),ready:false,failed:false};const img=new Image();img.decoding='async';img.onload=()=>item.ready=true;img.onerror=()=>{item.failed=true;$('#photo-status').textContent='Una foto no pudo cargarse. Revisa su enlace.';if(new URLSearchParams(location.search).get('share')==='1')$('.gesture').textContent='Una foto no está disponible. Las demás siguen aquí.'};img.src=item.url;item.img=img;return item}
try{const values=JSON.parse(initial.get('photos')||'[]');if(Array.isArray(values))photos=values.slice(0,MAX).filter(x=>x&&validURL(x.url)).map(preparePhoto)}catch{}
window.preservePhotos=p=>{if(photos.length)p.set('photos',JSON.stringify(photos.map(({url,name})=>({url,name}))));else p.delete('photos')};
function persist(){const p=new URLSearchParams(location.hash.slice(1)||location.search);window.preservePhotos(p);window.preserveSong?.(p);history.replaceState(null,'',location.pathname+'?'+p)}
function render(){const list=$('#photo-list');list.replaceChildren();photos.forEach((photo,index)=>{const card=document.createElement('div');card.className='photo-card';const img=document.createElement('img');img.src=photo.url;img.alt=photo.name;const button=document.createElement('button');button.type='button';button.textContent='×';button.setAttribute('aria-label','Quitar foto '+(index+1));button.addEventListener('click',()=>{photos.splice(index,1);render();persist();$('#photo-status').textContent='Foto quitada de esta dedicatoria.'});card.append(img,button);list.append(card)})}
async function compress(file){
 const objectURL=URL.createObjectURL(file);
 try{
  const img=await new Promise((resolve)=>{
   const image=new Image();
   const timer=setTimeout(()=>resolve(null),4000);
   image.onload=()=>{clearTimeout(timer);resolve(image)};
   image.onerror=()=>{clearTimeout(timer);resolve(null)};
   image.src=objectURL;
  });
  if(!img) return file;
  const ratio=Math.min(1,800/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));
  canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  return await new Promise(resolve=>{
   const timer=setTimeout(()=>resolve(file),3000);
   canvas.toBlob(blob=>{clearTimeout(timer);blob?resolve(blob):resolve(file)},'image/jpeg',.75);
  });
 }catch{return file}finally{URL.revokeObjectURL(objectURL)}
}
$('#photo-files').addEventListener('change',async e=>{
 if(window.musicUploading||window.photosUploading){$('#photo-status').textContent='Espera a que termine la subida actual.';e.target.value='';return}
 const files=Array.from(e.target.files||[]),remaining=MAX-photos.length,status=$('#photo-status');
 if(!files.length)return;
 if(files.length>remaining){status.textContent='Puedes agregar '+remaining+' fotos más (máximo 10).';e.target.value='';return}
 const password=$('#upload-password').value;if(!password && !localDemoMode){status.textContent='Escribe tu clave de subida en el apartado de música.';$('#upload-password').focus();e.target.value='';return}
 window.photosUploading=true;e.target.disabled=true;let completed=0;
 try{for(const file of files){if(!['image/jpeg','image/png','image/webp'].includes(file.type)&&!file.type.startsWith('image/'))throw new Error('Usa fotos JPG, PNG o WebP de hasta 10 MB.');status.textContent='Preparando foto '+(completed+1)+' de '+files.length+'…';const optimized=await compress(file);if(localDemoMode){const dataURL=await toDataURL(optimized);photos.push(preparePhoto({url:dataURL,name:'Nuestro recuerdo '+(photos.length+1)}));completed++;render();persist();status.textContent='Foto añadida en modo local. Sigue con la siguiente.';continue}status.textContent='Subiendo foto '+(completed+1)+' de '+files.length+'…';const blob=await upload('photos/'+crypto.randomUUID()+'.jpg',optimized,{access:'public',contentType:'image/jpeg',handleUploadUrl:'/api/upload',clientPayload:JSON.stringify({password}),onUploadProgress:({percentage})=>status.textContent='Foto '+(completed+1)+' de '+files.length+' · '+Math.round(percentage)+' %'});photos.push(preparePhoto({url:blob.url,name:'Nuestro recuerdo '+(photos.length+1)}));completed++;render();persist()}status.textContent=completed+' fotos guardadas. Se incluirán en el enlace compartido.'}catch(error){status.textContent=(completed?completed+' fotos guardadas. ':'')+(error.message||'No se pudo subir la foto.')}finally{window.photosUploading=false;e.target.disabled=false;e.target.value=''}
});
$('#add-photo-url').addEventListener('click',()=>{if(photos.length>=MAX){$('#photo-status').textContent='Ya tienes 10 fotos. Quita alguna para agregar otra.';return}const url=validURL($('#photo-url').value.trim());if(!url){$('#photo-status').textContent='Escribe un enlace HTTPS directo de imagen.';return}photos.push(preparePhoto({url,name:'Nuestro recuerdo '+(photos.length+1)}));render();persist();$('#photo-url').value='';$('#photo-status').textContent='Foto añadida. Comprueba que se vea antes de compartir.'});
window.drawOrbitPhotos=(ctx,w,h,time,project)=>{
 const ready=photos.filter(p=>p.ready);const projected=ready.map((photo,i)=>{const a=time*.075+i*Math.PI*2/ready.length+.4,q=project(Math.cos(a)*200,Math.sin(a)*90,Math.sin(a)*125);return {photo,q}}).sort((a,b)=>b.q[3]-a.q[3]);
 for(const {photo,q} of projected){const width=Math.min(w*.14,76)*q[2],height=width*1.18,x=q[0]-width/2,y=q[1]-height/2;ctx.save();ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.72+Math.min(.2,q[2]*.15);ctx.shadowColor='rgba(255,183,190,.22)';ctx.shadowBlur=10;ctx.fillStyle='#f5e9d5';ctx.fillRect(x-4,y-4,width+8,height+16);ctx.shadowBlur=0;const iw=photo.img.naturalWidth,ih=photo.img.naturalHeight,target=width/height;let sx=0,sy=0,sw=iw,sh=ih;if(iw/ih>target){sw=ih*target;sx=(iw-sw)/2}else{sh=iw/target;sy=(ih-sh)/2}ctx.drawImage(photo.img,sx,sy,sw,sh,x,y,width,height);ctx.fillStyle='#896156';ctx.font='9px Georgia';ctx.textAlign='center';ctx.fillText('♡',q[0],y+height+8);ctx.restore()}
};
render();

