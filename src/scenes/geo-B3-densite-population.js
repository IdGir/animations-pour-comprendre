/* META {"id":"geo-B3-densite-population","matiere":"geographie","annee":"B","periode":1,"theme":"Découper, mesurer, se déplacer dans les territoires","resume":"La densité (habitants par km²) : un carré de 1 km² qui se remplit, de la Bourgogne-Franche-Comté à Paris, et un cartogramme.","motsCles":["densité","population","superficie","km²","cartogramme","Bourgogne-Franche-Comté","Île-de-France","Paris","Dijon"]} */
//@data france
(function(){
const F=FRANCE, R={}; let bpop=20000, bsurf=5;
const C={bfc:"#E07A1F",idf:"#7B3F98",dij:"#2563A8",par:"#B03060",ink:"#1E2430",grey:"#4A5468"};
const reg=c=>F.regions.find(r=>r.code===c);
// pseudo-hasard déterministe
const rng=s=>()=>((s=(s*1664525+1013904223)>>>0)/4294967296);
// n points répartis (un par case tirée au hasard) dans un carré de côté "size" ; renvoie les segments d'un tracé "points ronds"
function dots(n,x,y,size,seed,rmax){ const rd=rng(seed), g=Math.ceil(Math.sqrt(n)), cell=size/g;
  const idx=[...Array(g*g).keys()]; for(let i=idx.length-1;i>0;i--){ const j=Math.floor(rd()*(i+1)); [idx[i],idx[j]]=[idx[j],idx[i]]; }
  const segs=idx.slice(0,n).map(k=>{ const cx=x+(k%g+.5+(rd()-.5)*.5)*cell, cy=y+(Math.floor(k/g)+.5+(rd()-.5)*.5)*cell; return `M${cx.toFixed(1)} ${cy.toFixed(1)}h.01`; });
  return {segs,r:Math.min(rmax||9,cell*.34)}; }
function dotLayer(parent,color,spec){ const p=a_el("path",{d:"",fill:"none",stroke:color,"stroke-width":spec.r*2,"stroke-linecap":"round"},parent); p.spec=spec; return p; }
let a_el; const setDots=(p,k)=>{ p.setAttribute("d",p.spec.segs.slice(0,Math.max(0,Math.round(k))).join("")); };
const fmt=v=>Math.round(v).toLocaleString("fr-FR");
// données (arrondis ; sources : Insee, recensement 2022 / estimations 2023)
const REG={"11":[12.4,1017],"84":[8.2,118],"75":[6.2,74],"76":[6.1,84],"32":[6.0,189],"44":[5.6,98],"93":[5.2,166],"52":[3.9,121],"53":[3.4,125],"28":[3.3,110],"27":[2.8,59],"24":[2.6,66],"94":[0.35,41]};
const dcol=d=>d<75?"#FBEFC6":d<125?"#F4C76A":d<200?"#E58A3A":"#8A2E0F";
// 5 territoires comparés : [nom, couleur, densité affichée, points (1 point = 10 hab.)]
const T=[["Bourgogne-\nFranche-Comté",C.bfc,"≈ 59",6],["Côte-d'Or",C.bfc,"≈ 61",6],["Île-de-France",C.idf,"≈ 1 000",100],["Dijon",C.dij,"≈ 4 000",400],["Paris",C.par,"≈ 20 000",2000]];
const SQ=270, GAP=40, X0=45, SY=210;
Anim.run({
  titre:"La densité de population",
  sousTitre:"Géographie · CM1-CM2 · Thème 1 : découper, mesurer, se déplacer dans les territoires",
  matiere:"geographie", badge:"Géographie",
  manipDes:4, manipJusqua:4,
  accroche:"Des endroits où l'on vit serrés, d'autres où l'on vit loin des voisins : comment le mesurer ?",
  init(a){
    const {el}=a; a_el=el;
    // ---------- 1. un carré de 1 km² ----------
    const s1=a.layer("s1"); R.s1=s1;
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Compter les habitants sur 1 km²"},s1);
    el("rect",{x:110,y:150,width:540,height:540,fill:"#F3F8EC",stroke:C.ink,"stroke-width":5},s1);
    R.rule=el("g",{},s1); el("line",{x1:110,y1:735,x2:650,y2:735,stroke:C.ink,"stroke-width":4},R.rule); el("line",{x1:110,y1:722,x2:110,y2:748,stroke:C.ink,"stroke-width":4},R.rule); el("line",{x1:650,y1:722,x2:650,y2:748,stroke:C.ink,"stroke-width":4},R.rule);
    el("text",{x:380,y:785,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"1 km de côté  =  1 km²"},R.rule);
    R.d1=dotLayer(s1,C.bfc,dots(6,110,150,540,7,17)); R.d1.spec.r=17; R.d1.setAttribute("stroke-width",34);
    { const lg=el("g",{},s1); el("circle",{cx:140,cy:830,r:12,fill:C.bfc},lg); el("text",{x:165,y:839,"font-size":26,"font-weight":700,fill:C.ink,text:"1 point = 10 habitants"},lg); R.lg1=lg; }
    // silhouette de la région
    R.sil=el("g",{},s1); { const r=reg("27"); const k=1.5; const g=el("g",{transform:`translate(${760-360*k},${120-208*k})scale(${k})`},R.sil); el("path",{d:r.d,fill:"#FCE3C8",stroke:C.bfc,"stroke-width":3/k},g);
      el("text",{x:1120,y:180,"font-size":30,"font-weight":800,fill:"#8A3A00",text:"Bourgogne-Franche-Comté"},R.sil); el("text",{x:1120,y:222,"font-size":24,fill:C.ink,text:"une région de France"},R.sil); }
    // formule
    R.form=[["Population (Insee, 2022)","≈ 2 800 000 habitants","≈ 2,8 millions",C.ink],["Surface","÷ 47 784 km²","",C.ink]].map(([n,v],i)=>{ const g=el("g",{},s1); const y=370+i*130; el("rect",{x:760,y,width:760,height:104,rx:16,fill:"#fff",stroke:"#9AA3B2","stroke-width":3},g); el("text",{x:790,y:y+42,"font-size":24,fill:C.grey,text:n},g); el("text",{x:790,y:y+86,"font-size":40,"font-weight":800,fill:C.ink,text:v},g); return g; });
    R.res=el("g",{},s1); el("rect",{x:760,y:635,width:760,height:150,rx:16,fill:"#FFF1E0",stroke:C.bfc,"stroke-width":5},R.res); el("text",{x:790,y:677,"font-size":24,fill:C.grey,text:"= Densité de population"},R.res);
    R.d1n=el("text",{x:790,y:748,"font-size":62,"font-weight":800,fill:"#8A3A00"},R.res);
    // ---------- 2-3. rangée de cinq carrés ----------
    const s2=a.layer("s2"); R.s2=s2; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s2);
    R.t2=el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink},s2);
    R.sl=T.map((t,i)=>{ const g=el("g",{},s2); const x=X0+i*(SQ+GAP);
      el("text",{x:x+SQ/2,y:SY-14,"text-anchor":"middle","font-size":22,fill:C.grey,text:"1 km²"},g);
      el("rect",{x,y:SY,width:SQ,height:SQ,fill:"#F3F8EC",stroke:C.ink,"stroke-width":4},g);
      g.d=dotLayer(g,t[1],dots(t[3],x,SY,SQ,11+i,9));
      const tx=el("text",{x:x+SQ/2,y:SY+SQ+44,"text-anchor":"middle","font-size":28,"font-weight":800,fill:t[1]},g); t[0].split("\n").forEach((l,j)=>el("tspan",{x:x+SQ/2,dy:j?32:0,text:l},tx));
      g.n=el("text",{x:x+SQ/2,y:SY+SQ+162,"text-anchor":"middle","font-size":44,"font-weight":800,fill:C.ink},g);
      el("text",{x:x+SQ/2,y:SY+SQ+198,"text-anchor":"middle","font-size":24,fill:C.grey,text:"habitants par km²"},g);
      return g; });
    R.lg2=el("g",{},s2); el("circle",{cx:X0+12,cy:830,r:10,fill:C.ink},R.lg2); el("text",{x:X0+34,y:838,"font-size":26,"font-weight":700,fill:C.ink,text:"1 point = 10 habitants"},R.lg2);
    // ---------- 4. même population, surfaces différentes ----------
    const s4=a.layer("s4"); R.s4=s4; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s4);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Presque autant d'habitants… sur des surfaces très différentes"},s4);
    const K=3, bx=40-360*K, by=110-208*K; // échelle commune : 1 px de carte = 1,62 km → ×3
    R.mapG=el("g",{transform:`translate(${bx},${by})scale(${K})`},s4); const bp=el("path",{d:reg("27").d,fill:"#FCE3C8",stroke:C.bfc,"stroke-width":2.5/K},R.mapG);
    // 280 points répartis dans la région (1 point = 10 000 habitants)
    { const rd=rng(5), pts=[]; let guard=0; const pt=bp.ownerSVGElement.createSVGPoint(); while(pts.length<280&&guard++<20000){ const x=360+rd()*198, y=208+rd()*153; pt.x=x; pt.y=y; if(bp.isPointInFill(pt)) pts.push([x,y]); }
      // ré-échantillonnage régulier : on garde la distribution tirée (uniforme)
      R.bfcPts=el("path",{d:"",fill:"none",stroke:C.bfc,"stroke-width":9,"stroke-linecap":"round"},s4); R.bfcPts.spec={segs:pts.map(p=>`M${(p[0]*K+bx).toFixed(1)} ${(p[1]*K+by).toFixed(1)}h.01`)}; }
    R.bfcL=el("g",{},s4); { const t=el("text",{x:337,y:612,"text-anchor":"middle","font-size":30,"font-weight":800,fill:"#8A3A00"},R.bfcL); el("tspan",{x:337,text:"Bourgogne-Franche-Comté"},t); const t2=el("text",{x:337,y:652,"text-anchor":"middle","font-size":28,"font-weight":700,fill:C.ink},R.bfcL); t2.textContent="2,8 millions d'habitants"; const t3=el("text",{x:337,y:690,"text-anchor":"middle","font-size":28,"font-weight":700,fill:C.ink},R.bfcL); t3.textContent="47 784 km²"; }
    // Paris à la même échelle : 105 km² = (105/2,636)=40 px² de carte → côté 6,3 px × 3 = 19 px
    const ps=19, px=770, py=300;
    R.parSmall=el("g",{},s4); el("rect",{x:px,y:py,width:ps,height:ps,fill:C.par,stroke:"#fff","stroke-width":1},R.parSmall); el("text",{x:px-10,y:py+ps/2+9,"text-anchor":"end","font-size":26,"font-weight":800,fill:C.par,text:"Paris"},R.parSmall);
    R.lens=el("g",{},s4); { const lx=900, ly=170, ls=228; el("path",{d:`M${px+ps},${py} L${lx},${ly} M${px+ps},${py+ps} L${lx},${ly+ls}`,stroke:C.par,"stroke-width":2.5,"stroke-dasharray":"8 6"},R.lens);
      el("rect",{x:lx,y:ly,width:ls,height:ls,fill:"#FBE9EF",stroke:C.par,"stroke-width":4},R.lens);
      R.parPts=el("path",{d:"",fill:"none",stroke:C.par,"stroke-width":11,"stroke-linecap":"round"},R.lens); R.parPts.spec=dots(211,lx,ly,ls,3,5.5);
      el("text",{x:lx+ls/2,y:ly+ls+38,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.par,text:"Paris (agrandi 12 fois)"},R.lens); }
    R.parL=el("g",{},s4); { const t=el("text",{x:1025,y:520,"text-anchor":"middle","font-size":28,"font-weight":700,fill:C.ink},R.parL); t.textContent="2,1 millions d'habitants"; const t2=el("text",{x:1025,y:558,"text-anchor":"middle","font-size":28,"font-weight":700,fill:C.ink},R.parL); t2.textContent="105 km²"; }
    R.lg4=el("g",{},s4); el("circle",{cx:60,cy:845,r:8,fill:C.ink},R.lg4); el("text",{x:82,y:853,"font-size":24,"font-weight":700,fill:C.ink,text:"1 point = 10 000 habitants"},R.lg4);
    R.concl=el("g",{},s4); el("rect",{x:300,y:720,width:1000,height:100,rx:16,fill:"#FFF8E8",stroke:"#C9A14A","stroke-width":3},R.concl); { const t=el("text",{x:800,y:762,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink},R.concl); t.textContent="Paris est environ 450 fois plus petit que la région…"; const t2=el("text",{x:800,y:802,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.par},R.concl); t2.textContent="… pour 2,1 millions d'habitants contre 2,8 millions."; }
    // ---------- 5. cartogramme ----------
    const s5=a.layer("s5"); R.s5=s5; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s5);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Un cartogramme : on dessine chaque région selon son nombre d'habitants"},s5);
    const S=.9, LX=90, RX=820, TY=95; const regs=F.regions.filter(r=>r.code!=="94"||true);
    R.mL=el("g",{transform:`translate(${LX},${TY})scale(${S})`},s5); R.regP=regs.map(r=>{ const p=el("path",{d:r.d,fill:dcol(REG[r.code][1]),stroke:r.code==="27"?"#1B3F8F":"#fff","stroke-width":(r.code==="27"?4:2)/S,"stroke-linejoin":"round"},R.mL); return p; });
    el("rect",{x:RX-10,y:TY-10,width:700*S+20,height:700*S+20,rx:12,fill:"#F7F8FA",stroke:"#D6DBE4","stroke-width":2},s5);
    // carrés ∝ population, relaxés pour ne pas se chevaucher
    { const Kq=40, q=regs.map(r=>({code:r.code,s:Math.sqrt(REG[r.code][0])*Kq,x:r.c[0]*S,y:r.c[1]*S,x0:r.c[0]*S,y0:r.c[1]*S}));
      for(let it=0;it<400;it++){ for(let i=0;i<q.length;i++) for(let j=i+1;j<q.length;j++){ const A=q[i],B=q[j]; const dx=B.x-A.x, dy=B.y-A.y, ox=(A.s+B.s)/2+6-Math.abs(dx), oy=(A.s+B.s)/2+6-Math.abs(dy); if(ox>0&&oy>0){ if(ox<oy){ const m=ox/2*(dx>=0?1:-1); A.x-=m; B.x+=m; } else { const m=oy/2*(dy>=0?1:-1); A.y-=m; B.y+=m; } } }
        q.forEach(A=>{ A.x+=(A.x0-A.x)*.06; A.y+=(A.y0-A.y)*.06; const lim=700*S-A.s/2-10; A.x=Math.max(A.s/2+10,Math.min(lim,A.x)); A.y=Math.max(A.s/2+10,Math.min(lim,A.y)); }); }
      R.mR=el("g",{transform:`translate(${RX},${TY})`},s5);
      R.sqs=q.map(A=>{ const g=el("g",{transform:`translate(${A.x},${A.y})`},R.mR); const inner=el("g",{},g); el("rect",{x:-A.s/2,y:-A.s/2,width:A.s,height:A.s,fill:dcol(REG[A.code][1]),stroke:A.code==="27"?"#1B3F8F":"#fff","stroke-width":A.code==="27"?5:2},inner); inner._s=A.s; g.inner=inner; g.A=A; return g; });
      const A27=q.find(z=>z.code==="27"), A11=q.find(z=>z.code==="11");
      R.lab5=el("g",{},s5);
      const lab=(x,y,txt,col,st)=>{ const t=el("text",{x,y,"text-anchor":"middle","font-size":23,"font-weight":800,fill:col,stroke:st||"#fff","stroke-width":6,"paint-order":"stroke"},R.lab5); txt.split("\n").forEach((l,j)=>el("tspan",{x,dy:j?26:0,text:l},t)); return t; };
      lab(RX+A11.x,TY+A11.y+8,"Île-de-\nFrance","#fff","#3A0F05"); lab(RX+A27.x,TY+A27.y+8,"BFC","#1B3F8F"); el("text",{x:RX+20,y:TY+700*S-14,"font-size":22,"font-weight":700,fill:"#1B3F8F",text:"BFC = Bourgogne-Franche-Comté"},R.lab5);
      const rr=reg("27").c, ri=reg("11").c; lab(LX+rr[0]*S,TY+rr[1]*S-4,"Bourgogne-\nFranche-Comté","#1B3F8F"); el("line",{x1:LX+ri[0]*S-30,y1:TY+ri[1]*S-52,x2:LX+ri[0]*S-4,y2:TY+ri[1]*S-8,stroke:"#8A2E0F","stroke-width":3},R.lab5); lab(LX+ri[0]*S-70,TY+ri[1]*S-62,"Île-de-France","#8A2E0F");
      R.q27=A27; R.q11=A11; }
    R.cap5=el("g",{},s5); el("text",{x:LX+350*S,y:TY+700*S+44,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Carte : la taille = la surface"},R.cap5); el("text",{x:RX+350*S,y:TY+700*S+44,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Cartogramme : la taille = les habitants"},R.cap5);
    R.leg5=el("g",{},s5); [["moins de 75","#FBEFC6"],["75 à 125","#F4C76A"],["125 à 200","#E58A3A"],["plus de 200","#8A2E0F"]].forEach(([t,c],i)=>{ const x=190+i*340; el("rect",{x,y:828,width:34,height:34,fill:c,stroke:"#9AA3B2","stroke-width":1.5},R.leg5); el("text",{x:x+46,y:855,"font-size":24,fill:C.ink,text:t},R.leg5); }); el("text",{x:30,y:855,"font-size":24,"font-weight":700,fill:C.grey,text:"hab./km² :"},R.leg5);
    // ---------- 6. synthèse ----------
    const s6=a.layer("s6"); R.s6=s6; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s6);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Ce qu'il faut retenir"},s6);
    el("text",{x:800,y:870,"text-anchor":"middle","font-size":22,fill:C.grey,text:"Sources : Insee, population légale 2022 et superficies des territoires (valeurs arrondies)."},s6);
    R.pts=[["1","La densité","nombre d'habitants\npar km²\n(population ÷ surface)"],["2","Deux facteurs","le nombre d'habitants\nET la surface\noù ils vivent"],["3","Très variable","≈ 59 en Bourgogne-\nFranche-Comté\n≈ 20 000 à Paris"]].map(([n,h,b],i)=>{ const g=el("g",{},s6); const x=60+i*505; el("rect",{x,y:100,width:470,height:310,rx:18,fill:"#F1F7F5",stroke:"#1C6E61","stroke-width":4},g); el("circle",{cx:x+50,cy:155,r:28,fill:"#1C6E61"},g); el("text",{x:x+50,y:167,"text-anchor":"middle","font-size":34,"font-weight":800,fill:"#fff",text:n},g); el("text",{x:x+95,y:166,"font-size":32,"font-weight":800,fill:"#1C6E61",text:h},g); const t=el("text",{x:x+30,y:238,"font-size":31,fill:C.ink},g); b.split("\n").forEach((l,j)=>el("tspan",{x:x+30,dy:j?46:0,text:l},t)); return g; });
    R.myth=el("g",{},s6); a.myth(R.myth,120,470,1360,"Là où il y a beaucoup d'habitants, la densité est forcément forte.","Non : il faut regarder la surface. La Bourgogne-Franche-Comté a plus d'habitants que Paris (2,8 millions contre 2,1), mais elle est 450 fois plus grande : sa densité est très faible.");
    // ---------- manipulation : faire varier population et surface ----------
    const s7=a.layer("s7"); R.s7=s7; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s7);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"À vous : faites varier le nombre d'habitants et la surface"},s7);
    R.u7=[...Array(250).keys()].map(i=>[((i+1)*0.7548776662)%1,((i+1)*0.5698402910)%1]);
    el("rect",{x:100,y:130,width:560,height:560,fill:"none",stroke:"#C9CED8","stroke-width":3,"stroke-dasharray":"12 10"},s7); el("text",{x:112,y:166,"font-size":24,fill:C.grey,text:"cadre en pointillés = 40 km²"},s7);
    R.sq7=el("rect",{x:100,y:130,width:560,height:560,fill:"#F3F8EC",stroke:C.ink,"stroke-width":5},s7);
    R.dt7=el("path",{d:"",fill:"none",stroke:C.idf,"stroke-linecap":"round"},s7);
    R.lb7=el("text",{x:100,y:740,"font-size":30,"font-weight":800,fill:C.ink},s7); R.lb7b=el("text",{x:100,y:782,"font-size":28,fill:C.grey},s7);
    R.lg7=el("g",{},s7); el("circle",{cx:112,cy:830,r:9,fill:C.idf},R.lg7); el("text",{x:134,y:838,"font-size":25,"font-weight":700,fill:C.ink,text:"1 point = 200 habitants"},R.lg7);
    R.cd7=el("g",{},s7); el("rect",{x:760,y:110,width:770,height:330,rx:18,fill:"#fff",stroke:"#9AA3B2","stroke-width":4},R.cd7);
    R.f1=el("text",{x:800,y:190,"font-size":48,"font-weight":800,fill:C.ink},R.cd7); R.f2=el("text",{x:800,y:260,"font-size":48,"font-weight":800,fill:C.ink},R.cd7);
    el("line",{x1:800,y1:288,x2:1490,y2:288,stroke:C.ink,"stroke-width":4},R.cd7); R.f3=el("text",{x:800,y:400,"font-size":78,"font-weight":800},R.cd7);
    R.vd7=el("g",{},s7); R.vdT=el("text",{x:760,y:520,"font-size":32,"font-weight":800},R.vd7);
    R.gg7=el("g",{},s7); { const gx=l=>780+(l-1.3)/3.5*740; el("line",{x1:780,y1:700,x2:1520,y2:700,stroke:C.ink,"stroke-width":6,"stroke-linecap":"round"},R.gg7);
      [["BFC ≈ 59",59,-1],["IDF ≈ 1 000",1000,1],["Dijon ≈ 4 000",4000,-1],["Paris ≈ 20 000",20000,1]].forEach(([t,v,up])=>{ const x=gx(Math.log10(v)); el("line",{x1:x,y1:690,x2:x,y2:710,stroke:C.ink,"stroke-width":4},R.gg7); el("text",{x,y:up<0?672:752,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.grey,text:t},R.gg7); });
      R.gm7=el("circle",{cx:780,cy:700,r:16,fill:C.bfc,stroke:C.ink,"stroke-width":4},R.gg7); R.gx7=gx; el("text",{x:1150,y:800,"text-anchor":"middle","font-size":24,fill:C.grey,text:"échelle des densités (hab./km²)"},R.gg7); }
    a.manip.innerHTML=`Habitants : <input type="range" id="mP" min="1000" max="50000" step="1000" value="20000"> <span id="mPv">20 000</span> &nbsp; Surface : <input type="range" id="mS" min="1" max="40" step="1" value="5"> <span id="mSv">5 km²</span>`;
    document.getElementById("mP").oninput=e=>{ bpop=+e.target.value; document.getElementById("mPv").textContent=fmt(bpop); a.redraw(); };
    document.getElementById("mS").oninput=e=>{ bsurf=+e.target.value; document.getElementById("mSv").textContent=bsurf+" km²"; a.redraw(); };
    // ---------- photos (encarts) ----------
    const ph=a.layer("photos");
    R.ph1=a.photo(ph,{id:"g-b3-paris-aerienne",x:1290,y:130,w:250,h:165,cap:"Paris vu du ciel",rot:2});
    R.ph2=a.photo(ph,{id:"g-b3-campagne-cote-d-or",x:1280,y:420,w:270,h:165,cap:"Campagne, Côte-d'Or",rot:-2});
  },
  reset(a){ [R.s1,R.s2,R.s4,R.s5,R.s6,R.s7,R.myth,R.ph1,R.ph2,R.rule,R.lg1,R.sil,...R.form,R.res,...R.sl,R.lg2,R.bfcL,R.parSmall,R.lens,R.parL,R.lg4,R.concl,R.mL,R.lab5,R.cap5,R.leg5,...R.pts].forEach(e=>a.op(e,0)); },
  etapes:[
  { titre:"Compter sur 1 km²", duree:11000,
    legende:"Pour mesurer à quel point un territoire est peuplé, on compte les habitants sur 1 km². En Bourgogne-Franche-Comté : environ 59 habitants par km². C'est la densité.",
    voix:"Pour savoir si un territoire est très peuplé ou peu peuplé, on compte les habitants sur un carré de un kilomètre de côté, c'est-à-dire un kilomètre carré. En Bourgogne-Franche-Comté, il y a environ deux millions huit cent mille habitants, répartis sur quarante-sept mille sept cent quatre-vingt-quatre kilomètres carrés. En divisant, on trouve environ cinquante-neuf habitants par kilomètre carré. C'est la densité de population.",
    anim(t,a){ const s=a.seg; a.op(R.s1,1); a.op(R.rule,s(t,.02,.12)); a.op(R.lg1,s(t,.1,.2)); const k=6*s(t,.15,.5,true); setDots(R.d1,Math.ceil(k-1e-9)); a.op(R.d1,k>0?1:0);
      a.op(R.sil,s(t,.45,.55)); a.op(R.form[0],s(t,.55,.65)); a.op(R.form[1],s(t,.65,.75)); a.op(R.res,s(t,.78,.88)); R.d1n.textContent="≈ "+fmt(59*s(t,.78,.95))+" hab./km²"; } },
  { titre:"Bourgogne, Côte-d'Or, Île-de-France", duree:11000,
    legende:"Même carré de 1 km², mais pas le même nombre de points. En Bourgogne-Franche-Comté et en Côte-d'Or : environ 60 habitants. En Île-de-France : environ 1 000 !",
    voix:"Regardons le même carré d'un kilomètre carré dans trois endroits. En Bourgogne-Franche-Comté, il y a environ soixante habitants, et en Côte-d'Or aussi. En Île-de-France, la région de Paris, il y en a environ mille, c'est-à-dire environ dix-sept fois plus.",
    anim(t,a){ const s=a.seg; a.op(R.s1,1-s(t,0,.08)); a.op(R.s2,s(t,0,.1)); R.t2.textContent="Un carré de 1 km² : de plus en plus d'habitants"; R.sl.forEach(g=>a.op(g,0));
      [0,1,2].forEach(i=>{ const g=R.sl[i]; const v=s(t,.1+i*.25,.2+i*.25); a.op(g,v); const k=T[i][3]*s(t,.2+i*.25,.45+i*.25,true); setDots(g.d,i===2?Math.round(k):Math.ceil(k-1e-9)); g.n.textContent=T[i][2]; });
      a.op(R.lg2,s(t,.05,.15)); } },
  { titre:"Dijon et Paris", duree:11000,
    legende:"Et dans une ville ? À Dijon : environ 4 000 habitants par km². À Paris : environ 20 000 ! Plus il y a de points sur 1 km², plus la densité est forte.",
    voix:"Et dans une ville ? À Dijon, on compte environ quatre mille habitants sur un kilomètre carré. Et à Paris, environ vingt mille ! Dans la capitale, le carré est presque entièrement rempli. Plus il y a de points dans le carré, plus la densité est forte.",
    anim(t,a){ const s=a.seg; a.op(R.s1,0); a.op(R.s2,1); R.t2.textContent="Un carré de 1 km² : de plus en plus d'habitants"; a.op(R.lg2,1);
      R.sl.forEach((g,i)=>{ if(i<3){ a.op(g,1); setDots(g.d,T[i][3]); g.n.textContent=T[i][2]; } else { const v=s(t,.05+(i-3)*.4,.15+(i-3)*.4); a.op(g,v); const k=T[i][3]*s(t,.15+(i-3)*.4,.5+(i-3)*.4,true); setDots(g.d,k); g.n.textContent=T[i][2]; } }); } },
  { titre:"Même population, surfaces différentes", duree:13000,
    legende:"La région compte presque autant d'habitants que Paris : 2,8 millions contre 2,1. Mais Paris tient dans 105 km², la région s'étend sur 47 784 km². La surface compte autant que le nombre d'habitants.",
    voix:"Comparons deux territoires, à la même échelle. La Bourgogne-Franche-Comté compte deux millions huit cent mille habitants. Paris en compte deux millions cent mille : presque autant. Mais regarde la surface de Paris : un tout petit carré ! Il faut l'agrandir douze fois pour voir ses habitants. Paris est environ quatre cent cinquante fois plus petit que notre région. C'est pour cela que sa densité est énorme.",
    anim(t,a){ const s=a.seg; a.op(R.s2,0); a.op(R.s4,1); a.op(R.mapG,s(t,0,.1)); setDots(R.bfcPts,280*s(t,.08,.4,true)); a.op(R.bfcL,s(t,.3,.42));
      a.op(R.parSmall,s(t,.42,.52)); a.op(R.lens,s(t,.52,.64)); setDots(R.parPts,211*s(t,.62,.85,true)); a.op(R.parL,s(t,.78,.88)); a.op(R.lg4,s(t,.1,.2)); a.op(R.concl,s(t,.88,.97));
      a.op(R.ph1,s(t,.7,.85)); a.op(R.ph2,s(t,.3,.45)); } },
  { titre:"À vous : population et surface", duree:9000,
    legende:"À vous : avec les curseurs, changez le nombre d'habitants et la surface. Regardez les points, et la densité qui change : à quoi ressemble votre territoire ?",
    voix:"À vous de jouer ! Avec les curseurs, changez le nombre d'habitants, puis la surface du territoire. Regardez les points : serrés ou espacés ? Et regardez la densité qui change. Que se passe-t-il quand on garde les mêmes habitants, mais sur une plus grande surface ?",
    anim(t,a){ const s=a.seg; a.op(R.s4,0); a.op(R.ph1,0); a.op(R.ph2,0); a.op(R.s7,s(t,0,.08));
      const side=560*Math.sqrt(bsurf/40), top=690-side; R.sq7.setAttribute("y",top); R.sq7.setAttribute("width",side); R.sq7.setAttribute("height",side);
      const nd=Math.round(bpop/200), k=Math.round(nd*s(t,.1,.45,true)); const r=Math.max(2.4,Math.min(9,side/Math.sqrt(nd)*.2));
      R.dt7.setAttribute("stroke-width",r*2); R.dt7.setAttribute("d",R.u7.slice(0,k).map(p=>`M${(100+p[0]*side).toFixed(1)} ${(top+p[1]*side).toFixed(1)}h.01`).join(""));
      R.lb7.textContent="Surface : "+bsurf+" km²"; R.lb7b.textContent=fmt(bpop)+" habitants"; a.op(R.lg7,s(t,.1,.2));
      const d=bpop/bsurf; a.op(R.cd7,s(t,.4,.55)); R.f1.textContent=fmt(bpop)+" habitants"; R.f2.textContent="÷ "+bsurf+" km²"; R.f3.textContent="= "+fmt(d)+" hab./km²"; const col=d<100?C.bfc:d<1500?C.idf:d<8000?C.dij:C.par; R.f3.setAttribute("fill",col);
      a.op(R.vd7,s(t,.5,.65)); R.vdT.setAttribute("fill",col); R.vdT.textContent=d<100?"Très peu dense : comme la Bourgogne-Franche-Comté":d<1500?"Assez dense : comme l'Île-de-France":d<8000?"Dense : comme Dijon":"Très dense : comme Paris";
      a.op(R.gg7,s(t,.55,.7)); R.gm7.setAttribute("cx",R.gx7(Math.log10(Math.max(20,d))));} },
  { titre:"Un cartogramme", duree:13000,
    legende:"Sur une carte, une grande région paraît très importante. Dans un cartogramme, chaque région est dessinée avec une taille proportionnelle à ses habitants : l'Île-de-France devient énorme, la Bourgogne-Franche-Comté très petite.",
    voix:"Sur une carte ordinaire, la taille d'une région dépend de sa surface. Un cartogramme fait autre chose : on dessine chaque région avec un carré dont la taille dépend du nombre d'habitants. Regarde l'Île-de-France : minuscule sur la carte, elle devient énorme. Et la Bourgogne-Franche-Comté, grande sur la carte, devient un petit carré. Les couleurs montrent la densité : plus c'est foncé, plus il y a d'habitants par kilomètre carré.",
    anim(t,a){ const s=a.seg; a.op(R.s4,0); a.op(R.s7,0); a.op(R.ph1,0); a.op(R.ph2,0); a.op(R.s5,1); a.op(R.mL,1); R.regP.forEach((p,i)=>a.op(p,s(t,.02+i*.012,.15+i*.012))); a.op(R.leg5,s(t,.2,.3)); a.op(R.cap5,s(t,.25,.35));
      R.sqs.forEach((g,i)=>{ const v=s(t,.35+(i%7)*.04,.5+(i%7)*.04); const sc=Math.max(.001,v); g.inner.setAttribute("transform",`scale(${sc})`); a.op(g,v>0?1:0); });
      a.op(R.lab5,s(t,.7,.82)); } },
  { titre:"Synthèse", duree:11000,
    legende:"La densité = nombre d'habitants ÷ surface. Elle dépend des deux. Elle est très faible dans notre région, très forte dans les grandes villes.",
    voix:"Pour finir, retenons trois choses. Un : la densité, c'est le nombre d'habitants par kilomètre carré. Deux : elle dépend à la fois du nombre d'habitants et de la surface où ils vivent. Trois : elle est très différente selon les endroits, faible chez nous et très forte à Paris.",
    anim(t,a){ const s=a.seg; a.op(R.s5,0); a.op(R.s6,s(t,0,.1)); R.pts.forEach((g,i)=>{ const v=s(t,.1+i*.14,.24+i*.14); a.op(g,v); a.tr(g,0,(1-v)*30); }); a.op(R.myth,s(t,.65,.8)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
