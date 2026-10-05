/* META {"id":"histoire-A4-pelerinage-vezelay-compostelle","matiere":"histoire","annee":"A","periode":1,"theme":"Le Moyen Âge : des rois francs aux … / vie religieuse et savoir","resume":"Le pèlerinage de Vézelay à Saint-Jacques-de-Compostelle : pourquoi on part, par où on passe, comment les hospices accueillent les pèlerins, et la coquille Saint-Jacques.","motsCles":["pèlerinage","Vézelay","Compostelle","Saint-Jacques","hospice","coquille","Marie-Madeleine","chemins"]} */
//@data europe
(function(){
const E=EUROPE;
const C={sea:"#DCEBF5",land:"#F5EFE2",ac:"#A8431F",ink:"#1E2430",or:"#E07A1F",bl:"#2563A8",gr:"#2E8B57",pr:"#7A3E9D"};
const el=(...x)=>Anim.H.el(...x);
// Tracé simplifié de la voie de Vézelay (coordonnées carte) : [nom, x, y, km approximatifs à vol d'oiseau]
const ROUTE=[["Vézelay",549.6,356.2,0],["La Charité",536.3,361.8,64],["Bourges",525.5,362.8,111],["La Souterraine",506.7,381.5,228],["Limoges",501.1,391.1,277],["Périgueux",489.1,405.8,360],["Bazas",469.4,421.6,471],["Saint-Sever",460,437.1,551],["Ostabat",448.7,447.4,618],["Saint-Jean-Pied-de-Port",445.1,449.8,637],["Roncevaux",442.9,453.2,655],["Pampelune",436.2,456.8,689],["Puente la Reina",432.1,459.9,711],["Logroño",419.6,462.5,767],["Burgos",396.1,460.8,871],["León",363.6,446.4,1027],["Astorga",354.1,447.7,1069],["Ponferrada",344.9,443,1114],["Sarria",331.6,433.4,1186],["Compostelle",312.1,425.3,1279]];
const TOT=1279;
const RD=[
 {nom:"Voie de Paris et de Tours",lat:"via Turonensis",dep:"départ : Paris, Tours",col:C.bl,fin:"Ostabat",pts:[[531.2,318.1],[520.3,341.1],[497.7,350.6],[488.3,369.8],[464.7,410.2],[451.1,436.8],[448.7,447.4]],lab:["Tours",-6,4,"end",[497.7,350.6]]},
 {nom:"Voie de Vézelay",lat:"via Lemovicensis",dep:"départ : Vézelay (Yonne)",col:C.ac,fin:"Ostabat",pts:ROUTE.slice(0,9).map(r=>[r[1],r[2]]),lab:["Vézelay",7,-8,"start",[549.6,356.2]]},
 {nom:"Voie du Puy",lat:"via Podiensis",dep:"départ : Le Puy-en-Velay",col:C.gr,fin:"Ostabat",pts:[[544.3,417.4],[516.5,424.9],[498.9,426],[491.2,433.8],[477.7,435.1],[448.7,447.4]],lab:["Le Puy",7,6,"start",[544.3,417.4]]},
 {nom:"Voie d'Arles",lat:"via Tolosana",dep:"départ : Arles",col:C.pr,fin:"Puente la Reina",pts:[[553.6,453.2],[550,452.8],[495.5,447.3],[456.6,451.2],[456.3,461.4],[454.9,466.8],[432.1,459.9]],lab:["Arles",0,22,"middle",[553.6,453.2]]}];
const COMMON=ROUTE.slice(8).map(r=>[r[1],r[2]]);
// étapes nommées sur la carte : nom -> [dx,dy,ancre]
const LAB={"Bourges":[-7,-6,"end"],"Limoges":[-8,3,"end"],"Périgueux":[8,5,"start"],"Ostabat":[9,-3,"start"],"Roncevaux":[9,11,"start"],"Burgos":[0,15,"middle"],"León":[0,-9,"middle"]};
const HOFF={"Bourges":[10,-8],"Limoges":[10,-8],"Périgueux":[10,-8],"Ostabat":[-11,-6],"Roncevaux":[-11,-8],"Burgos":[0,-13],"León":[0,13],"Sarria":[0,-13]};
const HOSP=["Bourges","Limoges","Périgueux","Ostabat","Roncevaux","Burgos","León","Sarria"];
const STOPS=HOSP.map(n=>ROUTE.find(r=>r[0]===n)[3]);
const KM=n=>ROUTE.find(r=>r[0]===n);
const R={}; let sel=1;

function smooth(pts){ let d="M"+pts[0][0]+","+pts[0][1]; for(let i=0;i<pts.length-1;i++){ const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
  d+=` C${p1[0]+(p2[0]-p0[0])/6},${p1[1]+(p2[1]-p0[1])/6} ${p2[0]-(p3[0]-p1[0])/6},${p2[1]-(p3[1]-p1[1])/6} ${p2[0]},${p2[1]}`; } return d; }
function pilgrim(p,s){ const g=el("g",{},p); const k=el("g",{transform:`scale(${s})`},g);
  el("path",{d:"M-12,0 L-9,-34 L9,-34 L12,0Z",fill:"#6B4A2B",stroke:C.ink,"stroke-width":2.4,"stroke-linejoin":"round"},k);
  el("circle",{cx:0,cy:-45,r:10,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2.4},k);
  el("ellipse",{cx:0,cy:-52,rx:17,ry:4.5,fill:"#4B3321",stroke:C.ink,"stroke-width":2},k); el("path",{d:"M-8,-53 Q0,-66 8,-53Z",fill:"#4B3321",stroke:C.ink,"stroke-width":2},k);
  el("path",{d:"M17,-58 V2",stroke:"#8A5A2B","stroke-width":4,"stroke-linecap":"round"},k);
  el("path",{d:"M-3,-28 Q0,-34 3,-28 Q0,-22 -3,-28Z",fill:"#F2D7A6",stroke:C.ink,"stroke-width":1.5},k); return g; }
function maison(p){ const g=el("g",{},p); el("rect",{x:-6,y:-4,width:12,height:9,fill:"#EADBC0",stroke:C.ink,"stroke-width":1.2},g); el("path",{d:"M-8,-3 L0,-10 L8,-3Z",fill:"#B0492B",stroke:C.ink,"stroke-width":1.2},g); el("path",{d:"M0,-8 V-4 M-2,-6 H2",stroke:"#fff","stroke-width":1.2},g); return g; }
function shell(p,Rr){ const g=el("g",{},p); const n=9, a0=-72*Math.PI/180, da=144*Math.PI/180/n; const P=k=>{ const th=a0+da*k; return [Rr*Math.sin(th),-Rr*Math.cos(th)]; };
  let d="M0,0 L"+P(0)[0]+","+P(0)[1]; for(let k=0;k<n;k++){ const m=a0+da*(k+.5), q=P(k+1); d+=` Q${1.14*Rr*Math.sin(m)},${-1.14*Rr*Math.cos(m)} ${q[0]},${q[1]}`; } d+=" Z";
  g.body=el("path",{d,fill:"#F6DDAF",stroke:"#B7791F","stroke-width":5,"stroke-linejoin":"round"},g);
  g.ribs=[]; for(let k=0;k<=n;k++){ const th=a0+da*k, x=.98*Rr*Math.sin(th), y=-.98*Rr*Math.cos(th); g.ribs.push({l:el("line",{x1:0,y1:0,x2:x,y2:y,stroke:"#B7791F","stroke-width":4,"stroke-linecap":"round"},g),x,y}); }
  el("path",{d:`M-34,8 L-22,-14 L22,-14 L34,8 L12,18 L-12,18Z`,fill:"#E9C98A",stroke:"#B7791F","stroke-width":4,"stroke-linejoin":"round"},g); return g; }

Anim.run({
  titre:"Vézelay, un départ vers Compostelle",
  sousTitre:"Histoire · CM1-CM2 · Le Moyen Âge : vie religieuse, pèlerinages et chemins",
  matiere:"histoire", badge:"Histoire", manipDes:4, manipJusqua:4,
  accroche:"Au Moyen Âge, des pèlerins partent de Bourgogne à pied jusqu'en Espagne. Pourquoi ? Par où ?",
  init(a){
    const defs=el("defs",{},a.svg);
    const cp=el("clipPath",{id:"zoneA4"},defs); el("rect",{x:20,y:20,width:980,height:740,rx:14},cp);
    const cpt=el("clipPath",{id:"terreA4"},defs); el("path",{d:E.land},cpt);
    const map=a.layer("carte"); R.map=map;
    const vp=el("g",{"clip-path":"url(#zoneA4)"},map);
    el("rect",{x:0,y:0,width:1600,height:900,fill:C.sea},vp);
    const inner=el("g",{transform:"translate(-634,-663) scale(2.6)"},vp); R.inner=inner;
    el("path",{d:E.land,fill:C.land,stroke:"#B8AC93","stroke-width":.8},inner);
    const T=(x,y,txt,o,par)=>el("text",Object.assign({x,y,"font-size":9,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":2.6,"paint-order":"stroke",text:txt},o||{}),par||inner);
    R.pays=[T(470,335,"FRANCE",{"font-size":15,fill:"#B8AC93","stroke-width":0,"text-anchor":"middle","letter-spacing":2}),T(372,506,"ESPAGNE",{"font-size":15,fill:"#B8AC93","stroke-width":0,"text-anchor":"middle","letter-spacing":2}),T(405,375,"Océan Atlantique",{"font-size":9,fill:"#6F96B8","stroke-width":0,"text-anchor":"middle","font-style":"italic"})];
    // villes repères
    [["Paris",[531,318],-5,-6,"end"],["Dijon",[571,363],6,4,"start"],["Lyon",[563,401],6,4,"start"],["Bordeaux",[465,410],-6,4,"end"],["Toulouse",[496,447],6,5,"start"]].forEach(([n,p,dx,dy,an])=>{ el("circle",{cx:p[0],cy:p[1],r:2.6,fill:"#555",stroke:"#fff","stroke-width":1},inner); T(p[0]+dx,p[1]+dy,n,{"text-anchor":an,"font-weight":600,fill:"#444"}); });
    // Pyrénées
    R.pyr=el("g",{},inner); [[452,466],[462,468],[472,467]].forEach(([x,y])=>el("path",{d:`M${x-6},${y} L${x},${y-9} L${x+6},${y}Z`,fill:"#A8A08A",stroke:"#7A7360","stroke-width":1},R.pyr)); T(470,478,"Pyrénées",{"text-anchor":"middle","font-style":"italic",fill:"#5A5545"},R.pyr);
    // route de Vézelay (étapes 3-4)
    R.pAll=el("path",{d:smooth(ROUTE.map(r=>[r[1],r[2]])),fill:"none",stroke:C.ac,"stroke-width":3.4,"stroke-linecap":"round","stroke-linejoin":"round"},inner);
    R.cities=ROUTE.filter(r=>LAB[r[0]]||r[0]==="Vézelay"||r[0]==="Compostelle").map(r=>{ const g=el("g",{},inner); el("circle",{cx:r[1],cy:r[2],r:3.4,fill:"#fff",stroke:C.ac,"stroke-width":1.8},g); if(r[0]!=="Vézelay"&&r[0]!=="Compostelle"){ const l=LAB[r[0]]; el("text",{x:r[1]+l[0],y:r[2]+l[1],"text-anchor":l[2],"font-size":9,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":2.6,"paint-order":"stroke",text:r[0]},g); } g.km=r[3]; g.nom=r[0]; return g; });
    // Vézelay + Compostelle (grands repères)
    R.vz=el("g",{},inner); R.vzRing=el("circle",{cx:549.6,cy:356.2,r:9,fill:"none",stroke:C.ac,"stroke-width":2.4},R.vz); el("circle",{cx:549.6,cy:356.2,r:5,fill:C.ac,stroke:"#fff","stroke-width":1.6},R.vz); T(557,348.5,"Vézelay",{"text-anchor":"start","font-size":11},R.vz);
    R.sc=el("g",{},inner); R.scRing=el("circle",{cx:312.1,cy:425.3,r:9,fill:"none",stroke:C.or,"stroke-width":2.4},R.sc); el("circle",{cx:312.1,cy:425.3,r:5,fill:C.or,stroke:"#fff","stroke-width":1.6},R.sc); T(318,404,"Saint-Jacques-",{"font-size":10.5},R.sc); T(318,416,"de-Compostelle",{"font-size":10.5},R.sc);
    // hospices
    R.hosp=HOSP.map(n=>{ const r=KM(n); const g=el("g",{},inner); const o=HOFF[n]; g.setAttribute("transform",`translate(${r[1]+o[0]},${r[2]+o[1]})`); maison(g); g.km=r[3]; return g; });
    // pèlerin
    R.pel=el("g",{},inner); pilgrim(R.pel,.4);
    // autres voies (étape 5)
    R.rd=RD.map((r,i)=>{ const p=el("path",{d:smooth(r.pts),fill:"none",stroke:r.col,"stroke-width":3.4,"stroke-linecap":"round","stroke-linejoin":"round"},inner); const lab=r.lab; const t=el("text",{x:lab[4][0]+lab[1],y:lab[4][1]+lab[2],"text-anchor":lab[3],"font-size":10,"font-weight":800,fill:r.col,stroke:"#fff","stroke-width":2.8,"paint-order":"stroke",text:lab[0]},inner); const dot=el("circle",{cx:lab[4][0],cy:lab[4][1],r:3.6,fill:r.col,stroke:"#fff","stroke-width":1.4},inner); p.t=t; p.dot=dot; return p; });
    R.comm=el("path",{d:smooth(COMMON),fill:"none",stroke:"#3A3F4B","stroke-width":3.4,"stroke-linecap":"round","stroke-linejoin":"round"},inner);
    R.join=[["Ostabat",[449,447],9,-3,"start"],["Puente la Reina",[432,460],-6,13,"end"]].map(([n,p,dx,dy,an])=>{ const g=el("g",{},inner); el("circle",{cx:p[0],cy:p[1],r:4.4,fill:"#fff",stroke:"#3A3F4B","stroke-width":2},g); el("text",{x:p[0]+dx,y:p[1]+dy,"text-anchor":an,"font-size":9,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":2.6,"paint-order":"stroke",text:n},g); return g; });
    R.cLeg=el("text",{x:44,y:742,"font-size":22,"font-weight":700,fill:C.ink,stroke:"#fff","stroke-width":5,"paint-order":"stroke"},map);
    // ===== panneau droit =====
    const pan=a.layer("panneau"); R.pan=pan;
    // 1 Vézelay
    R.p1=el("g",{},pan);
    el("text",{x:1300,y:66,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ac,text:"Vézelay (Yonne), en Bourgogne"},R.p1);
    R.pV=a.photo(pan,{id:"h-a4-vezelay-basilique",x:1080,y:96,w:440,h:293,cap:"La basilique de Vézelay",rot:-1});
    const t1=el("text",{x:1060,y:520,"font-size":26,"font-weight":700,fill:C.ink},R.p1); a.wrap(t1,"Sur une colline, la basilique Sainte-Marie-Madeleine : selon la tradition, on y vénère les reliques de Marie-Madeleine. Des pèlerins viennent de loin.",36,1.3);
    // 2 pourquoi
    R.p2=el("g",{},pan);
    el("text",{x:1300,y:66,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ac,text:"Pourquoi partir en pèlerinage ?"},R.p2);
    ["Demander de l'aide à Dieu et aux saints.","Demander pardon de ses fautes (pénitence).","Remercier, ou tenir une promesse (un vœu)."].forEach((s,i)=>{ const y=100+i*88; el("circle",{cx:1075,cy:y+34,r:24,fill:C.ac},R.p2); el("text",{x:1075,y:y+43,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#fff",text:String(i+1)},R.p2); const t=el("text",{x:1118,y:y+26,"font-size":26,"font-weight":700,fill:C.ink},R.p2); a.wrap(t,s,32,1.2); });
    R.pC=a.photo(pan,{id:"h-a4-compostelle-cathedrale",x:1130,y:400,w:340,h:226,cap:"Cathédrale de Compostelle",rot:1});
    // 3 étapes
    R.p3=el("g",{},pan);
    el("text",{x:1300,y:66,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ac,text:"Les grandes étapes"},R.p3);
    const ST=[["Vézelay","départ"],["Bourges",""],["Limoges",""],["Périgueux",""],["Ostabat","les chemins se rejoignent"],["Roncevaux","les Pyrénées"],["Burgos",""],["León",""],["Compostelle","arrivée"]];
    R.st=ST.map(([n,s],i)=>{ const g=el("g",{},R.p3); const y=108+i*47; el("circle",{cx:1050,cy:y+13,r:17,fill:C.ac},g); el("text",{x:1050,y:y+21,"text-anchor":"middle","font-size":22,"font-weight":800,fill:"#fff",text:String(i+1)},g); const t=el("text",{x:1084,y:y+22,"font-size":26,"font-weight":800,fill:C.ink},g); el("tspan",{text:n},t); if(s) el("tspan",{text:"  "+s,"font-weight":500,fill:"#4A5468","font-size":22},t); g.nom=n; return g; });
    R.p3b=el("text",{x:1300,y:578,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ac,text:"Plus de 1 500 km à pied"},R.p3);
    el("text",{x:1300,y:614,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"(tracé simplifié sur la carte)"},R.p3);
    // 4 pèlerin : forces
    R.p4=el("g",{},pan);
    el("text",{x:1300,y:66,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ac,text:"Le pèlerin marche…"},R.p4);
    el("text",{x:1060,y:150,"font-size":28,"font-weight":800,fill:C.ink,text:"Ses forces"},R.p4);
    el("rect",{x:1060,y:168,width:480,height:40,rx:20,fill:"#E6E9EF",stroke:"#C9CED8","stroke-width":2},R.p4);
    R.en=el("rect",{x:1060,y:168,width:480,height:40,rx:20,fill:C.gr},R.p4);
    el("text",{x:1060,y:252,"font-size":26,"font-weight":700,fill:C.ink,text:"Nuits dans un hospice, une abbaye :"},R.p4); R.nn=el("text",{x:1540,y:252,"text-anchor":"end","font-size":34,"font-weight":800,fill:C.ac},R.p4);
    const mg=el("g",{},R.p4); maison(mg); mg.setAttribute("transform","translate(1090,330) scale(4)");
    const lg=el("text",{x:1150,y:318,"font-size":26,"font-weight":700,fill:C.ink},R.p4); a.wrap(lg,"Un hospice, c'est un lieu qui accueille les voyageurs : on y dort, on y mange, on s'y soigne.",33,1.25);
    el("text",{x:1060,y:520,"font-size":24,"font-weight":700,fill:C.ink},R.p4).textContent="";
    const lg2=el("text",{x:1060,y:470,"font-size":24,"font-weight":600,fill:"#4A5468"},R.p4); a.wrap(lg2,"Schéma : les forces baissent en marchant et remontent à chaque étape accueillante.",38,1.25);
    // 5 voies
    R.p5=el("g",{},pan);
    el("text",{x:1300,y:62,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ac,text:"Quatre chemins en France"},R.p5);
    R.rows=RD.map((r,i)=>{ const g=el("g",{},R.p5); const y=88+i*98; const bg=el("rect",{x:1030,y,width:540,height:86,rx:12,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},g); el("rect",{x:1030,y,width:16,height:86,rx:6,fill:r.col},g); el("text",{x:1066,y:y+36,"font-size":26,"font-weight":800,fill:C.ink,text:r.nom},g); el("text",{x:1066,y:y+68,"font-size":22,fill:"#4A5468",text:r.dep+" · "+r.lat},g); g.bg=bg; return g; });
    const rt=el("text",{x:1030,y:520,"font-size":25,"font-weight":700,fill:C.ink},R.p5); a.wrap(rt,"Les voies de Paris, de Vézelay et du Puy se rejoignent à Ostabat. La voie d'Arles les rejoint à Puente la Reina. Ensuite, un seul chemin mène à Compostelle.",40,1.25);
    a.manip.innerHTML=`Chemin à suivre : <button id="mC0">Paris - Tours</button><button id="mC1" class="sel">Vézelay</button><button id="mC2">Le Puy</button><button id="mC3">Arles</button>`;
    [0,1,2,3].forEach(i=>{ document.getElementById("mC"+i).onclick=()=>{ sel=i; [0,1,2,3].forEach(j=>document.getElementById("mC"+j).classList.toggle("sel",j===i)); a.redraw(); }; });
    // ===== étape 6 : coquille =====
    const sl=a.layer("coquille"); R.sl=sl;
    el("text",{x:800,y:62,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ac,text:"La coquille Saint-Jacques, symbole du pèlerin"},sl);
    R.shell=shell(sl,300); R.shell.setAttribute("transform","translate(470,730)");
    R.shDots=R.shell.ribs.map(()=>el("circle",{r:9,fill:C.or,stroke:"#fff","stroke-width":3},R.shell));
    R.shT=el("g",{},sl); const st1=el("text",{x:470,y:790,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:"Les stries se rejoignent en un point,"},R.shT); el("text",{x:470,y:820,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:"comme les chemins qui mènent à Compostelle."},R.shT); el("text",{x:470,y:852,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"(une image souvent utilisée, pas une preuve)"},R.shT);
    R.pS=a.photo(sl,{id:"h-a4-coquille-saint-jacques",x:960,y:110,w:560,h:373,cap:"Une coquille Saint-Jacques",rot:1.2});
    R.shR=el("g",{},sl); const sr=el("text",{x:960,y:610,"font-size":28,"font-weight":700,fill:C.ink},R.shR); a.wrap(sr,"Au retour, le pèlerin rapporte une coquille : c'est la preuve qu'il est allé jusqu'à Compostelle.",40,1.3);
    const sr2=el("text",{x:960,y:740,"font-size":28,"font-weight":700,fill:C.ink},R.shR); a.wrap(sr2,"Aujourd'hui encore, elle sert à indiquer le chemin.",40,1.3);
    // ===== synthèse =====
    const sy=a.layer("synthese"); R.sy=sy;
    R.myth=a.myth(sy,60,70,720,"Pour aller à Compostelle, il n'y avait qu'un seul chemin.","Il y avait plusieurs chemins : quatre traversent la France, dont celui de Vézelay. Ils se rejoignent avant les Pyrénées ou en Espagne, puis un seul chemin mène à Compostelle.");
    el("text",{x:850,y:96,"font-size":30,"font-weight":800,fill:C.ac,text:"À retenir"},sy);
    R.syP=["On part en pèlerinage pour prier, demander pardon ou remercier : Compostelle est un des grands pèlerinages du Moyen Âge.","Le chemin de Vézelay part de la basilique Sainte-Marie-Madeleine, en Bourgogne, et traverse la France puis l'Espagne.","Des hospices et des abbayes accueillent les pèlerins ; la coquille Saint-Jacques est leur symbole."].map((p,i)=>{ const g=el("g",{},sy); const y=140+i*200; el("circle",{cx:880,cy:y+30,r:24,fill:C.ac},g); el("text",{x:880,y:y+40,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#fff",text:String(i+1)},g); const t=el("text",{x:925,y:y+24,"font-size":30,"font-weight":600,fill:C.ink},g); a.wrap(t,p,38,1.25); return g; });
  },
  reset(a){
    [R.map,R.pan,R.p1,R.p2,R.p3,R.p4,R.p5,R.pV,R.pC,R.pS,R.sl,R.sy,R.myth,R.shT,R.shR,R.pAll,R.vz,R.sc,R.pyr,R.comm,R.cLeg,R.pel,...R.cities,...R.hosp,...R.st,...R.rows,...R.rd,...R.rd.map(p=>p.t),...R.rd.map(p=>p.dot),...R.join,...R.syP,...R.pays].forEach(e=>a.op(e,0));
    R.pays.forEach(e=>a.op(e,1)); a.op(R.pyr,1);
  },
  etapes:[
  { titre:"Vézelay, en Bourgogne", duree:9000,
    legende:"Vézelay est une petite ville de l'Yonne, en Bourgogne. Sur la colline, la basilique Sainte-Marie-Madeleine attire des pèlerins venus de loin. C'est le départ d'un des chemins de Compostelle.",
    voix:"Voici Vézelé, une petite ville de l'Yonne, en Bourgogne, à une centaine de kilomètres de Dijon. Sur la colline se dresse la basilique Sainte-Marie-Madeleine. Selon la tradition, on y vénère les reliques de Marie-Madeleine, et des pèlerins viennent de loin pour prier. Vézelé est aussi le point de départ d'un des chemins qui mènent à Compostelle, en Espagne.",
    anim(t,a){ const s=a.seg; a.op(R.map,s(t,0,.12)); a.op(R.vz,s(t,.15,.3)); a.cls(R.vzRing,"pulse",t>.3); a.op(R.pan,1); a.op(R.p1,s(t,.2,.4)); a.op(R.pV,s(t,.35,.6)); } },
  { titre:"Pourquoi partir ?", duree:10000,
    legende:"Au Moyen Âge, on part en pèlerinage pour demander de l'aide, demander pardon ou remercier. Selon la tradition, le tombeau de l'apôtre saint Jacques a été découvert à Compostelle, vers 813.",
    voix:"Pourquoi partir en pèlerinage ? Pour demander de l'aide à Dieu et aux saints, pour demander pardon de ses fautes, ou pour remercier et tenir une promesse. Un des plus grands pèlerinages est celui de Compostelle, en Espagne, parce que, selon la tradition, le tombeau de l'apôtre saint Jacques y a été découvert vers l'an huit cent treize. Cela fait très loin de Vézelé.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.vz,1); a.op(R.p1,1-s(t,0,.15)); a.op(R.pV,1-s(t,0,.15)); a.op(R.p2,s(t,.1,.3)); a.op(R.sc,s(t,.4,.55)); a.cls(R.scRing,"pulse",t>.55); a.op(R.pC,s(t,.65,.9)); } },
  { titre:"Le chemin se trace", duree:11000,
    legende:"Le chemin de Vézelay traverse la France : Bourges, Limoges, Périgueux, puis les Pyrénées et l'Espagne : Burgos, León, jusqu'à Compostelle. Il fait plus de 1 500 kilomètres.",
    voix:"Voici le chemin de Vézelé. Il traverse la France par Bourges, Limoges et Périgueux. Près d'Ostabat, il rejoint d'autres chemins, puis il passe les Pyrénées à Ronsevaux. En Espagne, il traverse Burgos, puis Léon, et arrive enfin à Compostelle. Cela représente plus de mille cinq cents kilomètres à pied.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.vz,1); a.op(R.sc,1); a.op(R.p2,1-s(t,0,.1)); a.op(R.pC,1-s(t,0,.1)); a.op(R.p3,s(t,0,.12));
      const u=s(t,.1,.9,true); a.op(R.pAll,1); a.draw(R.pAll,u);
      R.cities.forEach(g=>{ a.op(g,u>=g.km/TOT-.001&&g.nom!=="Vézelay"&&g.nom!=="Compostelle"?1:0); });
      R.st.forEach((g,i)=>{ const nm=g.nom; const km=KM(nm)[3]; a.op(g,u>=km/TOT-.02?1:0); });
      a.op(R.p3b,s(t,.9,1)); } },
  { titre:"Un pèlerin en chemin", duree:12000,
    legende:"Le pèlerin marche, ses forces diminuent. Heureusement, des hospices, des abbayes et des églises l'accueillent sur la route : il y dort, mange et se soigne, puis repart.",
    voix:"Suivons un pèlerin. Il marche des semaines, et ses forces diminuent. Heureusement, sur la route, des hospices, des abbayes et des églises accueillent les voyageurs. On y dort, on y mange, on s'y soigne. Regarde : à chaque étape accueillante, les forces du pèlerin remontent, et il peut repartir.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.vz,1); a.op(R.sc,1); a.op(R.pAll,1); a.draw(R.pAll,1); a.op(R.p3,1-s(t,0,.1)); a.op(R.p4,s(t,0,.1));
      R.cities.forEach(g=>a.op(g,g.nom!=="Vézelay"&&g.nom!=="Compostelle"?1:0));
      const u=s(t,.1,.95,true), km=u*TOT; const q=a.along(R.pAll,u); a.op(R.pel,s(t,.05,.12)); a.tr(R.pel,q.x,q.y+2);
      let last=0, n=0; STOPS.forEach(st=>{ if(km>=st){ last=st; n++; } }); const d=km-last; const en=Math.max(.1,1-d*.0033);
      R.hosp.forEach(g=>a.op(g,km>=g.km-1?1:0));
      R.en.setAttribute("width",Math.max(20,480*en)); R.en.setAttribute("fill",en>.6?C.gr:en>.35?C.or:"#C0392B"); a.num(R.nn,n,0,""); } },
  { titre:"À vous : choisissez un chemin", duree:6000,
    legende:"À vous : touchez un bouton pour suivre un des quatre chemins de France. Regardez où ils se rejoignent, puis comment on continue jusqu'à Compostelle.",
    voix:"À vous de jouer. Touchez un bouton pour suivre l'un des quatre chemins qui traversent la France : Paris et Tours, Vézelé, Le Puy ou Arles. Regardez où les chemins se rejoignent, puis comment on continue ensemble jusqu'à Compostelle. Prenez votre temps, puis continuez.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.sc,1); a.op(R.vz,0); a.op(R.p4,1-s(t,0,.1)); a.op(R.pel,0); R.hosp.forEach(g=>a.op(g,0)); R.cities.forEach(g=>a.op(g,0)); a.op(R.pAll,0); a.op(R.p5,s(t,0,.15));
      a.op(R.comm,s(t,.05,.2)); R.join.forEach(g=>a.op(g,s(t,.1,.25)));
      R.rd.forEach((p,i)=>{ const v=s(t,.1+i*.12,.45+i*.12); const on=i===sel; a.op(p,v*(on?1:.5)); a.draw(p,v); p.setAttribute("stroke-width",on?4.6:2.2); a.op(p.t,v*(on?1:.55)); a.op(p.dot,v*(on?1:.55)); });
      R.comm.setAttribute("stroke-width",3.4); R.rows.forEach((g,i)=>{ const on=i===sel; a.op(g,s(t,.1+i*.1,.3+i*.1)); g.bg.setAttribute("stroke",on?RD[i].col:"#D6DBE4"); g.bg.setAttribute("stroke-width",on?6:3); g.bg.setAttribute("fill",on?"#FBF1E4":"#fff"); }); } },
  { titre:"La coquille Saint-Jacques", duree:10000,
    legende:"La coquille Saint-Jacques est le symbole du pèlerin. Au retour de Compostelle, il en rapporte une comme preuve de son voyage. Aujourd'hui encore, elle indique le chemin.",
    voix:"La coquille Saint-Jacques est le symbole du pèlerin. Regarde ses stries : elles se rejoignent en un point, comme les chemins qui mènent à Compostelle. Au retour de son voyage, le pèlerin rapporte une coquille : c'est la preuve qu'il est allé jusqu'au bout. Aujourd'hui encore, la coquille sert à indiquer le chemin.",
    anim(t,a){ const s=a.seg; a.op(R.map,1-s(t,0,.12)); a.op(R.pan,1-s(t,0,.12)); a.op(R.sl,s(t,.05,.2)); a.op(R.shell.body,s(t,.1,.3));
      R.shell.ribs.forEach((r,i)=>{ a.draw(r.l,s(t,.15+i*.04,.35+i*.04)); });
      R.shDots.forEach((d,i)=>{ const u=s(t,.5,.95,true), r=R.shell.ribs[i]; const w=((u*1.4-i*.02)%1+1)%1; a.op(d,u>0?1:0); d.setAttribute("cx",r.x*(1-w)); d.setAttribute("cy",r.y*(1-w)); });
      a.op(R.shT,s(t,.5,.7)); a.op(R.pS,s(t,.6,.8)); a.op(R.shR,s(t,.7,.9)); } },
  { titre:"Idée fausse et synthèse", duree:11000,
    legende:"Non, il n'y avait pas un seul chemin : quatre traversent la France et se rejoignent. Les pèlerins y trouvent des hospices, et leur symbole est la coquille.",
    voix:"Retenons l'essentiel. Une idée fausse : pour aller à Compostelle, il n'y aurait eu qu'un seul chemin. En réalité, quatre chemins traversent la France, dont celui de Vézelé, et ils se rejoignent. On part en pèlerinage pour prier, demander pardon ou remercier. Sur la route, des hospices et des abbayes accueillent les pèlerins, et leur symbole est la coquille Saint-Jacques.",
    anim(t,a){ const s=a.seg; a.op(R.sl,1-s(t,0,.12)); a.op(R.sy,1); a.op(R.myth,s(t,.1,.25)); a.cls(R.myth.faux,"pulse",t>.25&&t<.4); R.syP.forEach((g,i)=>{ const v=s(t,.35+i*.17,.5+i*.17); a.op(g,v); a.tr(g,(1-v)*50,0); }); } },
  ]
});
})();
