import {upload} from '@vercel/blob/client';
import './photos.js';
const $=s=>document.querySelector(s),song=$('#song'),player=$('#music-player');
const localDemoMode=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
let songURL='',songName='',uploadBusy=false;
function safeAudioURL(value){try{const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)return '';return url.href}catch{return ''}}
function dataUrlFromFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('No se pudo leer el archivo de audio.'));reader.readAsDataURL(file)})}
window.preserveSong=p=>{if(songURL){p.set('audio',songURL);p.set('track',songName)}};
function updateURL(){const p=new URLSearchParams(location.hash.slice(1)||location.search);p.delete('audio');p.delete('track');window.preserveSong(p);window.preservePhotos?.(p);history.replaceState(null,'',location.pathname+(p.size?'?'+p:''))}
function showSong(url,name){const safe=localDemoMode?url:safeAudioURL(url);if(!safe)throw new Error('Usa un enlace HTTPS válido a un archivo de audio.');song.pause();songURL=safe;songName=name.slice(0,150);song.src=safe;song.load();$('#track-title').textContent=songName;player.hidden=false;$('#remove-song').hidden=false;$('#track-state').textContent='Toca para escuchar'}
song.volume=.7;
$('#volume').addEventListener('input',e=>song.volume=Number(e.target.value));
async function play(){if(!songURL)return;$('#track-state').textContent='Cargando…';try{await song.play()}catch{$('#track-state').textContent='Toca ▶ para escuchar o reintentar.'}}
window.playGiftMusic=play;
$('#music-toggle').addEventListener('click',()=>song.paused?play():song.pause());
song.addEventListener('playing',()=>{$('#music-toggle').textContent='Ⅱ';$('#music-toggle').setAttribute('aria-label','Pausar canción');$('#track-state').textContent='Sonando para ti ♫'});
song.addEventListener('pause',()=>{$('#music-toggle').textContent='▶';$('#music-toggle').setAttribute('aria-label','Reproducir canción');$('#track-state').textContent='En pausa'});
song.addEventListener('error',()=>{if(songURL)$('#track-state').textContent='Audio no disponible. Revisa el enlace o prueba un MP3.'});
$('#song-file').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file||uploadBusy||window.photosUploading)return;
 const status=$('#upload-status'),submit=$('#customize .primary'),ext=file.name.split('.').pop().toLowerCase();
 const types={mp3:'audio/mpeg',m4a:'audio/mp4',wav:'audio/wav',ogg:'audio/ogg',aac:'audio/aac',flac:'audio/flac'};
 if(file.size>15*1024*1024||!file.size){status.textContent='Elige una canción de entre 1 byte y 15 MB.';e.target.value='';return}
 if(!Object.hasOwn(types,ext)){status.textContent='Elige un archivo MP3, M4A, WAV, OGG, AAC o FLAC.';e.target.value='';return}
 const password=$('#upload-password').value;
 if(!password && !localDemoMode){status.textContent='Escribe tu clave para subir música.';e.target.value='';$('#upload-password').focus();return}
 uploadBusy=true;window.musicUploading=true;e.target.disabled=true;submit.disabled=true;$('#remove-song').disabled=true;status.textContent=localDemoMode ? 'Guardando tu canción en modo local…' : 'Subiendo tu canción…';
 try{
 if(localDemoMode){const dataURL=await dataUrlFromFile(file);showSong(dataURL,file.name);updateURL();status.textContent='Canción guardada en modo local. El enlace compartido incluirá esta música.';}else{const blob=await upload('songs/'+crypto.randomUUID()+'.'+ext,file,{access:'public',contentType:types[ext],handleUploadUrl:'/api/upload',clientPayload:JSON.stringify({password}),onUploadProgress:({percentage})=>status.textContent='Subiendo tu canción… '+Math.round(percentage)+' %'});showSong(blob.url,file.name);updateURL();status.textContent='Canción guardada. El enlace compartido incluirá esta música.';}
 }catch(error){status.textContent='No se pudo subir: '+(error.message||'revisa tu conexión y vuelve a intentar.')}
 finally{uploadBusy=false;window.musicUploading=false;e.target.disabled=false;submit.disabled=false;$('#remove-song').disabled=false;e.target.value=''}
});
$('#use-audio-url').addEventListener('click',()=>{try{showSong($('#audio-url').value.trim(),'Nuestra canción');updateURL();$('#upload-status').textContent='Audio añadido. Pulsa ▶ para comprobarlo antes de compartir.'}catch(error){$('#upload-status').textContent=error.message}});
$('#remove-song').addEventListener('click',()=>{song.pause();songURL='';songName='';song.removeAttribute('src');song.load();player.hidden=true;$('#remove-song').hidden=true;$('#audio-url').value='';updateURL();$('#upload-status').textContent='Canción quitada de esta dedicatoria.'});
const p=new URLSearchParams(location.hash.slice(1)||location.search);if(safeAudioURL(p.get('audio')))showSong(p.get('audio'),p.get('track')||'Nuestra canción');
if(new URLSearchParams(location.search).get('share')!=='1'){if(localDemoMode){$('#upload-status').textContent='Modo local activo: puedes subir fotos y música desde este navegador.';}else fetch('/api/config').then(r=>r.json()).then(({musicUploadsEnabled})=>{if(!musicUploadsEnabled)$('#upload-status').textContent='Las subidas aún no están activadas. Puedes usar un enlace de audio.'}).catch(()=>{$('#upload-status').textContent='Para subir archivos, abre la web publicada en Vercel. También puedes usar un enlace de audio.'});}

