/* META {"id":"sciences-E5-tri-separation-dechets","matiere":"sciences","annee":"B","periode":1,"theme":"Les mélanges : séparer les constituants (tri des déchets)","resume":"Pour trier un mélange de déchets, on utilise leurs propriétés : l'aimant attire l'acier, le tamis trie par taille, l'eau sépare ce qui flotte de ce qui coule, le courant d'air emporte le léger. Exemple du tri à Dijon (bac jaune, colonne à verre, bac gris).","motsCles":["tri","séparation","mélange","aimant","tamis","flottaison","courant d'air","recyclage","déchets"]} */
(function(){
const R={}; let manActive=false, manT=0, manChoice=-1, manTried=false, manScore=0, manDone=0;
const C={ink:"#1E2430",or:"#E07A1F",gr:"#2E8B57",bl:"#2563A8",red:"#C0392B",wat:"#4A90D9"};
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
const AXs=[160,370,580,790,1000];
const METH=["L'aimant","Le tamis","L'eau (flotte ou coule ?)","Le courant d'air"];
const TASKS=[
 {t:"Retirer une boîte de conserve en acier d'un tas de déchets (verre, papier, plastique).",A:"steel",B:"glass",la:"boîte en acier",lb:"verre, papier…",ans:0,ok:"L'aimant attire l'acier, pas le verre, le papier ni le plastique."},
 {t:"Séparer de tout petits débris de gros emballages.",A:"debris",B:"box",la:"petits débris",lb:"gros emballages",ans:1,ok:"Les petits passent par les trous du tamis, les gros restent dessus."},
 {t:"Séparer un tesson de verre d'une barquette en polystyrène.",A:"shard",B:"foam",la:"tesson de verre",lb:"barquette",ans:2,ok:"Dans l'eau, la barquette flotte et le verre coule."},
 {t:"Séparer des feuilles de papier de bouteilles en verre.",A:"paper",B:"glass",la:"papier (léger)",lb:"verre (lourd)",ans:3,ok:"Le courant d'air emporte le papier léger, pas le verre lourd."},
 {t:"Séparer des canettes en aluminium de boîtes de conserve en acier.",A:"alu",B:"steel",la:"aluminium",lb:"acier",ans:0,ok:"L'aimant attire l'acier mais pas l'aluminium."} ];
/* ---------- objets dessinés (origine = milieu du bas) ---------- */
function mk(a,parent,kind,col){ const g=a.el("g",{},parent); const e=(t,at)=>a.el(t,at,g);
  const bottle=(f,s,cap)=>{ e("path",{d:"M-20,0 v-70 q0,-22 12,-36 v-30 h16 v30 q12,14 12,36 v70 z",fill:f,stroke:s,"stroke-width":3,"stroke-linejoin":"round","fill-opacity":.9}); if(cap) e("rect",{x:-9,y:-148,width:18,height:12,rx:3,fill:cap}); };
  switch(kind){
   case "steel": e("rect",{x:-30,y:-76,width:60,height:76,rx:4,fill:"#A9B4C2",stroke:"#5C6677","stroke-width":3}); e("rect",{x:-30,y:-58,width:60,height:36,fill:C.red}); e("line",{x1:-30,y1:-66,x2:30,y2:-66,stroke:"#5C6677","stroke-width":3}); e("line",{x1:-30,y1:-14,x2:30,y2:-14,stroke:"#5C6677","stroke-width":3}); break;
   case "alu": e("path",{d:"M-24,0 L-24,-72 Q-24,-84 -14,-84 L14,-84 Q24,-84 24,-72 L24,0 Z",fill:"#DDE2EA",stroke:"#8C96A6","stroke-width":3}); e("rect",{x:-24,y:-62,width:48,height:34,fill:C.bl}); e("rect",{x:-12,y:-90,width:24,height:6,rx:3,fill:"#B8BEC8"}); break;
   case "glass": bottle("#58B07A","#2E7048"); break;
   case "plastic": bottle("#8CCBEE","#3E86B0","#fff"); break;
   case "paper": e("path",{d:"M-30,-8 L-22,-34 L-2,-28 L20,-38 L32,-12 L18,2 L-14,4 Z",fill:"#fff",stroke:"#9AA3B2","stroke-width":3,"stroke-linejoin":"round"}); e("path",{d:"M-14,-22 L8,-18 M-4,-8 L16,-24",stroke:"#C5CAD3","stroke-width":2}); break;
   case "foam": e("path",{d:"M-46,-18 L46,-18 L36,0 L-36,0 Z",fill:"#F7F7F3",stroke:"#B9BFC9","stroke-width":3,"stroke-linejoin":"round"}); e("rect",{x:-48,y:-22,width:96,height:6,rx:3,fill:"#fff",stroke:"#B9BFC9","stroke-width":2}); break;
   case "cork": e("rect",{x:-15,y:-26,width:30,height:26,rx:5,fill:"#C9A06A",stroke:"#8A6A3A","stroke-width":3}); [[-6,-16],[5,-9],[3,-19]].forEach(([x,y])=>e("circle",{cx:x,cy:y,r:2,fill:"#8A6A3A"})); break;
   case "shard": e("path",{d:"M-20,0 L-8,-32 L14,-16 L22,0 Z",fill:"#6CC08B","fill-opacity":.9,stroke:"#2E7048","stroke-width":3,"stroke-linejoin":"round"}); break;
   case "stone": e("path",{d:"M-24,0 Q-28,-22 -6,-26 Q22,-28 26,-4 Q26,0 20,0 Z",fill:"#8C8F98",stroke:"#5C606A","stroke-width":3}); break;
   case "debris": e("circle",{cx:0,cy:-7,r:7,fill:col||"#8C8F98",stroke:"#5C606A","stroke-width":1.5}); break;
   case "box": e("rect",{x:-36,y:-58,width:72,height:58,rx:3,fill:"#C9A06A",stroke:"#8A6A3A","stroke-width":3}); e("rect",{x:-6,y:-58,width:12,height:58,fill:"#E3C79A"}); break;
   case "bag": e("path",{d:"M-34,0 Q-46,-48 -20,-62 L-8,-82 L8,-82 L20,-62 Q46,-48 34,0 Z",fill:"#4A5468",stroke:"#2B3040","stroke-width":3}); break;
   case "battery": e("rect",{x:-16,y:-54,width:32,height:54,rx:4,fill:C.gr,stroke:"#1B5E3A","stroke-width":3}); e("rect",{x:-7,y:-62,width:14,height:8,fill:"#B8BEC8"}); e("text",{x:0,y:-18,"text-anchor":"middle","font-size":30,"font-weight":800,fill:"#fff",text:"+"}); break;
   case "gas": e("rect",{x:-24,y:-86,width:48,height:86,rx:14,fill:C.red,stroke:"#7A1D12","stroke-width":3}); e("rect",{x:-8,y:-100,width:16,height:14,fill:"#B8BEC8"}); break;
  } return g; }
function item(a,parent,kind,x,y,s,r,col){ const g=mk(a,parent,kind,col); g._x=x; g._y=y; g.put=(x2,y2,s2,r2)=>g.setAttribute("transform",`translate(${x2},${y2}) scale(${s2||1}) rotate(${r2||0})`); g.put(x,y,s||1,r||0); return g; }
function lab(a,parent,x,y,str,o){ o=o||{}; const t=a.el("text",{x,y,"text-anchor":"middle","font-size":o.size||22,"font-weight":o.w||700,fill:o.fill||C.ink},parent); const L=str.split("\n"); L.forEach((l,i)=>a.el("tspan",{x,dy:i?(o.size||22)*1.2:0,text:l},t)); return t; }
function panel(a,parent,x,y,w,h,title,str,col){ const g=a.el("g",{},parent); a.el("rect",{x,y,width:w,height:h,rx:16,fill:"#fff",stroke:col,"stroke-width":4},g); a.el("text",{x:x+24,y:y+48,"font-size":30,"font-weight":800,fill:col,text:title},g); const t=a.el("text",{x:x+24,y:y+96,"font-size":28,"font-weight":600,fill:C.ink},g); a.wrap(t,str,Math.floor((w-48)/14.2),1.25); return g; }
function head(a,parent,n,t1,t2){ a.el("text",{x:60,y:76,"font-size":40,"font-weight":800,fill:C.bl,text:n+". "+t1},parent); a.el("text",{x:60,y:114,"font-size":28,"font-weight":600,fill:"#4A5468",text:t2},parent); }
function chip(a,parent,x,y,str,fill,stroke,color){ return a.label(parent,x,y,str,{size:24,stroke,color,fill}); }

Anim.run({
  titre:"Trier et séparer les déchets",
  sousTitre:"Sciences et technologie · CM1-CM2 · Les mélanges",
  matiere:"sciences", badge:"Sciences", manipDes:4, manipJusqua:4,
  accroche:"Comment séparer des déchets mélangés pour les recycler ?",
  init(a){
    const {el}=a;
    /* ===== 1. aimant ===== */
    const A=a.layer("A"); R.A=A; const AX=[160,370,580,790,1000], AK=["alu","glass","steel","paper","plastic"], AL=["canette\nen aluminium","bouteille\nen verre","boîte de conserve\nen acier","feuille\nde papier","bouteille\nen plastique"], FLOOR=700;
    R.aT1=el("text",{x:60,y:76,"font-size":40,"font-weight":800,fill:C.ink,text:"Un mélange de déchets"},A); R.aT1b=el("text",{x:60,y:114,"font-size":28,"font-weight":600,fill:"#4A5468",text:"Les constituants sont mélangés : comment les séparer ?"},A);
    R.aH=el("g",{},A); head(a,R.aH,1,"L'aimant","il trie selon le matériau");
    el("line",{x1:60,y1:FLOOR,x2:1100,y2:FLOOR,stroke:"#8C6A4F","stroke-width":6},A);
    R.aI=AK.map((k,i)=>item(a,A,k,AX[i],FLOOR,1,0)); R.aPile=AX.map((x,i)=>[580+(i-2)*34,FLOOR-(i%2)*8,(rnd(i,3)-.5)*60]);
    R.aL=AL.map((l,i)=>lab(a,A,AX[i],FLOOR+36,l)); R.aTag=AX.map((x,i)=>{ const g=el("g",{},A); a.label(g,x,FLOOR+130,i===2?"attirée !":"pas attiré",{size:22,w:150,h:40,stroke:i===2?C.gr:"#9AA3B2",color:i===2?C.gr:"#4A5468",fill:i===2?"#E8F6EE":"#fff"}); return g; });
    R.aM=el("g",{},A); el("line",{x1:0,y1:-420,x2:0,y2:-90,stroke:"#8C96A6","stroke-width":3},R.aM);
    el("path",{d:"M-50,0 L-50,-70 A50,50 0 0 1 50,-70 L50,0 L22,0 L22,-70 A22,22 0 0 0 -22,-70 L-22,0 Z",fill:C.red,stroke:"#7A1D12","stroke-width":3},R.aM); el("rect",{x:-50,y:-26,width:28,height:26,fill:"#DDE2EA",stroke:"#7A1D12","stroke-width":3},R.aM); el("rect",{x:22,y:-26,width:28,height:26,fill:"#DDE2EA",stroke:"#7A1D12","stroke-width":3},R.aM);
    R.aP=panel(a,A,1180,150,380,360,"Ce qu'on observe","L'aimant attire le fer et l'acier. Il n'attire pas l'aluminium, le verre, le plastique ni le papier.",C.or);
    R.aPh=a.photo(A,{id:"s-e5-aimant",x:1200,y:580,w:330,h:170,cap:"Un aimant attire l'acier",size:20,rot:2});
    /* ===== 2. tamis ===== */
    const S=a.layer("S"); R.S=S; head(a,S,2,"Le tamis","il trie selon la taille");
    const SX0=250, SW=600, SYY=430, TYY=660;
    R.sv=el("g",{},S); el("rect",{x:SX0-10,y:SYY,width:SW+20,height:16,rx:4,fill:"#8C96A6"},R.sv); for(let x=SX0;x<=SX0+SW;x+=30) el("rect",{x:x-4,y:SYY-6,width:8,height:28,fill:"#4A5468"},R.sv);
    R.sBig=[["steel",390],["glass",520],["foam",670],["box",790]].map(([k,x])=>item(a,R.sv,k,x,SYY-6,1,0));
    R.sPc=[...Array(20)].map((_,i)=>item(a,S,"debris",SX0+30+rnd(i,1)*(SW-60),SYY-6,1,0,["#8C8F98","#A9835A","#6CC08B","#B5532F"][i%4]));
    el("rect",{x:SX0-20,y:TYY+30,width:SW+40,height:16,rx:4,fill:"#8C6A4F"},S); el("path",{d:`M${SX0-20},${TYY+30} L${SX0-20},${TYY-10} M${SX0+SW+20},${TYY+30} L${SX0+SW+20},${TYY-10}`,stroke:"#8C6A4F","stroke-width":8},S);
    R.sL1=chip(a,S,SX0+SW/2,235,"Les gros restent dessus","#fff","#9AA3B2",C.ink); R.sL2=chip(a,S,SX0+SW/2,760,"Les petits tombent dessous : on les récupère","#fff",C.or,"#8A4A0E");
    R.sP=panel(a,S,920,150,640,300,"Ce qu'on observe","Le tamis trie selon la taille : les petits morceaux passent par les trous, les gros restent dessus.",C.or);
    R.sP2=el("g",{},S); { const t=el("text",{x:944,y:520,"font-size":26,"font-weight":600,fill:"#4A5468"},R.sP2); a.wrap(t,"Au centre de tri, de grands tambours percés tournent : c'est un tamis géant.",44,1.25); }
    /* ===== 3. flottaison ===== */
    const W=a.layer("W"); R.W=W; head(a,W,3,"L'eau : flotte ou coule ?","elle trie selon la flottaison");
    const WX0=300, WW=600, WTOP=380, WBOT=720;
    el("rect",{x:WX0,y:WTOP,width:WW,height:WBOT-WTOP,fill:C.wat,"fill-opacity":.4},W);
    R.wk=[["foam",400,1],["cork",560,1],["shard",730,0],["stone",840,0]].map(([k,x,fl],i)=>{ const g=item(a,W,k,x,240,1,0); g._fl=fl; g._x2=x; return g; });
    el("path",{d:`M${WX0},${WTOP-90} L${WX0},${WBOT} L${WX0+WW},${WBOT} L${WX0+WW},${WTOP-90}`,fill:"none",stroke:"#7E9BB3","stroke-width":6,"stroke-linejoin":"round"},W);
    el("line",{x1:WX0,y1:WTOP,x2:WX0+WW,y2:WTOP,stroke:C.wat,"stroke-width":4},W);
    R.wT=[["flotte",400,300,1],["flotte",560,300,1],["coule",730,640,0],["coule",840,640,0]].map(([tx,x,y,fl])=>{ const g=el("g",{},W); a.label(g,x,y,tx,{size:24,w:96,h:42,stroke:fl?C.gr:C.red,color:fl?C.gr:C.red,fill:"#fff"}); return g; });
    R.wL=[["barquette\nen polystyrène",400],["bouchon\nen liège",560],["tesson\nde verre",730],["caillou",840]].map(([l,x],i)=>lab(a,W,x,WBOT+36,l,{size:22}));
    R.wP=panel(a,W,980,150,580,330,"Ce qu'on observe","Dans l'eau, certains déchets flottent (barquette, bouchon) et d'autres coulent (verre, caillou). On récupère ce qui flotte à la surface.",C.or);
    /* ===== 4. courant d'air ===== */
    const V=a.layer("V"); R.V=V; head(a,V,4,"Le courant d'air","il trie selon la légèreté");
    el("line",{x1:60,y1:FLOOR,x2:1100,y2:FLOOR,stroke:"#8C6A4F","stroke-width":6},V);
    R.vFan=el("g",{transform:"translate(170,520)"},V); el("line",{x1:0,y1:60,x2:0,y2:180,stroke:"#8C96A6","stroke-width":10},R.vFan); el("rect",{x:-50,y:176,width:100,height:12,rx:5,fill:"#8C96A6"},R.vFan);
    R.vBl=el("g",{},R.vFan); [0,90,180,270].forEach(r=>el("ellipse",{cx:0,cy:-34,rx:18,ry:36,fill:C.bl,"fill-opacity":.85,transform:`rotate(${r})`},R.vBl)); el("circle",{r:70,fill:"none",stroke:"#8C96A6","stroke-width":6},R.vFan); el("circle",{r:10,fill:C.ink},R.vFan);
    R.vAir=[460,500,540,580].map((y,i)=>el("path",{d:`M270,${y} q60,-24 120,0 t120,0 t120,0 t120,0`,fill:"none",stroke:"#9ACBEF","stroke-width":5,"stroke-linecap":"round","stroke-dasharray":"30 20"},V));
    R.vK=[["paper",380,1],["glass",540,0],["paper",700,1],["steel",860,0]].map(([k,x,l])=>{ const g=item(a,V,k,x,FLOOR,1,0); g._l=l; g._x=x; return g; });
    R.vLab=["feuille\nde papier","bouteille\nen verre","feuille\nde papier","boîte de\nconserve"].map((l,i)=>lab(a,V,[380,540,700,860][i],FLOOR+36,l,{size:22}));
    el("path",{d:"M960,640 L970,700 L1110,700 L1120,640",fill:"#E3C79A","fill-opacity":.4,stroke:"#8A6A3A","stroke-width":5},V); lab(a,V,1040,FLOOR+36,"bac des\ndéchets légers",{size:22});
    R.vP=panel(a,V,1170,150,390,380,"Ce qu'on observe","Un courant d'air emporte les déchets légers (papier) et laisse les déchets lourds (verre, métal).",C.or);
    /* ===== manipulation : choisir la méthode ===== */
    const M=a.layer("M"); R.M=M; el("rect",{x:60,y:60,width:1480,height:270,rx:18,fill:"#fff",stroke:"#C9CED8","stroke-width":3},M);
    R.mH=el("text",{x:96,y:112,"font-size":28,"font-weight":800,fill:C.bl},M); R.mT=el("text",{x:96,y:170,"font-size":34,"font-weight":700,fill:C.ink},M);
    R.mIt=el("g",{},M);
    R.mScore=el("text",{x:1500,y:112,"text-anchor":"end","font-size":26,"font-weight":700,fill:"#4A5468"},M);
    R.mTile=METH.map((n,i)=>{ const g=el("g",{},M); const x=60+i*378; const r=el("rect",{x,y:380,width:352,height:240,rx:18,fill:"#fff",stroke:"#9AA3B2","stroke-width":5},g); g.r=r; const ic=el("g",{transform:`translate(${x+176},520)`},g);
      if(i===0){ el("path",{d:"M-44,20 L-44,-30 A44,44 0 0 1 44,-30 L44,20 L20,20 L20,-30 A20,20 0 0 0 -20,-30 L-20,20 Z",fill:C.red,stroke:"#7A1D12","stroke-width":3},ic); el("rect",{x:-44,y:0,width:24,height:22,fill:"#DDE2EA"},ic); el("rect",{x:20,y:0,width:24,height:22,fill:"#DDE2EA"},ic); el("rect",{x:-12,y:48,width:24,height:16,fill:"#A9B4C2",stroke:"#5C6677","stroke-width":2},ic); }
      if(i===1){ el("rect",{x:-100,y:-10,width:200,height:12,fill:"#8C96A6"},ic); for(let k=-96;k<=96;k+=24) el("rect",{x:k-3,y:-16,width:6,height:24,fill:"#4A5468"},ic); [-60,-12,40].forEach((x2,k)=>el("circle",{cx:x2,cy:30+k*8,r:6,fill:"#8C8F98"},ic)); el("rect",{x:-70,y:-52,width:50,height:40,rx:3,fill:"#C9A06A",stroke:"#8A6A3A","stroke-width":2},ic); }
      if(i===2){ el("rect",{x:-110,y:-30,width:220,height:90,fill:C.wat,"fill-opacity":.45,stroke:"#7E9BB3","stroke-width":3},ic); el("ellipse",{cx:-40,cy:-34,rx:34,ry:10,fill:"#F7F7F3",stroke:"#B9BFC9","stroke-width":2},ic); el("path",{d:"M30,52 L44,24 L64,40 L70,52 Z",fill:"#6CC08B",stroke:"#2E7048","stroke-width":2},ic); }
      if(i===3){ el("circle",{cx:-60,cy:0,r:36,fill:"none",stroke:"#8C96A6","stroke-width":5},ic); [0,90,180,270].forEach(r=>el("ellipse",{cx:-60,cy:-14,rx:8,ry:16,fill:C.bl,transform:`rotate(${r} -60 0)`},ic)); [-24,0,24].forEach(y=>el("path",{d:`M-10,${y} q30,-14 60,0 t60,0`,fill:"none",stroke:"#9ACBEF","stroke-width":5,"stroke-linecap":"round"},ic)); }
      lab(a,g,x+176,600,n,{size:26}); return g; });
    R.mFb=el("text",{x:800,y:710,"text-anchor":"middle","font-size":32,"font-weight":800},M); R.mFb2=el("text",{x:800,y:762,"text-anchor":"middle","font-size":28,"font-weight":600,fill:C.ink},M);
    a.manip.innerHTML=`Quelle méthode ? <button data-m="0">Aimant</button> <button data-m="1">Tamis</button> <button data-m="2">Eau</button> <button data-m="3">Courant d'air</button> <button data-m="n" id="mNext">Tâche suivante ▶</button>`;
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ const k=b.dataset.m; if(!manActive){ manActive=true; manT=0; manChoice=-1; manTried=false; manScore=0; manDone=0; }
      if(k==="n"){ manT++; if(manT>=TASKS.length){ manT=0; manScore=0; manDone=0; } manChoice=-1; manTried=false; }
      else { const m=+k; if(manChoice===TASKS[manT].ans) return; manChoice=m; if(!manTried){ manTried=true; manDone++; if(m===TASKS[manT].ans) manScore++; } }
      a.redraw(); });
    /* ===== À Dijon : trois bacs ===== */
    const D=a.layer("D"); R.D=D; head(a,D,5,"À Dijon : où va chaque déchet ?","à la maison, on trie d'abord");
    R.dBins=[[220,"Bac jaune","#F2C230","#D9A81C","Tous les emballages (métal, plastique, carton) et les papiers",["steel","alu","plastic","paper","box"]],[560,"Colonne à verre","#6B7280","#4B5563","Bouteilles, pots et bocaux en verre",["glass"]],[900,"Bac gris","#8C96A6","#5A6478","Le reste : les ordures ménagères",["bag"]]].map(([x,t1,c1,c2,t2,its])=>{
      const g=el("g",{},D); el("text",{x,y:176,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink},g).textContent=t1;
      if(t1==="Colonne à verre"){ el("rect",{x:x-70,y:260,width:140,height:250,rx:14,fill:c1,stroke:c2,"stroke-width":5},g); el("circle",{cx:x,cy:340,r:34,fill:"#1E2430"},g); el("rect",{x:x-80,y:250,width:160,height:22,rx:8,fill:c2},g); }
      else { el("path",{d:`M${x-80},270 L${x-66},510 L${x+66},510 L${x+80},270 Z`,fill:c1,stroke:c2,"stroke-width":5,"stroke-linejoin":"round"},g); el("rect",{x:x-92,y:246,width:184,height:30,rx:10,fill:c2},g); el("circle",{cx:x-44,cy:520,r:14,fill:C.ink},g); el("circle",{cx:x+44,cy:520,r:14,fill:C.ink},g); }
      const t=el("text",{x,y:600,"text-anchor":"middle","font-size":26,"font-weight":600,fill:C.ink},g); a.wrap(t,t2,24,1.25);
      const its2=its.map((k,i)=>item(a,g,k,x,200,.62,0)); g.its=its2; g.x=x; return g; });
    R.dPh=a.photo(D,{id:"s-e5-centre-de-tri",x:1130,y:150,w:400,h:250,cap:"Un centre de tri",rot:2});
    R.dTx=el("text",{x:1120,y:520,"font-size":26,"font-weight":600,fill:C.ink},D); a.wrap(R.dTx,"Au centre de tri de Dijon, des machines (tamis tournants, aimants, caméras…) trient le contenu des bacs jaunes.",30,1.25);
    /* ===== idée fausse ===== */
    const Y=a.layer("Y"); R.Y=Y; const bx=300;
    R.yB=el("g",{},Y); el("path",{d:`M${bx-100},380 L${bx-84},640 L${bx+84},640 L${bx+100},380 Z`,fill:"#F2C230",stroke:"#D9A81C","stroke-width":5,"stroke-linejoin":"round"},R.yB); el("rect",{x:bx-114,y:352,width:228,height:34,rx:12,fill:"#D9A81C"},R.yB); el("text",{x:bx,y:540,"text-anchor":"middle","font-size":30,"font-weight":800,fill:"#7A5A00",text:"Bac jaune"},R.yB);
    R.yOk=["steel","alu","box","paper"].map((k,i)=>item(a,Y,k,bx-120+i*80,300,.6,0));
    R.yNo=[["battery",640],["gas",780]].map(([k,x])=>{ const g=el("g",{},Y); item(a,g,k,x,640,1,0); el("circle",{cx:x,cy:600,r:70,fill:"none",stroke:C.red,"stroke-width":8},g); el("line",{x1:x-50,y1:550,x2:x+50,y2:650,stroke:C.red,"stroke-width":8},g); return g; });
    R.yNoT=el("g",{},Y); lab(a,R.yNoT,710,740,"pile, bonbonne de gaz : pas dans le bac jaune",{size:24,fill:C.red}); lab(a,R.yNoT,710,772,"(à rapporter en déchèterie ou en magasin)",{size:22,fill:C.red,w:600});
    R.yOkT=lab(a,Y,bx,700,"emballages et papiers : oui",{size:24,fill:C.gr});
    R.mythL=a.layer("myth"); R.mc=a.myth(R.mythL,880,80,680,"Au centre de tri, les machines retrient tout : inutile de trier chez soi.","Non : les machines ne séparent que les emballages et papiers du bac jaune, par matière. Le verre et les ordures ménagères ne passent pas par là, et une pile ou une bonbonne de gaz peut abîmer les machines. Bien trier chez soi est indispensable.");
    /* ===== synthèse ===== */
    R.syn=a.layer("syn"); el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},R.syn);
    el("text",{x:800,y:78,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink,text:"À retenir"},R.syn);
    R.pts=[["Pour séparer un mélange de déchets, on utilise leurs propriétés : matériau, taille, flottaison, légèreté.",C.bl],["L'aimant attire l'acier ; le tamis trie par taille ; dans l'eau, ça flotte ou ça coule ; le courant d'air emporte le léger.",C.or],["À Dijon : emballages et papiers dans le bac jaune, verre dans la colonne à verre, le reste dans le bac gris.",C.gr]].map(([tx,c],i)=>{
      const g=el("g",{},R.syn); const y=140+i*210; el("rect",{x:60,y,width:930,height:170,rx:18,fill:"#fff",stroke:c,"stroke-width":4},g); el("circle",{cx:120,cy:y+85,r:34,fill:c},g); el("text",{x:120,y:y+98,"text-anchor":"middle","font-size":38,"font-weight":800,fill:"#fff",text:i+1},g);
      const t=el("text",{x:180,y:y+62,"font-size":28,"font-weight":600,fill:C.ink},g); a.wrap(t,tx,50,1.2); return g; });
    R.ph2=a.photo(R.syn,{id:"s-e5-aimant",x:1060,y:230,w:440,h:300,cap:"Un aimant trie l'acier",rot:-2});
  },
  reset(a){ allOff(a); },
  etapes:[
  { titre:"Un mélange de déchets : l'aimant", duree:14000,
    legende:"Des déchets mélangés : comment les séparer ? Première méthode : l'aimant. Il attire la boîte de conserve en acier, mais pas la canette en aluminium, le verre, le papier ni le plastique.",
    voix:"Voici un mélange de déchets : une canette, une bouteille en verre, une boîte de conserve, une feuille de papier, une bouteille en plastique. Comment les séparer ? Première méthode : l'aimant. Passons-le au-dessus de chaque objet. Il attire la boîte de conserve, qui est en acier. Mais il n'attire pas la canette en aluminium, ni le verre, ni le papier, ni le plastique.",
    anim(t,a){ sc1(a,t); } },
  { titre:"Le tamis", duree:12000,
    legende:"Deuxième méthode : le tamis. On le secoue : les petits morceaux passent à travers les trous, les gros restent dessus. On trie selon la taille.",
    voix:"Deuxième méthode : le tamis. Secouons-le. Les petits morceaux passent à travers les trous et tombent dessous. Les gros restent sur le tamis. On trie donc selon la taille. Au centre de tri, de grands tambours percés tournent : c'est un tamis géant.",
    anim(t,a){ sc2(a,t); } },
  { titre:"L'eau : ça flotte ou ça coule", duree:12000,
    legende:"Troisième méthode : l'eau. La barquette en polystyrène et le bouchon en liège flottent ; le tesson de verre et le caillou coulent. On récupère ce qui flotte.",
    voix:"Troisième méthode : l'eau. Plongeons des objets dans l'eau. La barquette en polystyrène et le bouchon en liège flottent. Le tesson de verre et le caillou coulent au fond. On peut donc récupérer à la surface tout ce qui flotte.",
    anim(t,a){ sc3(a,t); } },
  { titre:"Le courant d'air", duree:12000,
    legende:"Quatrième méthode : le courant d'air. Il emporte les objets légers, comme le papier, et laisse sur place les objets lourds, comme le verre ou le métal.",
    voix:"Quatrième méthode : le courant d'air. Allumons un ventilateur. Les feuilles de papier, très légères, sont emportées dans le bac. La bouteille en verre et la boîte de conserve, plus lourdes, restent sur place.",
    anim(t,a){ sc4(a,t); } },
  { titre:"À vous : choisissez la méthode", duree:16000,
    legende:"À vous : pour chaque tâche, choisissez la bonne méthode (aimant, tamis, eau ou courant d'air) avec les boutons. Essayez-les toutes !",
    voix:"À vous de jouer ! Pour chaque tâche, choisissez la bonne méthode : l'aimant, le tamis, l'eau ou le courant d'air. Réfléchissez à ce qui est différent entre les deux sortes de déchets : le matériau, la taille, flotte ou coule, ou le poids. Prenez votre temps.",
    anim(t,a){ scM(a,t); } },
  { titre:"À Dijon : bac jaune, verre, bac gris", duree:13000,
    legende:"À Dijon : tous les emballages et les papiers vont dans le bac jaune, le verre dans la colonne à verre, le reste dans le bac gris. Le centre de tri sépare ensuite le contenu des bacs jaunes avec des machines.",
    voix:"Et à Dijon, comment trie-t-on ? Tous les emballages, en métal, en plastique ou en carton, et les papiers vont dans le bac jaune. Le verre va dans la colonne à verre. Tout le reste va dans le bac gris, celui des ordures ménagères. Ensuite, au centre de tri, des machines, comme des tamis tournants, des aimants et des caméras, séparent le contenu des bacs jaunes.",
    anim(t,a){ scD(a,t); } },
  { titre:"Idée fausse : « les machines retrient tout »", duree:13000,
    legende:"On croit parfois qu'inutile de trier chez soi, car les machines retrient tout. Faux : elles ne trient que le contenu du bac jaune, et une pile ou une bonbonne de gaz les abîme.",
    voix:"On entend parfois : pas besoin de trier chez soi, les machines du centre de tri retrient tout. C'est faux. Les machines ne séparent que les emballages et les papiers du bac jaune. Le verre et les ordures ménagères ne passent pas par là. Et une pile ou une bonbonne de gaz peut abîmer les machines : elles ne vont pas dans le bac jaune. Bien trier chez soi, c'est indispensable.",
    anim(t,a){ scY(a,t); a.cls(R.mc.faux,"pulse",t>.7); } },
  { titre:"À retenir", duree:9000,
    legende:"On sépare un mélange grâce aux propriétés des déchets : aimant, tamis, flottaison, courant d'air. À Dijon : bac jaune, colonne à verre, bac gris.",
    voix:"À retenir. Un : pour séparer un mélange de déchets, on utilise leurs propriétés : le matériau, la taille, la flottaison, la légèreté. Deux : l'aimant attire l'acier, le tamis trie selon la taille, dans l'eau ça flotte ou ça coule, et le courant d'air emporte ce qui est léger. Trois : à Dijon, emballages et papiers dans le bac jaune, verre dans la colonne à verre, le reste dans le bac gris.",
    anim(t,a){ const s=a.seg; allOff(a); a.op(R.syn,1); R.pts.forEach((g,i)=>a.op(g,s(t,.1+i*.22,.3+i*.22))); a.op(R.ph2,s(t,.75,.95)); } },
  ]
});
function allOff(a){ [R.A,R.S,R.W,R.V,R.M,R.D,R.Y,R.mythL,R.syn,R.ph2,R.aPh,R.dPh].forEach(e=>a.op(e,0)); }
/* 1 : aimant */
function sc1(a,t){ const s=a.seg; allOff(a); a.op(R.A,1); const FL=700, sp=s(t,.04,.22);
  a.op(R.aT1,1-s(t,.2,.26)); a.op(R.aT1b,1-s(t,.2,.26)); a.op(R.aH,s(t,.22,.3));
  const M0=AXs[0]-60, M1=AXs[4]+60, mx=a.lerp(M0,M1,s(t,.3,.86,true)), tcan=.3+.56*(AXs[2]-M0)/(M1-M0), tc=tcan-.02;
  const lift=s(t,tc,tc+.06);
  R.aI.forEach((g,i)=>{ const P=R.aPile[i]; let x=a.lerp(P[0],AXs[i],sp), y=a.lerp(P[1],FL,sp), r=a.lerp(P[2],0,sp);
    if(i===2&&lift>0){ x=a.lerp(AXs[2],mx,lift); y=a.lerp(FL,470+84,lift); r=0; }
    g.put(x,y,1,r); });
  R.aL.forEach((l,i)=>a.op(l,s(t,.22,.3)*(i===2&&lift>0?1-lift:1))); R.aTag.forEach((g,i)=>{ const tp=.3+.56*(AXs[i]-M0)/(M1-M0), pass=s(t,tp+.03,tp+.08); a.op(g,i===2?lift:pass); });
  a.op(R.aM,s(t,.26,.32)); a.tr(R.aM,mx,470);
  a.op(R.aP,s(t,.88,.97)); a.op(R.aPh,s(t,.9,.99)); }
/* 2 : tamis */
function sc2(a,t){ const s=a.seg; allOff(a); a.op(R.S,1); const SY=430, TY=660, sh=(t>.2&&t<.8)?Math.sin(t*90)*9:0;
  a.tr(R.sv,sh,0); R.sBig.forEach(g=>{ a.op(g,s(t,0,.12)); });
  R.sPc.forEach((g,i)=>{ const x0=250+30+rnd(i,1)*540, p=a.clamp((t-.22-rnd(i,5)*.3)/.2,0,1); const stack=Math.floor(i/6)*14+rnd(i,6)*4; const y=a.lerp(SY-6,TY+30-stack,a.ease(p)); a.op(g,s(t,0,.12)); g.put(x0+(p>0&&p<1?Math.sin(t*60+i)*3:sh*(p<=0?1:0)),y,1,0); });
  a.op(R.sL1,s(t,.3,.45)); a.op(R.sL2,s(t,.65,.8)); a.op(R.sP,s(t,.75,.9)); a.op(R.sP2,s(t,.85,.97)); }
/* 3 : flottaison */
function sc3(a,t){ const s=a.seg; allOff(a); a.op(R.W,1); const TOP=380, BOT=712;
  R.wk.forEach((g,i)=>{ const f=s(t,.08+i*.14,.3+i*.14); let y; if(g._fl){ y=a.lerp(240,TOP+10,a.ease(f)); if(f>.97) y+=Math.sin(t*28+i*2)*3; } else { const f1=a.clamp(f/.35,0,1), f2=a.clamp((f-.35)/.65,0,1); y=f<.35?a.lerp(240,TOP,a.ease(f1)):a.lerp(TOP,BOT,a.ease(f2)); }
    a.op(g,f>0?1:0); g.put(g._x2,y,1,g._fl?0:(rnd(i,4)-.5)*20*(1-a.clamp(f*2-1,0,1))); });
  R.wT.forEach((g,i)=>a.op(g,s(t,.45+i*.07,.55+i*.07))); R.wL.forEach(l=>a.op(l,s(t,.05,.15))); a.op(R.wP,s(t,.85,.97)); }
/* 4 : courant d'air */
function sc4(a,t){ const s=a.seg; allOff(a); a.op(R.V,1); const FL=700, on=s(t,.1,.2)*(1-s(t,.85,.95));
  R.vBl.setAttribute("transform",`rotate(${t*2400})`); R.vAir.forEach((p,i)=>{ a.op(p,on); p.style.strokeDashoffset=-(t*500+i*14)%50; });
  let j=0; R.vK.forEach((g,i)=>{ if(g._l){ const p=s(t,.25+j*.14,.62+j*.14); const x=a.lerp(g._x,1010+j*50,p), y=FL-Math.sin(p*Math.PI)*230; g.put(x,y,1,p*(j?-340:300)); j++; }
    else { g.put(g._x,FL,1,t>.25&&t<.8?Math.sin(t*50+i)*1.5:0); } });
  a.op(R.vP,s(t,.85,.97)); }
/* manipulation */
function scM(a,t){ const s=a.seg; allOff(a); a.op(R.M,1); if(t<.02) manActive=false;
  let T=manActive?manT:0, ch=manActive?manChoice:(t>.45?0:-1), done=manActive?manDone:(t>.45?1:0), sc=manActive?manScore:(t>.45?1:0);
  const tk=TASKS[T]; R.mH.textContent=`Tâche ${T+1} sur ${TASKS.length}`; R.mScore.textContent=`Réussi du premier coup : ${sc} sur ${done}`;
  R.mT.textContent=""; a.wrap(R.mT,tk.t,62,1.2);
  while(R.mIt.firstChild) R.mIt.removeChild(R.mIt.firstChild);
  const ga=item(a,R.mIt,tk.A,1220,270,1.1,0,"#8C8F98"), gb=item(a,R.mIt,tk.B,1400,270,1.1,0); lab(a,R.mIt,1220,300,tk.la.replace(" ","\n"),{size:22}); lab(a,R.mIt,1400,300,tk.lb.replace(" ","\n"),{size:22});
  R.mTile.forEach((g,i)=>{ const sel=ch===i, ok=sel&&i===tk.ans; g.r.setAttribute("stroke",sel?(ok?C.gr:C.red):"#9AA3B2"); g.r.setAttribute("fill",sel?(ok?"#E8F6EE":"#FDECEA"):"#fff"); g.r.setAttribute("stroke-width",sel?9:5); });
  const good=ch===tk.ans; R.mFb.textContent=ch<0?"Quelle méthode permet de les séparer ?":good?"Bravo !":"Pas celle-là. Essaie encore !"; R.mFb.setAttribute("fill",ch<0?"#4A5468":good?C.gr:C.red);
  R.mFb2.textContent=good?tk.ok:(ch<0?"Cherche ce qui est différent : le matériau, la taille, flotte ou coule, ou le poids.":"Qu'est-ce qui est différent entre les deux sortes de déchets ?"); }
/* À Dijon */
function scD(a,t){ const s=a.seg; allOff(a); a.op(R.D,1);
  R.dBins.forEach((g,bi)=>{ a.op(g,s(t,bi*.12,bi*.12+.1)); g.its.forEach((it,i)=>{ const st=.18+bi*.12+i*.08, p=s(t,st,st+.12); const y=a.lerp(285,430,a.ease(p)); it.put(g.x+(i%2?14:-14)*(g.its.length>1?1:0),y,.62,0); a.op(it,p>0&&p<.93?1:0); }); });
  a.op(R.dPh,s(t,.75,.92)); a.op(R.dTx,s(t,.85,.97)); }
/* idée fausse */
function scY(a,t){ const s=a.seg; allOff(a); a.op(R.Y,1); a.op(R.yB,s(t,0,.1)); R.yOk.forEach((g,i)=>{ const p=s(t,.08+i*.06,.2+i*.06); g.put(300-120+i*80+((i%2)?8:-8)*0,a.lerp(300,400,a.ease(p)),.6,0); a.op(g,p>0&&p<.95?1:0); }); a.op(R.yOkT,s(t,.3,.4));
  R.yNo.forEach((g,i)=>a.op(g,s(t,.3+i*.08,.4+i*.08))); a.op(R.yNoT,s(t,.45,.55)); a.op(R.mythL,s(t,.55,.72)); }
})();
