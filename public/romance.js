(()=>{
const $=s=>document.querySelector(s),params=new URLSearchParams(location.hash.slice(1)||location.search),recipient=new URLSearchParams(location.search).get('share')==='1';
const sender=$('#sender'),nameField=$('#name'),letterField=$('#letter'),sparklesField=$('#sparkles-enabled'),letterHeading=$('#letter-heading'),letterBody=$('#letter-body'),letterSignature=$('#letter-signature'),openLetter=$('#open-letter'),giftCover=$('#gift-cover'),giftName=$('#gift-name'),app=$('#app'),currentLang=(window.currentLanguage||document.documentElement.lang||'ar');
if(params.has('from')&&sender) sender.value=params.get('from').slice(0,40);
if(params.has('letter')&&letterField) letterField.value=params.get('letter').slice(0,1200);
if(sparklesField) sparklesField.checked=params.get('sparkles')!=='0';
function refresh(){
  if(document.body) document.body.classList.remove('no-flowers');
  if(letterHeading){
    const targetName=(nameField&&nameField.value.trim()) || (currentLang==='ar' ? 'أنتِ' : 'you');
    letterHeading.textContent=(currentLang==='ar' ? 'لكِ ' : 'For ') + targetName;
  }
  if(letterBody) letterBody.textContent=(letterField&&letterField.value) || '';
  if(letterSignature) letterSignature.textContent=(sender&&sender.value) ? ((currentLang==='ar' ? 'بكل حبي، ' : 'With love, ') + sender.value) : (currentLang==='ar' ? 'بكل حبي' : 'With all my love');
  if(openLetter) openLetter.hidden=!((letterField&&letterField.value.trim()) || '');
}
window.preserveRomance=p=>{if(sender) p.set('from',sender.value.trim());if(letterField) p.set('letter',letterField.value);if(sparklesField) p.set('sparkles',sparklesField.checked?'1':'0');window.preservePhotos?.(p);refresh()};
if($('#customize')) $('#customize').addEventListener('submit',refresh);
if(openLetter) openLetter.addEventListener('click',()=>{refresh();const modal=$('#love-letter'); if(modal&&typeof modal.showModal==='function') modal.showModal()});
const closeLetter=$('#close-letter'); if(closeLetter) closeLetter.addEventListener('click',()=>{const modal=$('#love-letter'); if(modal&&typeof modal.close==='function') modal.close()});
const loveLetter=$('#love-letter'); if(loveLetter) loveLetter.addEventListener('click',e=>{if(e.target===loveLetter){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
const details=Array.from({length:innerWidth<700?12:23},(_,i)=>({x:Math.random(),y:Math.random(),size:12+Math.random()*13,speed:5+Math.random()*9,phase:i}));
window.drawRomanticDetails=(ctx,w,h,time,project)=>{window.drawOrbitPhotos?.(ctx,w,h,time,project);if(!sparklesField||!sparklesField.checked)return;ctx.save();ctx.globalCompositeOperation='source-over';ctx.textAlign='center';for(const p of details){const y=(p.y*h-time*p.speed+h*100)%h,x=p.x*w+Math.sin(time*.3+p.phase)*15;ctx.fillStyle=p.phase%3?'rgba(247,176,185,.28)':'rgba(248,209,133,.42)';ctx.font=p.size+'px Georgia';ctx.fillText(p.phase%3?'♡':'✦',x,y)}ctx.restore()};
function giftURL(){if(window.musicUploading||window.photosUploading)throw new Error(currentLang==='ar' ? 'انتظر حتى تنتهي عمليات رفع الموسيقى والصور.' : 'Wait for the song and photo uploads to finish.');window.saveDedication();const url=new URL(location.href);const state=new URLSearchParams(url.search);state.delete('share');state.delete('song');url.search='?share=1';url.hash=state.toString();if(url.protocol==='file:')throw new Error(currentLang==='ar' ? 'انشر الصفحة في Vercel لإنشاء رابط قابل للإرسال.' : 'Publish the page on Vercel to create a shareable link.');return url.href}
function fallback(url){const field=$('#share-url'); if(field){field.hidden=false;field.value=url;field.focus();field.select();} const status=$('#share-status'); if(status) status.textContent=currentLang==='ar' ? 'احتفظ بالرابط وحدد نسخ.' : 'Hold the link and choose Copy.';}
async function copy(url){try{await navigator.clipboard.writeText(url);const status=$('#share-status'); if(status) status.textContent=currentLang==='ar' ? 'تم نسخ الرابط. يمكنك إرساله الآن.' : 'Link copied. You can send it now.'}catch{fallback(url)}}
const shareButton=$('#share'); if(shareButton){shareButton.addEventListener('click',async()=>{try{const url=giftURL();if(navigator.share){try{await navigator.share({title:'A universe for you',text:'I have a surprise for you 💛',url});const status=$('#share-status'); if(status) status.textContent=currentLang==='ar' ? 'جاهز للمشاركة.' : 'Dedication ready to share.'}catch(e){if(e.name!=='AbortError')await copy(url)}}else await copy(url)}catch(e){const status=$('#share-status'); if(status) status.textContent=e.message}})}
const copyLinkButton=$('#copy-link'); if(copyLinkButton){copyLinkButton.addEventListener('click',async()=>{try{await copy(giftURL())}catch(e){const status=$('#share-status'); if(status) status.textContent=e.message}})}
const previewGiftButton=$('#preview-gift'); if(previewGiftButton){previewGiftButton.addEventListener('click',()=>{try{window.open(giftURL(),'_blank','noopener,noreferrer')}catch(e){const status=$('#share-status'); if(status) status.textContent=e.message}})}
if(recipient){document.documentElement.classList.add('recipient-mode');if(app) app.classList.add('immersive');if(document.body) document.body.classList.remove('editing');if(giftName) giftName.textContent=params.get('name')?.slice(0,24)||'you';if(giftCover) giftCover.hidden=false;if(app) app.inert=true;if(document.body) document.body.classList.add('gift-closed');const openGift=$('#open-gift'); if(openGift){openGift.focus({preventScroll:true});openGift.addEventListener('click',()=>{if(giftCover) giftCover.hidden=true;if(app) app.inert=false;if(document.body) document.body.classList.remove('gift-closed');window.playGiftMusic?.();const letterButton=$('#open-letter'); if(letterButton) letterButton.focus({preventScroll:true})})}}
refresh();
})();

