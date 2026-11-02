const KEY="ajaytips-v1-data";
const DEFAULT={profiles:[{id:"p1",name:"Ajay Sir",bio:"Quantitative Aptitude & Reasoning Expert | Ajaytips",slug:"ajaytips",avatar:"",theme:{bg:"#121a24",card:"#ffffff",text:"#f8fafb",showCta:true,newTab:true},links:[
{id:"l1",title:"Ajaytips (@ajaytips0806)",url:"https://www.youtube.com/@ajaytips0806",icon:"youtube",clicks:0},
{id:"l2",title:"Ajaytips App (Google Play Store)",url:"https://play.google.com/store/apps/details?id=com.diy18.ajaytips",icon:"playstore",clicks:0},
{id:"l3",title:"Ajaytips Official (WhatsApp Channel)",url:"https://whatsapp.com/channel/0029Vajra07KGGGDcCB23G1G",icon:"whatsapp",clicks:0},
{id:"l4",title:"@ajay_tips (Instagram)",url:"https://www.instagram.com/ajay_tips",icon:"instagram",clicks:0},
{id:"l5",title:"Ajaytips (Telegram Channel)",url:"https://t.me/ajaytips",icon:"telegram",clicks:0},
{id:"l6",title:"Ajay Sir (X / Twitter)",url:"https://x.com/ajay_tips",icon:"x",clicks:0}
],views:0}]};
let state=load(),activeId=state.profiles[0]?.id,tab="overviewTab",adminCredentials=null,localRevision=0,syncQueue=Promise.resolve();
const $=id=>document.getElementById(id);
function load(){
  try{
    const x=JSON.parse(localStorage.getItem(KEY));
    if(x?.profiles?.length&&x.profiles.some(p=>p.slug==="ajaytips"||(p.name&&p.name.toLowerCase().includes("ajay"))))return x;
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
const icons={
  youtube:["▶","youtube"],
  playstore:["📱","playstore"],
  whatsapp:["◉","whatsapp"],
  telegram:["➤","telegram"],
  instagram:["◎","instagram"],
  x:["𝕏","x"],
  facebook:["f","facebook"],
  website:["↗","website"],
  graduation:["🎓","graduation"],
  custom:["✦","custom"]
};
function validUrl(s){try{let u=new URL(s);return ["https:","http:"].includes(u.protocol)?u.href:"#"}catch{return "#"}}
function profileUrl(p){let u=new URL(location.href);u.searchParams.set("p",p.slug);return u.href}
function avatar(img,fb,p){
  if(p.avatar){
    img.src=p.avatar;
    img.style.display="block";
    if(fb)fb.style.display="none";
  }else{
    img.removeAttribute("src");
    img.style.display="none";
    if(fb){
      fb.textContent=initials(p.name);
      fb.style.display="grid";
    }
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
  avatar($("adminAvatarPreview"),null,p);
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
    if((location.protocol==="file:"||["localhost","127.0.0.1"].includes(location.hostname))&&username==="admin"&&password==="ajay123"){
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
$("publicLinks").addEventListener("click",e=>{
  let a=e.target.closest("a[data-link]");
  if(!a)return;
  let p=active(),l=p.links.find(x=>x.id===a.dataset.link);
  if(l){l.clicks=(l.clicks||0)+1;localStorage.setItem(KEY,JSON.stringify(state));}
});
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
  if(f.size>2*1024*1024)return toast("Image must be under 2 MB");
  let r=new FileReader();
  r.onload=()=>{active().avatar=r.result;persist(true)};
  r.readAsDataURL(f);
};
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
$("addProfileButton").onclick=()=>$("profileDialog").showModal();
$("newProfileForm").onsubmit=e=>{
  e.preventDefault();
  let name=$("newProfileName").value.trim(),slug=slugify($("newProfileSlug").value);
  if(!slug)return toast("Enter a valid slug");
  if(state.profiles.some(p=>p.slug===slug))return toast("Slug already exists");
  let p={id:"p"+Date.now(),name,bio:$("newProfileBio").value.trim(),slug,avatar:"",views:0,theme:{bg:"#121a24",card:"#ffffff",text:"#f8fafb",showCta:true,newTab:true},links:[]};
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
(async function init(){
  const adminRoute=location.pathname.replace(/\/+$/,"")==="/admin",slug=new URLSearchParams(location.search).get("p"),revision=localRevision;
  let match=state.profiles.find(p=>p.slug===slug || (slug==="ajay-sir" && p.slug==="ajaytips"));
  if(match)activeId=match.id;
  renderPublic();
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
      localStorage.setItem(KEY,JSON.stringify(state));
      activeId=state.profiles.find(p=>p.slug===slug || (slug==="ajay-sir" && p.slug==="ajaytips"))?.id||state.profiles[0].id;
      renderPublic();
      if(!$("adminPage").classList.contains("hidden"))renderAdmin();
    }
  }catch{}
})();
