/* META {"id":"histoire-C1-peste-noire","matiere":"histoire","annee":"connexe","periode":1,"theme":"connexe","resume":"De 1347 à 1352, la peste arrive par les bateaux marchands, avance de ville en ville (curseur de mois à manipuler) et tue une grande partie des Européens : le mécanisme rat, puce, humain et ses conséquences.","motsCles":["peste noire","1347","bateaux marchands","puce","rat","bactérie","Givry","épidémie","salaires","Moyen Âge"]} */
//@data europe
(function(){
const E=EUROPE, V=E.villes;
const C={sea:"#DCEBF5",land:"#F5EFE2",ink:"#1E2430",or:"#E07A1F",red:"#C0392B",wood:"#8C5A32",
  s47:"#F2B84B",s48:"#E8803A",s49:"#C9402B",s50:"#8E1F2B",s51:"#6A2352",s52:"#2E1245"};
let Z={s:1,cx:800,cy:380,tx:800,ty:380};
const WORLD={s:1,cx:800,cy:380,tx:800,ty:380}, EST={s:2.0,cx:925,cy:445,tx:800,ty:380};
const zoomTo=(a,b,t)=>{ const L=Anim.H.lerp; Z={s:L(a.s,b.s,t),cx:L(a.cx,b.cx,t),cy:L(a.cy,b.cy,t),tx:800,ty:380}; };
const P=p=>[Z.tx+Z.s*(p[0]-Z.cx), Z.ty+Z.s*(p[1]-Z.cy)];
// villes projetées sur la carte d'Europe du moteur (même projection que europe.json)
const PT={Caffa:[1102,379],Constantinople:[1010,504],Messine:[756,602],Marseille:[566,464],Genes:[633,442],Venise:[695,418],Paris:[531,318],Londres:[502,245],Avignon:[558,447],Mayence:[631,300]};
const MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const dateTxt=m=>{ const k=Math.round(m)+9; const an=1347+Math.floor(k/12); return MOIS[k%12]+" "+an; }; // m=0 -> octobre 1347
let R={}, M=62;
// état de la carte au mois m (0 = octobre 1347) — commun à l'étape automatique et à la manipulation
function epi(a,m){ const s=a.seg; Z=Object.assign({},WORLD); a.op(R.date,1); a.op(R.note,1);
  R.dateT.textContent=dateTxt(m); a.op(R.cur,1); a.tr(R.cur,R.X(m),0);
  const ys=Math.floor(m/12), ms=Math.round(m%12); const parts=[]; if(ys) parts.push(ys+(ys>1?" ans":" an")); if(ms) parts.push(ms+" mois"); R.since.textContent=parts.length?"Depuis Messine : "+parts.join(" et "):""; a.op(R.since,parts.length?1:0);
  R.sl.forEach((sl,gi)=>sl.circ.forEach((c,i)=>{ const d=SL[gi].c[i]; const k=Math.max(0,Math.min(1,(m-d[3])/Math.max(.5,d[4]-d[3]))); c.setAttribute("r",d[2]*(k*(2-k))); c.setAttribute("fill-opacity",.82); }));
  ["Caffa","Constantinople"].forEach(n=>{ a.op(R.city[n],1); a.op(R.lbl[n],0); });
  a.op(R.route1,1); a.draw(R.route1,1); a.op(R.route2,1); a.draw(R.route2,1); a.op(R.route3,1); a.draw(R.route3,1);
  a.op(R.ship,0); a.op(R.city.Messine,1); a.op(R.lbl.Messine,0); a.op(R.when.Messine,0); a.op(R.city.Marseille,1); a.op(R.when.Marseille,0); a.op(R.city.Genes,1);
  a.op(R.lbl.Marseille,0);
  const th=mm=>s(m,mm,mm+1.2);
  a.op(R.city.Venise,th(3)); a.op(R.lbl.Venise,th(3)); a.op(R.when.Venise,th(3));
  a.op(R.city.Paris,th(9)); a.op(R.lbl.Paris,th(9)); a.op(R.when.Paris,th(9));
  a.op(R.city.Londres,th(13)); a.op(R.lbl.Londres,th(13)); a.op(R.when.Londres,th(13));
  a.op(R.lbl.Allemagne,th(18)); a.op(R.when.Allemagne,th(18)); a.op(R.lbl.Scandi,th(30)); a.op(R.when.Scandi,th(30)); a.op(R.lbl.Russie,th(53)); a.op(R.when.Russie,th(53));
}

// disques « zone touchée » : [cx,cy,rayon,mois début,mois fin]  (mois 0 = octobre 1347) — schéma simplifié
const SL=[
 {col:C.s52,c:[[921,86,110,52,58],[945,110,140,54,62]]},
 {col:C.s51,c:[[821,298,70,39,47]]},
 {col:C.s50,c:[[704,158,115,27,35],[682,48,120,29,37],[779,62,110,31,39],[479,125,90,31,38]]},
 {col:C.s49,c:[[531,300,160,15,22],[631,300,150,16,24],[677,330,110,16,24],[765,348,110,18,27],[419,179,70,18,26],[502,230,130,15,23],[385,509,130,15,22],[324,573,100,16,23],[715,240,90,23,28],[731,301,90,21,28]]},
 {col:C.s48,c:[[674,460,120,3,9],[695,418,70,3,6],[558,447,120,3,9],[501,505,95,4,10],[531,318,95,8,12],[502,246,90,11,15],[696,508,70,4,8],[960,560,90,6,13]]},
 {col:C.s47,c:[[1010,504,75,-2,0],[1102,379,70,-3,-1],[756,602,52,0,1],[566,464,40,1,2],[633,442,40,1,2],[900,630,60,-1,2]]},
];
const G47=5, NM=62; // index du groupe 1347 ; dernier mois de la frise (décembre 1352)

function ratG(a,p){ const g=a.el("g",{},p);
  a.el("path",{d:"M-58,6 C-95,6 -105,-30 -140,-24 C-165,-20 -170,10 -150,16",fill:"none",stroke:"#B88A7E","stroke-width":6,"stroke-linecap":"round"},g);
  [-34,28].forEach(x=>a.el("rect",{x:x,y:14,width:12,height:20,rx:5,fill:"#4B3E35"},g));
  a.el("ellipse",{cx:0,cy:-6,rx:64,ry:32,fill:"#6B5B4E",stroke:C.ink,"stroke-width":3},g);
  a.el("ellipse",{cx:64,cy:-2,rx:30,ry:19,fill:"#6B5B4E",stroke:C.ink,"stroke-width":3},g);
  a.el("circle",{cx:50,cy:-22,r:11,fill:"#B88A7E",stroke:C.ink,"stroke-width":2.5},g);
  a.el("circle",{cx:94,cy:0,r:6,fill:"#E3A0A0",stroke:C.ink,"stroke-width":2},g);
  a.el("circle",{cx:72,cy:-8,r:4,fill:"#fff"},g); a.el("circle",{cx:73,cy:-8,r:2,fill:C.ink},g);
  return g; }
function fleaG(a,p,k){ const g=a.el("g",{},p); k=k||1;
  [-1,0,1].forEach(i=>{ a.el("path",{d:`M${i*5*k},2 L${i*9*k-6*k},${12*k}`,stroke:"#3A2A1E","stroke-width":1.8*k,fill:"none"},g); a.el("path",{d:`M${i*5*k},2 L${i*9*k+7*k},${12*k}`,stroke:"#3A2A1E","stroke-width":1.8*k,fill:"none"},g); });
  a.el("ellipse",{cx:0,cy:-2*k,rx:11*k,ry:7.5*k,fill:"#6A3A1E",stroke:"#2A1A0E","stroke-width":1.5*k},g);
  a.el("circle",{cx:12*k,cy:-3*k,r:4.5*k,fill:"#6A3A1E",stroke:"#2A1A0E","stroke-width":1.5*k},g);
  return g; }
function personG(a,p,col){ const g=a.el("g",{},p);
  a.el("circle",{cx:0,cy:-118,r:24,fill:"#F1C9A5",stroke:C.ink,"stroke-width":3},g);
  a.el("path",{d:"M-26,-90 L26,-90 L36,0 L-36,0Z",fill:col||"#3C6FA8",stroke:C.ink,"stroke-width":3,"stroke-linejoin":"round"},g);
  a.el("rect",{x:-6,y:-98,width:12,height:12,fill:"#F1C9A5"},g);
  return g; }
function houseG(a,p,x,y,w,h,col,dead){ const g=a.el("g",{},p);
  a.el("rect",{x,y:y-h,width:w,height:h,fill:dead?"#CFC8BA":col,stroke:C.ink,"stroke-width":3},g);
  a.el("path",{d:`M${x-8},${y-h} L${x+w/2},${y-h-w*.42} L${x+w+8},${y-h}Z`,fill:dead?"#A39B8B":"#9A4B2B",stroke:C.ink,"stroke-width":3,"stroke-linejoin":"round"},g);
  a.el("rect",{x:x+w*.38,y:y-h*.55,width:w*.24,height:h*.55,fill:dead?"#7A7468":"#5A3A22"},g);
  return g; }
function shipG(a,p){ const g=a.el("g",{},p);
  a.el("path",{d:"M-46,0 L46,0 L32,20 L-32,20Z",fill:C.wood,stroke:C.ink,"stroke-width":3,"stroke-linejoin":"round"},g);
  a.el("line",{x1:0,y1:0,x2:0,y2:-56,stroke:C.ink,"stroke-width":4},g);
  a.el("path",{d:"M4,-54 L36,-8 L4,-8Z",fill:"#FFF6DF",stroke:C.ink,"stroke-width":3,"stroke-linejoin":"round"},g);
  a.el("rect",{x:-34,y:-12,width:18,height:12,fill:"#C9A064",stroke:C.ink,"stroke-width":2},g);
  return g; }
function txt(p,x,y,s,o){ o=o||{}; const t=a0.el("text",{x,y,"text-anchor":o.anchor||"middle","font-size":o.size||26,"font-weight":o.weight||800,fill:o.fill||C.ink,stroke:o.stroke===undefined?"#fff":o.stroke,"stroke-width":o.sw||5,"paint-order":"stroke"},p); t.textContent=s; return t; }
let a0;

Anim.run({
  titre:"La peste noire (1347-1352)",
  sousTitre:"Histoire · CM1-CM2 · Le Moyen Âge et la fin du Moyen Âge",
  matiere:"histoire", badge:"Histoire",
  accroche:"Comment une maladie venue d'un port de la mer Noire a-t-elle traversé toute l'Europe ?",
  manipDes:2, manipJusqua:2,
  init(a){
    a0=a; const {el}=a;
    // ----- carte
    const map=a.layer("map"); R.map=map;
    const defs=el("defs",{},a.svg);
    const cp=el("clipPath",{id:"terre"},defs); el("path",{d:E.land},cp);
    const cz=el("clipPath",{id:"zoneCarte"},defs); el("rect",{x:0,y:0,width:1600,height:760,rx:14},cz);
    a.svg.insertBefore(defs,a.svg.firstChild);
    map.setAttribute("clip-path","url(#zoneCarte)");
    el("rect",{x:-2000,y:-2000,width:6000,height:5000,fill:C.sea},map);
    const inner=el("g",{},map); R.inner=inner;
    el("path",{d:E.land,fill:C.land,stroke:"#B8AC93","stroke-width":1},inner);
    const zones=el("g",{"clip-path":"url(#terre)"},inner);
    R.sl=SL.map(s=>({g:el("g",{fill:s.col,"fill-opacity":.82},zones),circ:s.c.map(c=>el("circle",{cx:c[0],cy:c[1],r:0},null))}));
    R.sl.forEach(s=>s.circ.forEach(c=>s.g.appendChild(c)));
    // trajet des bateaux (coordonnées carte)
    R.route1=el("path",{d:"M1102,379 C1085,430 1050,470 1010,504 C985,545 960,610 905,642 C860,668 805,640 756,602",fill:"none",stroke:"#5B4636","stroke-width":5,"stroke-dasharray":"2 12","stroke-linecap":"round"},inner);
    R.route2=el("path",{d:"M756,602 C715,570 668,548 640,525 C620,500 600,478 566,464",fill:"none",stroke:"#5B4636","stroke-width":5,"stroke-dasharray":"2 12","stroke-linecap":"round"},inner);
    R.route3=el("path",{d:"M640,525 C640,500 636,470 633,442",fill:"none",stroke:"#5B4636","stroke-width":5,"stroke-dasharray":"2 12","stroke-linecap":"round"},inner);
    // marqueurs en coordonnées écran
    const lab=a.layer("labels"); R.lab=lab;
    R.city={}; Object.keys(PT).forEach(n=>{ R.city[n]=el("circle",{r:8,fill:C.ink,stroke:"#fff","stroke-width":3},lab); });
    R.lbl={};
    const mk=(k,s,o)=>{ R.lbl[k]=txt(lab,0,0,s,o); };
    mk("Caffa","Caffa (mer Noire)",{size:26}); mk("Constantinople","Constantinople",{size:24});
    mk("Messine","Messine (Sicile)",{size:24}); mk("Marseille","Marseille",{size:24}); mk("Paris","Paris",{size:24}); mk("Londres","Londres",{size:24}); mk("Venise","Venise",{size:24});
    mk("Allemagne","Allemagne",{size:24}); mk("Scandi","Scandinavie",{size:24}); mk("Russie","Russie",{size:24});
    R.when={}; [["Messine","octobre 1347"],["Marseille","novembre 1347"],["Venise","janvier 1348"],["Paris","été 1348"],["Londres","fin 1348"],["Allemagne","1349"],["Scandi","1349-1350"],["Russie","1352"]].forEach(([k,s])=>{ R.when[k]=txt(lab,0,0,s,{size:22,weight:700,fill:"#7A1D12"}); });
    // navire
    R.shipL=a.layer("ship"); R.ship=shipG(a,R.shipL);
    R.shipRat=el("g",{},R.ship); const rr=el("g",{},R.shipRat); ratG(a,rr); a.tr(rr,22,-12,.2); const ff=el("g",{},R.shipRat); fleaG(a,ff,1); a.tr(ff,-2,-18,.5);
    R.shipLbl=txt(R.ship,0,-96,"des rats et des puces à bord",{size:22,fill:"#7A1D12"});
    // bande du bas : date + frise des mois (la couleur des années est celle de la carte)
    const dg=a.layer("date"); R.date=dg;
    el("rect",{x:0,y:766,width:1600,height:134,fill:"#F7F1E6"},dg); el("line",{x1:0,y1:766,x2:1600,y2:766,stroke:"#B8AC93","stroke-width":3},dg);
    R.dateT=el("text",{x:200,y:822,"text-anchor":"middle","font-size":40,"font-weight":800,fill:C.red},dg);
    R.since=el("text",{x:200,y:862,"text-anchor":"middle","font-size":23,"font-weight":700,fill:"#4A5468"},dg);
    el("text",{x:990,y:798,"text-anchor":"middle","font-size":22,"font-weight":700,fill:"#4A5468",text:"Couleur sur la carte = année où la peste arrive"},dg);
    const X=m=>420+m/NM*1140; R.X=X;
    [[0,3,C.s47,"1347"],[3,15,C.s48,"1348"],[15,27,C.s49,"1349"],[27,39,C.s50,"1350"],[39,51,C.s51,"1351"],[51,NM,C.s52,"1352"]].forEach(([m0,m1,c,l])=>{ el("rect",{x:X(m0),y:812,width:X(m1)-X(m0),height:44,fill:c,stroke:"#fff","stroke-width":2},dg); el("text",{x:(X(m0)+X(m1))/2,y:843,"text-anchor":"middle","font-size":m1-m0<5?20:24,"font-weight":800,fill:m0===0?"#1E2430":"#fff",text:l},dg); });
    R.cur=el("g",{},dg); el("path",{d:"M0,808 L0,872",stroke:C.ink,"stroke-width":5},R.cur); el("path",{d:"M-13,876 L13,876 L0,860Z",fill:C.ink},R.cur);
    R.leg=el("g",{},dg);
    R.ask=a.label(a.layer("ask"),400,70,"Où est la peste un an après Messine (octobre 1348) ?",{size:26,fill:"#FFF4DC",stroke:C.or,w:640,h:60});
    R.note=el("text",{x:1580,y:748,"text-anchor":"end","font-size":22,fill:"#4A5468",stroke:"#fff","stroke-width":4,"paint-order":"stroke",text:"Carte simplifiée : les dates sont approximatives"},a.svg);

    // ----- fond blanc des schémas
    const sch=a.layer("schema"); R.sch=sch;
    el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:"#fff"},sch);
    // === Mécanisme (rat -> puce -> humain)
    const mg=el("g",{},sch); R.mech=mg;
    el("rect",{x:0,y:640,width:1600,height:260,fill:"#E9DDC4"},mg); el("line",{x1:0,y1:640,x2:1600,y2:640,stroke:"#8C7A5B","stroke-width":4},mg);
    // navire à gauche
    R.mShip=el("g",{},mg); el("path",{d:"M10,520 L330,520 L300,610 L40,610Z",fill:C.wood,stroke:C.ink,"stroke-width":4,"stroke-linejoin":"round"},R.mShip);
    el("rect",{x:60,y:470,width:70,height:50,fill:"#C9A064",stroke:C.ink,"stroke-width":3},R.mShip); el("rect",{x:145,y:455,width:60,height:65,fill:"#C9A064",stroke:C.ink,"stroke-width":3},R.mShip);
    el("path",{d:"M330,540 L430,640",stroke:"#6A4A2E","stroke-width":12,"stroke-linecap":"round"},R.mShip);
    txt(R.mShip,175,572,"navire marchand",{size:24,fill:"#fff",stroke:"#3A2A1E"});
    // maison + habitant
    R.mHouse=houseG(a,mg,1230,640,230,170,"#F3E5C8",false);
    R.mPers=el("g",{},mg); personG(a,R.mPers,"#3C6FA8"); a.tr(R.mPers,1080,640);
    R.bub=el("g",{},R.mPers); // bubons (sur la personne)
    [[-8,-72],[20,-60]].forEach(p=>el("circle",{cx:p[0],cy:p[1],r:9,fill:"#7A1D12",stroke:"#3A0A06","stroke-width":2},R.bub));
    R.bub.querySelectorAll("circle");
    R.fever=el("g",{},mg); txt(R.fever,1090,452,"fièvre, ganglions",{size:24,fill:"#7A1D12"}); txt(R.fever,1090,482,"gonflés (bubons)",{size:24,fill:"#7A1D12"});
    // rat
    R.rat=el("g",{},mg); R.ratIn=el("g",{},R.rat); ratG(a,R.ratIn);
    R.ratFleas=[[-20,-36],[10,-40],[-48,-18]].map(p=>{ const f=el("g",{},R.ratIn); fleaG(a,f,1.0); a.tr(f,p[0],p[1],1.1); return f; });
    R.ratL=txt(mg,0,0,"rat noir",{size:26});
    // puce qui saute
    R.jump=el("g",{},mg); fleaG(a,R.jump,1.5);
    // bulle de zoom
    const bg=el("g",{},mg); R.zoom=bg;
    el("circle",{cx:800,cy:300,r:150,fill:"#FFFDF6",stroke:C.ink,"stroke-width":5},bg);
    R.bubFlea=el("g",{},bg); fleaG(a,R.bubFlea,5.2); a.tr(R.bubFlea,780,318);
    R.bact=[[-48,-14],[-20,-26],[8,-18],[-30,2],[-4,2],[20,-4],[-52,16],[-10,22]].map(p=>{ const b=el("ellipse",{cx:0,cy:0,rx:11,ry:5,fill:C.red,stroke:"#5B0F08","stroke-width":2},bg); b._p=p; return b; });
    R.zl1=txt(bg,800,474,"zoom sur la puce",{size:24,weight:700,stroke:"#fff"});
    R.zl2=txt(bg,800,142,"bactérie : un microbe invisible à l'œil nu",{size:24,fill:C.red});
  
    // chaîne
    R.chain=[0,1,2].map(i=>{ const s=["1. Le rat malade porte des puces","2. La puce pique et passe sur l'humain","3. Le microbe rend l'humain malade"][i]; const g=a.label(mg,[300,800,1300][i],52,s,{size:23,fill:"#FFF4DC",stroke:C.or,w:470,h:56}); return g; });
    R.chainA=[0,1].map(i=>a.arrow(mg,`M${[540,1040][i]},52 L${[560,1060][i]},52`,{color:C.or,w:6,head:3}));
    // === Idée fausse
    R.mythL=el("g",{},sch); R.yers=el("g",{},sch); el("rect",{x:800,y:420,width:740,height:70,rx:14,fill:"#FFF4DC",stroke:C.or,"stroke-width":3},R.yers); el("text",{x:1170,y:466,"text-anchor":"middle","font-size":27,"font-weight":800,fill:"#7A3F00",text:"1894 : Alexandre Yersin identifie le microbe"},R.yers);
    R.myth=a.layer("mythL"); a.myth(R.myth,800,130,740,"« La peste venait de la saleté ou d'une punition de Dieu. »","C'est une maladie causée par une bactérie, transmise par les puces des rats. On a découvert ce microbe en 1894 : il y a 600 ans, personne ne pouvait le savoir.");
    // === Givry
    const gg=el("g",{},sch); R.givry=gg;
    el("text",{x:800,y:78,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.red,text:"Près de chez nous : Givry (Saône-et-Loire), 1348"},gg);
    el("text",{x:800,y:120,"text-anchor":"middle","font-size":24,fill:"#4A5468",text:"Le curé note chaque mort dans son registre paroissial. Voici le nombre de morts :"},gg);
    el("line",{x1:240,y1:720,x2:1360,y2:720,stroke:C.ink,"stroke-width":4},gg);
    R.gb1=el("rect",{x:380,y:720,width:200,height:0,fill:"#2E8B57",stroke:C.ink,"stroke-width":3},gg);
    R.gb2=el("rect",{x:900,y:720,width:200,height:0,fill:C.red,stroke:C.ink,"stroke-width":3},gg);
    R.gv1=el("text",{x:480,y:700,"text-anchor":"middle","font-size":40,"font-weight":800,fill:"#14532D"},gg);
    R.gv2=el("text",{x:1000,y:0,"text-anchor":"middle","font-size":40,"font-weight":800,fill:"#7A1D12"},gg);
    el("text",{x:480,y:765,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.ink,text:"Une année normale"},gg);
    el("text",{x:480,y:797,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"(avant 1348)"},gg);
    el("text",{x:1000,y:765,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.ink,text:"Du 28 juillet au 19 novembre 1348"},gg);
    el("text",{x:1000,y:797,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"en moins de 4 mois"},gg);
    R.gnote=el("text",{x:800,y:850,"text-anchor":"middle","font-size":24,"font-weight":700,fill:"#7A1D12",text:"Soit autant de morts en moins de 4 mois qu'en une vingtaine d'années."},gg);
    // === Conséquences
    const cg=el("g",{},sch); R.cons=cg;
    [[270,"1. Beaucoup moins d'habitants"],[800,"2. Des villages abandonnés"],[1330,"3. Des salaires plus élevés"]].forEach(([x,s])=>{ el("rect",{x:x-250,y:60,width:500,height:740,rx:18,fill:"#FBF6EE",stroke:"#D6C9B3","stroke-width":3},cg); el("text",{x,y:112,"text-anchor":"middle","font-size":29,"font-weight":800,fill:"#7A1D12",text:s},cg); });
    // colonne 1 : 12 silhouettes
    R.fig=[]; for(let i=0;i<12;i++){ const g=el("g",{},cg); const col=i%4,row=Math.floor(i/4); const c=i<8?"#3C6FA8":"#3C6FA8"; personG(a,g,c); a.tr(g,110+col*100,360+row*170,.78); R.fig.push(g); }
    R.c1t=txt(cg,270,745,"Exemple : sur 12 personnes, 4 disparaissent",{size:22,weight:700,stroke:"#FBF6EE"});
    R.c1t2=txt(cg,270,775,"(un tiers à la moitié des Européens)",{size:22,weight:700,stroke:"#FBF6EE"});
    // colonne 2 : village
    R.hs=[0,1,2,3,4,5].map(i=>{ const g=el("g",{},cg); houseG(a,g,0,0,100,80,["#F3E5C8","#EAD7B0","#F3E5C8"][i%3],false); const gd=el("g",{},cg); houseG(a,gd,0,0,100,80,"#CFC8BA",true); const p=[[560,330],[690,330],[820,330],[560,560],[690,560],[820,560]][i]; a.tr(g,p[0]+i*0,p[1]); a.tr(gd,p[0],p[1]); return {g,gd}; });
    R.c2t=txt(cg,800,640,"Les habitants manquent :",{size:24,weight:700,stroke:"#FBF6EE"});
    R.c2t2=txt(cg,800,675,"des maisons restent vides",{size:24,weight:700,stroke:"#FBF6EE"});
    R.c2t3=txt(cg,800,745,"Beaucoup de villages ont été abandonnés.",{size:22,weight:600,stroke:"#FBF6EE"});
    // colonne 3 : salaires
    el("line",{x1:1130,y1:690,x2:1530,y2:690,stroke:C.ink,"stroke-width":4},cg);
    R.w1=el("rect",{x:1160,y:690,width:130,height:0,fill:"#B8AC93",stroke:C.ink,"stroke-width":3},cg);
    R.w2=el("rect",{x:1370,y:690,width:130,height:0,fill:"#2E8B57",stroke:C.ink,"stroke-width":3},cg);
    el("text",{x:1225,y:725,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:"Avant"},cg); el("text",{x:1435,y:725,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:"Après"},cg);
    R.c3t=txt(cg,1330,160,"Il reste moins de travailleurs.",{size:23,weight:600,stroke:"#FBF6EE"});
    R.c3t2=txt(cg,1330,192,"Ils se font mieux payer.",{size:23,weight:600,stroke:"#FBF6EE"});
    R.c3t3=txt(cg,1330,765,"Salaire d'une journée (schéma)",{size:22,weight:700,stroke:"#FBF6EE"});
    // === Synthèse
    const sg=el("g",{},sch); R.syn=sg;
    R.sc=[["Cause","Une bactérie, transmise par les puces des rats. Ce n'est ni une punition ni la faute de quelqu'un.","#C0392B"],["Chemin","Des bateaux marchands partis de la mer Noire (1347), puis les ports, les villes et les campagnes jusqu'en 1352.","#E07A1F"],["Conséquences","Entre un tiers et la moitié des Européens meurent, des villages sont abandonnés, les salaires montent.","#2E8B57"]].map((c,i)=>{
      const g=el("g",{},sg); const y=120+i*215;
      el("rect",{x:80,y,width:1440,height:190,rx:18,fill:"#FBF6EE",stroke:c[2],"stroke-width":5},g);
      el("rect",{x:80,y,width:300,height:190,rx:18,fill:c[2]},g);
      el("text",{x:230,y:y+112,"text-anchor":"middle","font-size":38,"font-weight":800,fill:"#fff",text:c[0]},g);
      const t=el("text",{x:420,y:y+85,"font-size":30,"font-weight":600,fill:C.ink},g); a.wrap(t,c[1],56,1.3);
      return g; });
    // photos « Dans la réalité » (encarts libres)
    const lp=a.layer("photos");
    R.p1=a.photo(lp,{id:"h-c1-peste-enterrement-tournai",x:90,y:130,w:640,h:400,cap:"Tournai, 1349 : on enterre les morts de la peste",rot:-1.5,size:22});
    R.p2=a.photo(lp,{id:"h-c1-puce-xenopsylla",x:1010,y:520,w:340,h:215,cap:"Une puce du rat, de près",rot:1.5,size:22});
    // manipulation : curseur de mois (0 = octobre 1347)
    a.manip.innerHTML=`Mois : <input type="range" id="mM" min="0" max="${NM}" step="1" value="${NM}" aria-label="Mois"> <b id="mMv">${dateTxt(NM)}</b>`;
    const sl=document.getElementById("mM"), lb=document.getElementById("mMv");
    sl.oninput=()=>{ M=+sl.value; lb.textContent=dateTxt(M); a.redraw(); };
  },
  reset(a){
    Z=Object.assign({},WORLD);
    a.op(R.sch,0); [R.mech,R.myth,R.yers,R.givry,R.cons,R.syn].forEach(e=>a.op(e,0));
    R.mythL.setAttribute("opacity",0);
    a.op(R.p1,0); a.op(R.p2,0);
    R.sl.forEach(s=>s.circ.forEach(c=>c.setAttribute("r",0)));
    [R.route1,R.route2,R.route3,R.ship,R.date,R.leg,R.note,R.ask,R.since].forEach(e=>a.op(e,0));
    Object.values(R.city).forEach(e=>a.op(e,0)); Object.values(R.lbl).forEach(e=>a.op(e,0)); Object.values(R.when).forEach(e=>a.op(e,0));
  },
  after(a){
    a.set(R.inner,{transform:`translate(${Z.tx-Z.s*Z.cx},${Z.ty-Z.s*Z.cy}) scale(${Z.s})`});
    const at=(e,p,dx,dy)=>{ const q=P(p); a.tr(e,q[0]+(dx||0),q[1]+(dy||0)); };
    for(const n in R.city) at(R.city[n],PT[n]);
    at(R.lbl.Caffa,PT.Caffa,-80,50); at(R.lbl.Constantinople,PT.Constantinople,-20,38); at(R.lbl.Messine,PT.Messine,10,44); at(R.lbl.Marseille,PT.Marseille,-24,40); at(R.lbl.Paris,PT.Paris,-62,-14); at(R.lbl.Londres,PT.Londres,-62,-12); at(R.lbl.Venise,PT.Venise,50,-14);
    at(R.lbl.Allemagne,[690,300]); at(R.lbl.Scandi,[705,150]); at(R.lbl.Russie,[1000,175]);
    at(R.when.Messine,PT.Messine,10,72); at(R.when.Marseille,PT.Marseille,-24,70); at(R.when.Venise,PT.Venise,50,16); at(R.when.Paris,PT.Paris,-62,14); at(R.when.Londres,PT.Londres,-62,16); at(R.when.Allemagne,[690,330]); at(R.when.Scandi,[705,180]); at(R.when.Russie,[1000,205]);
  },
  etapes:[
  { titre:"De Caffa à Marseille", duree:15000,
    legende:"En 1346, la peste frappe Caffa, un port de la mer Noire. Des navires de marchands en partent, avec des rats et des puces à bord : ils arrivent en Sicile en octobre 1347, puis à Gênes et à Marseille.",
    voix:"En 1346, une grave maladie, la peste, touche Caffa, un port de la mer Noire où des marchands italiens viennent commercer. Des navires en repartent chargés de marchandises. Sans le savoir, ils embarquent aussi des rats, et des puces. À l'automne de l'année 1347, ils arrivent en Sicile, à Messine, en octobre. Puis la maladie touche Gênes et Marseille, en novembre 1347.",
    anim(t,a){ const s=a.seg;
      if(t<.34){ const u=t/.34; Z=Object.assign({},EST); a.op(R.date,1); R.dateT.textContent="1346"; a.op(R.cur,0); a.op(R.since,0);
        a.op(R.city.Caffa,s(u,.05,.2)); a.op(R.lbl.Caffa,s(u,.05,.2)); a.op(R.city.Constantinople,s(u,.15,.3)); a.op(R.lbl.Constantinople,s(u,.15,.3));
        a.op(R.note,s(u,.5,.7)); a.op(R.shipRat,s(u,.55,.75)); a.op(R.shipLbl,s(u,.6,.8));
        const pc=P(PT.Caffa); a.op(R.ship,s(u,.2,.4)); a.tr(R.ship,pc[0]+10,pc[1]-6+Math.sin(u*14)*3,1.3);
        R.sl[G47].circ[1].setAttribute("r",70*s(u,.55,.9)); R.sl[G47].circ[1].setAttribute("fill-opacity",.9); return; }
      const u=(t-.34)/.66; zoomTo(EST,WORLD,s(u,0,.3)); a.op(R.date,1); a.op(R.since,0); const mm=a.lerp(-1,1.2,s(u,.15,.95)); R.dateT.textContent=dateTxt(mm); a.op(R.cur,s(u,.1,.2)); a.tr(R.cur,R.X(mm),0);
      a.op(R.leg,0); a.op(R.note,1);
      const pL=a.along(R.route1,s(u,.2,.55,true)); let pos=pL;
      a.op(R.city.Caffa,1); a.op(R.lbl.Caffa,1-s(u,.3,.4)); a.op(R.city.Constantinople,1); a.op(R.lbl.Constantinople,1-s(u,.3,.4));
      a.op(R.route1,s(u,.15,.2)); a.draw(R.route1,s(u,.2,.55,true));
      a.op(R.route2,u>.56?1:0); a.draw(R.route2,s(u,.56,.85,true)); a.op(R.route3,u>.6?1:0); a.draw(R.route3,s(u,.6,.85,true));
      if(u>.56){ pos=a.along(R.route2,s(u,.56,.85,true)); }
      const q=P([pos.x,pos.y]); a.op(R.ship,1); a.op(R.shipRat,1); a.op(R.shipLbl,0); a.tr(R.ship,q[0],q[1]-8+Math.sin(u*40)*2,1.1);
      a.op(R.city.Messine,s(u,.5,.55)); a.op(R.lbl.Messine,s(u,.5,.6)); a.op(R.when.Messine,s(u,.52,.62));
      a.op(R.city.Marseille,s(u,.8,.88)); a.op(R.lbl.Marseille,s(u,.8,.88)); a.op(R.when.Marseille,s(u,.84,.92)); a.op(R.city.Genes,s(u,.8,.88));
      const g=R.sl[G47].circ; g[1].setAttribute("r",70); g[0].setAttribute("r",75*s(u,0,.2)); g[5].setAttribute("r",60*s(u,.3,.5));
      g[2].setAttribute("r",52*s(u,.55,.7)); g[1].setAttribute("fill-opacity",.82); g[3].setAttribute("r",40*s(u,.82,.95)); g[4].setAttribute("r",40*s(u,.82,.95)); } },
  { titre:"La peste avance, mois après mois", duree:11000,
    legende:"De ports en villes, par les routes et les fleuves, la maladie avance : Paris en 1348, Londres fin 1348, l'Allemagne en 1349, la Scandinavie en 1350, la Russie en 1352.",
    voix:"Des ports, la maladie gagne les villes, par les routes et par les fleuves. Elle arrive à Paris pendant l'été 1348, à Londres à la fin de 1348, en Allemagne en 1349, en Scandinavie en 1349 et 1350, et jusqu'en Russie en 1352. En cinq ans environ, elle a traversé toute l'Europe.",
    anim(t,a){ const s=a.seg; epi(a,a.lerp(1.2,NM,s(t,.04,.96,true))); } },
  { titre:"À vous : remontez le temps", duree:6000,
    legende:"À vous : faites glisser le curseur, mois après mois. Où est la peste un an après son arrivée à Messine, en octobre 1348 ? Regardez les couleurs et les dates qui changent.",
    voix:"À vous de jouer ! Faites glisser le curseur, mois après mois. Où est la peste un an après son arrivée à Messine, en octobre 1348 ? Regardez les couleurs de la carte et les dates qui changent. Prenez votre temps, puis cliquez sur Continuer.",
    anim(t,a){ const s=a.seg; epi(a,M); a.op(R.ask,s(t,.1,.3)); } },
  { titre:"Rat, puce, humain", duree:13000,
    legende:"La maladie est due à une bactérie. Elle vit dans les puces des rats : la puce pique le rat, puis pique l'humain et lui transmet le microbe.",
    voix:"Comment la maladie se transmet-elle ? C'est une bactérie, un microbe trop petit pour être vu. Elle vit dans les puces des rats noirs. Les rats voyagent sur les bateaux, puis entrent dans les maisons. Quand le rat meurt, les puces cherchent un autre repas : elles piquent un humain et lui passent la bactérie. L'humain tombe malade, il a de la fièvre et des gonflements douloureux.",
    anim(t,a){ const s=a.seg; a.op(R.sch,1); a.op(R.mech,1); Z=Object.assign({},WORLD);
      // la carte reste dessous, masquée par le fond blanc
      [R.date,R.leg,R.note,R.ship].forEach(e=>a.op(e,0)); Object.values(R.city).forEach(e=>a.op(e,0)); Object.values(R.lbl).forEach(e=>a.op(e,0)); Object.values(R.when).forEach(e=>a.op(e,0));
      a.op(R.mShip,1); a.op(R.mHouse.ownerSVGElement?R.mHouse:R.mHouse,1);
      // chaîne
      R.chain.forEach((c,i)=>a.op(c,s(t,[.0,.5,.8][i],[.08,.58,.88][i]))); R.chainA.forEach((c,i)=>a.op(c,s(t,[.4,.7][i],[.5,.8][i])));
      // rat
      const run=s(t,.12,.4,true); const rx=a.lerp(300,900,run), ry=a.lerp(560,628,s(run,0,.3,true));
      const sick=s(t,.4,.5); const bob=Math.sin(run*60)*(1-sick)*4;
      a.op(R.rat,s(t,0,.08)); a.tr(R.rat,rx,ry+bob+sick*18,1.2,sick*-8);
      R.ratIn.setAttribute("transform",`rotate(${sick*180} 0 0)`);
      R.ratL.textContent=sick>.5?"le rat meurt de la maladie":"rat noir"; a.tr(R.ratL,rx+(sick>.5?-10:0),ry+100); R.ratL.setAttribute("font-size",sick>.5?24:26);
      a.op(R.ratL,s(t,.05,.12));
      R.ratFleas.forEach((f,i)=>{ a.op(f,t<.5?1:1-s(t,.5,.52)); });
      // bulle de zoom
      a.op(R.zoom,s(t,.02,.14)); R.bact.forEach((b,i)=>{ const bp=b._p; let x=780+bp[0]*2.2, y=318+bp[1]*2.2; let o=1;
        if(t>.66){ const u=s(t,.66+i*.012,.82+i*.012); x=a.lerp(x,1080+(i%3)*10-10,u); y=a.lerp(y,430+(i%4)*30,u); const qq=Math.sin(u*Math.PI)*-60; y+=qq; o=u<1?1:(0); }
        a.set(b,{cx:x,cy:y,rx:t>.66?8:11,ry:t>.66?4:5}); b.setAttribute("opacity",o); b.style.display=o?"":"none"; });
      R.zl1.setAttribute("opacity",t<.66?1:1-s(t,.66,.72)); R.zl2.setAttribute("opacity",1);
      a.op(R.bubFlea,1);
      // puce qui saute (de la zone du rat vers l'humain)
      const j=s(t,.52,.68,true); a.op(R.jump,j>0&&j<1?1:(j>=1&&t<.82?1:0));
      const jx=a.lerp(rx+30,1075,j), jy=a.lerp(ry-30,590,j)-Math.sin(j*Math.PI)*120; a.tr(R.jump,jx,jy,1,j*20);
      // humain malade
      const m=s(t,.8,.95); a.op(R.bub,m); R.bub.setAttribute("opacity",m); a.op(R.fever,s(t,.86,.97));
      R.mPers.setAttribute("opacity",1); } },
  { titre:"Idée fausse : punition ou saleté ?", duree:9000,
    legende:"Au Moyen Âge, beaucoup pensent à une punition de Dieu. En réalité, c'est une bactérie transmise par les puces des rats, découverte en 1894.",
    voix:"À l'époque, beaucoup de gens pensent que la peste est une punition de Dieu, ou qu'elle vient de la saleté. En réalité, c'est une maladie causée par une bactérie, transmise par les puces des rats. On a découvert ce microbe seulement en mille huit cent quatre-vingt-quatorze. À l'époque, personne ne pouvait le savoir.",
    anim(t,a){ const s=a.seg; a.op(R.sch,1); a.op(R.mech,1-s(t,0,.15)); [R.date,R.leg,R.note,R.ship].forEach(e=>a.op(e,0));
      Object.values(R.city).forEach(e=>a.op(e,0)); Object.values(R.lbl).forEach(e=>a.op(e,0)); Object.values(R.when).forEach(e=>a.op(e,0));
      a.op(R.myth,s(t,.1,.3)); R.mythL.setAttribute("opacity",0);
      a.op(R.p1,s(t,.15,.4)); a.op(R.p2,s(t,.5,.75)); a.op(R.yers,s(t,.4,.55)); a.cls(R.myth.faux,"pulse",t>.35&&t<.7); } },
  { titre:"Près de chez nous : Givry, 1348", duree:9000,
    legende:"À Givry, en Saône-et-Loire, le curé compte les morts : 620 du 28 juillet au 19 novembre 1348, contre une trentaine par an en temps normal.",
    voix:"Chez nous, en Bourgogne, à Givry, en Saône-et-Loire, le curé note les morts dans un registre. Les années normales, il y en a une trentaine par an. Mais du vingt-huit juillet au dix-neuf novembre mille trois cent quarante-huit, il en compte six cent vingt. C'est autant que pendant une vingtaine d'années, en moins de quatre mois.",
    anim(t,a){ const s=a.seg; a.op(R.sch,1); a.op(R.myth,0); a.op(R.yers,0); a.op(R.p1,0); a.op(R.p2,0); a.op(R.mech,0); a.op(R.givry,s(t,0,.1));
      const h1=a.lerp(0,25,s(t,.15,.35)); a.set(R.gb1,{y:720-h1,height:h1}); R.gv1.setAttribute("y",720-h1-16); R.gv1.textContent="environ "+Math.round(a.lerp(0,30,s(t,.15,.35)))+" par an";
      const h2=a.lerp(0,520,s(t,.4,.8)); a.set(R.gb2,{y:720-h2,height:h2}); R.gv2.setAttribute("y",720-h2-16); R.gv2.textContent=Math.round(a.lerp(0,620,s(t,.4,.8)))+" morts";
      a.op(R.gv1,s(t,.15,.2)); a.op(R.gv2,s(t,.4,.45)); a.op(R.gnote,s(t,.85,1)); a.cls(R.gb2,"pulse",t>.8&&t<1); } },
  { titre:"Les conséquences", duree:12000,
    legende:"Entre un tiers et la moitié des Européens meurent. Des villages sont abandonnés. Comme les travailleurs manquent, leurs salaires augmentent.",
    voix:"Les historiens estiment que la peste noire a fait disparaître entre un tiers et la moitié des habitants de l'Europe. Des villages se vident et sont abandonnés. Et comme il manque des travailleurs, ceux qui restent se font mieux payer : les salaires augmentent.",
    anim(t,a){ const s=a.seg; a.op(R.sch,1); a.op(R.myth,0); a.op(R.givry,0); a.op(R.cons,s(t,0,.1));
      const gone=[2,5,8,11]; R.fig.forEach((g,i)=>{ const k=gone.indexOf(i); const v=k<0?0:s(t,.12+k*.05,.2+k*.05); g.setAttribute("opacity",1-v*.88); });
      R.hs.forEach((h,i)=>{ const dead=[1,3,5].indexOf(i)>=0; const v=dead?s(t,.4+i*.04,.5+i*.04):0; a.op(h.g,1-v); a.op(h.gd,v); });
      const hh1=a.lerp(0,150,s(t,.65,.75)); a.set(R.w1,{y:690-hh1,height:hh1}); const hh2=a.lerp(0,250,s(t,.75,.95)); a.set(R.w2,{y:690-hh2,height:hh2}); } },
  { titre:"Synthèse", duree:11000,
    legende:"Une bactérie, des puces et des rats ; des bateaux marchands qui répandent la maladie ; des millions de morts, et une société qui change.",
    voix:"Récapitulons. La cause : une bactérie, transmise par les puces des rats. Le chemin : des bateaux marchands partis de la mer Noire, puis les ports, les villes et les campagnes, entre 1347 et 1352. Les conséquences : entre un tiers et la moitié des Européens meurent, des villages sont abandonnés et les salaires augmentent.",
    anim(t,a){ const s=a.seg; a.op(R.sch,1); a.op(R.cons,0); a.op(R.syn,1); R.sc.forEach((g,i)=>{ const v=s(t,.05+i*.28,.2+i*.28); a.op(g,v); a.tr(g,(1-v)*70,0); }); } },
  ]
});
})();
