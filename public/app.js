'use strict';
const $=s=>document.querySelector(s),canvas=$('#galaxy'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const palette={rose:[245,166,184],red:[214,72,92],blue:[104,144,255]};
const translations={
  ar:{
    editorToggleHide:'إخفاء المحرر ↗',editorToggleShow:'تخصيص العالم ✧',headerNote:'عالم صغير، فقط لها',sceneEyebrow:'✦ كل نجم يذكرني بك',sceneTitlePrefix:'عالم خاص لـ',openLetter:'♡ رسالة لكِ',musicTrack:'أغنيتك',musicState:'اضغط للاستماع',volumeLabel:'الصوت',gesture:'✧ اسحب لاستكشاف عالمك',shapeHeart:'القلب',shapeFlower:'الزهرة',shapeName:'الاسم',autoLabel:'تلقائي',pauseLabel:'Ⅱ',littleNote:'هناك من يجعل كل شيء يلمع.',editorEyebrow:'صنعناه لكِ، لكِ',editorTitle:'صمّم عالمها',introText:'اسمكِ، كلماتكِ.\nتفصيل لا يمكن أن يكون إلا لكما.',nameLabel:'اسمها',fieldHelpName:'ستتجمع النجوم لتكتب الاسم بشكل ثلاثي الأبعاد.',messageLabel:'رسالتك',phrasesLabel:'كلمات تحيط بها',phrasesHint:'سطر في كل سطر',colorLegend:'لون عالمها',colorPink:'وردي',colorRose:'روز',colorLilac:'بنفسجي',senderLabel:'من طرف',letterLabel:'رسالة لها',flowersToggle:'ورود وزهور حولها',sparklesToggle:'قلوب ومشاعل تطفو',photoLegend:'ذكرياتنا ♡',photoHelp:'حتى 10 صور صغيرة تطفو حول القلب.',addPhotos:'إضافة صور',photoMeta:'JPG، PNG أو WebP · حتى 10 MB لكل صورة.\nاستخدم نفس المفتاح نفسه للصوت.',photoLinkSummary:'أو استخدم رابط صورة',photoUrlLabel:'رابط مباشر HTTPS للصورة',addThisPhoto:'إضافة هذه الصورة',musicLegend:'أغنيةكما ♫',uploadKeyLabel:'مفتاح رفع الصور والموسيقى',chooseSong:'اختيار أغنية',songMeta:'MP3، M4A، WAV، OGG، AAC أو FLAC · حتى 15 MB.\nيتم حفظ الأغنية مع هذه الرسالة.',audioLinkSummary:'أو استخدام رابط صوتي',audioUrlLabel:'رابط مباشر HTTPS للأغنية',useThisAudio:'استخدام هذا الصوت',audioHelp:'ملف صوتي قابل للوصول عبر الرابط، وليس صفحة YouTube أو Spotify.',removeSong:'إزالة الأغنية من هذه الرسالة',createUniverse:'إنشاء عالمها',statusReady:'كل اسم له كوكبة خاصة به.',shareButton:'مشاركة الرسالة ↗',copyLink:'نسخ الرابط',previewGift:'عرض ما ستراه',editorFooter:'تفصيل صغير. شعور كبير.',giftEyebrow:'هدية صغيرة من قلبي',giftTitle:'عيد ميلاد سعيد\nيا حبيبتي،',giftText:'أجمل الأشياء تُصنع\nلأجمل قلب.',openGift:'افتح هديتي ✧',giftNote:'اضغط لاكتشاف مفاجأتك',closeEditor:'العودة للعالم ↓',closeLetter:'إغلاق ×',letterEyebrow:'لأحب شخصيتي المفضلة',shareStatus:'',copySuccess:'تم نسخ الرابط.',shareReady:'الرسالة جاهزة للمشاركة.',saveReady:'تم تحديث العالم.',defaultName:'أنتِ',defaultMessage:'عيد ميلاد سعيد يا أحلى قلب.',giftName:'الحب',languageLabel:'اللغة',namePlaceholder:'اكتب اسمها',senderPlaceholder:'اسمك أو لقبك',uploadPasswordPlaceholder:'مفتاح صفحتك',audioUrlPlaceholder:'https://…/song.mp3',photoUrlPlaceholder:'https://…/photo.jpg',inputLetterTitle:'رسالة لها',copyLinkStatus:'تم نسخ الرابط. يمكنك إرساله الآن.'},
  en:{
    editorToggleHide:'Hide editor ↗',editorToggleShow:'Customize world ✧',headerNote:'A little universe, just for her',sceneEyebrow:'✦ EVERY STAR REMINDS ME OF YOU',sceneTitlePrefix:'A universe for',openLetter:'♡ A letter for you',musicTrack:'Your song',musicState:'Tap to listen',volumeLabel:'Volume',gesture:'✧ Drag to explore your universe',shapeHeart:'Heart',shapeFlower:'Flower',shapeName:'Name',autoLabel:'Auto',pauseLabel:'Ⅱ',littleNote:'Some people make everything glow.',editorEyebrow:'MADE FOR YOU, FOR HER',editorTitle:'Design her world',introText:'Her name, your words.\nA detail that can only belong to you two.',nameLabel:'Her name',fieldHelpName:'The stars will gather to write it in 3D.',messageLabel:'Your dedication',phrasesLabel:'Words around her',phrasesHint:'One per line',colorLegend:'Her universe color',colorPink:'Pink',colorRose:'Rose',colorLilac:'Lilac',senderLabel:'From',letterLabel:'A letter for her',flowersToggle:'Roses and flowers around',sparklesToggle:'Floating hearts and sparkles',photoLegend:'Our memories ♡',photoHelp:'Up to 10 small photos floating around the heart.',addPhotos:'Add photos',photoMeta:'JPG, PNG or WebP · up to 10 MB each.\nUse the same upload key as music.',photoLinkSummary:'Or use an image link',photoUrlLabel:'Direct HTTPS image link',addThisPhoto:'Add this photo',musicLegend:'Your song ♫',uploadKeyLabel:'Your key to upload photos and music',chooseSong:'Choose a song',songMeta:'MP3, M4A, WAV, OGG, AAC or FLAC · up to 15 MB.\nThe song is saved with this dedication.',audioLinkSummary:'Or use an audio link',audioUrlLabel:'Direct HTTPS song link',useThisAudio:'Use this audio',audioHelp:'An audio file accessible by link, not a YouTube or Spotify page.',removeSong:'Remove song from this dedication',createUniverse:'Create her universe',statusReady:'Every name has its own constellation.',shareButton:'Share dedication ↗',copyLink:'Copy link',previewGift:'See how she will see it',editorFooter:'A small detail. A huge feeling.',giftEyebrow:'A tiny gift made with love',giftTitle:'Happy birthday,\nmy love,',giftText:'The best things in life\nare the ones made for you.',openGift:'Open my birthday surprise ✧',giftNote:'Tap to discover your surprise',closeEditor:'Back to the galaxy ↓',closeLetter:'Close ×',letterEyebrow:'FOR MY FAVORITE PERSON',shareStatus:'',copySuccess:'Link copied.',shareReady:'Dedication ready to share.',saveReady:'Universe updated.',defaultName:'you',defaultMessage:'Happy birthday, my love.',giftName:'love',languageLabel:'Language',namePlaceholder:'Write her name',senderPlaceholder:'Your name or nickname',uploadPasswordPlaceholder:'Your page key',audioUrlPlaceholder:'https://…/song.mp3',photoUrlPlaceholder:'https://…/photo.jpg',inputLetterTitle:'A letter for her',copyLinkStatus:'Link copied. You can send it now.'}
};
let currentLanguage='en';
  let config={name:'',message:translations.en.defaultMessage,phrases:['My favorite place','Always you','With you, everything feels brighter'],color:'rose'};
try{const p=new URLSearchParams(location.hash.slice(1)||location.search);if(p.has('name'))config.name=p.get('name').slice(0,24);if(p.has('message'))config.message=p.get('message').slice(0,180);if(p.has('phrases'))config.phrases=p.get('phrases').split('\n').map(x=>x.trim().slice(0,48)).filter(Boolean).slice(0,5);if(Object.hasOwn(palette,p.get('color')))config.color=p.get('color')}catch{}

function applyTranslations(){
  const lang=translations[currentLanguage];
  document.documentElement.lang=currentLanguage;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.dataset.i18n;
    if(lang[key]) el.textContent=lang[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key=el.dataset.i18nPlaceholder;
    if(lang[key]) el.placeholder=lang[key];
  });
  const nameDefault=currentLanguage==='ar' ? 'أنتِ' : 'you';
  const recipientText=config.name || nameDefault;
  if($('#recipient')) $('#recipient').textContent=recipientText;
  if($('#dedication')) $('#dedication').textContent=config.message || translations[currentLanguage].defaultMessage;
  if($('#share-status')) $('#share-status').textContent = $('#share-status').dataset.status || '';
  if($('#editor-toggle')) $('#editor-toggle').textContent = $('#app')?.classList.contains('immersive') ? lang.editorToggleShow : lang.editorToggleHide;
  if($('#status')) $('#status').textContent = config.name ? (currentLanguage==='ar' ? 'تم تحديث عالم '+config.name+'.' : 'Your universe is ready for '+config.name+'.') : lang.statusReady;
  const titlePrefix=currentLanguage==='ar' ? 'عالم' : 'MORY';
  document.title=config.name ? `${titlePrefix} · ${config.name}` : 'MORY';
  const colorLabels = document.querySelectorAll('[name="color"] + span + b');
  colorLabels.forEach((el, index)=>{
    const labels = ['Rose', 'Red', 'Blue'];
    if (labels[index]) el.textContent = labels[index];
  });
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    const isActive = btn.dataset.lang === currentLanguage;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  if ($('#name')) $('#name').placeholder = currentLanguage==='ar' ? 'اكتب اسمها' : 'Write her name';
  if ($('#sender')) $('#sender').placeholder = currentLanguage==='ar' ? 'اسمك أو لقبك' : 'Your name or nickname';
  if ($('#upload-password')) $('#upload-password').placeholder = currentLanguage==='ar' ? 'مفتاح صفحتك' : 'Your page key';
  if ($('#audio-url')) $('#audio-url').placeholder = currentLanguage==='ar' ? 'https://…/song.mp3' : 'https://…/song.mp3';
  if ($('#photo-url')) $('#photo-url').placeholder = currentLanguage==='ar' ? 'https://…/photo.jpg' : 'https://…/photo.jpg';
  if ($('#letter-heading')) $('#letter-heading').textContent = currentLanguage==='ar' ? 'لكِ' : 'For you';
}

function setLanguage(lang){
  if(!translations[lang]) return;
  currentLanguage=lang;
  if($('#name'))$('#name').value=config.name;
  if($('#message'))$('#message').value=config.message;
  if($('#phrases'))$('#phrases').value=config.phrases.join('\n');
  applyTranslations();
}
let W=0,H=0,dpr=1,shape=0,auto=!reduced,paused=reduced,clock=0,last=0,lastSwitch=0,rotX=0,rotY=0,targetX=0,targetY=0,drag=null,zoom=1;
const mobile=matchMedia('(max-width:700px)').matches;
const N=mobile?1500:2200,points=[],stars=[],ring=[];
function rand(a,b){return a+Math.random()*(b-a)}
for(let i=0;i<N;i++){const t=Math.random()*Math.PI*2,fill=Math.sqrt(Math.random()),x=16*Math.sin(t)**3,y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);const f=Math.random()*Math.PI*2,petal=42+95*Math.abs(Math.cos(5*f/2)),r=Math.sqrt(Math.random())*petal;points.push({heart:[x*9*fill,(y+1)*9*fill,rand(-30,30)*Math.sqrt(1-fill*.7)],flower:[r*Math.cos(f),r*Math.sin(f),30*Math.sin(r/140*Math.PI)+rand(-8,8)],name:[0,0,0],p:[x*9*fill,(y+1)*9*fill,rand(-25,25)],size:rand(.5,1.6),phase:rand(0,6.28)})}
for(let i=0;i<(mobile?160:430);i++)stars.push({x:Math.random(),y:Math.random(),r:rand(.25,1.15),phase:rand(0,7),depth:rand(.1,1)});
for(let i=0;i<(mobile?420:1000);i++){const t=rand(0,Math.PI*2),r=rand(188,300);ring.push([Math.cos(t)*r,rand(-5,5),Math.sin(t)*r,rand(.25,1.2)])}
function makeName(){const off=document.createElement('canvas');off.width=1100;off.height=230;const c=off.getContext('2d');let text=config.name||((currentLanguage==='ar')?'أنتِ':'you');c.font='600 130px Georgia';const size=Math.min(130,1000/c.measureText(text).width*130);c.font='600 '+size+'px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillText(text,550,110);const a=c.getImageData(0,0,1100,230).data,samples=[];for(let y=0;y<230;y+=3)for(let x=0;x<1100;x+=3)if(a[(y*1100+x)*4+3]>100)samples.push([(x-550)*.41,(115-y)*.41]);points.forEach(p=>{const q=samples[Math.floor(Math.random()*samples.length)]||[0,0];p.name=[q[0]+rand(-.7,.7),q[1]+rand(-.7,.7),rand(-10,10)]})}
function sync(){
  if($('#name')) $('#name').value=config.name;
  if($('#message')) $('#message').value=config.message;
  if($('#phrases')) $('#phrases').value=config.phrases.join('\n');
  const colorInput=document.querySelector('input[value="'+config.color+'"]'); if(colorInput) colorInput.checked=true;
  const nameDefault=currentLanguage==='ar' ? 'أنتِ' : 'you';
  if($('#recipient')) $('#recipient').textContent=config.name||nameDefault;
  if($('#dedication')) $('#dedication').textContent=config.message || translations[currentLanguage].defaultMessage;
  document.documentElement.style.setProperty('--gold','rgb('+palette[config.color]+')');
  const titleText=currentLanguage==='ar' ? (config.name ? 'عالم '+config.name : 'عالمك الخاص') : (config.name ? 'MORY · '+config.name : 'MORY');
  document.title=titleText;
  applyTranslations();
  makeName();
}
function choose(i){shape=i;lastSwitch=clock;document.querySelectorAll('[data-shape]').forEach(b=>{const yes=Number(b.dataset.shape)===i;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',yes)});if(paused)draw(performance.now(),true)}
function apply(input){if(typeof input.name!=='string'||input.name.length>24||typeof input.message!=='string'||input.message.length>180||!Array.isArray(input.phrases)||input.phrases.length>5||input.phrases.some(p=>typeof p!=='string'||p.length>48)||!Object.hasOwn(palette,input.color))throw new Error(currentLanguage==='ar' ? 'راجع الاسم، الجمل، واللون.' : 'Check the name, phrases, and color.');config={name:input.name.trim(),message:input.message.trim(),phrases:input.phrases,color:input.color};sync();const p=new URLSearchParams({name:config.name,message:config.message,phrases:config.phrases.join('\n'),color:config.color});window.preserveSong?.(p);window.preserveRomance?.(p);history.replaceState(null,'',location.pathname+'?'+p);choose(2);$('#status').textContent=config.name?(currentLanguage==='ar' ? 'تم تحديث عالم '+config.name+'.' : 'Your universe is ready for '+config.name+'.'):(currentLanguage==='ar' ? 'تم تحديث رسالتك.' : 'Your dedication is ready.');return {name:config.name,color:config.color,shape:'nombre'}}
$('#customize').addEventListener('submit',e=>{e.preventDefault();apply({name:$('#name').value,message:$('#message').value,phrases:$('#phrases').value.split('\n').map(x=>x.trim().slice(0,48)).filter(Boolean).slice(0,5),color:$('input[name=color]:checked').value});if(innerWidth<=700)setEditor(false)});
document.querySelectorAll('[data-shape]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.shape))));
function controls(){$('#auto').classList.toggle('active',auto);$('#auto').setAttribute('aria-pressed',auto);$('#pause').textContent=paused?'▶':'Ⅱ';$('#pause').setAttribute('aria-pressed',paused);$('#pause').setAttribute('aria-label',paused?'Reanudar animación':'Pausar animación')}
$('#auto').addEventListener('click',()=>{auto=!auto;lastSwitch=clock;controls()});$('#pause').addEventListener('click',()=>{paused=!paused;controls()});function setEditor(open){if(new URLSearchParams(location.search).get('share')==='1')return;$('#app').classList.toggle('immersive',!open);$('#editor-toggle').textContent = open ? (currentLanguage==='ar' ? 'عرض العالم ✧' : 'View galaxy ✧') : (currentLanguage==='ar' ? 'تخصيص العالم ✧' : 'Customize ✧');$('#editor-toggle').setAttribute('aria-expanded',open);document.body.classList.toggle('editing',open&&innerWidth<=700);resize();if(open&&innerWidth<=700){$('#editor').focus({preventScroll:true})}else if(!open){$('#editor-toggle').focus({preventScroll:true})}}
$('#editor-toggle').addEventListener('click',()=>setEditor($('#app').classList.contains('immersive')));$('#close-editor').addEventListener('click',()=>setEditor(false));addEventListener('keydown',e=>{if(e.key==='Escape')setEditor(false)});
document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(devicePixelRatio||1,mobile?1.5:2);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);if(paused)draw(performance.now(),true)}
new ResizeObserver(resize).observe($('.universe'));
canvas.addEventListener('pointerdown',e=>{drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;targetY+=(e.clientX-drag.x)*.006;targetX=Math.max(-.8,Math.min(.8,targetX+(e.clientY-drag.y)*.004));drag.x=e.clientX;drag.y=e.clientY;if(paused)draw(performance.now(),true)});function release(){drag=null}canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.65,Math.min(1.4,zoom-e.deltaY*.001));if(paused)draw(performance.now(),true)},{passive:false});
let sceneTop=150,sceneSpace=300;
function measureScene(){sceneTop=Math.max(130,$('.scene-heading').offsetHeight+$('.scene-heading').offsetTop+16);sceneSpace=Math.max(80,H-sceneTop-$('.scene-footer').offsetHeight-34)}
function project(x,y,z,rotation=rotY){const cy=Math.cos(rotation),sy=Math.sin(rotation),cx=Math.cos(rotX),sx=Math.sin(rotX),xx=x*cy+z*sy,zz=-x*sy+z*cy,yy=y*cx-zz*sx,zz2=y*sx+zz*cx,k=650/(650+zz2),scale=Math.min(W/640,sceneSpace/330,1.42)*zoom;return [W/2+xx*k*scale,sceneTop+sceneSpace/2-yy*k*scale,k,zz2]}
function draw(now,force=false){const dt=Math.min((now-(last||now))/1000,.08);last=now;if(!paused)clock+=dt;if(paused&&!force)return;if(auto&&clock-lastSwitch>7)choose((shape+1)%3);rotX+=(targetX-rotX)*(force?1:.09);rotY+=(targetY-rotY)*(force?1:.09);measureScene();ctx.clearRect(0,0,W,H);const rgb=palette[config.color];const glow=ctx.createRadialGradient(W*.5,H*.53,0,W*.5,H*.53,W*.4);glow.addColorStop(0,'rgba('+rgb+',.045)');glow.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
for(const s of stars){const a=.18+.5*(.5+.5*Math.sin(clock*.5+s.phase));ctx.fillStyle='rgba('+rgb+','+a+')';ctx.beginPath();ctx.arc((s.x*W+Math.sin(clock*.04+s.phase)*5*s.depth+W)%W,s.y*H,s.r,0,7);ctx.fill()}
ctx.globalCompositeOperation='lighter';
for(const p of ring){const a=clock*.025,x=p[0]*Math.cos(a)-p[2]*Math.sin(a),z=p[0]*Math.sin(a)+p[2]*Math.cos(a),q=project(x,p[1]+z*.36,z),alpha=.1+.23*(q[3]+320)/640;ctx.fillStyle='rgba('+rgb+','+alpha+')';ctx.beginPath();ctx.arc(q[0],q[1],p[3]*q[2],0,7);ctx.fill()}
const key=['heart','flower','name'][shape],rotation=rotY+(shape===2?Math.sin(clock*.22)*.1:Math.sin(clock*.18)*.24),beat=shape===0?1+Math.sin(clock*2.4)*.025:1;
for(const p of points){const to=p[key];for(let j=0;j<3;j++)p.p[j]+=(to[j]-p.p[j])*(force?1:1-Math.exp(-dt*2.7));const q=project(p.p[0]*beat,p.p[1]*beat,p.p[2]*beat,rotation),alpha=.45+.5*(.5+.5*Math.sin(clock*.7+p.phase));ctx.fillStyle='rgba('+rgb+','+alpha+')';ctx.beginPath();ctx.arc(q[0],q[1],Math.max(.4,p.size*q[2]*Math.min(W/600,1.2)),0,7);ctx.fill();if(p.size>1.52){ctx.fillStyle='rgba('+rgb+',.07)';ctx.beginPath();ctx.arc(q[0],q[1],p.size*q[2]*4,0,7);ctx.fill()}}
if(window.drawRomanticDetails)window.drawRomanticDetails(ctx,W,H,clock,project);ctx.globalCompositeOperation='source-over';ctx.textAlign='center';ctx.textBaseline='middle';
for(let i=0;i<config.phrases.length;i++){const a=clock*.065+i*Math.PI*2/Math.max(config.phrases.length,1)+.3,q=project(Math.cos(a)*245,Math.sin(a)*80-14,Math.sin(a)*150);ctx.font='italic '+Math.max(14,Math.min(20,W/37)*q[2])+'px Georgia';ctx.fillStyle='rgba('+rgb+','+(.34+q[2]*.2)+')';ctx.fillText(config.phrases[i],q[0],q[1],W*.45)}
}
sync();applyTranslations();resize();controls();if(mobile)setEditor(false);draw(performance.now(),true);let frame=0,lastFrame=0;function tick(now){frame=0;if(document.hidden)return;if(now-lastFrame>=(mobile?1000/30:1000/60)-1){draw(now);lastFrame=now}frame=requestAnimationFrame(tick)}function resumeFrames(){last=0;if(!frame&&!document.hidden)frame=requestAnimationFrame(tick)}document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else resumeFrames()});resumeFrames();
const lifecycle=new AbortController();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'personalize_dedication',title:'Personalizar dedicatoria',description:'Actualiza el nombre, la dedicatoria, las frases y el color, y muestra el nombre formado por partículas.',inputSchema:{type:'object',properties:{name:{type:'string',maxLength:24},message:{type:'string',maxLength:180},phrases:{type:'array',maxItems:5,items:{type:'string',maxLength:48}},color:{type:'string',enum:['gold','rose','lilac']}},required:['name','message','phrases','color'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:apply},{signal:lifecycle.signal})).catch(()=>{})}catch{}}
addEventListener('pagehide',()=>lifecycle.abort());


window.saveDedication=()=>apply({name:$('#name').value,message:$('#message').value,phrases:$('#phrases').value.split('\n').map(x=>x.trim().slice(0,48)).filter(Boolean).slice(0,5),color:$('input[name=color]:checked').value});
window.closeEditor=()=>setEditor(false);
