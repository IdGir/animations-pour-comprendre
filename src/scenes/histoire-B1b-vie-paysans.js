/* META {"id":"histoire-B1b-vie-paysans","matiere":"histoire","annee":"B","periode":1,"theme":"La vie quotidienne des paysans au Moyen Âge : travaux, cultures et redevances","resume":"Une année de paysan : la maison, le calendrier des travaux, la rotation des cultures et le partage de la récolte entre la famille, l'Église et le seigneur.","motsCles":["paysans","calendrier des travaux","assolement","jachère","dîme","corvées","seigneur","récolte","Moyen Âge"]} */
(function(){
let pT=1; const fresh=t=>{ const f=t<pT-.05; pT=t; return f; }; // vrai quand l'étape (re)démarre : remet la manipulation à zéro
let R={}, recolte=10, manuel=false, mt=1, tok=0; // manipulation : récolte de l'année
const C={or:"#E07A1F",red:"#C0392B",bl:"#2563A8",gr:"#2E8B57",ink:"#1E2430",ble:"#E2B84A",orge:"#C9D27A",jach:"#B98F5E",brown:"#8C6D46",wood:"#A9743F",woodD:"#6B4524"};
const K=C.ink;
function person(a,p,col,crown){ const g=a.el("g",{},p); a.el("circle",{cx:0,cy:-50,r:12,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2},g); a.el("path",{d:"M-14,-37 L14,-37 L19,0 L-19,0Z",fill:col,stroke:C.ink,"stroke-width":2},g); if(crown) a.el("path",{d:"M-12,-60 l4,-12 l8,8 l8,-8 l4,12Z",fill:"#F2C230",stroke:"#8A6A00","stroke-width":1.5},g); return g; }
/* icônes dessinées (pas d'emoji), boîte ±50 ; e(tag,attrs,parent?) ajoute à l'icône */
const IC={
  marteau:e=>{ const r=e("g",{transform:"rotate(35)"}); e("rect",{x:-6,y:-22,width:12,height:72,rx:3,fill:C.wood,stroke:K,"stroke-width":3},r); e("rect",{x:-30,y:-40,width:60,height:24,rx:4,fill:"#7A8494",stroke:K,"stroke-width":3},r); },
  buche:e=>{ e("rect",{x:-38,y:-16,width:76,height:50,rx:8,fill:C.wood,stroke:K,"stroke-width":3}); e("ellipse",{cx:-34,cy:9,rx:12,ry:25,fill:"#E0B77A",stroke:K,"stroke-width":3}); e("circle",{cx:-34,cy:9,r:6,fill:"none",stroke:C.woodD,"stroke-width":2.5}); e("path",{d:"M-12,-4 L30,-4 M-12,22 L30,22",stroke:C.woodD,"stroke-width":2.5}); },
  araire:e=>{ e("path",{d:"M-48,38 L48,38",stroke:"#7A5A32","stroke-width":8,"stroke-linecap":"round"}); e("path",{d:"M-44,-22 L30,22",stroke:C.woodD,"stroke-width":10,"stroke-linecap":"round"}); e("path",{d:"M30,22 L46,-34",stroke:C.woodD,"stroke-width":10,"stroke-linecap":"round"}); e("path",{d:"M22,20 L42,20 L34,40Z",fill:"#7A8494",stroke:K,"stroke-width":3}); },
  pousse:e=>{ e("ellipse",{cx:0,cy:38,rx:36,ry:10,fill:"#8C6D46"}); e("path",{d:"M0,38 L0,0",stroke:"#3E7A32","stroke-width":6,"stroke-linecap":"round"}); e("path",{d:"M0,14 Q-36,14 -38,-24 Q-4,-24 0,14Z",fill:"#5FA04E",stroke:"#2F6A28","stroke-width":3}); e("path",{d:"M0,2 Q32,2 36,-32 Q4,-32 0,2Z",fill:"#7BBF5E",stroke:"#2F6A28","stroke-width":3}); },
  mouton:e=>{ [[-20,0,16],[0,-10,18],[20,0,16],[0,8,16],[-8,-2,16],[10,-2,16]].forEach(([x,y,r])=>e("circle",{cx:x,cy:y,r,fill:"#fff",stroke:K,"stroke-width":3})); e("ellipse",{cx:34,cy:-4,rx:11,ry:14,fill:"#3E3A36"}); [-14,12].forEach(x=>e("rect",{x,y:20,width:7,height:22,fill:"#3E3A36"})); },
  faux:e=>{ e("path",{d:"M-34,44 L22,-34",stroke:C.woodD,"stroke-width":7,"stroke-linecap":"round"}); e("path",{d:"M22,-34 Q52,-34 50,0",fill:"none",stroke:"#7A8494","stroke-width":8,"stroke-linecap":"round"}); e("path",{d:"M-44,44 Q-20,30 4,44",fill:"none",stroke:"#C9A93A","stroke-width":6,"stroke-linecap":"round"}); },
  ble:e=>{ e("path",{d:"M0,46 L0,-30",stroke:"#B8902A","stroke-width":5,"stroke-linecap":"round"}); for(let i=0;i<5;i++){ const y=-34+i*16; [[-1,-28],[1,28]].forEach(([s,r])=>e("ellipse",{cx:s*10,cy:y+6,rx:7,ry:14,fill:C.ble,stroke:"#8A6A1A","stroke-width":2.5,transform:`rotate(${r} ${s*10} ${y+6})`})); } e("ellipse",{cx:0,cy:-38,rx:7,ry:14,fill:C.ble,stroke:"#8A6A1A","stroke-width":2.5}); },
  orge:e=>{ e("path",{d:"M0,46 L0,-30",stroke:"#7E8A3A","stroke-width":5,"stroke-linecap":"round"}); for(let i=0;i<5;i++){ const y=-30+i*15; [-1,1].forEach(s=>{ e("ellipse",{cx:s*9,cy:y+6,rx:6,ry:12,fill:C.orge,stroke:"#6B7430","stroke-width":2.5,transform:`rotate(${s*22} ${s*9} ${y+6})`}); e("path",{d:`M${s*12},${y+2} L${s*34},${y-26}`,stroke:"#6B7430","stroke-width":2}); }); } },
  fleau:e=>{ e("path",{d:"M-30,46 L-6,-12",stroke:C.woodD,"stroke-width":7,"stroke-linecap":"round"}); e("circle",{cx:-4,cy:-14,r:5,fill:"#444"}); e("path",{d:"M-4,-14 L36,-34",stroke:C.wood,"stroke-width":9,"stroke-linecap":"round"}); for(let i=0;i<5;i++) e("ellipse",{cx:-26+i*14,cy:46,rx:5,ry:3,fill:C.ble,stroke:"#8A6A1A"}); },
  raisin:e=>{ [[-16,-8],[0,-8],[16,-8],[-8,8],[8,8],[0,24]].forEach(([x,y])=>e("circle",{cx:x,cy:y,r:10,fill:"#7B3F98",stroke:"#4A2060","stroke-width":2.5})); e("path",{d:"M0,-18 L2,-34",stroke:C.woodD,"stroke-width":5}); e("path",{d:"M2,-30 Q26,-44 32,-22 Q10,-18 2,-30Z",fill:"#5FA04E",stroke:"#2F6A28","stroke-width":2.5}); },
  semis:e=>{ e("path",{d:"M-44,24 Q-10,-30 30,-8",fill:"none",stroke:"#8C6D46","stroke-width":6,"stroke-linecap":"round"}); [[-30,-10],[-10,-26],[8,-30],[26,-24],[16,-6],[-6,-8],[34,-4],[0,12],[22,14]].forEach(([x,y])=>e("ellipse",{cx:x,cy:y,rx:5,ry:3.5,fill:C.ble,stroke:"#8A6A1A","stroke-width":1.5})); e("ellipse",{cx:0,cy:42,rx:44,ry:8,fill:"#8C6D46"}); },
  cochon:e=>{ e("ellipse",{cx:-4,cy:6,rx:36,ry:24,fill:"#F2A8B4",stroke:K,"stroke-width":3}); e("circle",{cx:28,cy:2,r:16,fill:"#F2A8B4",stroke:K,"stroke-width":3}); e("ellipse",{cx:42,cy:6,rx:8,ry:7,fill:"#E8808F",stroke:K,"stroke-width":2.5}); e("path",{d:"M22,-12 L26,-26 L34,-12Z",fill:"#E8808F",stroke:K,"stroke-width":2.5}); [-22,8].forEach(x=>e("rect",{x,y:24,width:9,height:18,fill:"#E8808F",stroke:K,"stroke-width":2.5})); e("circle",{cx:30,cy:-2,r:2.5,fill:K}); },
  jambon:e=>{ e("path",{d:"M-34,-4 Q-34,-36 4,-36 Q40,-34 40,0 Q40,30 4,34 Q-30,34 -34,-4Z",fill:"#C9605A",stroke:K,"stroke-width":3}); e("path",{d:"M-34,-4 L-46,-10",stroke:"#EDE4D0","stroke-width":10,"stroke-linecap":"round"}); e("circle",{cx:-48,cy:-12,r:8,fill:"#EDE4D0",stroke:K,"stroke-width":2.5}); e("ellipse",{cx:6,cy:-8,rx:16,ry:9,fill:"#E39A92"}); },
  flamme:e=>{ e("path",{d:"M0,-46 Q30,-12 24,16 Q20,42 0,42 Q-24,40 -26,14 Q-26,-8 -6,-26 Q-4,-10 6,-6 Q4,-28 0,-46Z",fill:C.or,stroke:"#A8431F","stroke-width":3}); e("path",{d:"M0,-10 Q14,8 10,24 Q8,36 0,36 Q-12,34 -12,22 Q-12,8 0,-10Z",fill:"#F2C230"}); e("rect",{x:-34,y:40,width:68,height:8,rx:3,fill:C.woodD}); },
  lit:e=>{ e("rect",{x:-44,y:-26,width:10,height:62,fill:C.wood,stroke:C.woodD,"stroke-width":3}); e("rect",{x:-44,y:4,width:88,height:18,fill:"#E0C070",stroke:C.woodD,"stroke-width":3}); e("rect",{x:44,y:-6,width:8,height:42,fill:C.wood,stroke:C.woodD,"stroke-width":3}); e("rect",{x:-32,y:-10,width:30,height:14,rx:6,fill:"#fff",stroke:K,"stroke-width":3}); },
  vache:e=>{ e("rect",{x:-38,y:-18,width:66,height:40,rx:14,fill:"#fff",stroke:K,"stroke-width":3}); [[-24,-10,9],[-4,6,8],[10,-8,8]].forEach(([x,y,r])=>e("circle",{cx:x,cy:y,r,fill:"#3E3A36"})); e("rect",{x:24,y:-22,width:24,height:26,rx:8,fill:"#fff",stroke:K,"stroke-width":3}); e("rect",{x:36,y:-6,width:14,height:10,rx:4,fill:"#F2A8B4",stroke:K,"stroke-width":2}); e("path",{d:"M26,-22 L22,-34 M46,-22 L50,-34",stroke:K,"stroke-width":3}); [-32,-10,14,24].forEach(x=>e("rect",{x,y:22,width:8,height:20,fill:"#fff",stroke:K,"stroke-width":2.5})); },
  sac:e=>{ e("path",{d:"M-30,40 Q-40,-10 -14,-28 L14,-28 Q40,-10 30,40Z",fill:"#E8D3A2",stroke:"#8A6A3A","stroke-width":3.5}); e("path",{d:"M-14,-28 L0,-42 L14,-28",fill:"#E8D3A2",stroke:"#8A6A3A","stroke-width":3.5}); e("path",{d:"M-12,0 Q0,-12 12,0 M-14,16 Q0,4 14,16",fill:"none",stroke:"#8A6A3A","stroke-width":3}); },
  balance:e=>{ e("path",{d:"M0,-42 L0,40 M-20,42 L20,42",stroke:K,"stroke-width":5,"stroke-linecap":"round"}); e("path",{d:"M-42,-26 L42,-26",stroke:K,"stroke-width":5,"stroke-linecap":"round"}); [-42,42].forEach(x=>{ e("path",{d:`M${x},-26 L${x-14},4 M${x},-26 L${x+14},4`,stroke:K,"stroke-width":2.5}); e("path",{d:`M${x-18},4 L${x+18},4 Q${x+14},22 ${x},22 Q${x-14},22 ${x-18},4Z`,fill:"#F2C230",stroke:K,"stroke-width":3}); }); },
  maison:e=>{ e("rect",{x:-34,y:-6,width:68,height:50,fill:"#EADBC0",stroke:K,"stroke-width":4}); e("path",{d:"M-44,-4 L0,-42 L44,-4Z",fill:"#C9B07A",stroke:K,"stroke-width":4}); e("rect",{x:-9,y:16,width:18,height:28,fill:C.woodD}); },
  nuage:e=>{ [[-24,0,18],[0,-10,24],[26,0,18]].forEach(([x,y,r])=>e("circle",{cx:x,cy:y,r,fill:"#8A93A6",stroke:"#5A6478","stroke-width":3})); e("rect",{x:-40,y:0,width:80,height:18,fill:"#8A93A6"}); }
};
function icon(a,parent,nom,x,y,s){ const g=a.el("g",{transform:`translate(${x},${y}) scale(${s||1})`},parent); IC[nom]((t,at,par)=>a.el(t,at,par||g)); return g; }
function ph(a,parent,o){ const g=a.el("g",{},parent); const p=a.photo(g,o); g._missing=p._missing; if(!p._missing) a.el("text",{x:o.x+o.w/2,y:o.y-26,"text-anchor":"middle","font-size":22,"font-weight":800,fill:"#8A3A00",text:"Dans la réalité"},g); return g; }
const MOIS=[["janv.","janvier","marteau","réparer les outils"],["févr.","février","buche","couper du bois"],["mars","mars","araire","labourer"],["avril","avril","pousse","semer l'orge"],["mai","mai","mouton","tondre les moutons"],["juin","juin","faux","faucher le foin"],["juil.","juillet","ble","moissonner le blé"],["août","août","fleau","battre le grain"],["sept.","septembre","raisin","vendanger"],["oct.","octobre","semis","semer le blé d'hiver"],["nov.","novembre","cochon","mener les cochons en forêt"],["déc.","décembre","jambon","tuer le cochon"]];
const PARTS=[["Semences pour l'an prochain","#7A9A4A"],["Dîme à l'Église","#7B3F98"],["Taxes du seigneur",C.red],["Moulin du seigneur","#B7791F"],["Pour nourrir la famille",C.gr]];
const ints=R0=>{ const d=Math.round(R0*.1); return [4,d,d,d,R0-4-3*d]; }; // semences, dîme, taxes, moulin, famille
const hex=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16)); const mix=(a,b,t)=>"rgb("+hex(a).map((v,i)=>Math.round(v+(hex(b)[i]-v)*t)).join(",")+")";
const CULT=[["Blé",C.ble,"ble"],["Orge ou avoine",C.orge,"orge"],["Jachère (repos)",C.jach,null]];
function partage(a,o){ // dessine le partage de la récolte : o={R0,pile,nPile,ap:[5],cols,msg,col,ybOp,hail,ph,faim,corvee}
  const I=ints(o.R0), slots=[]; I.forEach((n,c)=>{ for(let k=0;k<n;k++) slots.push({c,k}); });
  R.sacs.forEach((g,i)=>{ const px=800+((i%10)-4.5)*60, py=220+Math.floor(i/10)*70; a.op(g,o.pile*Math.max(0,Math.min(1,o.nPile-i)));
    let x=px,y=py; if(slots[i]){ const {c,k}=slots[i]; const p=o.ap[c], col=R.cols[c]; const x1=col.x-75+(k%4)*50, y1=596-Math.floor(k/4)*58; x=a.lerp(px,x1,p); y=a.lerp(py,y1,p)-Math.sin(p*Math.PI)*50; } a.tr(g,x,y); });
  R.cols.forEach((col,c)=>{ a.op(col.g,o.cols); const n=Math.round(I[c]*o.ap[c]); col.n.textContent=o.ap[c]>0.02?(n+(n>1?" sacs":" sac")):""; });
  R.yb.textContent=o.msg; a.set(R.yb,{fill:o.col}); a.op(R.yb,o.ybOp);
  a.op(R.hail,o.hail); R.hailS.forEach((l,i)=>{ const f=((o.ph*6+i*.37)%1); const x=330+i*26; a.set(l,{x1:x,y1:270+f*70,x2:x-6,y2:284+f*70}); });
  a.op(R.faim,o.faim); a.cls(R.faim,"pulse",o.faim>.99); a.op(R.corvee,o.corvee);
}
function majBoutons(){ if(R.manipBtns) R.manipBtns.forEach(b=>b.classList.toggle("sel",+b.dataset.r===recolte)); }
function lancer(a){ const my=++tok, t0=performance.now(); mt=0; (function f(now){ if(my!==tok) return; mt=Math.min(1,(now-t0)/1500); a.redraw(); if(mt<1) requestAnimationFrame(f); })(t0); }
Anim.run({
  titre:"La vie quotidienne des paysans au Moyen Âge",
  sousTitre:"Histoire · CM1-CM2 · Thème 1 : le Moyen Âge",
  matiere:"histoire", badge:"Histoire",
  accroche:"Une année dans la vie d'une famille de paysans",
  manipDes:5, manipJusqua:5,
  init(a){
    const {el}=a;
    // 1. population
    const po=a.layer("pop"); R.pop=po;
    R.pp=[...Array(10)].map((_,i)=>{ const g=person(a,po,i<9?C.brown:"#5B3A8A",i===9); a.tr(g,260+i*120,590,2.2); return g; });
    R.popT=el("text",{x:800,y:230,"text-anchor":"middle","font-size":42,"font-weight":800,fill:C.ink},po);
    R.popS=el("text",{x:800,y:770,"text-anchor":"middle","font-size":28,fill:"#3A4458"},po);
    R.brace=el("path",{d:"M200,640 Q210,675 720,675 Q740,675 740,700 Q740,675 760,675 Q1270,675 1280,640",fill:"none",stroke:C.brown,"stroke-width":5},po);
    // maison
    const ma=a.layer("maison"); R.ma=ma;
    el("rect",{x:300,y:330,width:1000,height:400,fill:"#EADBC0",stroke:"#7A6A4E","stroke-width":4},ma);
    el("path",{d:"M260,340 L800,120 L1340,340Z",fill:"#C9B07A",stroke:"#7A6A4E","stroke-width":4},ma);
    for(let i=0;i<14;i++) el("line",{x1:300+i*72,y1:330-(i<7?i*36:(13-i)*36)+10,x2:330+i*72,y2:340,stroke:"#A88F5A","stroke-width":3},ma);
    el("rect",{x:300,y:700,width:1000,height:30,fill:"#9C8158"},ma);
    const it=[[480,"flamme","le foyer : cuisiner, se chauffer"],[800,"lit","un seul lit de paille pour la famille"],[1130,"vache","les animaux, l'hiver"]];
    R.mItems=it.map(([x,ic,t])=>{ const g=el("g",{},ma); icon(a,g,ic,x,500,1.9); const tt=el("text",{x,y:620,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink},g); a.wrap(tt,t,22,1.2); return g; });
    R.mT=el("text",{x:800,y:85,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"Une maison de paysan : une seule pièce, un sol en terre battue"},ma);
    R.repas=el("g",{},ma); a.label(R.repas,800,810,"Au menu : pain noir, bouillie, soupe de légumes… très peu de viande",{size:24,stroke:C.or,color:"#8A4A0E"});
    // 2. calendrier
    const ca=a.layer("cal"); R.cal=ca; const cx=560, cy=460, r=290;
    const seasons=["#CFE3F5","#CFE3F5","#D8EFC8","#D8EFC8","#D8EFC8","#F6E3A6","#F6E3A6","#F6E3A6","#EFC8A0","#EFC8A0","#EFC8A0","#CFE3F5"];
    R.segs=MOIS.map((m,i)=>{ const a0=(i/12)*2*Math.PI-Math.PI/2, a1=((i+1)/12)*2*Math.PI-Math.PI/2; const g=el("g",{},ca);
      el("path",{d:`M${cx},${cy} L${cx+r*Math.cos(a0)},${cy+r*Math.sin(a0)} A${r},${r} 0 0 1 ${cx+r*Math.cos(a1)},${cy+r*Math.sin(a1)}Z`,fill:seasons[i],stroke:"#fff","stroke-width":4},g);
      const am=(a0+a1)/2; icon(a,g,m[2],cx+(r-50)*Math.cos(am),cy+(r-50)*Math.sin(am),.6);
      g._lab=el("text",{x:cx+(r+36)*Math.cos(am),y:cy+(r+36)*Math.sin(am)+8,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:m[0]},ca); return g; });
    el("circle",{cx,cy,r:150,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},ca);
    R.needle=el("path",{d:`M${cx},${cy-152} L${cx},${cy-r+8}`,stroke:C.or,"stroke-width":12,"stroke-linecap":"round"},ca);
    R.calIc=MOIS.map(m=>icon(a,ca,m[2],cx,cy+10,1.6));
    R.card=el("g",{},ca); el("rect",{x:1030,y:470,width:520,height:250,rx:18,fill:"#fff",stroke:C.or,"stroke-width":4},R.card);
    R.cardM=el("text",{x:1290,y:540,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.or},R.card); R.cardT=el("text",{x:1290,y:600,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink},R.card);
    el("text",{x:1290,y:690,"text-anchor":"middle","font-size":22,fill:"#3A4458",text:"Calendrier simplifié (exemple)"},R.card);
    // 3. assolement
    const as=a.layer("ass"); R.ass=as;
    R.annee=el("text",{x:800,y:90,"text-anchor":"middle","font-size":40,"font-weight":800,fill:C.or},as);
    R.fields=[0,1,2].map(i=>{ const g=el("g",{},as); const x=140+i*460; const rc=el("rect",{x,y:170,width:400,height:240,rx:14,stroke:"#7A6A4E","stroke-width":4},g); for(let k=0;k<7;k++) el("line",{x1:x+30+k*55,y1:186,x2:x+30+k*55,y2:394,stroke:"rgba(0,0,0,.12)","stroke-width":4},g);
      el("text",{x:x+200,y:152,"text-anchor":"middle","font-size":26,"font-weight":700,fill:"#3A4458",text:"Champ "+(i+1)},g);
      const ic=CULT.map(c=>c[2]?icon(a,g,c[2],x+200,290,1.7):(()=>{ const z=el("g",{},g); [[-40,10,50],[0,-14,40],[34,-30,32]].forEach(([dx,dy,fs])=>el("text",{x:x+200+dx,y:300+dy,"text-anchor":"middle","font-size":fs,"font-weight":800,fill:"#6B4A22",text:"z"})); return z; })());
      const t=el("text",{x:x+200,y:452,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ink},g); return {g,rc,t,ic}; });
    R.tab=el("g",{},as); R.tabC=[];
    for(let y=0;y<3;y++){ el("text",{x:24,y:576+y*76,"text-anchor":"start","font-size":24,"font-weight":800,fill:"#3A4458",text:"Année "+(y+1)},R.tab);
      for(let i=0;i<3;i++){ const c=CULT[(i+3-y)%3]; const g=el("g",{},R.tab); const x=140+i*460; el("rect",{x,y:530+y*76,width:400,height:64,rx:10,fill:c[1],stroke:"#7A6A4E","stroke-width":2.5},g); el("text",{x:x+200,y:572+y*76,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.ink,text:c[0]},g); R.tabC.push({g,y,i}); } }
    R.cur=el("rect",{x:128,width:1344,height:72,rx:12,fill:"none",stroke:C.or,"stroke-width":6},R.tab);
    R.assT=el("text",{x:800,y:850,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"Chaque champ se repose une année sur trois : la jachère"},as);
    // 4. partage de la récolte
    const pa=a.layer("part"); R.part=pa;
    el("text",{x:800,y:62,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"Que devient la récolte ? (exemple simplifié)"},pa);
    R.yb=el("text",{x:800,y:132,"text-anchor":"middle","font-size":36,"font-weight":800},pa);
    R.sacs=[...Array(24)].map((_,i)=>{ const g=el("g",{},pa); const s=el("g",{transform:"scale(.78)"},g); IC.sac((t,at,par)=>el(t,at,par||s)); return g; });
    R.cols=[0,1,2,3,4].map(i=>{ const g=el("g",{},pa); const x=220+i*290; el("line",{x1:x-120,y1:640,x2:x+120,y2:640,stroke:"#9AA3B2","stroke-width":3},g); const t=el("text",{x,y:676,"text-anchor":"middle","font-size":22,"font-weight":800,fill:PARTS[i][1]},g); a.wrap(t,PARTS[i][0],18,1.15); const n=el("text",{x,y:758,"text-anchor":"middle","font-size":32,"font-weight":800,fill:PARTS[i][1]},g); return {g,t,n,x}; });
    R.corvee=el("g",{},pa); a.label(R.corvee,800,834,"+ les corvées : des jours de travail gratuit sur les terres du seigneur",{size:24,stroke:C.red,color:C.red});
    R.faim=el("g",{},pa); a.label(R.faim,800,446,"Mauvaise récolte : la famille a presque tout perdu, c'est la disette (la faim)",{size:26,stroke:C.red,color:C.red,fill:"#FDECEA"});
    R.hail=el("g",{},pa); const hc=el("g",{transform:"translate(380,235) scale(1.3)"},R.hail); IC.nuage((t,at,par)=>el(t,at,par||hc));
    R.hailS=[...Array(7)].map((_,i)=>el("line",{stroke:"#5A8FC0","stroke-width":5,"stroke-linecap":"round"},R.hail));
    // synthèse
    const sy=a.layer("syn"); R.syn=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    el("text",{x:800,y:90,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink,text:"La vie des paysans au Moyen Âge"},sy);
    R.sy3=[["ble","Travailler la terre","au rythme des saisons,\nde l'aube au coucher"],["balance","Payer et obéir","dîme à l'Église ;\ntaxes et corvées au seigneur"],["maison","Vivre simplement","une pièce, pain et bouillie ;\npeur des famines"]].map((f,i)=>{ const g=el("g",{},sy); const x=290+i*510; el("rect",{x:x-230,y:130,width:460,height:300,rx:18,fill:"#FBF6EE",stroke:"#A8431F","stroke-width":3},g); icon(a,g,f[0],x,205,1.05); el("text",{x,y:300,"text-anchor":"middle","font-size":30,"font-weight":800,fill:"#A8431F",text:f[1]},g); const t=el("text",{x,y:345,"text-anchor":"middle","font-size":24,fill:C.ink},g); f[2].split("\n").forEach((l,j)=>el("tspan",{x,dy:j?30:0,text:l},t)); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,200,480,1200,"Les paysans gardent toute leur récolte pour eux.","Une grande partie part d'abord à l'Église et au seigneur ; la famille vit avec ce qui reste, et elle a faim si la récolte est mauvaise.");
    // photos
    const pl=a.layer("photos");
    R.phE=ph(a,pl,{id:"h-b1b-berry-octobre",x:1090,y:84,w:440,h:290,cap:"Octobre, les semailles (XVe siècle)",rot:1.5});
    R.phG=ph(a,pl,{id:"h-b1b-grange-dimiere",x:1190,y:96,w:340,h:225,cap:"Une grange dîmière (Meslay)",rot:2});
    // manipulation : la récolte de l'année
    a.manip.innerHTML=`<span style="font-size:24px"><b>À vous :</b> la récolte de l'année</span> <button data-r="24" style="font-size:22px;min-height:50px">très bonne (24 sacs)</button><button data-r="20" style="font-size:22px;min-height:50px">normale (20 sacs)</button><button data-r="10" class="sel" style="font-size:22px;min-height:50px">mauvaise, grêle (10 sacs)</button>`;
    R.manipBtns=[...a.manip.querySelectorAll("button")];
    R.manipBtns.forEach(b=>b.onclick=()=>{ recolte=+b.dataset.r; manuel=true; majBoutons(); lancer(a); });
  },
  reset(a){ [R.pop,R.ma,R.cal,R.ass,R.part,R.syn,R.myth,R.brace,R.repas,R.corvee,R.faim,R.card,R.hail,R.phE,R.phG,...R.mItems].forEach(e=>a.op(e,0)); R.pp.forEach(p=>a.op(p,0)); },
  etapes:[
  { titre:"9 habitants sur 10", duree:7000,
    legende:"Au Moyen Âge, environ 9 habitants sur 10 sont des paysans. Ils vivent à la campagne, dans des villages, et cultivent la terre.",
    voix:"Au Moyen Âge, environ neuf habitants sur dix sont des paysans. Ils vivent à la campagne, dans des villages, et passent leur vie à cultiver la terre et à élever des animaux.",
    anim(t,a){ const s=a.seg; a.op(R.pop,1); R.pp.forEach((p,i)=>a.op(p,s(t,i*.05,i*.05+.1))); const n=Math.round(9*s(t,.55,.8)); R.popT.textContent=t>.5?`Environ ${n} paysans sur 10 habitants`:"10 habitants…"; a.op(R.brace,s(t,.55,.7)); a.draw(R.brace,s(t,.55,.8)); R.popS.textContent=t>.8?"Le dixième : un seigneur, un homme d'Église ou un artisan":""; } },
  { titre:"Dans la maison", duree:8000,
    legende:"La famille vit dans une seule pièce, avec un foyer au milieu. L'hiver, les animaux sont parfois à l'intérieur. On mange surtout du pain et de la bouillie.",
    voix:"La maison du paysan est faite de bois, de terre et de paille. La famille vit dans une seule pièce au sol en terre battue, autour du foyer qui sert à cuisiner et à se chauffer. L'hiver, les animaux sont parfois gardés à l'intérieur. On mange surtout du pain noir, de la bouillie et de la soupe de légumes : la viande est rare.",
    anim(t,a){ const s=a.seg; a.op(R.pop,1-s(t,0,.15)); a.op(R.ma,s(t,.1,.25)); R.mItems.forEach((m,i)=>a.op(m,s(t,.25+i*.15,.35+i*.15))); a.op(R.repas,s(t,.75,.9)); } },
  { titre:"Le calendrier des travaux", duree:14000,
    legende:"Toute l'année, le travail suit les saisons : labourer et semer au printemps, moissonner en été, vendanger et semer le blé à l'automne, réparer les outils l'hiver.",
    voix:"Toute l'année, le travail suit les saisons. En hiver, on répare les outils et on coupe du bois. Au printemps, on laboure et on sème. En été, on fauche le foin puis on moissonne le blé. À l'automne, on vendange et on sème le blé d'hiver. En novembre, on mène les cochons manger des glands en forêt. Cette image ancienne, peinte au début du quinzième siècle, montre les semailles d'octobre.",
    anim(t,a){ const s=a.seg; a.op(R.ma,1-s(t,0,.08)); a.op(R.cal,s(t,0,.1)); a.op(R.card,s(t,.08,.12));
      const v=s(t,.1,.98,true)*12; const m=Math.min(11,Math.floor(v)); R.needle.setAttribute("transform",`rotate(${v*30},560,460)`);
      R.segs.forEach((g,i)=>{ a.op(g,i===m?1:.55); a.set(g._lab,{"font-weight":i===m?900:600,fill:i===m?C.or:C.ink}); }); R.calIc.forEach((g,i)=>a.op(g,i===m?1:0)); R.cardM.textContent=MOIS[m][1]; R.cardT.textContent=MOIS[m][3];
      a.op(R.phE,s(t,.74,.8)); } },
  { titre:"La rotation des cultures", duree:13000,
    legende:"Les champs du village sont divisés en trois. Chaque année, on tourne : blé, puis orge, puis jachère. La terre en jachère se repose pour donner de meilleures récoltes.",
    voix:"Les terres du village sont partagées en trois parties. Chaque année, on fait tourner les cultures : dans un champ du blé, dans l'autre de l'orge ou de l'avoine, et le troisième est laissé en jachère, c'est-à-dire au repos. L'année suivante, tout tourne. Regarde le tableau : en trois ans, chaque champ a eu du blé, de l'orge et un repos. Ainsi, la terre ne s'épuise pas. On appelle cela l'assolement sur trois ans.",
    anim(t,a){ const s=a.seg; a.op(R.phE,0); a.op(R.cal,1-s(t,0,.08)); a.op(R.ass,s(t,0,.1));
      const u=s(t,.08,.96,true)*3; const y=Math.min(2,Math.floor(u)); const ph=u>=3?1:u%1; const tr=a.seg(ph,0,.25);
      R.annee.textContent="Année "+(y+1)+" sur 3";
      R.fields.forEach((f,i)=>{ const cn=CULT[(i+3-y)%3], cp=CULT[(i+3-Math.max(0,y-1)+(y===0?0:0))%3]; const prev=y===0?cn:CULT[(i+3-(y-1))%3];
        a.set(f.rc,{fill:mix(prev[1],cn[1],tr)}); f.t.textContent=cn[0]; f.ic.forEach((g,k)=>a.op(g,CULT[k]===cn?tr:(CULT[k]===prev&&y>0?1-tr:0))); });
      R.tabC.forEach(c=>{ a.op(c.g,c.y<y||(c.y===y&&ph>.15)?1:0); });
      a.set(R.cur,{y:526+y*76}); a.op(R.tab,s(t,.08,.14)); a.op(R.assT,s(t,.9,.98)); } },
  { titre:"Que devient la récolte ?", duree:13000,
    legende:"Une bonne année : 20 sacs de grain. On garde d'abord les semences, puis on donne la dîme à l'Église, on paie le seigneur et son moulin. La famille vit avec ce qui reste.",
    voix:"Que devient la récolte ? Voici un exemple simplifié. Une année normale, on récolte vingt sacs de grain. Il faut d'abord garder quatre sacs pour semer l'an prochain. Puis la dîme part à l'Église, le seigneur prend ses taxes, et il faut payer pour moudre le grain à son moulin : deux sacs chaque fois. Il reste dix sacs pour nourrir la famille. En plus, les paysans doivent des corvées : des jours de travail gratuit pour le seigneur.",
    anim(t,a){ const s=a.seg; a.op(R.ass,1-s(t,0,.08)); a.op(R.part,s(t,0,.1)); a.op(R.phE,0); a.op(R.phG,s(t,.2,.32));
      partage(a,{R0:20,pile:s(t,.02,.1),nPile:20,ap:[0,1,2,3,4].map(c=>s(t,.12+c*.1,.27+c*.1)),cols:s(t,.08,.14),msg:"Année normale : 20 sacs récoltés",col:C.gr,ybOp:s(t,.02,.08),hail:0,ph:0,faim:0,corvee:s(t,.9,.97)}); } },
  { titre:"À vous : bonne ou mauvaise récolte ?", duree:11000,
    legende:"Et si la récolte est mauvaise ? À vous : choisissez une très bonne, une normale ou une mauvaise récolte, et regardez ce qui change pour la famille.",
    voix:"Mais certaines années, la grêle détruit les cultures. À vous : choisissez une très bonne récolte, une récolte normale ou une mauvaise récolte, et regardez ce qui change pour la famille. Les semences, il faut toujours les garder, et il faut toujours payer l'Église et le seigneur. Alors, quand la récolte est mauvaise, c'est la famille qui se retrouve avec presque rien : c'est la disette.",
    anim(t,a){ const s=a.seg; if(fresh(t)){ manuel=false; recolte=10; majBoutons(); }
      a.op(R.ass,0); a.op(R.part,1); a.op(R.phE,0); a.op(R.phG,0); a.op(R.corvee,0);
      const R0=recolte, I=ints(R0), faim=I[4]<=3;
      const txt=R0>20?"Très bonne année : "+R0+" sacs récoltés":R0===20?"Année normale : 20 sacs récoltés":"Mauvaise année : "+R0+" sacs récoltés", col=R0>=20?C.gr:C.red;
      if(manuel){ const q=mt; partage(a,{R0,pile:1,nPile:R0,ap:[0,1,2,3,4].map(c=>s(q,.1+c*.08,.55+c*.08)),cols:1,msg:txt,col,ybOp:1,hail:R0<20?s(q,0,.1)*(1-s(q,.5,.7)):0,ph:q,faim:faim?s(q,.9,1):0,corvee:0}); }
      else { const n=a.lerp(20,R0,s(t,.38,.48)); const msg=t<.2?"Année normale : 20 sacs récoltés":t<.5?"La grêle ! Il reste "+Math.round(n)+" sacs":txt;
        partage(a,{R0,pile:s(t,0,.08),nPile:n,ap:[0,1,2,3,4].map(c=>s(t,.55+c*.06,.7+c*.06)),cols:s(t,0,.1),msg,col:t<.2?C.gr:t<.5?C.or:col,ybOp:s(t,0,.08),hail:R0<20?s(t,.18,.24)*(1-s(t,.5,.56)):0,ph:t*1.3,faim:faim?s(t,.92,.97):0,corvee:0}); } } },
  { titre:"Synthèse", duree:9000,
    legende:"Les paysans travaillent dur au rythme des saisons, donnent une grande part de leur récolte à l'Église et au seigneur, et vivent très simplement.",
    voix:"Récapitulons. Les paysans, qui forment l'immense majorité de la population, travaillent dur au rythme des saisons. Ils donnent une grande part de leur récolte à l'Église et au seigneur, et lui doivent des corvées. Ils vivent très simplement, et redoutent les mauvaises récoltes qui provoquent la faim.",
    anim(t,a){ const s=a.seg; a.op(R.phG,0); a.op(R.part,1-s(t,0,.1)); a.op(R.syn,s(t,0,.1)); R.sy3.forEach((f,i)=>{ const v=s(t,.1+i*.15,.25+i*.15); a.op(f,v); a.tr(f,0,(1-v)*40); }); a.op(R.myth,s(t,.65,.8)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
