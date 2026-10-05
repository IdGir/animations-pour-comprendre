/* META {"id":"geo-B1-decoupage-administratif","matiere":"geographie","annee":"B","periode":1,"theme":"Le découpage administratif de la France : régions, départements, communes","resume":"La France est découpée en territoires emboîtés (18 régions, 101 départements, 34 875 communes), avec l'exemple de la Bourgogne-Franche-Comté et de la Côte-d'Or.","motsCles":["région","département","commune","préfecture","maire","Bourgogne-Franche-Comté","Côte-d'Or","Dijon","outre-mer"]} */
//@data france
(function(){
let pT=1; const fresh=t=>{ const f=t<pT-.05; pT=t; return f; }; // vrai quand l'étape (re)démarre : remet la manipulation à zéro
const F=FRANCE; let R={}, sel=null;
const C={reg:"#7FB8AA",regD:"#1C6E61",bfc:"#E07A1F",dep:"#2563A8",com:"#2E8B57",ink:"#1E2430",idf:"#7B3F98"};
const BFC_DEPS=["21","25","39","58","70","71","89","90"];
const MX=60, MY=110, MS=1.05; // placement carte
Anim.run({
  titre:"Le découpage administratif de la France",
  sousTitre:"Géographie · CM1-CM2 · Thème 1 : l'organisation du territoire français",
  matiere:"geographie", badge:"Géographie",
  accroche:"Région, département, commune : comment la France est-elle organisée ?",
  manipDes:3, manipJusqua:3,
  init(a){
    const {el}=a;
    const map=a.layer("map"); R.map=map; R.mapIn=el("g",{},map);
    R.regs=F.regions.map(r=>{ const p=el("path",{d:r.d,fill:"#EEF2EE",stroke:C.regD,"stroke-width":2.2,"stroke-linejoin":"round"},R.mapIn); p._r=r; return p; });
    R.depG=el("g",{},R.mapIn); R.deps=F.deps.map(d=>{ const p=el("path",{d:d.d,fill:"none",stroke:C.dep,"stroke-width":1.1,"stroke-linejoin":"round"},R.depG); p._d=d; return p; });
    R.bfcDeps=el("g",{},R.mapIn); F.deps.filter(d=>BFC_DEPS.includes(d.code)).forEach(d=>{ el("path",{d:d.d,fill:d.code==="21"?"#FFD9B0":"#FDEBD6",stroke:C.dep,"stroke-width":1.6},R.bfcDeps); el("text",{x:d.c[0],y:d.c[1]+5,"text-anchor":"middle","font-size":13,"font-weight":800,fill:C.dep,text:d.code},R.bfcDeps); });
    R.dijon=el("g",{},R.mapIn); el("circle",{cx:F.dijonF[0],cy:F.dijonF[1],r:4.5,fill:C.ink,stroke:"#fff","stroke-width":1.5},R.dijon);
    R.paris=el("g",{},R.mapIn); el("circle",{cx:F.parisF[0],cy:F.parisF[1],r:6,fill:C.ink,stroke:"#fff","stroke-width":2},R.paris); el("text",{x:F.parisF[0]+10,y:F.parisF[1]-8,"font-size":18,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":4,"paint-order":"stroke",text:"Paris"},R.paris);
    // outre-mer
    R.drom=el("g",{},map); F.drom.forEach((d,i)=>{ const g=el("g",{transform:`translate(${40+i*118},${820}) scale(.75)`},R.drom); el("rect",{x:0,y:0,width:100,height:100,rx:8,fill:"#fff",stroke:"#9FB8CC","stroke-width":2.5},g); el("path",{d:d.d,fill:"#EEF2EE",stroke:C.regD,"stroke-width":2},g); el("text",{x:50,y:122,"text-anchor":"middle","font-size":15,"font-weight":700,fill:C.ink,text:d.nom},g); g._p=g.querySelector("path"); });
    // communes de Côte-d'Or
    const cm=a.layer("communes"); R.cm=cm; R.cmIn=el("g",{transform:`translate(${MX+20},${MY-20}) scale(1.0)`},cm);
    el("path",{d:F.cdo.d,fill:"#F1F8EE",stroke:C.dep,"stroke-width":4},R.cmIn);
    R.coms=F.communes.map(c=>{ const p=el("path",{d:c.d,fill:"transparent",stroke:C.com,"stroke-width":.9,style:"cursor:pointer"},R.cmIn); p._c=c; p.addEventListener("click",()=>{ sel=c; a.redraw(); }); return p; });
    R.dijC=el("path",{d:F.communes.find(c=>c.nom==="Dijon").d,fill:C.bfc,stroke:"#8A3A00","stroke-width":2},R.cmIn);
    R.selP=el("path",{fill:"#2563A8",stroke:"#0F2E5A","stroke-width":2,"pointer-events":"none"},R.cmIn);
    R.dijT=el("g",{},R.cmIn); a.label(R.dijT,F.dijonC[0]+110,F.dijonC[1]-50,"Dijon",{size:24,stroke:C.bfc,color:"#8A3A00"});
    R.selT=el("g",{},cm);
    // étiquettes de carte (hors zoom)
    const lab=a.layer("lab"); R.lab=lab;
    R.bfcL=el("text",{"font-size":24,"font-weight":800,fill:"#8A3A00",stroke:"#fff","stroke-width":5,"paint-order":"stroke",text:"Bourgogne-Franche-Comté"},lab);
    R.idfL=el("text",{"font-size":22,"font-weight":800,fill:C.idf,stroke:"#fff","stroke-width":5,"paint-order":"stroke",text:"Île-de-France"},lab);
    R.dijL=el("text",{"font-size":22,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":5,"paint-order":"stroke",text:"Dijon"},lab);
    // panneau compteur
    const pn=a.layer("panel"); R.pn=pn;
    el("rect",{x:860,y:60,width:700,height:330,rx:18,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},pn);
    R.pBig=el("text",{x:1210,y:190,"text-anchor":"middle","font-size":96,"font-weight":800,fill:C.regD},pn);
    R.pName=el("text",{x:1210,y:250,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink},pn);
    R.pSub=el("text",{x:1210,y:300,"text-anchor":"middle","font-size":24,fill:"#4A5468"},pn);
    R.pSub2=el("text",{x:1210,y:340,"text-anchor":"middle","font-size":24,fill:"#4A5468"},pn);
    R.info=el("g",{},a.svg); el("rect",{x:860,y:420,width:700,height:205,rx:18,fill:"#F1F7F5",stroke:"#1C6E61","stroke-width":3},R.info);
    R.infoT=el("text",{x:890,y:470,"font-size":28,"font-weight":800,fill:"#1C6E61"},R.info); R.infoB=el("text",{x:890,y:520,"font-size":24,fill:C.ink},R.info);
    // emboîtement
    const em=a.layer("emb"); R.em=em; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},em);
    el("text",{x:800,y:60,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"Des territoires emboîtés… et qui s'occupe de quoi ?"},em);
    const nest=[["La France","l'État : armée, justice, programmes scolaires","#5B6B7F",60,90,1480,790],["Une région (18)","conseil régional : les lycées, les trains régionaux","#1C6E61",110,190,1380,670],["Un département (101)","conseil départemental : les collèges, les routes","#2563A8",160,290,1280,550],["Une commune (34 875)","maire et conseil municipal : l'école primaire, l'état civil","#2E8B57",210,390,1180,430]];
    R.nest=nest.map(([n,d,c,x,y,w,h])=>{ const g=el("g",{},em); el("rect",{x,y,width:w,height:h,rx:22,fill:c,"fill-opacity":.08,stroke:c,"stroke-width":5},g); el("text",{x:x+28,y:y+48,"font-size":30,"font-weight":800,fill:c,text:n},g); el("text",{x:x+28,y:y+84,"font-size":22,fill:C.ink,text:d},g); return g; });
    R.ecoles=el("g",{},em); [["ecole","ton école → la commune","#2E8B57"],["college","ton futur collège → le département","#2563A8"],["lycee","le lycée → la région","#1C6E61"]].forEach(([ic,t,c],i)=>{ const g=el("g",{transform:`translate(295,${555+i*80})`},R.ecoles); const K=C.ink;
      if(ic==="ecole"){ el("rect",{x:-24,y:-6,width:48,height:28,fill:"#F0D9B0",stroke:K,"stroke-width":2.5},g); el("path",{d:"M-28,-6 L0,-26 L28,-6Z",fill:c,stroke:K,"stroke-width":2.5},g); el("rect",{x:-5,y:6,width:10,height:16,fill:"#6B4524"},g); }
      else if(ic==="college"){ el("rect",{x:-28,y:-24,width:56,height:46,fill:"#D9DEE8",stroke:K,"stroke-width":2.5},g); [-18,-4,10].forEach(x=>[-16,-2,12].forEach(y=>el("rect",{x,y,width:9,height:8,fill:"#fff",stroke:K,"stroke-width":1.5},g))); }
      else { el("path",{d:"M-30,-12 L0,-28 L30,-12Z",fill:c,stroke:K,"stroke-width":2.5},g); el("rect",{x:-28,y:-12,width:56,height:34,fill:"#E9EEF0",stroke:K,"stroke-width":2.5},g); [-18,-6,6,18].forEach(x=>el("rect",{x:x-3,y:-8,width:6,height:26,fill:"#fff",stroke:K,"stroke-width":1.5},g)); }
      el("text",{x:350,y:565+i*80,"font-size":28,"font-weight":800,fill:c,text:t},R.ecoles); });
    // comparaison
    const cp=a.layer("cmp"); R.cp=cp; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},cp);
    el("text",{x:800,y:60,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"Deux régions très différentes"},cp);
    const reg=(code)=>F.regions.find(r=>r.code===code);
    const mini=(code,x,col)=>{ const r=reg(code); const g=el("g",{},cp); const p=el("path",{d:r.d,fill:col,"fill-opacity":.25,stroke:col,"stroke-width":3},g); return {g,p,r}; };
    R.mB=mini("27",0,C.bfc); R.mI=mini("11",0,C.idf);
    R.cols=[["Bourgogne-Franche-Comté",C.bfc,"≈ 48 000 km²","≈ 2,8 millions","≈ 59 hab./km²","campagnes, forêts, vignobles,\nmontagnes du Jura, industrie"],["Île-de-France",C.idf,"≈ 12 000 km²","≈ 12,4 millions","≈ 1 000 hab./km²","Paris, la capitale : une région\ntrès urbaine, beaucoup d'emplois"]].map((c,i)=>{ const g=el("g",{},cp); const x=i?1180:420; el("text",{x,y:120,"text-anchor":"middle","font-size":30,"font-weight":800,fill:c[1],text:c[0]},g);
      const rows=["Superficie","Habitants","Densité"]; rows.forEach((r,j)=>{ el("text",{x:x-200,y:470+j*58,"font-size":24,fill:"#4A5468",text:r},g); el("text",{x:x+200,y:470+j*58,"text-anchor":"end","font-size":26,"font-weight":800,fill:C.ink,text:c[2+j]},g); });
      const tt=el("text",{x,y:660,"text-anchor":"middle","font-size":22,fill:C.ink},g); c[5].split("\n").forEach((l,j)=>el("tspan",{x,dy:j?28:0,text:l},tt)); return g; });
    // densité : 1 km² = carré + points
    R.dens=[0,1].map(i=>{ const g=el("g",{},cp); const x=i?1080:320, y=730; el("rect",{x,y,width:200,height:130,rx:10,fill:"#fff",stroke:i?C.idf:C.bfc,"stroke-width":3},g); g.dots=[...Array(100)].map((_,k)=>el("circle",{cx:x+10+(k%20)*9.5,cy:y+12+Math.floor(k/20)*25,r:3.6,fill:i?C.idf:C.bfc},g)); el("text",{x:x+215,y:y+60,"font-size":20,fill:"#4A5468",text:"1 km² :"},g); g.n=el("text",{x:x+215,y:y+92,"font-size":24,"font-weight":800,fill:i?C.idf:C.bfc},g); return g; });
    el("text",{x:800,y:800,"text-anchor":"middle","font-size":20,fill:"#4A5468",text:"1 point = 10 habitants"},cp);
    R.fin=a.layer("fin"); el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},R.fin);
    R.chain=[["La France","1","#5B6B7F"],["régions","18","#1C6E61"],["départements","101","#2563A8"],["communes","34 875","#2E8B57"]].map(([n,v,c],i)=>{ const g=el("g",{},R.fin); const x=230+i*380; el("circle",{cx:x,cy:250,r:120+i*0,fill:c,"fill-opacity":.12,stroke:c,"stroke-width":5},g); el("text",{x,y:265,"text-anchor":"middle","font-size":i===3?52:64,"font-weight":800,fill:c,text:v},g); el("text",{x,y:420,"text-anchor":"middle","font-size":30,"font-weight":800,fill:c,text:n},g); if(i<3) a.arrow(g,`M${x+130},250 L${x+245},250`,{color:"#9AA3B2",w:6}); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,200,560,1200,"Une région, un département et une commune, c'est la même chose.","Ce sont des territoires emboîtés : une région contient plusieurs départements, qui contiennent de nombreuses communes. Chacun a ses élus et ses missions.");
    // photos "Dans la réalité"
    const pl=a.layer("photos");
    const ph=(o)=>{ const g=el("g",{},pl); const p=a.photo(g,o); g._missing=p._missing; if(!p._missing) el("text",{x:o.x+o.w/2,y:o.y-26,"text-anchor":"middle","font-size":22,"font-weight":800,fill:"#8A3A00",text:"Dans la réalité"},g); return g; };
    R.phP=ph({id:"g-b1-prefecture-dijon",x:1000,y:500,w:380,h:230,cap:"La préfecture de la Côte-d'Or (Dijon)",rot:1.5});
    R.phM=ph({id:"g-b1-hotel-ville-dijon",x:1000,y:690,w:340,h:110,cap:"L'hôtel de ville de Dijon",rot:-1});
    a.manip.innerHTML=`<span style="font-size:24px"><b>À vous :</b> cliquez sur une commune de la carte (Côte-d'Or) : son nom s'affiche.</span>`;
  },
  reset(a){
    [R.fin,R.depG,R.bfcDeps,R.dijon,R.paris,R.drom,R.cm,R.bfcL,R.idfL,R.dijL,R.pn,R.info,R.em,R.cp,R.myth,R.dijC,R.dijT,R.selP,R.selT,R.ecoles,R.phP,R.phM,...R.nest].forEach(e=>a.op(e,0));
    a.op(R.map,1); R.regs.forEach(p=>{ a.op(p,0); a.set(p,{fill:"#EEF2EE","stroke-width":2.2}); }); R.deps.forEach(p=>a.op(p,1));
    R.zoom={s:MS,x:MX,y:MY}; R.mapIn.setAttribute("transform",`translate(${MX},${MY}) scale(${MS})`);
  },
  after(a){
    const Z=R.zoom; const P=(p)=>[Z.x+Z.s*p[0],Z.y+Z.s*p[1]];
    const b=F.regions.find(r=>r.code==="27").c, i=F.regions.find(r=>r.code==="11").c;
    let q=P(b); a.set(R.bfcL,{x:q[0]-125,y:q[1]-Z.s*76}); q=P(i); a.set(R.idfL,{x:q[0]-60,y:q[1]-Z.s*45}); q=P(F.dijonF); a.set(R.dijL,{x:q[0]+10,y:q[1]-10});
    if(sel&&R.cm.style.display!=="none"){ a.set(R.selP,{d:sel.d}); a.op(R.selP,1); while(R.selT.firstChild) R.selT.removeChild(R.selT.firstChild); a.label(R.selT,MX+20+sel.c[0],MY-20+sel.c[1]-44,sel.nom,{size:24,stroke:"#2563A8",color:"#0F2E5A"}); a.op(R.selT,1); }
  },
  etapes:[
  { titre:"La France", duree:8000,
    legende:"La France, c'est la métropole… et cinq territoires d'outre-mer : Guadeloupe, Martinique, Guyane, La Réunion et Mayotte. Pour être bien gérée, elle est découpée en territoires.",
    voix:"La France, c'est la France métropolitaine, mais aussi cinq territoires d'outre-mer : la Guadeloupe, la Martinique, la Guyane, La Réunion et Mayotte. Pour être bien organisé et gouverné, ce grand territoire est découpé en morceaux plus petits.",
    anim(t,a){ const s=a.seg; R.regs.forEach(p=>{ a.op(p,s(t,0,.3)); a.set(p,{"stroke-width":.01+2.2*s(t,.5,.7)}); p.setAttribute("stroke-opacity",s(t,.5,.7)); }); R.deps.forEach(p=>a.op(p,0)); a.op(R.drom,s(t,.3,.5)); a.op(R.paris,s(t,.2,.35)); } },
  { titre:"18 régions", duree:11000,
    legende:"Premier niveau : les régions. Il y en a 18 : 13 en métropole et 5 en outre-mer. Notre région : la Bourgogne-Franche-Comté, avec Dijon pour chef-lieu.",
    voix:"Premier découpage : les régions. Il y en a dix-huit : treize en métropole et cinq en outre-mer. Notre région s'appelle la Bourgogne-Franche-Comté. Elle est née en 2016, de la fusion de la Bourgogne et de la Franche-Comté. Son chef-lieu est Dijon.",
    anim(t,a){ const s=a.seg; R.deps.forEach(p=>a.op(p,0)); a.op(R.drom,1); a.op(R.paris,1); a.op(R.pn,s(t,0,.08)); const n=Math.floor(13*s(t,.05,.6,true)); const nd=t>.65?Math.floor(5*s(t,.65,.8,true)):0;
      R.regs.forEach((p,i)=>{ const on=i<n; a.set(p,{fill:on?(p._r.code==="27"&&t>.8?"#FFD9B0":["#BFE0D6","#D7EADF","#A9D3C6","#CFE6DA"][i%4]):"#EEF2EE"}); });
      R.drom.querySelectorAll("g").forEach((g,i)=>a.set(g._p,{fill:i<nd?"#BFE0D6":"#EEF2EE"}));
      R.pBig.textContent=n+nd; R.pName.textContent="régions"; R.pSub.textContent=`${n} en métropole${t>.65?` + ${nd} en outre-mer`:""}`; R.pSub2.textContent="";
      a.op(R.bfcL,s(t,.82,.9)); a.op(R.dijon,s(t,.85,.9)); a.op(R.dijL,s(t,.85,.9)); a.op(R.info,s(t,.85,.95)); R.infoT.textContent="Notre région"; a.wrap(R.infoB,"Bourgogne-Franche-Comté : née en 2016 de la fusion de deux régions. Chef-lieu : Dijon. Assemblée : le conseil régional.",50); } },
  { titre:"101 départements", duree:11000,
    legende:"Chaque région est découpée en départements : 96 en métropole + 5 en outre-mer = 101. Chacun a un numéro. La Bourgogne-Franche-Comté en compte 8, dont la Côte-d'Or (21).",
    voix:"Deuxième découpage : chaque région est partagée en départements. Il y en a cent un : quatre-vingt-seize en métropole et cinq en outre-mer. Chaque département a un numéro, qu'on retrouve par exemple dans les codes postaux. La Bourgogne-Franche-Comté compte huit départements, dont la Côte-d'Or, numéro vingt et un, avec Dijon pour préfecture.",
    anim(t,a){ const s=a.seg; a.op(R.pn,1); a.op(R.drom,1); a.op(R.paris,1); a.op(R.dijon,1); a.op(R.info,1-s(t,0,.08)); a.op(R.bfcL,1); a.op(R.dijL,1);
      const n=Math.floor(96*s(t,.05,.5,true)); R.deps.forEach((p,i)=>{ a.op(p,i<n?1:0); }); a.op(R.depG,1); const nd=t>.5?5:0;
      R.pBig.textContent=n+nd; R.pName.textContent="départements"; R.pSub.textContent=`${n} en métropole${nd?" + 5 en outre-mer":""}`; R.pSub2.textContent="";
      const z=s(t,.55,.85); const s2=a.lerp(MS,2.6,z); const bc=F.regions.find(r=>r.code==="27").c; const tx=a.lerp(MX,420-bc[0]*s2,z), ty=a.lerp(MY,460-bc[1]*s2,z); R.zoom={s:s2,x:tx,y:ty}; R.mapIn.setAttribute("transform",`translate(${tx},${ty}) scale(${s2})`);
      a.op(R.drom,1-z); a.op(R.bfcDeps,s(t,.75,.9)); a.op(R.phP,s(t,.88,1)); a.op(R.paris,1-z); R.regs.forEach(p=>{ if(p._r.code!=="27") p.setAttribute("opacity",1-.6*z); });
      if(t>.85){ R.pBig.textContent="8"; R.pName.textContent="départements"; R.pSub.textContent="en Bourgogne-Franche-Comté"; R.pSub2.textContent="dont la Côte-d'Or (21), préfecture : Dijon"; } } },
  { titre:"Près de 35 000 communes", duree:11000,
    legende:"Chaque département est découpé en communes : villes et villages. La Côte-d'Or en compte environ 700, la France 34 875 ! À vous : cliquez sur une commune de la carte.",
    voix:"Troisième découpage : les communes. Ce sont nos villes et nos villages. La Côte-d'Or en compte environ sept cents, et la France entière trente-quatre mille huit cent soixante-quinze ! Chaque commune est dirigée par un maire et un conseil municipal, élus par les habitants. À vous : cliquez sur une commune de la carte pour découvrir son nom.",
    anim(t,a){ const s=a.seg; a.op(R.map,1-s(t,0,.15)); a.op(R.bfcL,1-s(t,0,.1)); a.op(R.dijL,0); if(fresh(t)) sel=null; a.op(R.cm,Math.max(.02,s(t,.05,.2))); a.op(R.pn,1); a.op(R.phP,1-s(t,0,.1)); a.op(R.phM,s(t,.8,.95));
      const n=Math.floor(R.coms.length*s(t,.15,.6,true)); R.coms.forEach((p,i)=>p.setAttribute("stroke-opacity",i<n?1:0)); a.op(R.dijC,s(t,.6,.7)); a.op(R.dijT,s(t,.65,.75));
      const N=t<.65?Math.round(700*s(t,.15,.6)):Math.round(a.lerp(700,34875,s(t,.65,.95))); R.pBig.textContent=N.toLocaleString("fr-FR"); R.pName.textContent="communes"; R.pSub.textContent=t<.65?"en Côte-d'Or (environ)":"en France (1er janvier 2025)"; R.pSub2.textContent=sel?"Commune choisie : "+sel.nom:(t<.65?"":"dont 1 : Dijon, préfecture de la Côte-d'Or");
      a.op(R.info,s(t,.75,.85)); R.infoT.textContent="La commune"; a.wrap(R.infoB,"Le maire et le conseil municipal sont élus par les habitants. Ils s'occupent des écoles primaires, des rues, de la cantine, des mariages, des naissances…",50); } },
  { titre:"Des territoires emboîtés", duree:11000,
    legende:"Commune, département, région, France : les territoires s'emboîtent comme des poupées. Ton école dépend de la commune, le collège du département, le lycée de la région.",
    voix:"Récapitulons : la commune est dans un département, le département dans une région, la région dans la France. Ces territoires s'emboîtent comme des poupées russes. Chacun a ses élus et ses missions : ton école est gérée par la commune, le collège par le département, et le lycée par la région.",
    anim(t,a){ const s=a.seg; a.op(R.cm,1-s(t,0,.1)); a.op(R.phM,1-s(t,0,.1)); a.op(R.pn,1-s(t,0,.1)); a.op(R.info,1-s(t,0,.1)); a.op(R.em,s(t,0,.1)); R.nest.forEach((g,i)=>{ const v=s(t,.1+i*.14,.24+i*.14); a.op(g,v); g.setAttribute("transform",`translate(${800*(1-v)*0},${0}) scale(1)`); }); a.op(R.ecoles,s(t,.7,.85)); } },
  { titre:"Comparer deux régions", duree:12000,
    legende:"Comparons deux régions. La Bourgogne-Franche-Comté est 4 fois plus grande que l'Île-de-France, mais 4 fois moins peuplée : sur 1 km², il y a environ 59 habitants contre 1 000 !",
    voix:"Comparons maintenant notre région à l'Île-de-France, la région de Paris. La Bourgogne-Franche-Comté est environ quatre fois plus grande, mais quatre fois moins peuplée. Résultat : sur un kilomètre carré, on compte en moyenne une soixantaine d'habitants chez nous, contre environ mille en Île-de-France. C'est ce qu'on appelle la densité de population.",
    anim(t,a){ const s=a.seg; a.op(R.em,1-s(t,0,.1)); a.op(R.cp,s(t,0,.1));
      const sc=1.25; const pB=R.mB.r, pI=R.mI.r; // cartes à la même échelle
      R.mB.g.setAttribute("transform",`translate(${420-pB.c[0]*sc},${280-pB.c[1]*sc}) scale(${sc})`); R.mI.g.setAttribute("transform",`translate(${1180-pI.c[0]*sc},${280-pI.c[1]*sc}) scale(${sc})`);
      a.op(R.mB.g,s(t,.05,.2)); a.op(R.mI.g,s(t,.1,.25)); R.cols.forEach((c,i)=>a.op(c,s(t,.2+i*.1,.3+i*.1)));
      R.dens.forEach((d,i)=>{ a.op(d,s(t,.45,.55)); const target=i?100:6; const k=Math.round(target*s(t,.55,.9)); d.dots.forEach((c,j)=>a.op(c,j<k?1:0)); d.n.textContent=i?`≈ ${Math.round(1000*s(t,.55,.9))} hab.`:`≈ ${Math.round(59*s(t,.55,.9))} hab.`; });
      a.op(R.myth,0); } },
  { titre:"Synthèse", duree:8000,
    legende:"La France est découpée en 18 régions, 101 départements et 34 875 communes. Ces territoires emboîtés ont chacun leurs élus et leurs missions.",
    voix:"Pour finir : la France est découpée en dix-huit régions, cent un départements et trente-quatre mille huit cent soixante-quinze communes. Ce ne sont pas les mêmes choses : ce sont des territoires emboîtés, qui ont chacun leurs élus et leurs missions.",
    anim(t,a){ const s=a.seg; a.op(R.cp,1-s(t,0,.1)); a.op(R.fin,s(t,0,.1)); R.chain.forEach((g,i)=>{ const v=s(t,.1+i*.12,.22+i*.12); a.op(g,v); }); a.op(R.myth,s(t,.65,.8)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
