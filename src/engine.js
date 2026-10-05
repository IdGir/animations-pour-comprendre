/* Moteur d'animations pédagogiques — étapes, pas-à-pas, vitesse, voix off fr-FR */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const lerp=(a,b,t)=>a+(b-a)*t;

/* ---------- helpers SVG ---------- */
function el(tag,attrs,parent){
  const e=document.createElementNS(NS,tag);
  if(attrs) for(const k in attrs){ if(k==="text") e.textContent=attrs[k]; else if(attrs[k]!==undefined&&attrs[k]!==null) e.setAttribute(k,attrs[k]); }
  if(parent) parent.appendChild(e);
  return e;
}
function set(e,attrs){ for(const k in attrs){ if(k==="text") e.textContent=attrs[k]; else e.setAttribute(k,attrs[k]); } return e; }

const H={
  ease,lerp,clamp,el,set,
  /* progression locale d'un sous-intervalle [a,b] de t, avec easing */
  seg(t,a,b,noEase){ const v=clamp((t-a)/(b-a),0,1); return noEase?v:ease(v); },
  op(e,v){ if(!e) return; if(e._missing){ e.style.display="none"; return; } e.setAttribute("opacity",clamp(v,0,1)); e.style.display=v<=0.001?"none":""; },
  show(e){H.op(e,1)}, hide(e){H.op(e,0)},
  /* tracé progressif d'un chemin */
  draw(p,t){ if(!p) return; let L=p._len; if(L===undefined){ try{L=p.getTotalLength();}catch(_){L=1000} p._len=L; }
    p.style.strokeDasharray=L+" "+L; p.style.strokeDashoffset=L*(1-clamp(t,0,1)); p.style.display=t<=0.001?"none":""; },
  tr(e,x,y,s,r){ e.setAttribute("transform",`translate(${x},${y})`+(s!==undefined&&s!==1?` scale(${s})`:"")+(r?` rotate(${r})`:"")); },
  /* point le long d'un chemin */
  along(p,t){ let L=p._len; if(L===undefined){L=p.getTotalLength();p._len=L;} const q=p.getPointAtLength(L*clamp(t,0,1)); return {x:q.x,y:q.y}; },
  num(e,v,dec,suffix){ e.textContent=(dec?v.toFixed(dec).replace(".",","):Math.round(v).toLocaleString("fr-FR"))+(suffix||""); },
  cls(e,c,on){ if(e) e.classList.toggle(c,!!on); },
  /* texte multi-lignes (retour à la ligne approximatif) */
  wrap(textEl,str,maxChars,lh){
    while(textEl.firstChild) textEl.removeChild(textEl.firstChild);
    const x=textEl.getAttribute("x")||0; lh=lh||1.2;
    const lines=[]; str.split("\n").forEach(par=>{ let cur=""; par.split(" ").forEach(w=>{ if((cur+" "+w).trim().length>maxChars&&cur){lines.push(cur);cur=w;} else cur=(cur?cur+" ":"")+w; }); lines.push(cur); });
    lines.forEach((l,i)=>{ const ts=el("tspan",{x,dy:i===0?0:lh+"em"},textEl); ts.textContent=l; });
    return lines.length;
  },
  /* étiquette = rectangle arrondi + texte centré */
  label(parent,x,y,str,o){
    o=o||{}; const g=el("g",{},parent); const fs=o.size||26;
    const lines=str.split("\n"); const w=o.w||Math.max(...lines.map(l=>l.length))*fs*0.56+fs*1.1; const h=o.h||lines.length*fs*1.22+fs*0.7;
    el("rect",{x:x-w/2,y:y-h/2,width:w,height:h,rx:o.rx??12,fill:o.fill||"#fff",stroke:o.stroke||"#1E2430","stroke-width":o.sw??2.5},g);
    const t=el("text",{x,y:y-(lines.length-1)*fs*0.61+fs*0.35,"text-anchor":"middle","font-size":fs,"font-weight":o.weight||700,fill:o.color||"#1E2430"},g);
    lines.forEach((l,i)=>{ el("tspan",{x,dy:i?fs*1.22:0,text:l},t); });
    g._w=w; g._h=h; return g;
  },
  /* flèche (ligne ou courbe) avec pointe */
  arrow(parent,d,o){
    o=o||{}; const g=el("g",{},parent); const col=o.color||"#E07A1F"; const id="ah"+Math.random().toString(36).slice(2,8);
    const defs=el("defs",{},g); const m=el("marker",{id,viewBox:"0 0 10 10",refX:7,refY:5,markerWidth:o.head||4,markerHeight:o.head||4,orient:"auto-start-reverse"},defs);
    el("path",{d:"M0,0 L10,5 L0,10 z",fill:col},m);
    const p=el("path",{d,fill:"none",stroke:col,"stroke-width":o.w||6,"stroke-linecap":"round","marker-end":`url(#${id})`,"stroke-dasharray":o.dash||null},g);
    g.path=p; return g;
  },
  /* photo d'illustration (chargée depuis ../photos/<id>.jpg ; ignorée si absente — voir telecharger-photos.mjs) */
  photo(parent,o){
    const g=el("g",{},parent); const cr=(window.PHOTO_CREDITS||{})[o.id];
    if(!cr){ g._missing=true; g.style.display="none"; return g; }
    const {x,y,w,h}=o, cap=o.cap||"", uid="pc"+Math.random().toString(36).slice(2,8);
    const inner=el("g",{transform:`translate(${x},${y})`+(o.rot?` rotate(${o.rot})`:"")},g);
    const fh=h+(cap?58:20)+22;
    el("rect",{x:-12,y:-12,width:w+24,height:fh,rx:8,fill:"#fff",stroke:"#C9CED8","stroke-width":2,filter:"drop-shadow(0 4px 8px rgba(0,0,0,.28))"},inner);
    const cp=el("clipPath",{id:uid},inner); el("rect",{x:0,y:0,width:w,height:h,rx:3},cp);
    el("rect",{x:0,y:0,width:w,height:h,fill:"#E6E9EF"},inner);
    el("image",{href:"../photos/"+o.id+".jpg",x:0,y:0,width:w,height:h,preserveAspectRatio:"xMidYMid slice","clip-path":`url(#${uid})`},inner);
    if(cap) el("text",{x:w/2,y:h+32,"text-anchor":"middle","font-size":o.size||22,"font-weight":700,fill:"#1E2430",text:cap},inner);
    const mx=Math.floor(w/6.6); const ct=cr.length>mx?cr.slice(0,mx-1)+"…":cr;
    el("text",{x:w/2,y:h+(cap?52:16),"text-anchor":"middle","font-size":13,fill:"#5A6478",text:ct},inner);
    g._h=fh; return g;
  },
  /* carte "idée fausse / en réalité" */
  myth(parent,x,y,w,faux,vrai){
    const g=el("g",{},parent); const fs=24;
    const t1=el("text",{x:x+70,y:y+44,"font-size":fs,"font-weight":600,fill:"#7A1D12"},null);
    const t2=el("text",{x:x+70,y:0,"font-size":fs,"font-weight":600,fill:"#14532D"},null);
    const n1=H.wrap(t1,faux,Math.floor((w-90)/(fs*0.5)));
    const h1=n1*fs*1.2+40;
    const r1=el("rect",{x,y,width:w,height:h1,rx:14,fill:"#FDECEA",stroke:"#C0392B","stroke-width":3},g);
    el("text",{x:x+20,y:y+46,"font-size":34,"font-weight":800,fill:"#C0392B",text:"✗"},g); g.appendChild(t1);
    const y2=y+h1+14; t2.setAttribute("y",y2+44);
    const n2=H.wrap(t2,vrai,Math.floor((w-90)/(fs*0.5)));
    const h2=n2*fs*1.2+40;
    el("rect",{x,y:y2,width:w,height:h2,rx:14,fill:"#E8F6EE",stroke:"#2E8B57","stroke-width":3},g);
    el("text",{x:x+18,y:y2+46,"font-size":34,"font-weight":800,fill:"#2E8B57",text:"✓"},g); g.appendChild(t2);
    g.faux=r1; g._h=h1+14+h2; return g;
  },
  /* frise chronologique persistante */
  frise(parent,o){
    const g=el("g",{},parent); const {x,y,w,debut,fin}=o; const sc=v=>x+(v-debut)/(fin-debut)*w;
    el("rect",{x:x-10,y:y-34,width:w+20,height:92,rx:12,fill:"#fff",stroke:"#D6DBE4","stroke-width":2},g);
    el("line",{x1:x,y1:y,x2:x+w,y2:y,stroke:"#1E2430","stroke-width":4},g);
    (o.ticks||[]).forEach(v=>{ el("line",{x1:sc(v),y1:y-8,x2:sc(v),y2:y+8,stroke:"#1E2430","stroke-width":2},g); el("text",{x:sc(v),y:y+32,"text-anchor":"middle","font-size":20,fill:"#4A5468",text:v<0?(-v)+" av. J.-C.":String(v)},g); });
    (o.periodes||[]).forEach(p=>{ const r=el("rect",{x:sc(p.a),y:y-24,width:sc(p.b)-sc(p.a),height:14,rx:5,fill:p.color,opacity:.85},g); el("text",{x:(sc(p.a)+sc(p.b))/2,y:y-30,"text-anchor":"middle","font-size":17,"font-weight":700,fill:p.color,text:p.nom},g); });
    const evts={}; (o.events||[]).forEach(e=>{ const eg=el("g",{},g); el("circle",{cx:sc(e.d),cy:y,r:9,fill:e.color||"#A8431F",stroke:"#fff","stroke-width":2},eg); el("text",{x:sc(e.d),y:y+(e.up?-40:54),"text-anchor":"middle","font-size":19,"font-weight":700,fill:e.color||"#A8431F",text:e.label},eg); evts[e.id]=eg; });
    const cur=el("g",{},g); el("path",{d:"M0,-30 L0,14",stroke:"#E07A1F","stroke-width":5},cur); el("path",{d:"M-11,-40 L11,-40 L0,-26 z",fill:"#E07A1F"},cur);
    const curT=el("text",{x:0,y:-46,"text-anchor":"middle","font-size":22,"font-weight":800,fill:"#E07A1F"},cur);
    g.events=evts; g.sc=sc;
    g.at=(v,lbl)=>{ H.tr(cur,sc(v),y); curT.textContent=lbl!==undefined?lbl:Math.round(v); };
    g.cursor=cur; return g;
  }
};


/* ---------- lexique de prononciation (voix off uniquement : l'affichage ne change pas) ---------- */
const ORD={1:"premier",2:"deuxième",3:"troisième",4:"quatrième",5:"cinquième",6:"sixième",7:"septième",8:"huitième",9:"neuvième",10:"dixième",11:"onzième",12:"douzième",13:"treizième",14:"quatorzième",15:"quinzième",16:"seizième",17:"dix-septième",18:"dix-huitième",19:"dix-neuvième",20:"vingtième",21:"vingt et unième"};
function roman(r){ const m={I:1,V:5,X:10,L:50,C:100}; let n=0; for(let i=0;i<r.length;i++){ const v=m[r[i]],w=m[r[i+1]]||0; n+=v<w?-v:v; } return n; }
const LEXIQUE=[
  [/\bmoyen[\s\-]+[aâ]ge\b/gi,"moyin nâge"],
  [/\bmoyen[\s\-]+[aâ]geux\b/gi,"moyin nâgeux"],
  [/\btamis(age|ages|er|é|ée|és|ées|e|es|eur|ons|ez)\b/gi,(m,x)=>"tamiz"+x],
  [/\bsiècles?\b/gi,m=>m],
  [/\bœ/g,"eu"],
  [/\bhPa\b/g,"hectopascals"],[/\bm\/s\b/g,"mètres par seconde"],[/\bm³/g,"mètres cubes"],[/\bcm³/g,"centimètres cubes"],[/\bmL\b/g,"millilitres"],[/\bCO₂|\bCO2\b/g,"dioxyde de carbone"],
  [/\bVézelay\b/g,"Vézelé"],[/\bCîteaux\b/g,"Cito"],[/\bGreenwich\b/g,"Grénitch"],[/\bhôtels?-Dieu\b/gi,"ôtel-Dieu"],
  [/\bkm\/h\b/gi,"kilomètres par heure"],
  [/\bkm\b/gi,"kilomètres"],
  [/\bcm\b/gi,"centimètres"],
  [/\bmm\b/gi,"millimètres"],
  [/\b(\d+)\s?g\b/g,"$1 grammes"],
  [/\bkg\b/gi,"kilogrammes"],
  [/°C/g," degrés Celsius"],
  [/%/g," pour cent"],
  [/×/g," fois "],
  [/\bhab\.?\/km²/gi,"habitants par kilomètre carré"],
  [/\bkm²/gi,"kilomètres carrés"],
  [/\bav\. J\.?-C\.?/gi,"avant Jésus-Christ"],
  [/\bapr\. J\.?-C\.?/gi,"après Jésus-Christ"],
  [/\bM\.\s/g,"monsieur "],
  [/\bXIe\b/g,"onzième"],
  [/\b([IVXL]+)(e|er|ème)\b/g,(m,r,e)=>{ const n=roman(r); return ORD[n]?(e==="er"?"premier":ORD[n]):m; }],
  [/\b1er\b/g,"premier"],[/\b(\d+)e\b/g,(m,n)=>ORD[+n]||m],
  [/\s*[—–]\s*/g,", "],
  [/\s*\/\s*/g," ou "],
  [/\s*\(\s*/g,", "],[/\s*\)\s*/g,", "],
];
function prononcer(txt){ let t=" "+txt+" "; for(const [re,rep] of LEXIQUE) t=t.replace(re,rep); return t.replace(/\s+/g," ").replace(/(,\s*){2,}/g,", ").replace(/\s+,/g,",").trim(); }

/* ---------- voix off ---------- */
const Voice={
  on:true, voice:null, ready:false, cur:null,
  init(){
    if(!("speechSynthesis" in window)){ this.on=false; this.ok=false; return; }
    this.ok=true;
    const pick=()=>{ const vs=speechSynthesis.getVoices().filter(v=>/^fr/i.test(v.lang)); if(!vs.length) return;
      const pref=["Denise","Vivienne","Eloise","Henri","Rémy","Remy","Google français","Amélie","Amelie","Thomas","Audrey","Hortense","Julie","Paul"];
      const fr=vs.filter(v=>/fr[-_]FR/i.test(v.lang)); const pool=fr.length?fr:vs;
      let best=null; for(const p of pref){ best=pool.find(v=>v.name.includes(p)&&/Natural|Online|Neural/i.test(v.name))||null; if(best) break; }
      if(!best) for(const p of pref){ best=pool.find(v=>v.name.includes(p))||null; if(best) break; }
      this.voice=best||pool[0]; this.ready=true; };
    pick(); speechSynthesis.onvoiceschanged=pick;
  },
  speak(text,rate){
    return new Promise(res=>{
      if(!this.on||!this.ok||!text){ res(); return; }
      try{ speechSynthesis.cancel(); }catch(_){}
      const id=(this.id=(this.id||0)+1);
      // découpage en phrases (évite la coupure des longues lectures dans Chrome)
      const parts=(prononcer(text).replace(/[✗✓→←]/g,"").match(/[^.!?;:]+[.!?;:]*/g)||[text]).map(x=>x.trim()).filter(Boolean);
      let done=false; const fin=()=>{ if(!done){done=true; clearTimeout(to); res();} };
      const to=setTimeout(fin,(text.length/11/rate+5)*1000); // garde-fou
      const next=k=>{ if(id!==this.id||k>=parts.length){ fin(); return; }
        const u=new SpeechSynthesisUtterance(parts[k]); u.lang="fr-FR"; if(this.voice) u.voice=this.voice; u.rate=rate; u.pitch=1;
        u.onend=()=>next(k+1); u.onerror=()=>next(k+1); this.cur=u; speechSynthesis.speak(u); };
      next(0);
    });
  },
  stop(){ this.id=(this.id||0)+1; if(this.ok) try{ speechSynthesis.cancel(); }catch(_){} }
};

/* ---------- application ---------- */
window.Anim={ H, run(cfg){
  document.body.className="m-"+(cfg.matiere||"sciences");
  document.title=cfg.titre;
  const [VW,VH]=cfg.viewBox||[1600,900];
  document.body.innerHTML=`<div id="app">
   <header><a class="hbtn" href="../index.html" title="Toutes les animations" style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none">☰</a><span class="badge">${cfg.badge||cfg.matiere}</span><h1>${cfg.titre}<small>${cfg.sousTitre||""}</small></h1>
   <button class="hbtn" id="bVoice" title="Voix off (V)">🔊</button><button class="hbtn" id="bFull" title="Plein écran (F)">⛶</button></header>
   <div id="stageWrap"><svg id="stage" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid meet"></svg>
     <div id="overlay"><div class="big">▶</div><p>${cfg.accroche||"Lance l'animation"}</p><p class="sub">Espace : lecture/pause · ← → : étapes · R : recommencer · F : plein écran</p></div></div>
   <div id="manip"></div>
   <div id="caption"><span class="num" id="cNum">1</span><span id="cTxt"></span></div>
   <div id="bar"><div class="ctl"><button class="cbtn" id="bRe" title="Recommencer (R)">⏮</button><button class="cbtn" id="bPrev" title="Étape précédente (←)">◀</button><button class="cbtn play" id="bPlay" title="Lecture / pause (Espace)">▶</button><button class="cbtn" id="bNext" title="Étape suivante (→)">▶|</button></div>
   <button class="cbtn go" id="bGo" style="display:none" title="Continuer (Espace)">Continuer ▶</button><div id="dots"></div>
   <div class="speed">Vitesse <input type="range" id="sp" min="0" max="6" step="1" value="3"><b id="spv">×1</b></div></div></div>`;
  const svg=document.getElementById("stage");
  const $=id=>document.getElementById(id);
  const steps=cfg.etapes, N=steps.length;
  const api=Object.assign({interactif:true,svg,W:VW,H:VH,manip:$("manip"),step:()=>S.k,redraw:()=>render()},H);
  // fond et calques
  el("rect",{x:0,y:0,width:VW,height:VH,fill:"#fff",rx:14},svg);
  api.layer=name=>el("g",{id:name},svg);
  cfg.init(api);

  const SPEEDS=[.25,.5,.75,1,1.25,1.5,2];
  const S={k:0,t:0,playing:false,running:false,started:false,speed:1,raf:0,token:0};

  // frise des étapes
  const dots=$("dots");
  steps.forEach((s,i)=>{ if(i){ const sg=document.createElement("div"); sg.className="seg"; dots.appendChild(sg);} const b=document.createElement("button"); b.className="dot"; b.textContent=i+1; b.title=s.titre||("Étape "+(i+1)); b.onclick=()=>{ jump(i); }; dots.appendChild(b); });

  function render(){
    if(cfg.reset) cfg.reset(api);
    for(let i=0;i<S.k;i++) steps[i].anim(1,api);
    steps[S.k].anim(S.t,api);
    if(cfg.after) cfg.after(api,S.k,S.t);
    // UI
    $("cNum").textContent=(S.k+1)+"/"+N; $("cTxt").textContent=steps[S.k].legende;
    [...dots.querySelectorAll(".dot")].forEach((d,i)=>{ d.classList.toggle("done",i<S.k||(i===S.k&&S.t>=1)); d.classList.toggle("cur",i===S.k); });
    [...dots.querySelectorAll(".seg")].forEach((d,i)=>d.classList.toggle("done",i<S.k));
    $("bPlay").textContent=S.playing?"⏸":"▶"; $("bGo").style.display=S.waiting?"":"none"; $("bGo").classList.toggle("pulse",!!S.waiting); $("manip").classList.toggle("wait",!!S.waiting);
    const m=cfg.manipDes, mj=cfg.manipJusqua??N; $("manip").classList.toggle("on",m!==undefined&&S.k>=m&&S.k<=mj);
  }
  const enManip=k=>cfg.manipDes!==undefined&&k>=cfg.manipDes&&k<=(cfg.manipJusqua??N)&&k<N-1;
  function stopAnim(){ S.waiting=false; cancelAnimationFrame(S.raf); S.running=false; S.token++; Voice.stop(); }
  function runStep(){
    stopAnim(); $("overlay").classList.add("hide"); S.started=true;
    const tok=S.token; const st=steps[S.k]; const dur=(st.duree||4000);
    let last=performance.now(); S.running=true;
    const vp=Voice.speak(st.voix||st.legende, clamp(0.95*Math.sqrt(S.speed),0.6,1.5));
    const tick=now=>{ if(tok!==S.token) return; const dt=Math.min(now-last,100); last=now; S.t=clamp(S.t+dt*S.speed/dur,0,1); render(); if(S.t<1) S.raf=requestAnimationFrame(tick); else { S.running=false; vp.then(()=>{ if(tok!==S.token) return; if(S.playing&&enManip(S.k)){ S.playing=false; S.waiting=true; render(); return; } if(S.playing){ if(S.k<N-1){ setTimeout(()=>{ if(tok!==S.token||!S.playing) return; S.k++; S.t=0; runStep(); },700/S.speed); } else { S.playing=false; render(); } } }); } };
    S.raf=requestAnimationFrame(tick);
  }
  function play(){ if(S.waiting){ goOn(); return; } if(S.playing){ S.playing=false; stopAnim(); render(); return; }
    S.playing=true; if(S.t>=1){ if(S.k<N-1){S.k++;S.t=0;} else {S.k=0;S.t=0;} } runStep(); render(); }
  function goOn(){ S.waiting=false; if(S.k<N-1){ S.k++; S.t=0; S.playing=true; runStep(); render(); } }
  function next(){ if(S.waiting){ goOn(); return; } S.playing=false; if(!S.started||(S.t<1&&!S.running)){ runStep(); return; } if(S.k<N-1){ S.k++; S.t=0; runStep(); } else { stopAnim(); S.t=1; render(); } }
  function prev(){ S.playing=false; if(S.k>0) S.k--; S.t=0; runStep(); }
  function jump(i){ S.playing=false; S.k=i; S.t=0; runStep(); }
  function restart(){ S.playing=false; stopAnim(); S.k=0; S.t=0; S.started=false; $("overlay").classList.remove("hide"); render(); }
  $("overlay").onclick=()=>{ S.playing=true; runStep(); render(); };
  $("bGo").onclick=goOn; $("bPlay").onclick=play; $("bNext").onclick=next; $("bPrev").onclick=prev; $("bRe").onclick=restart;
  $("sp").oninput=e=>{ S.speed=SPEEDS[+e.target.value]; $("spv").textContent="×"+String(S.speed).replace(".",","); };
  Voice.init(); if(!Voice.ok) $("bVoice").classList.add("off");
  $("bVoice").onclick=()=>{ Voice.on=!Voice.on; if(!Voice.on) Voice.stop(); $("bVoice").classList.toggle("off",!Voice.on); $("bVoice").textContent=Voice.on?"🔊":"🔇"; };
  $("bFull").onclick=()=>{ const a=$("app"); if(!document.fullscreenElement) (a.requestFullscreen||a.webkitRequestFullscreen).call(a).catch?.(()=>{}); else document.exitFullscreen(); };
  document.addEventListener("keydown",e=>{ if(e.target.tagName==="INPUT"&&e.target.type!=="range") return;
    if(e.code==="Space"){e.preventDefault();play();} else if(e.key==="ArrowRight"){e.preventDefault();next();} else if(e.key==="ArrowLeft"){e.preventDefault();prev();}
    else if(e.key==="r"||e.key==="R") restart(); else if(e.key==="f"||e.key==="F") $("bFull").click(); else if(e.key==="v"||e.key==="V") $("bVoice").click(); });
  window.__anim={S,N,render,jump,next,prev,restart,setT:(k,t)=>{stopAnim();S.k=k;S.t=t;S.started=true;$("overlay").classList.add("hide");render();}};
  render();
}};
})();
