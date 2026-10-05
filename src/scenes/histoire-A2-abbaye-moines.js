/* META {"id":"histoire-A2-abbaye-moines","matiere":"histoire","annee":"A","periode":1,"theme":"Le Moyen Âge : des rois francs aux … / vie religieuse et savoir","resume":"Plan d'une abbaye cistercienne (Fontenay) qui se construit, puis journée d'un moine rythmée par la règle de saint Benoît : on prie, mais on travaille aussi.","motsCles":["abbaye","moine","règle de saint Benoît","cloître","Fontenay","Cluny","Cîteaux","scriptorium","forge"]} */
//@data france
(function(){
const FR=FRANCE;
const C={ink:"#1E2430",stone:"#E7DCC8",stoneD:"#8A7656",grass:"#EAF1DC",water:"#8EC5E8",waterD:"#2B7BB0",pr:"#6B3FA0",tr:"#E07A1F",le:"#2563A8",re:"#2E8B57",so:"#7A8499",acc:"#A8431F"};
const KIND={pr:{nom:"Prière",col:C.pr},tr:{nom:"Travail manuel",col:C.tr},le:{nom:"Lecture et étude",col:C.le},re:{nom:"Repas",col:C.re},so:{nom:"Sommeil et repos",col:C.so}};
// Exemple d'horaire d'été (d'après la règle, ch. 48) : [début, fin, nature, nom, lieu]
const L={dort:[640,362],egl:[705,85],clo:[340,148],scr:[575,328],forg:[712,522],ref:[445,470],jard:[230,625]};
const DAY=[[0,2,"so","Sommeil","dort"],[2,3,"pr","Vigiles","egl"],[3,5,"le","Lecture","clo"],[5,6,"pr","Laudes","egl"],[6,6.5,"pr","Prime","egl"],[6.5,9,"tr","Travail","forg"],[9,9.5,"pr","Tierce","egl"],[9.5,10,"tr","Travail","forg"],[10,12,"le","Lecture, copie","scr"],[12,12.5,"pr","Sexte","egl"],[12.5,13,"re","Repas","ref"],[13,14.5,"so","Repos","dort"],[14.5,15,"pr","None","egl"],[15,17.5,"tr","Travail","jard"],[17.5,18,"pr","Vêpres","egl"],[18,19,"re","Repas du soir","ref"],[19,19.5,"pr","Complies","egl"],[19.5,24,"so","Sommeil","dort"]];
const KORD=["pr","tr","le","re","so"];
function cum(h){ const o={pr:0,tr:0,le:0,re:0,so:0}; DAY.forEach(s=>{ o[s[2]]+=Math.max(0,Math.min(s[1],h)-s[0]); }); return o; }
function segAt(h){ h=Math.min(h,23.999); let i=DAY.findIndex(s=>h>=s[0]&&h<s[1]); return i<0?DAY.length-1:i; }
function monkPos(h){ const i=segAt(h), s=DAY[i], p=L[s[4]]; if(i===0) return p; const q=L[DAY[i-1][4]]; const k=Math.max(0,Math.min(1,(h-s[0])/0.4)); const e=k*k*(3-2*k); return [q[0]+(p[0]-q[0])*e,q[1]+(p[1]-q[1])*e]; }
const CK={x:1270,y:385,R:205,r:125};
const pt=(h,rad)=>{ const th=h/24*2*Math.PI-Math.PI/2; return [CK.x+rad*Math.cos(th),CK.y+rad*Math.sin(th)]; };
function sector(h0,h1){ if(h1-h0<0.005) return ""; const a=pt(h0,CK.R),b=pt(h1,CK.R),c=pt(h1,CK.r),d=pt(h0,CK.r); const big=(h1-h0)/24>0.5?1:0;
  return `M${a[0]},${a[1]} A${CK.R},${CK.R} 0 ${big} 1 ${b[0]},${b[1]} L${c[0]},${c[1]} A${CK.r},${CK.r} 0 ${big} 0 ${d[0]},${d[1]} Z`; }
const R={};
function setClock(a,h){ const i=segAt(h), sg=DAY[i];
  R.live.forEach((p,j)=>{ const d=DAY[j]; p.setAttribute("d",sector(d[0],Math.min(d[1],h))); });
  a.tr(R.hand,CK.x,CK.y,1,h/24*360);
  const hh=Math.floor(h)%24, mm=Math.floor((h-Math.floor(h))*60/5)*5; R.cH.textContent=hh+" h "+(mm<10?"0":"")+mm;
  R.cN.textContent=sg[3]; R.cK.textContent=KIND[sg[2]].nom.split(" ")[0].toLowerCase(); R.cK.setAttribute("fill",KIND[sg[2]].col);
  const mp=monkPos(h); a.tr(R.moine,mp[0],mp[1]);
  const c=cum(h); KORD.forEach((k,j)=>{ const r=R.barR[j]; r.b.setAttribute("width",c[k]*22); a.num(r.v,c[k],1," h"); r.v.setAttribute("x",1255+c[k]*22+10); }); }
let touched=false, mH=10.5;

function room(p,x,y,w,h,fill,txt,o){ o=o||{}; const g=Anim.H.el("g",{},p); Anim.H.el("rect",{x,y,width:w,height:h,fill,stroke:C.stoneD,"stroke-width":3},g);
  const ls=txt.split("\n"), fs=o.size||24; const t=Anim.H.el("text",{x:x+w/2,y:y+h/2+(o.dy||0)-(ls.length-1)*fs*0.6+fs*0.35,"text-anchor":"middle","font-size":fs,"font-weight":800,fill:o.col||C.ink},g);
  ls.forEach((l,i)=>Anim.H.el("tspan",{x:x+w/2,dy:i?fs*1.2:0,text:l},t)); return g; }

Anim.run({
  titre:"L'abbaye et la journée d'un moine",
  sousTitre:"Histoire · CM1-CM2 · Le Moyen Âge : vie religieuse et savoir",
  matiere:"histoire", badge:"Histoire", manipDes:5, manipJusqua:5,
  accroche:"Que fait un moine de l'aube à la nuit ? Les moines ne font-ils que prier ?",
  init(a){
    const {el}=a;
    const defs=el("defs",{},a.svg);
    const plan=a.layer("plan"); R.plan=plan; a.tr(plan,40,110);
    const right=a.layer("droite"); R.right=right;
    // titre du plan
    R.titre=el("g",{},a.svg);
    el("text",{x:40,y:56,"font-size":28,"font-weight":800,fill:C.acc,text:"Plan simplifié d'une abbaye cistercienne (vue de dessus)"},R.titre);
    el("text",{x:40,y:88,"font-size":22,fill:"#4A5468",text:"d'après l'abbaye de Fontenay, en Côte-d'Or · pointillés = mur d'enceinte"},R.titre);
    // sol + enceinte
    R.sol=el("g",{},plan);
    el("rect",{x:0,y:0,width:900,height:700,rx:16,fill:C.grass},R.sol);
    R.mur=el("rect",{x:0,y:0,width:900,height:700,rx:16,fill:"none",stroke:"#7A6A48","stroke-width":5,"stroke-dasharray":"16 10"},plan);
    // ruisseau
    R.ruis=el("path",{d:"M900,330 C850,380 812,440 792,520 C776,590 700,650 620,700",fill:"none",stroke:C.water,"stroke-width":26,"stroke-linecap":"round"},plan);
    R.ruisT=el("text",{x:858,y:430,"font-size":22,"font-weight":700,fill:C.waterD,"text-anchor":"end",text:"ruisseau"},plan);
    // église
    R.egl=el("g",{},plan);
    R.eglF=el("path",{d:"M100,45 L540,45 L540,0 L660,0 L660,45 L760,45 L760,125 L660,125 L660,190 L540,190 L540,125 L100,125 Z",fill:C.stone,stroke:C.stoneD,"stroke-width":4,"stroke-linejoin":"round"},R.egl);
    R.eglL=el("path",{d:"M100,45 L540,45 L540,0 L660,0 L660,45 L760,45 L760,125 L660,125 L660,190 L540,190 L540,125 L100,125 Z",fill:"none",stroke:C.pr,"stroke-width":6,"stroke-linejoin":"round"},R.egl);
    R.eglT=el("text",{x:320,y:94,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"Église"},R.egl);
    R.eglC=el("path",{d:"M600,60 V130 M570,82 H630",stroke:C.stoneD,"stroke-width":5,"stroke-linecap":"round"},R.egl);
    // cloître
    R.clo=el("g",{},plan);
    el("rect",{x:190,y:125,width:300,height:300,fill:"#DCCFB4",stroke:C.stoneD,"stroke-width":3},R.clo);
    el("rect",{x:230,y:165,width:220,height:220,fill:"#B9D69A",stroke:C.stoneD,"stroke-width":2},R.clo);
    el("circle",{cx:340,cy:290,r:14,fill:C.water,stroke:C.waterD,"stroke-width":3},R.clo);
    el("text",{x:340,y:250,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"Cloître"},R.clo);
    R.cloL=el("text",{x:340,y:345,"text-anchor":"middle","font-size":22,fill:"#3E5A2A",text:"jardin au centre"},R.clo);
    // ailes
    R.est1=room(plan,490,190,170,75,C.stone,"Salle\ncapitulaire",{size:22});
    R.est2=room(plan,490,265,170,80,"#F1E3B8","Scriptorium",{size:22,col:C.le,dy:-16});
    R.est3=room(plan,490,345,170,80,"#D7DDEA","Dortoir\n(à l'étage)",{size:22});
    R.sud=room(plan,190,425,300,85,"#DDEBD3","Réfectoire",{size:26,col:C.re});
    R.ouest=room(plan,78,125,112,300,C.stone,"Cellier",{size:22,dy:-12});
    R.ouestS=el("text",{x:134,y:300,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"(réserves)"},R.ouest);
    // forge + roue
    R.forge=el("g",{},plan);
    el("rect",{x:570,y:455,width:175,height:92,fill:"#E3C9B8",stroke:"#7A4A33","stroke-width":3},R.forge);
    el("path",{d:"M558,458 L657,418 L757,458Z",fill:"#B0492B",stroke:"#6E2914","stroke-width":3},R.forge);
    el("text",{x:657,y:515,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Forge"},R.forge);
    R.roue=el("g",{},plan);
    el("circle",{r:32,fill:"#B98A55",stroke:"#6A4A22","stroke-width":4},R.roue); el("circle",{r:6,fill:"#6A4A22"},R.roue);
    for(let i=0;i<8;i++){ const th=i*Math.PI/4; el("line",{x1:0,y1:0,x2:32*Math.cos(th),y2:32*Math.sin(th),stroke:"#6A4A22","stroke-width":4},R.roue); }
    R.roueT=el("text",{x:775,y:582,"text-anchor":"start","font-size":22,"font-weight":700,fill:C.waterD,text:"roue à eau"},plan);
    // jardin
    R.jard=el("g",{},plan);
    el("rect",{x:40,y:545,width:380,height:135,rx:10,fill:"#D2E5B0",stroke:"#6C8F3C","stroke-width":3},R.jard);
    for(let i=0;i<5;i++) el("rect",{x:60+i*72,y:590,width:56,height:76,rx:6,fill:"#8DBB5A",stroke:"#5B8A2E","stroke-width":2},R.jard);
    el("text",{x:230,y:574,"text-anchor":"middle","font-size":24,"font-weight":800,fill:"#33581A",text:"Jardin et potager"},R.jard);
    // lieux pour les lueurs (étape 6)
    R.glowScr=R.est2; R.glowForge=R.forge; R.glowJard=R.jard; R.glowClo=R.clo;
    // moine
    R.moine=el("g",{},plan);
    el("circle",{r:26,fill:C.tr,opacity:.35},R.moine);
    el("path",{d:"M-13,14 L-8,-6 L8,-6 L13,14 Z",fill:"#F6F2E8",stroke:C.ink,"stroke-width":2.5,"stroke-linejoin":"round"},R.moine);
    el("path",{d:"M-6,-6 L6,-6 L4,14 L-4,14Z",fill:"#2B2B2B"},R.moine);
    el("circle",{cx:0,cy:-14,r:8,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2.5},R.moine);

    // panneau droit : carte de Bourgogne-Franche-Comté
    R.map=el("g",{},right);
    const cp=el("clipPath",{id:"clipMapA2"},defs); el("rect",{x:985,y:100,width:590,height:440,rx:14},cp);
    const mg=el("g",{"clip-path":"url(#clipMapA2)"},R.map);
    el("rect",{x:985,y:100,width:590,height:440,fill:"#DCEBF5",stroke:"#B8C6D4","stroke-width":2},mg);
    const S=2.7, ox=1280, oy=320, cx=459, cy=284.5; const P=p=>[ox+S*(p[0]-cx),oy+S*(p[1]-cy)];
    const gm=el("g",{transform:`translate(${ox-S*cx},${oy-S*cy}) scale(${S})`},mg);
    FR.regions.forEach(r=>{ const bfc=r.code==="27"; el("path",{d:r.d,fill:bfc?"#F3D7B5":"#F4EFE2",stroke:bfc?C.acc:"#B8AC93","stroke-width":(bfc?3:1.5)/S,"stroke-linejoin":"round"},gm); });
    el("text",{x:1005,y:140,"font-size":24,"font-weight":800,fill:C.acc,text:"Bourgogne-Franche-Comté"},R.map);
    R.pts=[["Cluny",[445,342],"910","Saône-et-Loire","e",18,12],["Cîteaux",[464,293],"1098","","e",18,6],["Fontenay",[431,260],"1118","Côte-d'Or","w",-18,0]].map(([n,p,an,dep,side,dx,dy])=>{
      const q=P(p), g=el("g",{},R.map); el("circle",{cx:q[0],cy:q[1],r:11,fill:C.acc,stroke:"#fff","stroke-width":3},g);
      const t=el("text",{x:q[0]+dx,y:q[1]+dy+8,"text-anchor":side==="e"?"start":"end","font-size":26,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":6,"paint-order":"stroke"},g);
      el("tspan",{text:n+" "},t); el("tspan",{text:an,fill:C.acc},t); return g; });
    // carte "règle"
    R.regle=el("g",{},right);
    el("rect",{x:985,y:570,width:590,height:200,rx:16,fill:"#FFF7E0",stroke:C.acc,"stroke-width":3},R.regle);
    el("text",{x:1280,y:616,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.acc,text:"La règle de saint Benoît (vers 530)"},R.regle);
    el("text",{x:1280,y:668,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"« Prie et travaille »"},R.regle);
    el("text",{x:1280,y:712,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"Formule qui résume la Règle :"},R.regle);
    el("text",{x:1280,y:742,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"prière, lecture et travail manuel"},R.regle);
    // photos
    R.ph=a.layer("photos");
    R.pCl=a.photo(R.ph,{id:"h-a2-fontenay-cloitre",x:1005,y:130,w:550,h:366,cap:"Le cloître de l'abbaye de Fontenay",rot:-1.5});
    R.pFo=a.photo(R.ph,{id:"h-a2-fontenay-forge",x:1005,y:130,w:550,h:366,cap:"La forge de Fontenay (fin du XIIe siècle)",rot:1.2});
    // note sous la photo
    R.note=el("g",{},right);
    R.noteBox=el("rect",{x:985,y:650,width:590,height:150,rx:14,fill:"#FFF",stroke:"#D6DBE4","stroke-width":3},R.note);
    R.noteT=el("text",{x:1005,y:692,"font-size":24,"font-weight":700,fill:C.ink},R.note);
    // horloge
    R.clock=el("g",{},right);
    el("text",{x:1270,y:66,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.acc,text:"Une journée de moine"},R.clock);
    el("text",{x:1270,y:98,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"exemple d'une journée d'été · les heures varient"},R.clock);
    el("circle",{cx:CK.x,cy:CK.y,r:CK.R+6,fill:"#fff",stroke:"#D6DBE4","stroke-width":2},R.clock);
    R.ghost=DAY.map(s=>el("path",{d:sector(s[0],s[1]),fill:KIND[s[2]].col,opacity:.22,stroke:"#fff","stroke-width":1},R.clock));
    R.live=DAY.map(s=>el("path",{d:"",fill:KIND[s[2]].col,stroke:"#fff","stroke-width":1.5},R.clock));
    [[0,"0 h"],[6,"6 h"],[12,"12 h"],[18,"18 h"]].forEach(([h,l])=>{ const p1=pt(h,CK.R+4),p2=pt(h,CK.R+22),q=pt(h,CK.R+44); el("line",{x1:p1[0],y1:p1[1],x2:p2[0],y2:p2[1],stroke:C.ink,"stroke-width":4},R.clock); el("text",{x:q[0],y:q[1]+8,"text-anchor":"middle","font-size":24,"font-weight":800,fill:C.ink,text:l},R.clock); });
    R.hand=el("g",{},R.clock); el("line",{x1:0,y1:0,x2:0,y2:-(CK.R+12),stroke:C.ink,"stroke-width":7,"stroke-linecap":"round"},R.hand); el("circle",{cx:0,cy:-(CK.R+12),r:9,fill:"#E07A1F",stroke:C.ink,"stroke-width":3},R.hand);
    el("circle",{cx:CK.x,cy:CK.y,r:CK.r-6,fill:"#FBF6EE",stroke:"#E3D3C3","stroke-width":2},R.clock);
    R.cH=el("text",{x:CK.x,y:CK.y-22,"text-anchor":"middle","font-size":40,"font-weight":800,fill:C.ink},R.clock);
    R.cN=el("text",{x:CK.x,y:CK.y+22,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink},R.clock);
    R.cK=el("text",{x:CK.x,y:CK.y+56,"text-anchor":"middle","font-size":24,"font-weight":700},R.clock);
    // barres de bilan
    R.bars=el("g",{},right); R.barR=[];
    el("text",{x:985,y:672,"font-size":22,"font-weight":700,fill:"#4A5468",text:"Heures de la journée (exemple), au fil de l'horloge :"},R.bars);
    KORD.forEach((k,i)=>{ const y=704+i*35; el("rect",{x:985,y:y-17,width:24,height:24,rx:5,fill:KIND[k].col},R.bars); el("text",{x:1020,y:y+3,"font-size":22,"font-weight":700,fill:C.ink,text:KIND[k].nom},R.bars);
      const b=el("rect",{x:1255,y:y-17,width:0,height:24,rx:5,fill:KIND[k].col},R.bars); const v=el("text",{x:1262,y:y+3,"font-size":22,"font-weight":800,fill:C.ink},R.bars); R.barR.push({b,v}); });
    a.manip.innerHTML=`Heure de la journée : <input type="range" id="mH" min="0" max="24" step="0.5" value="10.5"> <b id="mHv">10 h 30</b> &nbsp; <button data-h="2">2 h</button><button data-h="8">8 h</button><button data-h="12">12 h</button><button data-h="18">18 h</button>`;
    const gid=id=>document.getElementById(id);
    gid("mH").oninput=e=>{ mH=+e.target.value; touched=true; a.redraw(); };
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ mH=+b.dataset.h; touched=true; gid("mH").value=mH; a.redraw(); });
    // cartes du travail
    R.cards=[["Copier des livres","au scriptorium",C.le,"scr"],["Forger le fer","à la forge, avec la force de l'eau",C.tr,"forg"],["Cultiver","le jardin, le potager, les champs",C.re,"jard"],["Lire et étudier","dans le cloître",C.le,"clo"]].map(([t,s,col],i)=>{
      const g=el("g",{},right); const y=140+i*128; el("rect",{x:985,y,width:590,height:108,rx:14,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},g); el("rect",{x:985,y,width:14,height:108,rx:5,fill:col},g);
      el("text",{x:1024,y:y+48,"font-size":30,"font-weight":800,fill:C.ink,text:t},g); el("text",{x:1024,y:y+84,"font-size":24,fill:"#4A5468",text:s},g); return g; });
    el("text",{x:985,y:122,"font-size":26,"font-weight":800,fill:C.acc,text:"Ce que font aussi les moines"},R.cards[0]);
    // idée fausse + synthèse
    R.myth=a.layer("myth"); R.mythC=a.myth(R.myth,985,100,590,"Les moines passent leur vie à prier, sans rien faire d'autre.","Ils prient plusieurs fois par jour, mais ils travaillent aussi : ils lisent, copient des livres, cultivent la terre et forgent le fer.");
    R.syn=a.layer("synthese"); const sy=R.syn;
    const pts=["Une abbaye ressemble à une petite ville : église, cloître, dortoir, réfectoire, ateliers.","La règle de saint Benoît rythme la journée : prière, lecture, travail.","Les moines copient des livres et font vivre la terre : un rôle important au Moyen Âge."];
    R.synT=el("text",{x:985,y:425,"font-size":28,"font-weight":800,fill:C.acc,text:"À retenir"},sy);
    R.syP=pts.map((p,i)=>{ const g=el("g",{},sy); const y=455+i*88; el("circle",{cx:1005,cy:y+18,r:17,fill:C.acc},g); el("text",{x:1005,y:y+26,"text-anchor":"middle","font-size":22,"font-weight":800,fill:"#fff",text:String(i+1)},g); const t=el("text",{x:1035,y:y+14,"font-size":22,"font-weight":600,fill:C.ink},g); a.wrap(t,p,44,1.2); return g; });
  },
  reset(a){
    [R.titre,R.sol,R.mur,R.ruis,R.ruisT,R.egl,R.clo,R.est1,R.est2,R.est3,R.sud,R.ouest,R.forge,R.roue,R.roueT,R.jard,R.moine,R.map,...R.pts,R.regle,R.pCl,R.pFo,R.note,R.clock,R.bars,...R.cards,R.myth,R.syn,R.synT,...R.syP].forEach(e=>a.op(e,0));
    a.op(R.titre,1); a.op(R.sol,1);
    ["glow","pulse"].forEach(c=>[R.glowScr,R.glowForge,R.glowJard,R.glowClo].forEach(e=>a.cls(e,c,false)));
  },
  etapes:[
  { titre:"Une abbaye dans un vallon", duree:8000,
    legende:"Une abbaye est un monastère où vivent des moines. Cluny (910), Cîteaux (1098) et Fontenay (1118) sont en Bourgogne. Les moines y suivent la règle de saint Benoît.",
    voix:"Une abbaye est un grand monastère où vivent des moines. En Bourgogne, il y en a de célèbres : Cluny, fondée en neuf cent dix, Cito, en mille quatre-vingt-dix-huit, et Fontenay, en mille cent dix-huit, près de Montbard. Les moines y suivent une règle écrite par saint Benoît, vers l'an cinq cent trente.",
    anim(t,a){ const s=a.seg; a.op(R.map,s(t,0,.15)); R.pts.forEach((g,i)=>{ const v=s(t,.15+i*.17,.28+i*.17); a.op(g,v); a.tr(g,0,(1-v)*-18); });
      a.op(R.ruis,s(t,.55,.7)); a.draw(R.ruis,s(t,.55,.95)); a.op(R.ruisT,s(t,.85,1)); a.op(R.mur,s(t,.6,.9));
      a.op(R.regle,s(t,.7,.9)); } },
  { titre:"L'église et le cloître", duree:8000,
    legende:"On construit d'abord l'église, en forme de croix, puis le cloître : une cour entourée de galeries couvertes où les moines marchent, lisent et se recueillent.",
    voix:"On construit d'abord l'église, dont le plan a la forme d'une croix. Puis le cloître : un jardin carré entouré de galeries couvertes. Les moines y marchent, y lisent et s'y recueillent, à l'abri de la pluie. Regarde la vraie photo du cloître de Fontenay.",
    anim(t,a){ const s=a.seg; a.op(R.ruis,1); a.draw(R.ruis,1); a.op(R.ruisT,1); a.op(R.mur,1); a.op(R.map,1-s(t,0,.2)); a.op(R.regle,1-s(t,0,.2)); R.pts.forEach(g=>a.op(g,1-s(t,0,.2)));
      a.op(R.egl,s(t,0,.15)); a.draw(R.eglL,s(t,0,.5)); R.eglF.setAttribute("opacity",s(t,.35,.6)); a.op(R.eglT,s(t,.5,.65)); a.op(R.eglC,s(t,.5,.65));
      a.op(R.clo,s(t,.55,.75)); a.tr(R.clo,0,(1-s(t,.55,.8))*-26); a.op(R.pCl,s(t,.8,1)); } },
  { titre:"Autour du cloître : vivre ensemble", duree:9000,
    legende:"Les salles s'organisent autour du cloître : la salle capitulaire pour se réunir, le scriptorium pour copier des livres, le dortoir pour dormir, le réfectoire pour manger.",
    voix:"Les autres salles s'organisent autour du cloître. Ici, la salle où les moines se réunissent. Le scriptorium, où l'on copie les livres à la main. Le dortoir, à l'étage, où l'on dort tous ensemble. Le réfectoire, où l'on mange en silence. Et le cellier, où l'on range les provisions.",
    anim(t,a){ const s=a.seg; a.op(R.map,0); a.op(R.pCl,1); [R.egl,R.clo].forEach(e=>a.op(e,1)); R.eglF.setAttribute("opacity",1); a.draw(R.eglL,1); a.tr(R.clo,0,0);
      [[R.est1,.0],[R.est2,.18],[R.est3,.36],[R.sud,.54],[R.ouest,.72]].forEach(([g,d])=>{ const v=s(t,d,d+.2); a.op(g,v); a.tr(g,(1-v)*(g===R.ouest?-30:g===R.sud?0:30),(g===R.sud?(1-v)*30:0)); });
      a.op(R.note,s(t,.75,.95)); R.noteT.textContent=""; a.wrap(R.noteT,"Dormir, manger, copier, se réunir : tout se fait ensemble, au rythme de la cloche.",44,1.25); } },
  { titre:"Hors du cloître : l'eau, la forge, le jardin", duree:9000,
    legende:"À l'extérieur, un ruisseau fait tourner une roue : elle actionne la forge. Les moines cultivent aussi un jardin et un potager. Une abbaye produit presque tout ce dont elle a besoin.",
    voix:"À l'extérieur, un ruisseau fait tourner une roue à eau. Cette roue donne sa force à la forge, où les moines travaillent le fer. Un peu plus loin, le jardin et le potager fournissent des légumes. Une abbaye produit presque tout ce dont elle a besoin.",
    anim(t,a){ const s=a.seg; a.op(R.map,0); [R.egl,R.clo,R.est1,R.est2,R.est3,R.sud,R.ouest].forEach(e=>{a.op(e,1);a.tr(e,0,0);}); R.eglF.setAttribute("opacity",1); a.draw(R.eglL,1);
      a.op(R.pCl,1-s(t,0,.2)); a.op(R.pFo,s(t,.25,.45)); a.op(R.note,1); R.noteT.textContent=""; a.wrap(R.noteT,"L'eau du ruisseau fait tourner la roue, qui donne sa force à la forge.",44,1.25);
      const f=s(t,0,.3); a.op(R.forge,f); a.op(R.roue,f); a.op(R.roueT,s(t,.2,.4)); a.tr(R.roue,775,500,1,t*720);
      a.op(R.jard,s(t,.5,.75)); a.tr(R.jard,0,(1-s(t,.5,.75))*30); } },
  { titre:"La journée d'un moine", duree:12000,
    legende:"Une horloge de 24 heures : la cloche appelle les moines à la prière sept fois dans le jour et une fois dans la nuit. Entre deux, ils travaillent, lisent, mangent et se reposent.",
    voix:"Voici une journée de moine, par exemple en été. La nuit, à deux heures, les vigiles. À l'aube, les laudes, puis prime. Le matin, c'est le travail manuel. Puis la lecture et la copie de livres. À midi, sexte et le repas. Après un temps de repos, on dit none, puis on retourne travailler au jardin. Le soir, vêpres, repas, complies, et au lit. Suis le moine sur le plan.",
    anim(t,a){ const s=a.seg; a.op(R.map,0); a.op(R.pCl,0); a.op(R.pFo,0); a.op(R.note,0); [R.egl,R.clo,R.est1,R.est2,R.est3,R.sud,R.ouest,R.forge,R.roue,R.roueT,R.jard].forEach(e=>{a.op(e,1);a.tr(e,0,0);}); R.eglF.setAttribute("opacity",1); a.draw(R.eglL,1);
      a.tr(R.roue,775,500,1,60+t*90);
      a.op(R.clock,s(t,0,.08)); a.op(R.bars,s(t,0,.08)); a.op(R.moine,s(t,0,.08));
      const h=24*s(t,.08,.97,true); const i=segAt(h), sg=DAY[i];
      setClock(a,h); } },
  { titre:"À vous : choisissez l'heure", duree:7000,
    legende:"À vous : déplacez le curseur ou touchez une heure. Où est le moine ? Que fait-il ? Regardez les heures de prière, de travail et de lecture déjà passées.",
    voix:"À vous de jouer. Déplacez le curseur pour choisir l'heure de la journée. Regardez où se trouve le moine sur le plan, ce qu'il fait, et combien d'heures il a déjà passées à prier, à travailler et à lire. Prenez votre temps, puis continuez.",
    anim(t,a){ const s=a.seg; a.op(R.map,0); a.op(R.pCl,0); a.op(R.pFo,0); a.op(R.note,0); [R.egl,R.clo,R.est1,R.est2,R.est3,R.sud,R.ouest,R.forge,R.roue,R.roueT,R.jard].forEach(e=>{a.op(e,1);a.tr(e,0,0);}); R.eglF.setAttribute("opacity",1); a.draw(R.eglL,1);
      a.tr(R.roue,775,500,1,60+t*90); a.op(R.clock,1); a.op(R.bars,1); a.op(R.moine,1);
      let h; if(touched) h=mH; else { h=a.lerp(0,10.5,s(t,.12,.85)); const sl=document.getElementById("mH"); if(sl) sl.value=h; }
      const hv=document.getElementById("mHv"); if(hv){ const hh=Math.floor(h), mm=Math.round((h-hh)*60); hv.textContent=hh+" h "+(mm<10?"0":"")+mm; }
      setClock(a,h); } },
  { titre:"Prier et travailler", duree:9000,
    legende:"Dans cet exemple, un moine travaille à peu près autant de temps qu'il prie, et il lit encore plusieurs heures. Il copie des livres, forge le fer, cultive la terre.",
    voix:"Dans cet exemple, le moine travaille presque autant de temps qu'il prie, et il lit encore pendant plusieurs heures. Il copie des livres dans le scriptorium, il forge le fer, il cultive le jardin et les champs. Les moines ne font donc pas que prier.",
    anim(t,a){ const s=a.seg; a.op(R.map,0); [R.egl,R.clo,R.est1,R.est2,R.est3,R.sud,R.ouest,R.forge,R.roue,R.roueT,R.jard].forEach(e=>{a.op(e,1);a.tr(e,0,0);}); R.eglF.setAttribute("opacity",1); a.draw(R.eglL,1);
      a.tr(R.roue,775,500,1,150+t*180);
      a.op(R.clock,1-s(t,0,.12)); a.op(R.moine,1-s(t,0,.12)); a.op(R.bars,1);
      R.live.forEach((p,j)=>p.setAttribute("d",sector(DAY[j][0],DAY[j][1]))); const c=cum(24); KORD.forEach((k,j)=>{ const r=R.barR[j]; r.b.setAttribute("width",c[k]*22); a.num(r.v,c[k],1," h"); r.v.setAttribute("x",1255+c[k]*22+10); });
      const ap=[R.glowScr,R.glowForge,R.glowJard,R.glowClo];
      R.cards.forEach((g,i)=>{ const v=s(t,.12+i*.2,.28+i*.2); a.op(g,v); a.tr(g,(1-v)*60,0); });
      const cur=Math.min(3,Math.floor(Math.max(0,t-.12)/.2)); ap.forEach((e,i)=>a.cls(e,"glow",t>.12&&i===cur)); } },
  { titre:"Idée fausse et synthèse", duree:10000,
    legende:"Non, les moines ne font pas que prier : ils prient, ils lisent et ils travaillent. Les abbayes sont aussi des lieux de savoir et de production.",
    voix:"Retenons l'essentiel. Une idée fausse très répandue : les moines passeraient leur vie à prier. En réalité, ils prient plusieurs fois par jour, mais ils travaillent aussi : ils lisent, ils copient des livres, ils cultivent et ils forgent. Une abbaye ressemble à une petite ville. La règle de saint Benoît rythme la journée : prière, lecture, travail. Et grâce aux livres copiés, les moines ont aidé à conserver le savoir.",
    anim(t,a){ const s=a.seg; a.op(R.map,0); [R.egl,R.clo,R.est1,R.est2,R.est3,R.sud,R.ouest,R.forge,R.roue,R.roueT,R.jard].forEach(e=>{a.op(e,1);a.tr(e,0,0);}); R.eglF.setAttribute("opacity",1); a.draw(R.eglL,1);
      a.tr(R.roue,775,500,1,330+t*120);
      R.live.forEach((p,j)=>p.setAttribute("d",sector(DAY[j][0],DAY[j][1]))); a.op(R.bars,1-s(t,0,.12)); const c=cum(24); KORD.forEach((k,j)=>{ const r=R.barR[j]; r.b.setAttribute("width",c[k]*22); a.num(r.v,c[k],1," h"); r.v.setAttribute("x",1255+c[k]*22+10); });
      R.cards.forEach(g=>a.op(g,1-s(t,0,.12)));
      a.op(R.myth,s(t,.1,.25)); a.cls(R.mythC.faux,"pulse",t>.25&&t<.4);
      a.op(R.syn,1); a.op(R.synT,s(t,.45,.55)); R.syP.forEach((g,i)=>{ const v=s(t,.5+i*.15,.65+i*.15); a.op(g,v); a.tr(g,(1-v)*40,0); }); } },
  ]
});
})();
