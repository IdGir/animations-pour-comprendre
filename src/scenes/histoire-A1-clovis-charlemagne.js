/* META {"id":"histoire-A1-clovis-charlemagne","matiere":"histoire","annee":"A","periode":1,"theme":"Le Moyen Âge, des rois francs à l'empire de Charlemagne","resume":"De la fin de l'Empire romain d'Occident à Clovis puis Charlemagne : ce que les rois francs gardent de Rome.","motsCles":["Clovis","Charlemagne","Empire romain","Francs","baptême","couronnement"]} */
//@data europe
(function(){
const E=EUROPE, V=E.villes;
const C={sea:"#DCEBF5",land:"#F5EFE2",rome:"#7B3F98",romeF:"#E6D5EF",orient:"#51628F",orientF:"#D3DAEA",fr:"#2F5DA8",frF:"#BCD0F0",bu:"#4F8A44",buF:"#D4E8CC",wi:"#B7791F",wiF:"#F4DFB6",ch:"#A8431F",chF:"#F6CDB8",or:"#E07A1F"};
let Z={s:1,cx:800,cy:380,tx:800,ty:380};
const zoomTo=(a,b,t)=>{ Z={s:Anim.H.lerp(a.s,b.s,t),cx:Anim.H.lerp(a.cx,b.cx,t),cy:Anim.H.lerp(a.cy,b.cy,t),tx:a.tx,ty:a.ty}; };
const WORLD={s:1,cx:800,cy:380,tx:800,ty:380}, GAULE={s:2.05,cx:545,cy:345,tx:560,ty:385}, EMPIRE={s:1.55,cx:615,cy:360,tx:560,ty:385};
const P=p=>[Z.tx+Z.s*(p[0]-Z.cx), Z.ty+Z.s*(p[1]-Z.cy)];
let R={}; // références
const INK="#1E2430";
const ICONS=[ // icônes SVG (pas d'emoji) : latin, croix, villes, lois, titre
  (el,g)=>{ el("rect",{x:-20,y:-24,width:40,height:48,rx:4,fill:"#F4E4B8",stroke:INK,"stroke-width":2.5},g); [-12,-3,6,15].forEach(y=>el("line",{x1:-12,y1:y,x2:12,y2:y,stroke:INK,"stroke-width":2.5},g)); },
  (el,g)=>{ el("path",{d:"M0,-26 L0,26 M-16,-10 L16,-10",stroke:INK,"stroke-width":8,"stroke-linecap":"round"},g); },
  (el,g)=>{ el("path",{d:"M-26,-8 L0,-26 L26,-8Z",fill:"#E7DCC8",stroke:INK,"stroke-width":2.5,"stroke-linejoin":"round"},g); [-18,-6,6,18].forEach(x=>el("rect",{x:x-3,y:-6,width:6,height:28,fill:"#E7DCC8",stroke:INK,"stroke-width":2},g)); el("rect",{x:-26,y:22,width:52,height:6,fill:"#C9B99A",stroke:INK,"stroke-width":2},g); },
  (el,g)=>{ el("path",{d:"M0,-24 L0,24 M-14,24 L14,24 M-22,-14 L22,-14",stroke:INK,"stroke-width":4,"stroke-linecap":"round"},g); [-22,22].forEach(x=>el("path",{d:`M${x-12},-2 L${x+12},-2 Q${x},14 ${x-12},-2Z M${x},-14 L${x-12},-2 M${x},-14 L${x+12},-2`,fill:"#F2C230",stroke:INK,"stroke-width":2.5,"stroke-linejoin":"round"},g)); },
  (el,g)=>{ el("path",{d:"M-12,0 L-20,26 L-6,20 L0,28 L2,2Z M12,0 L20,26 L6,20 L0,28 L-2,2Z",fill:"#C0392B",stroke:INK,"stroke-width":2},g); el("circle",{cx:0,cy:-8,r:16,fill:"#F2C230",stroke:INK,"stroke-width":2.5},g); el("circle",{cx:0,cy:-8,r:8,fill:"none",stroke:"#8A6A00","stroke-width":2.5},g); }
];

Anim.run({
  titre:"Clovis et Charlemagne, héritiers de Rome",
  sousTitre:"Histoire · CM1-CM2 · Thème 1 : le Moyen Âge",
  matiere:"histoire", badge:"Histoire",
  accroche:"Comment les rois francs ont-ils pris la suite de l'Empire romain ?",
  init(a){
    const {el}=a;
    const map=a.layer("map"); R.map=map;
    el("rect",{x:-2000,y:-2000,width:6000,height:5000,fill:C.sea},map);
    const defs=el("defs",{},a.svg); const cp=el("clipPath",{id:"terre"},defs); el("path",{d:E.land},cp);
    const cpm=el("clipPath",{id:"zoneCarte"},defs); el("rect",{x:0,y:0,width:1600,height:760,rx:14},cpm);
    a.svg.insertBefore(defs,a.svg.firstChild);
    map.setAttribute("clip-path","url(#zoneCarte)");
    const inner=el("g",{},map); R.inner=inner;
    el("path",{d:E.land,fill:C.land,stroke:"#B8AC93","stroke-width":1},inner);
    const zones=el("g",{"clip-path":"url(#terre)"},inner);
    const Zs=(k,f,s)=>el("path",{d:E[k],fill:f,stroke:s,"stroke-width":2,"stroke-linejoin":"round"},zones);
    R.west=Zs("west",C.romeF,C.rome); R.east=Zs("east",C.orientF,C.orient);
    R.wis=Zs("wisigoths",C.wiF,C.wi); R.bur=Zs("burgondes",C.buF,C.bu); R.sya=Zs("syagrius",C.romeF,C.rome);
    R.f511=Zs("francs511",C.frF,C.fr); R.f481=Zs("francs481","#7FA3DE",C.fr);
    R.charl=Zs("charlemagne",C.chF,C.ch); R.charl.setAttribute("fill-opacity",.85);
    R.limes=el("path",{d:E.limes,fill:"none",stroke:C.rome,"stroke-width":4,"stroke-dasharray":"10 7"},inner);
    R.charlB=el("path",{d:E.charlemagne,fill:"none",stroke:C.ch,"stroke-width":4,"clip-path":"url(#terre)"},inner);
    const pat=el("pattern",{id:"hach",width:14,height:14,patternUnits:"userSpaceOnUse",patternTransform:"rotate(45)"},defs); el("rect",{width:14,height:14,fill:"rgba(123,63,152,.10)"},pat); el("line",{x1:0,y1:0,x2:0,y2:14,stroke:C.rome,"stroke-width":5,opacity:.55},pat);
    R.westB=el("path",{d:E.west,fill:"url(#hach)",stroke:"none","clip-path":"url(#terre)"},inner);
    // migrations (coordonnées carte)
    const mig=el("g",{},inner); R.mig=[];
    [["M640,215 C610,240 585,255 560,285","Francs"],["M700,255 C660,300 620,330 590,380","Burgondes"],["M930,420 C820,380 640,380 470,470 C430,490 400,500 360,520","Wisigoths"],["M800,330 C760,380 720,420 700,470","Ostrogoths"]]
      .forEach(([d])=>{ const g=a.arrow(mig,d,{color:"#5B4636",w:3.5,head:4.5}); R.mig.push(g); });
    // étiquettes (hors groupe zoomé)
    const lab=a.layer("labels"); R.lab=lab;
    const mk=(txt,col,fs,w)=>{ const t=el("text",{"text-anchor":"middle","font-size":fs||26,"font-weight":800,fill:col,stroke:"#fff","stroke-width":5,"paint-order":"stroke"},lab); t.textContent=txt; return t; };
    R.lWest=mk("Empire romain d'Occident",C.rome,26); R.lEast=mk("Empire romain d'Orient",C.orient,26);
    R.lFr=mk("Francs",C.fr,26); R.lBu=mk("Burgondes",C.bu,24); R.lWi=mk("Wisigoths",C.wi,24); R.lSy=mk("Domaine gallo-romain",C.rome,20);
    R.lF511=mk("Royaume de Clovis (511)",C.fr,26); R.lCh=mk("Empire de Charlemagne (814)",C.ch,28);
    R.lLimes=mk("frontière de l'Empire romain",C.rome,20);
    R.lMig=["Francs","Burgondes","Wisigoths","Ostrogoths"].map(n=>mk(n,"#5B4636",20));
    R.city={}; ["Rome","Constantinople","Tournai","Soissons","Reims","Paris","Vouillé","Aix-la-Chapelle","Pavie","Barcelone"].forEach(n=>{ const g=el("g",{},lab); el("circle",{r:7,fill:"#1E2430",stroke:"#fff","stroke-width":2.5},g); const t=el("text",{x:11,y:-9,"font-size":22,"font-weight":700,fill:"#1E2430",stroke:"#fff","stroke-width":4,"paint-order":"stroke"},g); t.textContent=n; R.city[n]=g; });
    R.city["Vouillé"].querySelector("text").textContent=""; // l'étiquette « 507 : Vouillé » suffit
    R.city["Soissons"].querySelector("text").setAttribute("x",-11); R.city["Soissons"].querySelector("text").setAttribute("text-anchor","end");
    R.city["Reims"].querySelector("text").setAttribute("y",-12);
    R.city["Paris"].querySelector("text").setAttribute("y",28); R.city["Paris"].querySelector("text").setAttribute("x",12);
    // flèches de conquête (dessinées en coordonnées écran à chaque frame)
    const cq=a.layer("conquetes"); R.cq=cq;
    R.aSoi=a.arrow(cq,"M0,0",{color:C.or,w:7,head:3.5}); R.aVou=a.arrow(cq,"M0,0",{color:C.or,w:7,head:3.5});
    R.aCh=[0,1,2,3].map(()=>a.arrow(cq,"M0,0",{color:C.or,w:6,head:3.5}));
    R.lCq=[0,1,2,3,4,5].map(()=>{ const t=el("text",{"font-size":22,"font-weight":800,fill:"#8A4A0E",stroke:"#fff","stroke-width":5,"paint-order":"stroke","text-anchor":"middle"},cq); return t; });
    // couronne
    R.crown=el("g",{},a.svg);
    el("path",{d:"M-34,14 L-38,-18 L-18,0 L0,-26 L18,0 L38,-18 L34,14 Z",fill:"#F2C230",stroke:"#8A6A00","stroke-width":3},R.crown);
    el("rect",{x:-34,y:12,width:68,height:12,rx:3,fill:"#E0AE1C",stroke:"#8A6A00","stroke-width":3},R.crown);
    // photos « Dans la réalité » (encarts à droite de la carte, jamais sur un élément essentiel)
    const lp=a.layer("photos");
    R.pBap=a.photo(lp,{id:"h-a1-baptistere-poitiers",x:1190,y:50,w:340,h:230,cap:"Baptistère Saint-Jean, Poitiers",rot:2});
    R.pCha=a.photo(lp,{id:"h-a1-chapelle-palatine",x:1150,y:50,w:380,h:250,cap:"Chapelle palatine, Aix-la-Chapelle",rot:-2});
    R.pDen=a.photo(lp,{id:"h-a1-denier-charlemagne",x:1190,y:50,w:320,h:240,cap:"Un denier de Charlemagne",rot:2});
    // panneau d'héritage
    const pan=a.layer("panneau"); R.pan=pan;
    el("rect",{x:1110,y:24,width:470,height:712,rx:18,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},pan);
    R.panT=el("text",{x:1345,y:72,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ch},pan);
    R.items=[]; for(let i=0;i<5;i++){ const g=el("g",{},pan); el("rect",{x:1132,y:100+i*118,width:426,height:104,rx:14,fill:"#FBF6EE",stroke:"#E3D3C3","stroke-width":2},g); const ic=el("g",{transform:`translate(1180,${152+i*118})`},g); ICONS[i](el,ic); const t=el("text",{x:1222,y:134+i*118,"font-size":24,"font-weight":700,fill:"#1E2430"},g); const s=el("text",{x:1222,y:162+i*118,"font-size":22,fill:"#3A4458"},g); R.items.push({g,ic,t,s}); }
    R.myth=a.layer("myth");
    a.myth(R.myth,1120,150,450,"En 476, tout ce qui était romain disparaît d'un coup.","Les rois francs gardent le latin, la religion chrétienne, les villes et même le titre d'empereur : c'est une continuité.");
    // frise
    R.fr=a.frise(a.svg,{x:120,y:842,w:1360,debut:350,fin:850,ticks:[400,500,600,700,800],
      periodes:[{a:350,b:476,nom:"Empire romain d'Occident",color:C.rome},{a:481,b:751,nom:"Rois mérovingiens (Clovis)",color:C.fr},{a:751,b:850,nom:"Carolingiens",color:C.ch}],
      events:[{id:"e476",d:476,label:"476",color:C.rome},{id:"e800",d:800,label:"800",color:C.ch}]});
  },
  reset(a){
    Z=Object.assign({},WORLD);
    [R.pBap,R.pCha,R.pDen,R.wis,R.bur,R.sya,R.f511,R.f481,R.charl,R.charlB,R.westB,R.crown,R.myth,R.pan,R.lWest,R.lEast,R.lFr,R.lBu,R.lWi,R.lSy,R.lF511,R.lCh,R.limes,R.lLimes,...R.mig,...R.lMig,R.aSoi,R.aVou,...R.aCh,...R.lCq,...Object.values(R.city)].forEach(e=>a.op(e,0));
    a.op(R.west,0); a.op(R.east,0); R.west.setAttribute("fill",C.romeF);
    R.items.forEach(it=>a.op(it.g,0));
    a.op(R.fr.events.e476,0); a.op(R.fr.events.e800,0); R.fr.at(400,"vers 400");
    [R.f481,R.f511].forEach(e=>a.cls(e,"pulse",false));
  },
  after(a){
    // applique le zoom et place les étiquettes
    a.set(R.inner,{transform:`translate(${Z.tx-Z.s*Z.cx},${Z.ty-Z.s*Z.cy}) scale(${Z.s})`});
    const at=(e,p,dx,dy)=>{ const q=P(p); a.tr(e,q[0]+(dx||0),q[1]+(dy||0)); };
    for(const n in R.city) at(R.city[n],V[n]);
    { const q=P([470,610]); a.tr(R.lWest,q[0],Math.min(q[1],736)); } at(R.lEast,[1050,600]); at(R.lFr,[548,262],0,-6); at(R.lBu,[590,410]); at(R.lWi,[380,520]); at(R.lSy,[520,330]);
    at(R.lF511,[455,425]); at(R.lCh,[520,225],0,-30); at(R.lLimes,[760,330],0,-12);
    const mp=[[640,205],[715,245],[945,410],[810,318]]; R.lMig.forEach((t,i)=>at(t,mp[i]));
  },
  etapes:[
  { titre:"L'Empire romain vers 400", duree:7000,
    legende:"Vers 400, l'Empire romain entoure la Méditerranée. Il est coupé en deux : l'Occident (capitale Rome) et l'Orient (Constantinople). La Gaule est romaine.",
    voix:"Vers l'an 400, l'Empire romain entoure toute la mer Méditerranée. Il est coupé en deux parties : l'Empire d'Occident, avec Rome, et l'Empire d'Orient, avec Constantinople. La Gaule, notre future France, fait partie de l'Empire romain.",
    anim(t,a){ const s=a.seg; a.op(R.west,s(t,0,.3)); a.op(R.lWest,s(t,.15,.35)); a.op(R.east,s(t,.3,.6)); a.op(R.lEast,s(t,.45,.65));
      a.op(R.city.Rome,s(t,.2,.3)); a.op(R.city.Constantinople,s(t,.5,.6)); a.op(R.limes,s(t,.65,.8)); a.draw(R.limes,s(t,.65,.95)); a.op(R.lLimes,s(t,.8,.95)); } },
  { titre:"476 : fin de l'Empire d'Occident", duree:9000,
    legende:"Des peuples germaniques franchissent la frontière et s'installent. En 476, l'Empire d'Occident disparaît ; des royaumes le remplacent. L'Orient, lui, continue.",
    voix:"Des peuples germaniques, comme les Francs, les Burgondes ou les Visigoths, franchissent la frontière et s'installent dans l'Empire. En 476, le dernier empereur d'Occident perd son trône : l'Empire romain d'Occident disparaît et des royaumes le remplacent. L'Empire d'Orient, lui, continue d'exister.",
    anim(t,a){ const s=a.seg; a.op(R.lLimes,1-s(t,0,.1));
      R.mig.forEach((m,i)=>{ const v=s(t,.05+i*.08,.35+i*.08); a.op(m,v>0?1:0); a.draw(m.path,v); a.op(R.lMig[i],v>0?Math.min(1,v*3)*(1-s(t,.75,.85)):0); });
      R.fr.at(a.lerp(400,476,s(t,.1,.6)), String(Math.round(a.lerp(400,476,s(t,.1,.6))))); a.op(R.fr.events.e476,s(t,.55,.65));
      const k=s(t,.6,.85); R.west.setAttribute("fill-opacity",1-.75*k); a.op(R.lWest,1-k);
      a.op(R.wis,k); a.op(R.bur,k); a.op(R.sya,k); a.op(R.f481,k); a.op(R.lWi,k); a.op(R.lBu,k); a.op(R.lSy,k); a.op(R.lFr,k);
      R.mig.forEach(m=>{ if(t>.85) a.op(m,1-s(t,.85,1)); }); } },
  { titre:"481 : Clovis, roi des Francs", duree:9000,
    legende:"En 481, Clovis devient roi d'un petit royaume franc autour de Tournai. En 486, il bat le dernier chef romain de Gaule à Soissons.",
    voix:"En 481, Clovis devient roi d'un petit royaume franc, autour de la ville de Tournai. En 486, il bat à Soissons le dernier chef romain de la Gaule et s'empare de son territoire.",
    anim(t,a){ const s=a.seg; a.op(R.west,1-s(t,0,.2)); a.op(R.east,1-s(t,0,.2)); a.op(R.limes,1-s(t,0,.2)); a.op(R.lEast,0); a.op(R.city.Constantinople,0);
      zoomTo(WORLD,GAULE,s(t,0,.35)); a.op(R.city.Rome,1-s(t,0,.2)); a.op(R.city.Tournai,s(t,.3,.4));
      R.fr.at(a.lerp(476,486,s(t,.35,.8)),String(Math.round(a.lerp(476,486,s(t,.35,.8))))); a.cls(R.f481,"pulse",t>.35&&t<.55);
      const p1=P(V.Tournai),p2=P(V.Soissons); a.op(R.aSoi,t>.55?1:0); R.aSoi.path.setAttribute("d",`M${p1[0]-10},${p1[1]+14} Q${p1[0]-40},${(p1[1]+p2[1])/2} ${p2[0]-6},${p2[1]-14}`); a.draw(R.aSoi.path,s(t,.55,.75));
      a.op(R.city.Soissons,s(t,.65,.75)); a.op(R.lCq[0],s(t,.7,.8)); R.lCq[0].textContent="486 : victoire de Soissons"; a.tr(R.lCq[0],p2[0]-150,p2[1]+52);
      R.sya.setAttribute("fill",t>.8?C.frF:C.romeF); R.sya.setAttribute("stroke",t>.8?C.fr:C.rome); a.op(R.lSy,1-s(t,.78,.88)); } },
  { titre:"Baptême et conquêtes de Clovis", duree:10000,
    legende:"Vers 496, Clovis est baptisé à Reims : il devient chrétien comme les Gallo-Romains, et les évêques le soutiennent. En 507, il bat les Wisigoths à Vouillé.",
    voix:"Vers 496, Clovis se fait baptiser à Reims par l'évêque Rémi. Il devient chrétien, comme les Gallo-Romains, et les évêques le soutiennent. En 507, il bat les Visigoths à Vouillé et prend presque toute la Gaule. Il meurt à Paris, sa capitale, en cinq cent onze.",
    anim(t,a){ const s=a.seg; a.op(R.pBap,s(t,.7,.85)); Z=Object.assign({},GAULE); R.sya.setAttribute("fill",C.frF); R.sya.setAttribute("stroke",C.fr);
      a.op(R.city.Reims,s(t,0,.1)); const pr=P(V.Reims); a.op(R.aSoi,1-s(t,0,.1)); a.op(R.lCq[0],1-s(t,0,.1)); a.op(R.city.Soissons,1); a.op(R.crown,0);
      a.op(R.lCq[1],s(t,.05,.15)*(1-s(t,.9,1))); R.lCq[1].textContent="baptême (vers 496)"; a.tr(R.lCq[1],pr[0]+160,pr[1]+34);
      R.fr.at(a.lerp(486,511,s(t,.1,.95)),String(Math.round(a.lerp(486,511,s(t,.1,.95)))));
      const p1=P(V.Paris),p2=P(V.Vouillé); a.op(R.aVou,t>.35?1:0); R.aVou.path.setAttribute("d",`M${p1[0]-10},${p1[1]+18} Q${p1[0]-60},${(p1[1]+p2[1])/2+10} ${p2[0]+8},${p2[1]-16}`); a.draw(R.aVou.path,s(t,.35,.55));
      a.op(R.city.Vouillé,s(t,.45,.55)); a.op(R.lCq[2],s(t,.5,.6)); R.lCq[2].textContent="507 : Vouillé"; a.tr(R.lCq[2],p2[0]-20,p2[1]+44);
      const k=s(t,.6,.85); a.op(R.f511,k); a.op(R.lF511,k); a.op(R.lFr,1-k); a.op(R.city.Paris,s(t,.7,.8)); a.cls(R.f511,"pulse",t>.85&&t<1); } },
  { titre:"Ce que Clovis garde de Rome", duree:10000,
    legende:"Le royaume de Clovis n'efface pas Rome : on y garde le latin, la religion chrétienne, les villes romaines avec leurs évêques, et les lois écrites.",
    voix:"Le royaume de Clovis n'efface pas Rome. On continue d'écrire en latin. La religion chrétienne de l'Empire devient celle du roi. Les villes romaines restent les centres du royaume, avec leurs évêques. Et Clovis fait mettre par écrit les lois de son peuple. En cinq cent huit, l'empereur d'Orient lui envoie même un titre romain.",
    anim(t,a){ const s=a.seg; a.op(R.pBap,1-s(t,0,.1)); Z=Object.assign({},GAULE); R.sya.setAttribute("fill",C.frF); R.sya.setAttribute("stroke",C.fr); a.op(R.f511,1); a.op(R.lF511,1); a.op(R.lFr,0);
      a.op(R.aVou,1-s(t,0,.1)); [R.lCq[2]].forEach(x=>a.op(x,1-s(t,0,.1))); R.fr.at(511,"511");
      a.op(R.pan,s(t,0,.1)); R.panT.textContent="Héritages de Rome";
      const L=[["","La langue latine","pour écrire, prier et faire les lois"],["","La religion chrétienne","religion de l'Empire, puis du roi"],["","Les villes romaines","Paris, Reims, Soissons, avec leurs évêques"],["","Des lois écrites","comme à Rome"],["","Un titre romain","envoyé par l'empereur d'Orient (508)"]];
      R.items.forEach((it,i)=>{ it.t.textContent=L[i][1]; a.wrap(it.s,L[i][2],30,1.1); const v=s(t,.1+i*.16,.22+i*.16); a.op(it.g,v); a.tr(it.g,(1-v)*60,0); }); } },
  { titre:"Charlemagne agrandit le royaume", duree:10000,
    legende:"Charlemagne devient roi en 768. Par la guerre, il conquiert l'Italie du Nord, la Saxe, la Bavière et le nord de l'Espagne. Sa capitale est Aix-la-Chapelle.",
    voix:"Presque trois siècles plus tard, Charlemagne devient roi des Francs, en 768. Par de nombreuses guerres, il conquiert le nord de l'Italie, la Saxe, la Bavière et une partie du nord de l'Espagne. Il installe sa capitale à Aix-la-Chapelle.",
    anim(t,a){ const s=a.seg; a.op(R.pCha,s(t,.6,.75)); a.op(R.pan,1-s(t,0,.1)); R.items.forEach(it=>a.op(it.g,1-s(t,0,.1)));
      zoomTo(GAULE,EMPIRE,s(t,0,.3)); R.sya.setAttribute("fill",C.frF); R.sya.setAttribute("stroke",C.fr);
      a.op(R.f511,1-s(t,.25,.4)); a.op(R.lF511,1-s(t,.1,.2)); a.op(R.sya,1-s(t,.25,.4)); a.op(R.f481,1-s(t,.25,.4)); a.op(R.wis,1-s(t,.25,.4)); a.op(R.bur,1-s(t,.25,.4)); a.op(R.lBu,1-s(t,.1,.2)); a.op(R.lWi,1-s(t,.1,.2));
      ["Tournai","Soissons","Vouillé","Reims"].forEach(n=>a.op(R.city[n],1-s(t,.1,.2))); a.op(R.city.Paris,1);
      R.fr.at(a.lerp(511,800,s(t,.1,.45)),String(Math.round(a.lerp(511,768,s(t,.1,.45)))));
      a.op(R.charl,s(t,.35,.55)); a.op(R.charlB,s(t,.35,.4)); a.draw(R.charlB,s(t,.35,.6)); a.op(R.city["Aix-la-Chapelle"],s(t,.4,.5));
      const aix=P(V["Aix-la-Chapelle"]); const tg=[[[V.Pavie[0],V.Pavie[1]],"Italie du Nord (774)",0,40],[[700,215],"Saxe",0,-30],[[690,330],"Bavière",30,30],[[V.Barcelone[0],V.Barcelone[1]],"Barcelone (801)",-10,40]];
      R.aCh.forEach((ar,i)=>{ const q=P(tg[i][0]); const v=s(t,.5+i*.1,.68+i*.1); a.op(ar,v>0?1:0); ar.path.setAttribute("d",`M${aix[0]},${aix[1]+12} Q${(aix[0]+q[0])/2+(i===3?-60:40)},${(aix[1]+q[1])/2} ${q[0]},${q[1]-8}`); a.draw(ar.path,v);
        a.op(R.lCq[i+1],s(t,.6+i*.1,.68+i*.1)); R.lCq[i+1].textContent=tg[i][1]; a.tr(R.lCq[i+1],q[0]+tg[i][2],q[1]+tg[i][3]); });
      a.op(R.city.Pavie,s(t,.55,.6)); a.op(R.city.Barcelone,s(t,.85,.9)); a.op(R.lCh,s(t,.9,1)); } },
  { titre:"Noël 800 : un empereur en Occident", duree:10000,
    legende:"Le jour de Noël 800, le pape couronne Charlemagne empereur à Rome. Pour la première fois depuis 476, il y a de nouveau un empereur en Occident.",
    voix:"Le jour de Noël de l'an 800, à Rome, le pape Léon trois couronne Charlemagne empereur. Pour la première fois depuis 476, il y a de nouveau un empereur en Occident. Regarde : son empire recouvre une grande partie de l'ancien Empire romain d'Occident.",
    anim(t,a){ const s=a.seg; a.op(R.pCha,1-s(t,0,.1)); a.op(R.pDen,s(t,.6,.75)); Z=Object.assign({},EMPIRE); [R.f511,R.sya,R.f481,R.wis,R.bur].forEach(e=>a.op(e,0)); a.op(R.charl,1); a.op(R.charlB,1); a.draw(R.charlB,1); a.op(R.lCh,1);
      R.aCh.forEach(x=>a.op(x,1-s(t,0,.1))); R.lCq.forEach(x=>a.op(x,1-s(t,0,.1))); a.op(R.city.Pavie,0); a.op(R.city.Barcelone,0);
      a.op(R.city.Rome,s(t,0,.1)); R.fr.at(a.lerp(768,800,s(t,0,.3)),String(Math.round(a.lerp(768,800,s(t,0,.3))))); a.op(R.fr.events.e800,s(t,.25,.35));
      const pr=P(V.Rome), pa0=P(V["Aix-la-Chapelle"]), pa=[pa0[0]-34,pa0[1]+0]; const v=s(t,.15,.5); a.op(R.crown,s(t,.1,.2)); a.tr(R.crown,pr[0],a.lerp(pr[1]-140,pr[1]-40,v),1.1); a.cls(R.crown,"glow",t>.45&&t<.7);
      if(t>.5){ const w=s(t,.5,.7); a.tr(R.crown,a.lerp(pr[0],pa[0],w),a.lerp(pr[1]-40,pa[1]-52,w)-Math.sin(w*Math.PI)*120,1.1); }
      a.op(R.westB,s(t,.7,.9)); a.op(R.lWest,s(t,.85,.95)); } },
  { titre:"Synthèse : une continuité", duree:9000,
    legende:"Rome, Clovis puis Charlemagne : le latin, la religion chrétienne, les villes et l'idée d'empire se transmettent. Le Moyen Âge commence dans la continuité de Rome.",
    voix:"Récapitulons. De Rome à Clovis, puis de Clovis à Charlemagne, beaucoup de choses se transmettent : la langue latine, la religion chrétienne, les villes, les lois écrites, et même l'idée d'un empereur. Charlemagne crée aussi des écoles pour former des hommes capables de lire et d'écrire. Le Moyen Âge ne commence donc pas par une rupture totale : il prolonge l'héritage romain.",
    anim(t,a){ const s=a.seg; a.op(R.pDen,1-s(t,0,.1)); Z=Object.assign({},EMPIRE); a.op(R.charl,1); a.op(R.charlB,1); a.draw(R.charlB,1); a.op(R.lCh,1); a.op(R.city.Rome,1); a.op(R.city["Aix-la-Chapelle"],1); a.op(R.city.Paris,1); a.op(R.fr.events.e800,1); R.fr.at(814,"814");
      a.op(R.westB,1); a.op(R.lWest,1); const pa=P(V["Aix-la-Chapelle"]); a.op(R.crown,1); a.tr(R.crown,pa[0]-34,pa[1]-52,1.1);
      a.op(R.myth,s(t,.1,.3)); a.cls(R.myth.faux,"pulse",t>.3&&t<.6); } },
  ]
});
})();
