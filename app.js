const KEY="ajaytips-v1-data";
const DEFAULT={profiles:[{id:"p1",name:"Ajay Sir",bio:"Quantitative Aptitude & Reasoning Expert | Ajaytips",slug:"ajaytips",avatar:"",theme:{bg:"#121a24",card:"#ffffff",text:"#f8fafb",showCta:true,newTab:true},links:[
{id:"l1",title:"Ajaytips (@ajaytips0806)",url:"https://www.youtube.com/@ajaytips0806",icon:"youtube",clicks:0},
{id:"l2",title:"Ajaytips App (Google Play Store)",url:"https://play.google.com/store/apps/details?id=com.diy18.ajaytips",icon:"playstore",clicks:0},
{id:"l3",title:"Ajaytips Official (WhatsApp Channel)",url:"https://whatsapp.com/channel/0029Vajra07KGGGDcCB23G1G",icon:"whatsapp",clicks:0},
{id:"l4",title:"@ajay_tips (Instagram)",url:"https://www.instagram.com/ajay_tips",icon:"instagram",clicks:0},
{id:"l5",title:"Ajaytips (Telegram Channel)",url:"https://t.me/ajaytips",icon:"telegram",clicks:0},
{id:"l6",title:"Ajay Sir (X / Twitter)",url:"https://x.com/ajay_tips",icon:"x",clicks:0}
],slides:[
{id:"s1",image:"",badge:"QUANTITATIVE APTITUDE",title:"Ajay Sir Quantitative Classes",text:"Comprehensive classes, concept building & shortcut methods for competitive exams.",url:"https://www.youtube.com/@ajaytips0806",gradient:"blue"},
{id:"s2",image:"",badge:"OFFICIAL APP",title:"Ajaytips Mobile App",text:"Download our official app for live practice tests, formula sheets & courses.",url:"https://play.google.com/store/apps/details?id=com.diy18.ajaytips",gradient:"green"},
{id:"s3",image:"",badge:"COMMUNITY",title:"WhatsApp & Telegram Channel",text:"Get daily practice questions, free notes & fast notifications directly on your phone.",url:"https://whatsapp.com/channel/0029Vajra07KGGGDcCB23G1G",gradient:"purple"}
],views:0}]};
let state=load(),activeId=state.profiles[0]?.id,tab="overviewTab",adminCredentials=null,localRevision=0,syncQueue=Promise.resolve();
const $=id=>document.getElementById(id);
function load(){
  try{
    const x=JSON.parse(localStorage.getItem(KEY));
    if(x?.profiles?.length&&x.profiles.some(p=>p.slug==="ajaytips"||(p.name&&p.name.toLowerCase().includes("ajay")))){
      x.profiles.forEach(p=>{if(!p.slides)p.slides=structuredClone(DEFAULT.profiles[0].slides)});
      return x;
    }
  }catch(e){}
  return structuredClone(DEFAULT);
}
function active(){return state.profiles.find(p=>p.id===activeId)||state.profiles[0]}
async function persist(sync=false){
  localRevision++;
  localStorage.setItem(KEY,JSON.stringify(state));
  renderPublic();
  renderAdmin();
  if(!sync)return true;
  if(!adminCredentials){toast("Saved on this device; sign in again to sync to GitHub");return false}
  const snapshot=JSON.stringify(state),credentials=adminCredentials;
  syncQueue=syncQueue.then(async()=>{
    const response=await fetch("/.netlify/functions/profile-data",{
      method:"POST",
      headers:{"Content-Type":"application/json",Authorization:"Basic "+btoa(credentials)},
      body:JSON.stringify({action:"save",data:JSON.parse(snapshot)})
    });
    if(!response.ok)throw new Error("sync failed");
  }).then(()=>{toast("Saved and synced to GitHub");return true}).catch(()=>{toast("Saved on this device; GitHub sync failed");return false});
  return syncQueue;
}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function initials(s="AJ"){
  let str=(s||"AJ").trim();
  let parts=str.split(/\s+/);
  if(parts[0].toLowerCase()==="ajay")return "AJ";
  return parts.slice(0,2).map(x=>x[0]).join("").toUpperCase()||"AJ";
}
const svgIcons={
  instagram:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  youtube:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  whatsapp:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.302-.78 1-.956 1.202-.175.202-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.895-.799-1.5-1.787-1.676-2.088-.175-.302-.019-.465.132-.615.136-.135.301-.351.452-.527.15-.175.2-.301.3-.502.101-.2.05-.376-.025-.527-.075-.15-.678-1.633-.93-2.238-.244-.59-.493-.51-.678-.52l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511c0 1.482 1.08 2.912 1.23 3.113.15.201 2.125 3.245 5.148 4.551.719.311 1.28.497 1.718.636.723.23 1.381.198 1.902.12.58-.088 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.352zm-5.422 7.424h-.008a9.835 9.835 0 0 1-5.01-1.378l-.359-.213-3.725.977.994-3.63-.233-.371a9.841 9.841 0 0 1-1.51-5.26c0-5.433 4.422-9.855 9.859-9.855 2.632 0 5.107 1.025 6.968 2.887 1.86 1.862 2.885 4.337 2.885 6.97 0 5.433-4.422 9.873-9.861 9.873zm8.384-18.257C18.293 1.38 15.395.27 12.05.27 5.568.27.29 5.549.29 12.032c0 2.071.54 4.093 1.567 5.875L0 23.73l5.98-1.568a11.722 11.722 0 0 0 5.736 1.488h.005c6.48 0 11.759-5.28 11.759-12.032 0-3.213-1.25-6.233-3.046-8.069z"/></svg>`,
  telegram:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.832.942z"/></svg>`,
  playstore:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186c-.276-.234-.447-.63-.447-1.127V2.941c0-.497.171-.893.446-1.127zm11.24 11.242l2.368-2.368-12.44-7.14 10.072 9.508zm2.973-2.973l2.845 1.633a1.054 1.054 0 0 1 0 1.826l-2.845 1.633-2.5-2.5 2.5-2.582zm-2.973 2.973l-10.072 9.508 12.44-7.14-2.368-2.368z"/></svg>`,
  x:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  facebook:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  linkedin:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`,
  github:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  website:`<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  graduation:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 14.5l-7-3.82v3.64l7 3.82 7-3.82v-3.64l-7 3.82z"/></svg>`,
  custom:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
};
const icons={
  instagram:[svgIcons.instagram,"instagram"],
  youtube:[svgIcons.youtube,"youtube"],
  whatsapp:[svgIcons.whatsapp,"whatsapp"],
  telegram:[svgIcons.telegram,"telegram"],
  playstore:[svgIcons.playstore,"playstore"],
  x:[svgIcons.x,"x"],
  facebook:[svgIcons.facebook,"facebook"],
  linkedin:[svgIcons.linkedin,"linkedin"],
  github:[svgIcons.github,"github"],
  website:[svgIcons.website,"website"],
  graduation:[svgIcons.graduation,"graduation"],
  custom:[svgIcons.custom,"custom"]
};
function validUrl(s){try{let u=new URL(s);return ["https:","http:"].includes(u.protocol)?u.href:"#"}catch{return "#"}}
function profileUrl(p){let u=new URL(location.href);u.searchParams.set("p",p.slug);return u.href}
function avatar(img,fb,p){
  if(!img)return;
  if(p&&p.avatar&&p.avatar.trim()){
    img.src=p.avatar;
    img.style.display="block";
    if(fb)fb.style.display="none";
    img.onerror=()=>{
      img.removeAttribute("src");
      img.style.display="none";
      if(fb){fb.textContent=initials(p.name);fb.style.display="grid";}
    };
  }else{
    img.removeAttribute("src");
    img.style.display="none";
    if(fb){fb.textContent=initials(p?p.name:"AJ");fb.style.display="grid";}
  }
}
function applyTheme(p){
  document.documentElement.style.setProperty("--bg",p.theme.bg);
  document.documentElement.style.setProperty("--card",p.theme.card);
  document.documentElement.style.setProperty("--text",p.theme.text);
}
function renderPublic(){
  const p=active();
  if(!p)return;
  applyTheme(p);
  $("profileName").textContent=p.name;
  $("profileBio").textContent=p.bio;
  avatar($("profileAvatar"),$("avatarFallback"),p);
  
  const socialOrder=["instagram","youtube","whatsapp","telegram","playstore","x","facebook","linkedin"];
  const headerLinks=socialOrder
    .map(key=>p.links.find(l=>l.icon===key))
    .filter(Boolean);
  if($("headerSocials")){
    $("headerSocials").innerHTML=headerLinks.map(l=>{
      let [sym,cls]=icons[l.icon]||icons.custom;
      return `<a class="header-social-btn ${cls}" href="${esc(validUrl(l.url))}" target="${p.theme.newTab?"_blank":"_self"}" ${p.theme.newTab?'rel="noopener noreferrer"':""} title="${esc(l.title)}" aria-label="${esc(l.title)}" data-link="${esc(l.id)}">${sym}</a>`;
    }).join("");
  }

  const slides=p.slides||[];
  const carouselSec=$("carouselSection");
  if(carouselSec){
    if(slides.length===0){
      carouselSec.style.display="none";
    }else{
      carouselSec.style.display="";
      const track=$("carouselTrack");
      if(track){
        track.innerHTML=slides.map(s=>{
          let inner="";
          if(s.image){
            let hasMeta=Boolean(s.badge||s.title||s.text);
            inner=`<img src="${esc(s.image)}" alt="${esc(s.title||'Slide banner')}">${hasMeta?`<div class="carousel-card-overlay">${s.badge?`<span class="slide-badge">${esc(s.badge)}</span>`:""}${s.title?`<h3>${esc(s.title)}</h3>`:""}${s.text?`<p>${esc(s.text)}</p>`:""}</div>`:""}`;
          }else{
            inner=`<div class="carousel-card slide-gradient-${esc(s.gradient||'blue')}">${s.badge?`<span class="slide-badge">${esc(s.badge)}</span>`:""}${s.title?`<h3>${esc(s.title)}</h3>`:""}${s.text?`<p>${esc(s.text)}</p>`:""}</div>`;
          }
          if(s.url&&validUrl(s.url)!=="#"){
            inner=`<a class="carousel-slide-link" href="${esc(validUrl(s.url))}" target="${p.theme.newTab?"_blank":"_self"}" ${p.theme.newTab?'rel="noopener noreferrer"':""}>${inner}</a>`;
          }
          return `<div class="carousel-slide">${inner}</div>`;
        }).join("");
      }
      const dots=$("carouselDots");
      if(dots){
        dots.innerHTML=slides.map((_,i)=>`<button class="carousel-dot ${i===0?'active':''}" aria-label="Slide ${i+1}" data-index="${i}" type="button"></button>`).join("");
      }
      initCarousel();
    }
  }

  $("publicLinks").innerHTML=p.links.map(l=>{
    let [sym,cls]=icons[l.icon]||icons.custom;
    return `<a class="social-card" href="${esc(validUrl(l.url))}" target="${p.theme.newTab?"_blank":"_self"}" ${p.theme.newTab?'rel="noopener noreferrer"':""} data-link="${esc(l.id)}"><span class="social-icon ${cls}">${sym}</span><span class="social-title">${esc(l.title)}</span><span class="more-dots">⋮</span></a>`;
  }).join("");
  document.title=p.name+" | Ajaytips";
}
function renderAdmin(){
  const p=active();
  if(!p)return;
  $("nameInput").value=p.name;
  $("bioInput").value=p.bio;
  $("slugInput").value=p.slug;
  avatar($("adminAvatarPreview"),$("adminAvatarFallback"),p);
  $("bgInput").value=p.theme.bg;
  $("cardInput").value=p.theme.card;
  $("textInput").value=p.theme.text;
  $("newTabInput").checked=p.theme.newTab;
  $("activeProfileLabel").textContent=p.name;
  $("viewsCount").textContent=p.views||0;
  $("clicksCount").textContent=p.links.reduce((n,l)=>n+(l.clicks||0),0);
  $("activeLinksCount").textContent=p.links.length;
  const max=Math.max(1,...p.links.map(l=>l.clicks||0));
  $("analyticsList").innerHTML=p.links.map(l=>`<div class="analytics-row"><span class="analytics-name">${esc(l.title)}</span><div class="bar-track"><div class="bar-fill" style="width:${(l.clicks||0)/max*100}%"></div></div><span class="analytics-count">${l.clicks||0}</span></div>`).join("")||"<p class='muted'>No links to report yet.</p>";
  $("adminLinksList").innerHTML=p.links.map((l,i)=>{
    let [sym]=icons[l.icon]||icons.custom;
    return `<article class="manage-item"><span class="manage-icon">${sym}</span><div class="manage-meta"><strong>${esc(l.title)}</strong><small>${esc(l.url)}</small></div><div class="item-actions"><button class="mini-btn" data-act="up" data-id="${l.id}" ${i===0?"disabled":""}>↑</button><button class="mini-btn" data-act="down" data-id="${l.id}" ${i===p.links.length-1?"disabled":""}>↓</button><button class="mini-btn" data-act="edit" data-id="${l.id}">✎</button><button class="mini-btn delete" data-act="delete" data-id="${l.id}">×</button></div></article>`;
  }).join("")||"<div class='panel'>No links yet. Add your first link.</div>";
  const slides=p.slides||[];
  if($("adminCarouselList")){
    $("adminCarouselList").innerHTML=slides.map((s,i)=>{
      let thumbContent=s.image?`<img src="${esc(s.image)}" alt="">`:`▣`;
      let thumbClass=s.image?"manage-thumb":`manage-thumb slide-gradient-${esc(s.gradient||'blue')}`;
      let title=s.title||(s.image?"Image Banner":"Slide "+(i+1));
      let subtitle=s.url||s.text||s.badge||"No link";
      return `<article class="manage-item"><div class="${thumbClass}">${thumbContent}</div><div class="manage-meta"><strong>${esc(title)}</strong><small>${esc(subtitle)}</small></div><div class="item-actions"><button class="mini-btn" data-slide-act="up" data-id="${s.id}" ${i===0?"disabled":""}>↑</button><button class="mini-btn" data-slide-act="down" data-id="${s.id}" ${i===slides.length-1?"disabled":""}>↓</button><button class="mini-btn" data-slide-act="edit" data-id="${s.id}">✎</button><button class="mini-btn delete" data-slide-act="delete" data-id="${s.id}">×</button></div></article>`;
    }).join("")||"<div class='panel'>No carousel slides yet. Click ＋ Add slide to create your first slide or banner.</div>";
  }
  $("profilesList").innerHTML=state.profiles.map(pr=>`<article class="profile-item"><span class="profile-avatar-mini">${pr.avatar?`<img src="${pr.avatar}" alt="">`:initials(pr.name)}</span><div class="profile-meta"><strong>${esc(pr.name)} ${pr.id===activeId?"· Active":""}</strong><small>?p=${esc(pr.slug)} · ${pr.links.length} links</small></div><div class="item-actions"><button class="mini-btn" data-profile-act="switch" data-id="${pr.id}" title="Open profile">↗</button><button class="mini-btn" data-profile-act="edit" data-id="${pr.id}" title="Edit">✎</button>${state.profiles.length>1?`<button class="mini-btn delete" data-profile-act="delete" data-id="${pr.id}" title="Delete">×</button>`:""}</div></article>`).join("");
  renderQr();
}
function renderQr(){
  let p=active();
  $("qrcode").innerHTML="";
  $("qrProfileName").textContent=p.name;
  $("qrProfileUrl").textContent=profileUrl(p);
  if(window.QRCode)new QRCode($("qrcode"),{text:profileUrl(p),width:145,height:145,colorDark:"#111111",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.H});
}
function toast(msg){let t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2200)}
function showPublic(){$("adminPage").classList.add("hidden");$("publicPage").classList.remove("hidden");$("publicActions").classList.remove("hidden");window.scrollTo(0,0)}
function showAdmin(){$("publicPage").classList.add("hidden");$("publicActions").classList.add("hidden");$("adminPage").classList.remove("hidden");setTab("overviewTab");renderAdmin();window.scrollTo(0,0)}
function setTab(id){tab=id;document.querySelectorAll(".admin-tab").forEach(x=>x.classList.toggle("hidden",x.id!==id));document.querySelectorAll(".side-link").forEach(x=>x.classList.toggle("active",x.dataset.tab===id));if(id==="qrTab")renderQr()}
function editLink(l){$("linkForm").reset();$("editLinkId").value=l?.id||"";$("linkTitleInput").value=l?.title||"";$("linkUrlInput").value=l?.url||"";$("linkIconInput").value=l?.icon||"youtube";$("linkDialogTitle").textContent=l?"Edit link":"Add a link";$("linkDialog").showModal()}
function slugify(s){return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g,"-").replace(/^-|-$/g,"")}
$("adminShortcut").onclick=()=>$("loginDialog").showModal();
$("loginForm").onsubmit=async e=>{
  e.preventDefault();
  const username=$("usernameInput").value,password=$("passwordInput").value;
  try{
    const response=await fetch("/.netlify/functions/profile-data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"login",username,password})});
    if(!response.ok)throw new Error("login failed");
    adminCredentials=username+":"+password;
    $("loginDialog").close();
    $("loginError").classList.add("hidden");
    showAdmin();
  }catch{
    if((location.protocol==="file:"||["localhost","127.0.0.1"].includes(location.hostname))&&username==="admin"&&password==="admin123"){
      adminCredentials=null;
      $("loginDialog").close();
      $("loginError").classList.add("hidden");
      showAdmin();
      toast("Local demo mode: changes stay in this browser");
    }else $("loginError").classList.remove("hidden");
  }
};
$("logoutButton").onclick=()=>{adminCredentials=null;history.replaceState(null,"","/"+location.search+location.hash);showPublic()};
$("viewProfileButton").onclick=()=>{history.replaceState(null,"","/"+location.search+location.hash);showPublic()};
document.querySelectorAll(".side-link").forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
function trackClick(e){
  let a=e.target.closest("a[data-link]");
  if(!a)return;
  let p=active(),l=p.links.find(x=>x.id===a.dataset.link);
  if(l){l.clicks=(l.clicks||0)+1;localStorage.setItem(KEY,JSON.stringify(state));}
}
$("publicLinks").addEventListener("click",trackClick);
if($("headerSocials"))$("headerSocials").addEventListener("click",trackClick);
(function countView(){
  let p=active();
  if(p){p.views=(p.views||0)+1;localStorage.setItem(KEY,JSON.stringify(state));}
})();
$("profileForm").onsubmit=e=>{
  e.preventDefault();
  let p=active(),slug=slugify($("slugInput").value);
  if(state.profiles.some(x=>x.id!==p.id&&x.slug===slug))return toast("That profile slug is already in use");
  p.name=$("nameInput").value.trim();
  p.bio=$("bioInput").value.trim();
  p.slug=slug||slugify(p.name);
  persist(true);
};
$("avatarUpload").onchange=e=>{
  let f=e.target.files?.[0];
  if(!f)return;
  if(!f.type.startsWith("image/"))return toast("Choose an image file");
  let r=new FileReader();
  r.onload=()=>{
    let img=new Image();
    img.onload=()=>{
      let canvas=document.createElement("canvas");
      let size=320;
      canvas.width=size;
      canvas.height=size;
      let ctx=canvas.getContext("2d");
      let minDim=Math.min(img.width,img.height);
      let sx=(img.width-minDim)/2;
      let sy=(img.height-minDim)/2;
      ctx.drawImage(img,sx,sy,minDim,minDim,0,0,size,size);
      active().avatar=canvas.toDataURL("image/jpeg",0.92);
      persist(true);
      toast("Profile photo updated");
    };
    img.onerror=()=>{
      active().avatar=r.result;
      persist(true);
      toast("Profile photo updated");
    };
    img.src=r.result;
  };
  r.readAsDataURL(f);
};
if($("removeAvatarButton")){
  $("removeAvatarButton").onclick=()=>{
    active().avatar="";
    $("avatarUpload").value="";
    persist(true);
    toast("Profile photo removed");
  };
}
$("addLinkButton").onclick=()=>editLink(null);
$("linkForm").onsubmit=e=>{
  e.preventDefault();
  let p=active(),id=$("editLinkId").value,l={id:id||"l"+Date.now(),title:$("linkTitleInput").value.trim(),url:$("linkUrlInput").value.trim(),icon:$("linkIconInput").value,clicks:0};
  if(validUrl(l.url)==="#")return toast("Enter a valid http/https URL");
  if(id)p.links=p.links.map(x=>x.id===id?{...x,...l,clicks:x.clicks||0}:x);
  else p.links.push(l);
  $("linkDialog").close();
  persist(true);
};
$("adminLinksList").onclick=e=>{
  let b=e.target.closest("button[data-act]");
  if(!b)return;
  let p=active(),i=p.links.findIndex(l=>l.id===b.dataset.id),a=b.dataset.act;
  if(i<0)return;
  if(a==="edit")return editLink(p.links[i]);
  if(a==="delete"){if(confirm("Delete this link?"))p.links.splice(i,1)}
  if(a==="up"&&i>0)[p.links[i-1],p.links[i]]=[p.links[i],p.links[i-1]];
  if(a==="down"&&i<p.links.length-1)[p.links[i+1],p.links[i]]=[p.links[i],p.links[i+1]];
  persist(true);
};
let currentSlideImage="";
function editSlide(s){
  $("slideForm").reset();
  $("editSlideId").value=s?.id||"";
  currentSlideImage=s?.image||"";
  $("slideImageUrlInput").value=(s?.image&&!s.image.startsWith("data:"))?s.image:"";
  $("slideTitleInput").value=s?.title||"";
  $("slideBadgeInput").value=s?.badge||"";
  $("slideTextInput").value=s?.text||"";
  $("slideUrlInput").value=s?.url||"";
  $("slideGradientInput").value=s?.gradient||"blue";
  $("slideDialogTitle").textContent=s?"Edit slide":"Add a slide";

  if(currentSlideImage){
    $("slideImagePreview").src=currentSlideImage;
    $("slideImagePreviewWrap").classList.remove("hidden");
  }else{
    $("slideImagePreview").src="";
    $("slideImagePreviewWrap").classList.add("hidden");
  }
  $("slideDialog").showModal();
}
if($("addSlideButton"))$("addSlideButton").onclick=()=>editSlide(null);
if($("slideImageUpload")){
  $("slideImageUpload").onchange=e=>{
    let f=e.target.files?.[0];
    if(!f)return;
    if(!f.type.startsWith("image/"))return toast("Choose an image file");
    let r=new FileReader();
    r.onload=()=>{
      let img=new Image();
      img.onload=()=>{
        let maxW=960,maxH=540;
        let w=img.width,h=img.height;
        if(w>maxW||h>maxH){
          let ratio=Math.min(maxW/w,maxH/h);
          w=Math.round(w*ratio);
          h=Math.round(h*ratio);
        }
        let canvas=document.createElement("canvas");
        canvas.width=w;
        canvas.height=h;
        let ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0,w,h);
        currentSlideImage=canvas.toDataURL("image/jpeg",0.85);
        $("slideImagePreview").src=currentSlideImage;
        $("slideImagePreviewWrap").classList.remove("hidden");
        $("slideImageUrlInput").value="";
      };
      img.onerror=()=>{
        currentSlideImage=r.result;
        $("slideImagePreview").src=currentSlideImage;
        $("slideImagePreviewWrap").classList.remove("hidden");
        $("slideImageUrlInput").value="";
      };
      img.src=r.result;
    };
    r.readAsDataURL(f);
  };
}
if($("removeSlideImageBtn")){
  $("removeSlideImageBtn").onclick=()=>{
    currentSlideImage="";
    $("slideImageUpload").value="";
    $("slideImageUrlInput").value="";
    $("slideImagePreview").src="";
    $("slideImagePreviewWrap").classList.add("hidden");
  };
}
if($("slideImageUrlInput")){
  $("slideImageUrlInput").oninput=()=>{
    let val=$("slideImageUrlInput").value.trim();
    if(val){
      currentSlideImage=val;
      $("slideImagePreview").src=val;
      $("slideImagePreviewWrap").classList.remove("hidden");
    }else if(!currentSlideImage.startsWith("data:")){
      currentSlideImage="";
      $("slideImagePreview").src="";
      $("slideImagePreviewWrap").classList.add("hidden");
    }
  };
}
if($("slideForm")){
  $("slideForm").onsubmit=e=>{
    e.preventDefault();
    let p=active();
    if(!p.slides)p.slides=[];
    let id=$("editSlideId").value;
    let imgVal=currentSlideImage||$("slideImageUrlInput").value.trim();
    let title=$("slideTitleInput").value.trim();
    let badge=$("slideBadgeInput").value.trim();
    let text=$("slideTextInput").value.trim();
    let url=$("slideUrlInput").value.trim();
    let gradient=$("slideGradientInput").value||"blue";

    if(!imgVal&&!title&&!badge&&!text){
      return toast("Provide an image banner or text/heading");
    }
    if(url&&validUrl(url)==="#"){
      return toast("Enter a valid http/https URL");
    }

    let slide={
      id:id||"s"+Date.now(),
      image:imgVal,
      title,
      badge,
      text,
      url,
      gradient
    };

    if(id)p.slides=p.slides.map(s=>s.id===id?slide:s);
    else p.slides.push(slide);

    $("slideDialog").close();
    persist(true);
    toast(id?"Slide updated":"Slide added");
  };
}
if($("adminCarouselList")){
  $("adminCarouselList").onclick=e=>{
    let b=e.target.closest("button[data-slide-act]");
    if(!b)return;
    let p=active();
    if(!p.slides)p.slides=[];
    let i=p.slides.findIndex(s=>s.id===b.dataset.id),a=b.dataset.slideAct;
    if(i<0)return;
    if(a==="edit")return editSlide(p.slides[i]);
    if(a==="delete"){
      if(confirm("Delete this slide?"))p.slides.splice(i,1);
    }
    if(a==="up"&&i>0)[p.slides[i-1],p.slides[i]]=[p.slides[i],p.slides[i-1]];
    if(a==="down"&&i<p.slides.length-1)[p.slides[i+1],p.slides[i]]=[p.slides[i],p.slides[i+1]];
    persist(true);
  };
}
$("addProfileButton").onclick=()=>$("profileDialog").showModal();
$("newProfileForm").onsubmit=e=>{
  e.preventDefault();
  let name=$("newProfileName").value.trim(),slug=slugify($("newProfileSlug").value);
  if(!slug)return toast("Enter a valid slug");
  if(state.profiles.some(p=>p.slug===slug))return toast("Slug already exists");
  let p={id:"p"+Date.now(),name,bio:$("newProfileBio").value.trim(),slug,avatar:"",views:0,theme:{bg:"#121a24",card:"#ffffff",text:"#f8fafb",showCta:true,newTab:true},links:[],slides:structuredClone(DEFAULT.profiles[0].slides)};
  state.profiles.push(p);
  activeId=p.id;
  $("profileDialog").close();
  $("newProfileForm").reset();
  persist(true);
  setTab("profileTab");
};
$("profilesList").onclick=e=>{
  let b=e.target.closest("button[data-profile-act]");
  if(!b)return;
  let id=b.dataset.id,act=b.dataset.profileAct,pr=state.profiles.find(x=>x.id===id);
  if(act==="switch"){activeId=id;persist();setTab("overviewTab");toast("Active profile changed")}
  if(act==="edit"){activeId=id;persist();setTab("profileTab")}
  if(act==="delete"&&state.profiles.length>1&&confirm(`Delete ${pr.name} and all its links?`)){
    state.profiles=state.profiles.filter(x=>x.id!==id);
    if(activeId===id)activeId=state.profiles[0].id;
    persist(true);
  }
};
$("saveAppearanceButton").onclick=()=>{
  let t=active().theme;
  t.bg=$("bgInput").value;
  t.card=$("cardInput").value;
  t.text=$("textInput").value;
  t.newTab=$("newTabInput").checked;
  persist(true);
};
$("resetThemeButton").onclick=()=>{
  active().theme={bg:"#121a24",card:"#ffffff",text:"#f8fafb",showCta:true,newTab:true};
  persist(true);
};
$("shareButton").onclick=async()=>{
  let p=active(),url=profileUrl(p);
  try{
    if(navigator.share)await navigator.share({title:p.name,text:"Visit Ajay Sir's links on Ajaytips",url});
    else{await navigator.clipboard.writeText(url);toast("Profile URL copied")}
  }catch(e){if(e.name!=="AbortError")toast("Unable to share")}
};
$("copyProfileUrlButton").onclick=async()=>{
  try{await navigator.clipboard.writeText(profileUrl(active()));toast("Profile URL copied")}
  catch{toast("Copy is not available in this browser")}
};
$("downloadQrButton").onclick=()=>{
  let canvas=$("qrcode").querySelector("canvas"),img=$("qrcode").querySelector("img");
  let url=canvas?canvas.toDataURL("image/png"):img?.src;
  if(!url)return toast("QR code is still loading");
  let a=document.createElement("a");
  a.href=url;
  a.download=active().slug+"-qr.png";
  a.click();
};
let carouselTimer=null;
function initCarousel(){
  if(carouselTimer){clearInterval(carouselTimer);carouselTimer=null;}
  const track=$("carouselTrack");
  const slides=document.querySelectorAll(".carousel-slide");
  const dots=document.querySelectorAll(".carousel-dot");
  const prevBtn=$("carouselPrev");
  const nextBtn=$("carouselNext");
  const container=$("carouselContainer");
  if(!track||slides.length===0){
    if(prevBtn)prevBtn.style.display="none";
    if(nextBtn)nextBtn.style.display="none";
    return;
  }
  if(slides.length<=1){
    if(prevBtn)prevBtn.style.display="none";
    if(nextBtn)nextBtn.style.display="none";
  }else{
    if(prevBtn)prevBtn.style.display="grid";
    if(nextBtn)nextBtn.style.display="grid";
  }

  let current=0;
  function getWidth(){
    return container.getBoundingClientRect().width||container.offsetWidth||0;
  }
  function goTo(index,withTransition=true){
    if(index<0)index=slides.length-1;
    if(index>=slides.length)index=0;
    current=index;
    if(!withTransition){
      track.style.transition="none";
    }else{
      track.style.transition="transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    }
    const w=getWidth();
    if(w>0){
      track.style.transform=`translateX(-${current*w}px)`;
    }else{
      track.style.transform=`translateX(-${current*100}%)`;
    }
    dots.forEach((d,i)=>d.classList.toggle("active",i===current));
  }
  goTo(0,false);

  if(!window._carouselResizeBound){
    window.addEventListener("resize",()=>{
      const activeTrack=$("carouselTrack");
      if(activeTrack){
        const w=getWidth();
        if(w>0)activeTrack.style.transform=`translateX(-${current*w}px)`;
      }
    });
    window._carouselResizeBound=true;
  }

  function startAuto(){
    stopAuto();
    if(slides.length>1){
      carouselTimer=setInterval(()=>goTo(current+1),4200);
    }
  }
  function stopAuto(){
    if(carouselTimer){clearInterval(carouselTimer);carouselTimer=null;}
  }

  if(prevBtn)prevBtn.onclick=()=>{goTo(current-1);startAuto();};
  if(nextBtn)nextBtn.onclick=()=>{goTo(current+1);startAuto();};
  dots.forEach(dot=>{
    dot.onclick=()=>{
      const idx=parseInt(dot.dataset.index,10);
      if(!isNaN(idx)){goTo(idx);startAuto();}
    };
  });

  let startX=0,startY=0,currentDiff=0,isDragging=false,isHorizontal=false;

  track.ontouchstart=e=>{
    if(slides.length<=1)return;
    stopAuto();
    const touch=e.touches[0];
    startX=touch.clientX;
    startY=touch.clientY;
    currentDiff=0;
    isDragging=true;
    isHorizontal=false;
  };

  track.ontouchmove=e=>{
    if(!isDragging||slides.length<=1)return;
    const touch=e.touches[0];
    const dx=touch.clientX-startX;
    const dy=touch.clientY-startY;

    if(!isHorizontal){
      if(Math.abs(dx)>Math.abs(dy)+5){
        isHorizontal=true;
      }else if(Math.abs(dy)>Math.abs(dx)+5){
        isDragging=false;
        return;
      }
    }

    if(isHorizontal){
      if(e.cancelable)e.preventDefault();
      currentDiff=dx;
      const w=getWidth();
      track.style.transition="none";
      track.style.transform=`translateX(-${(current*w)-dx}px)`;
    }
  };

  function finishSwipe(){
    if(!isDragging)return;
    isDragging=false;
    track.style.transition="transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    const threshold=40;
    if(currentDiff<-threshold){
      goTo(current+1);
    }else if(currentDiff>threshold){
      goTo(current-1);
    }else{
      goTo(current);
    }
    startAuto();
  }

  track.ontouchend=finishSwipe;
  track.ontouchcancel=()=>{
    isDragging=false;
    track.style.transition="transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    goTo(current);
    startAuto();
  };

  if(container){
    container.onmouseenter=stopAuto;
    container.onmouseleave=startAuto;
  }
  startAuto();
}

(async function init(){
  const adminRoute=location.pathname.replace(/\/+$/,"")==="/admin",slug=new URLSearchParams(location.search).get("p"),revision=localRevision;
  let match=state.profiles.find(p=>p.slug===slug || (slug==="ajay-sir" && p.slug==="ajaytips"));
  if(match)activeId=match.id;
  renderPublic();
  initCarousel();
  if(adminRoute)$("loginDialog").showModal();
  try{
    let remote=null;
    try{
      const response=await fetch("/.netlify/functions/profile-data");
      if(response.ok)remote=await response.json();
    }catch{}
    if(!remote){
      try{
        const staticResp=await fetch("./data/profiles.json");
        if(staticResp.ok)remote=await staticResp.json();
      }catch{}
    }
    if(remote?.profiles?.length && revision===localRevision){
      state=remote;
      state.profiles.forEach(p=>{if(!p.slides)p.slides=structuredClone(DEFAULT.profiles[0].slides)});
      localStorage.setItem(KEY,JSON.stringify(state));
      activeId=state.profiles.find(p=>p.slug===slug || (slug==="ajay-sir" && p.slug==="ajaytips"))?.id||state.profiles[0].id;
      renderPublic();
      if(!$("adminPage").classList.contains("hidden"))renderAdmin();
    }
  }catch{}
})();
