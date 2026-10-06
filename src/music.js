import {upload} from '@vercel/blob/client';
import './photos.js';
const $=s=>document.querySelector(s),song=$('#song'),player=$('#music-player');
const localDemoMode=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
let songURL='',songName='',uploadBusy=false;
function safeAudioURL(value){try{const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)return '';return url.href}catch{return ''}}
function dataUrlFromFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Could not read audio file.'));reader.readAsDataURL(file)})}
window.preserveSong=p=>{if(songURL){p.set('audio',songURL);p.set('track',songName)}};
function updateURL(){const p=new URLSearchParams(location.hash.slice(1)||location.search);p.delete('audio');p.delete('track');window.preserveSong(p);window.preservePhotos?.(p);history.replaceState(null,'',location.pathname+(p.size?'?'+p:''))}
function showSong(url,name){const safe=localDemoMode?url:safeAudioURL(url);if(!safe)throw new Error('Use a valid HTTPS link to an audio file.');song.pause();songURL=safe;songName=name.slice(0,150);song.src=safe;song.load();$('#track-title').textContent=songName;player.hidden=false;$('#remove-song').hidden=false;$('#track-state').textContent='Tap to listen'}
song.volume=.7;
$('#volume').addEventListener('input',e=>song.volume=Number(e.target.value));
async function play(){if(!songURL)return;$('#track-state').textContent='Loading…';try{await song.play()}catch{$('#track-state').textContent='Tap ▶ to listen or retry.'}}
window.playGiftMusic=play;
$('#music-toggle').addEventListener('click',()=>song.paused?play():song.pause());
song.addEventListener('playing',()=>{$('#music-toggle').textContent='Ⅱ';$('#music-toggle').setAttribute('aria-label','Pause song');$('#track-state').textContent='Playing for you ♫'});
song.addEventListener('pause',()=>{$('#music-toggle').textContent='▶';$('#music-toggle').setAttribute('aria-label','Play song');$('#track-state').textContent='Paused'});
song.addEventListener('error',()=>{if(songURL)$('#track-state').textContent='Audio unavailable. Check the link or try an MP3.'});
async function uploadSongDirect(file, ext, contentType, password) {
 const dataURL = await dataUrlFromFile(file);
 const response = await fetch('/api/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
   action: 'direct',
   filename: 'songs/' + crypto.randomUUID() + '.' + ext,
   contentType,
   fileData: dataURL,
   password
  })
 });
 const data = await response.json();
 if (!response.ok || data.error) {
  throw new Error(data.error || 'Could not upload song.');
 }
 return data.url;
}

async function uploadSong(file, ext, contentType, password) {
 if (file.size <= 3 * 1024 * 1024) {
  try {
   return await uploadSongDirect(file, ext, contentType, password);
  } catch (e) {
   console.warn('Direct upload fallback:', e);
  }
 }
 const blob = await upload('songs/' + crypto.randomUUID() + '.' + ext, file, {
  access: 'public',
  contentType,
  handleUploadUrl: '/api/upload',
  clientPayload: JSON.stringify({ password }),
  onUploadProgress: ({ percentage }) => {
   const status = $('#upload-status');
   if (status) status.textContent = 'Uploading song… ' + Math.round(percentage) + ' %';
  }
 });
 return blob.url;
}

$('#song-file').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file||uploadBusy||window.photosUploading)return;
 const status=$('#upload-status'),submit=$('#customize .primary'),ext=file.name.split('.').pop().toLowerCase();
 const types={mp3:'audio/mpeg',m4a:'audio/mp4',wav:'audio/wav',ogg:'audio/ogg',aac:'audio/aac',flac:'audio/flac'};
 if(file.size>15*1024*1024||!file.size){status.textContent='Choose a song up to 15 MB.';e.target.value='';return}
 if(!Object.hasOwn(types,ext)){status.textContent='Choose an MP3, M4A, WAV, OGG, AAC or FLAC file.';e.target.value='';return}
 const password=$('#upload-password').value;
 if(!password && !localDemoMode){status.textContent='Enter your upload key to upload music.';e.target.value='';$('#upload-password').focus();return}
 uploadBusy=true;window.musicUploading=true;e.target.disabled=true;submit.disabled=true;$('#remove-song').disabled=true;status.textContent=localDemoMode ? 'Saving song in local mode…' : 'Uploading song…';
 try{
 if(localDemoMode){const dataURL=await dataUrlFromFile(file);showSong(dataURL,file.name);updateURL();status.textContent='Song saved in local mode.';}else{const songUrl=await uploadSong(file,ext,types[ext],password);showSong(songUrl,file.name);updateURL();status.textContent='Song saved successfully.';}
 }catch(error){status.textContent='Upload failed: '+(error.message||'Check your connection and try again.')}
 finally{uploadBusy=false;window.musicUploading=false;e.target.disabled=false;submit.disabled=false;$('#remove-song').disabled=false;e.target.value=''}
});
$('#use-audio-url').addEventListener('click',()=>{try{showSong($('#audio-url').value.trim(),'Our Song');updateURL();$('#upload-status').textContent='Audio added. Tap ▶ to test before sharing.'}catch(error){$('#upload-status').textContent=error.message}});
$('#remove-song').addEventListener('click',()=>{song.pause();songURL='';songName='';song.removeAttribute('src');song.load();player.hidden=true;$('#remove-song').hidden=true;$('#audio-url').value='';updateURL();$('#upload-status').textContent='Song removed.'});
const p=new URLSearchParams(location.hash.slice(1)||location.search);if(safeAudioURL(p.get('audio')))showSong(p.get('audio'),p.get('track')||'Our Song');
if(new URLSearchParams(location.search).get('share')!=='1'){if(localDemoMode){$('#upload-status').textContent='Local mode active: you can add photos and music.';}else fetch('/api/config').then(r=>r.json()).then(({musicUploadsEnabled})=>{if(!musicUploadsEnabled)$('#upload-status').textContent='Uploads are not enabled yet. You can use an audio link.'}).catch(()=>{$('#upload-status').textContent='To upload files, open the published Vercel website.'});}


