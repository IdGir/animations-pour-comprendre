/* META {"id":"geo-A1-se-deplacer","matiere":"geographie","annee":"A","periode":1,"theme":"Se déplacer : choisir un moyen de transport selon la distance, le lieu et les moyens","resume":"En une heure, chaque moyen de transport va plus ou moins loin : la distance et le lieu où l'on vit expliquent comment on se déplace, ici et ailleurs dans le monde.","motsCles":["se déplacer","transports","distance","vitesse","ville","campagne","tramway","car scolaire"]} */
//@data world
(function(){
let pT=1; const fresh=t=>{ const f=t<pT-.05; pT=t; return f; }; // vrai quand l'étape (re)démarre : remet la manipulation à zéro
let R={}, dist=60, manuel=false; // manipulation : distance à parcourir (km)
const C={walk:"#2E8B57",bike:"#2563A8",bus:"#E07A1F",car:"#C0392B",ink:"#1E2430",road:"#C9CED8",green:"#DDEFD2",city:"#E9E4F2",teal:"#1C6E61"};
const K=C.ink;
const MODES=[["walker","À pied",5,C.walk],["bike","À vélo",15,C.bike],["bus","En bus (ville)",20,C.bus],["car","En voiture (route)",50,C.car]];
const fmt=h=>{ const m=Math.round(h*60); if(m<60) return m+" min"; const hh=Math.floor(m/60), mm=m%60; return mm?hh+" h "+String(mm).padStart(2,"0"):hh+" h"; };
const fk=x=>(Math.round(x*10)/10).toString().replace(".",",");
/* icônes dessinées (pas d'emoji), boîte ±50 */
const IC={
  walker:e=>{ e("circle",{cx:0,cy:-34,r:11,fill:"#F1C9A5",stroke:K,"stroke-width":3}); e("path",{d:"M0,-22 L0,8 M0,-16 L-17,0 M0,-16 L17,-6",stroke:C.walk,"stroke-width":8,"stroke-linecap":"round",fill:"none"}); e("path",{d:"M0,8 L-14,42 M0,8 L16,42",stroke:K,"stroke-width":8,"stroke-linecap":"round",fill:"none"}); },
  bike:e=>{ [-28,28].forEach(x=>e("circle",{cx:x,cy:18,r:18,fill:"none",stroke:K,"stroke-width":5})); e("path",{d:"M-28,18 L-6,-10 L18,-10 L28,18 M-6,-10 L4,18 L-28,18 M18,-10 L12,-24 L26,-24 M-6,-10 L-12,-22 L-24,-22",fill:"none",stroke:C.bike,"stroke-width":5,"stroke-linejoin":"round","stroke-linecap":"round"}); },
  bus:e=>{ e("rect",{x:-48,y:-28,width:96,height:52,rx:9,fill:C.bus,stroke:K,"stroke-width":3.5}); for(let i=0;i<4;i++) e("rect",{x:-40+i*22,y:-20,width:18,height:16,rx:3,fill:"#CFE8F8",stroke:K,"stroke-width":2}); e("rect",{x:-48,y:6,width:96,height:6,fill:"#fff"}); [-26,26].forEach(x=>e("circle",{cx:x,cy:26,r:10,fill:K})); },
  car:e=>{ e("path",{d:"M-48,10 L-42,-6 L-28,-22 L22,-22 L40,-6 L50,10 L50,26 L-48,26Z",fill:C.car,stroke:K,"stroke-width":3.5,"stroke-linejoin":"round"}); e("path",{d:"M-24,-17 L-12,-17 L-12,-4 L-34,-4Z M-6,-17 L20,-17 L33,-4 L-6,-4Z",fill:"#CFE8F8",stroke:K,"stroke-width":2}); [-28,28].forEach(x=>e("circle",{cx:x,cy:28,r:11,fill:K,stroke:"#fff","stroke-width":2})); },
  train:e=>{ e("rect",{x:-44,y:-32,width:88,height:58,rx:14,fill:"#2563A8",stroke:K,"stroke-width":3.5}); [-30,0].forEach(x=>e("rect",{x,y:-22,width:26,height:20,rx:4,fill:"#CFE8F8",stroke:K,"stroke-width":2})); e("rect",{x:-44,y:6,width:88,height:6,fill:"#fff"}); [-24,24].forEach(x=>e("circle",{cx:x,cy:30,r:8,fill:K})); e("path",{d:"M-20,-32 L-20,-44 L20,-44 L20,-32",fill:"none",stroke:K,"stroke-width":3}); e("circle",{cx:34,cy:-6,r:5,fill:"#F2C230"}); },
  maison:e=>{ e("rect",{x:-34,y:-6,width:68,height:50,fill:"#EADBC0",stroke:K,"stroke-width":4}); e("path",{d:"M-44,-4 L0,-42 L44,-4Z",fill:C.car,stroke:K,"stroke-width":4}); e("rect",{x:-9,y:16,width:18,height:28,fill:"#6B4524"}); },
  ecole:e=>{ e("rect",{x:-46,y:-8,width:92,height:52,fill:"#F0D9B0",stroke:K,"stroke-width":4}); e("path",{d:"M-52,-6 L0,-34 L52,-6Z",fill:C.car,stroke:K,"stroke-width":4}); e("path",{d:"M0,-34 L0,-52 L22,-46 L0,-40",fill:C.bike,stroke:K,"stroke-width":3}); [-30,-10,10,26].forEach(x=>e("rect",{x,y:2,width:14,height:14,fill:"#CFE8F8",stroke:K,"stroke-width":2})); e("rect",{x:-8,y:22,width:16,height:22,fill:"#6B4524"}); },
  ballon:e=>{ e("circle",{cx:0,cy:0,r:36,fill:"#fff",stroke:K,"stroke-width":4}); e("path",{d:"M0,-14 L13,-4 L8,12 L-8,12 L-13,-4Z",fill:K}); e("path",{d:"M0,-14 L0,-35 M13,-4 L33,-12 M8,12 L20,28 M-8,12 L-20,28 M-13,-4 L-33,-12",stroke:K,"stroke-width":3.5}); },
  caddie:e=>{ e("path",{d:"M-46,-30 L-30,-30 L-16,18 L32,18 L42,-14 L-26,-14",fill:"#CFE3F5",stroke:K,"stroke-width":5,"stroke-linejoin":"round","stroke-linecap":"round"}); [-10,26].forEach(x=>e("circle",{cx:x,cy:34,r:8,fill:K})); e("path",{d:"M-4,-10 L-2,12 M12,-10 L12,12 M28,-10 L26,12",stroke:K,"stroke-width":3}); },
  mamie:e=>{ e("circle",{cx:0,cy:-30,r:11,fill:"#D8D8DE",stroke:K,"stroke-width":3}); e("circle",{cx:0,cy:0,r:30,fill:"#D8D8DE",stroke:K,"stroke-width":3}); e("circle",{cx:0,cy:4,r:24,fill:"#F1C9A5",stroke:K,"stroke-width":3}); [-9,9].forEach(x=>e("circle",{cx:x,cy:-2,r:7,fill:"none",stroke:K,"stroke-width":2.5})); e("path",{d:"M-10,14 Q0,22 10,14",fill:"none",stroke:K,"stroke-width":3,"stroke-linecap":"round"}); },
  regle:e=>{ const r=e("g",{transform:"rotate(-30)"}); e("rect",{x:-52,y:-16,width:104,height:32,rx:4,fill:"#F2C230",stroke:K,"stroke-width":3.5},r); for(let i=0;i<9;i++) e("line",{x1:-44+i*11,y1:-16,x2:-44+i*11,y2:i%2?-6:2,stroke:K,"stroke-width":2.5},r); },
  rails:e=>{ for(let i=0;i<6;i++) e("rect",{x:-30,y:-42+i*15,width:60,height:7,fill:"#8C6D46",stroke:K,"stroke-width":1.5}); e("path",{d:"M-16,-46 L-16,46 M16,-46 L16,46",stroke:"#5A6478","stroke-width":6}); },
  ville:e=>{ [[-40,-10,26,50],[-12,-34,28,74],[18,-18,26,58]].forEach(([x,y,w,h])=>{ e("rect",{x,y,width:w,height:h,fill:"#B9B2C9",stroke:K,"stroke-width":3}); for(let k=0;k<Math.floor(h/18);k++) e("rect",{x:x+5,y:y+8+k*16,width:w-10,height:7,fill:"#fff"}); }); },
  pieces:e=>{ e("circle",{cx:-8,cy:8,r:30,fill:"#F2C230",stroke:"#8A6A00","stroke-width":4}); e("circle",{cx:14,cy:-10,r:30,fill:"#F6D45A",stroke:"#8A6A00","stroke-width":4}); e("text",{x:14,y:1,"text-anchor":"middle","font-size":30,"font-weight":800,fill:"#8A6A00",text:"€"}); }
};
function majCurseur(v){ if(!R.mD) return; const d=v===undefined?dist:Math.round(v); R.mD.value=d; R.mDv.textContent=d+" km"; }
function icon(a,parent,nom,x,y,s){ const g=a.el("g",{transform:`translate(${x},${y}) scale(${s||1})`},parent); IC[nom]((t,at)=>a.el(t,at,g)); return g; }
function ph(a,parent,o){ const g=a.el("g",{},parent); const p=a.photo(g,o); g._missing=p._missing; if(!p._missing) a.el("text",{x:o.x+o.w/2,y:o.y-26,"text-anchor":"middle","font-size":22,"font-weight":800,fill:"#8A3A00",text:"Dans la réalité"},g); return g; }
Anim.run({
  titre:"Se déplacer : ici et ailleurs",
  sousTitre:"Géographie · CM1-CM2 · Thème 1 : se déplacer",
  matiere:"geographie", badge:"Géographie",
  accroche:"Comment choisit-on son moyen de transport ?",
  manipDes:2, manipJusqua:2,
  init(a){
    const {el}=a;
    // 1. mes déplacements (carte schématique)
    const m1=a.layer("m1"); R.m1=m1;
    el("rect",{x:0,y:0,width:1600,height:900,fill:"#F4F8F2",rx:14},m1);
    el("text",{x:800,y:70,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"Mes déplacements de la semaine (exemple)"},m1);
    const P={maison:[250,480],ecole:[560,260],sport:[640,720],super:[1100,220],gp:[1360,560]};
    const lieu=(k,ic,t)=>{ const g=el("g",{},m1); const [x,y]=P[k]; el("circle",{cx:x,cy:y,r:56,fill:"#fff",stroke:C.teal,"stroke-width":4},g); icon(a,g,ic,x,y+4,.78); el("text",{x,y:y+96,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:t},g); return g; };
    R.l={maison:lieu("maison","maison","Ma maison"),ecole:lieu("ecole","ecole","L'école"),sport:lieu("sport","ballon","Le club de sport"),super:lieu("super","caddie","Le supermarché"),gp:lieu("gp","mamie","Chez mes grands-parents")};
    const trajet=(to,km,ic,col,bend)=>{ const [x0,y0]=P.maison,[x1,y1]=P[to]; const mx=(x0+x1)/2, my=(y0+y1)/2+bend; const ar=a.arrow(m1,`M${x0+(x1-x0)*.16},${y0+(y1-y0)*.16} Q${mx},${my} ${x1-(x1-x0)*.14},${y1-(y1-y0)*.14}`,{color:col,w:6}); const g=el("g",{},m1); const cy=my+(bend>0?-10:10);
      el("rect",{x:mx-72,y:cy-24,width:144,height:48,rx:12,fill:"#fff",stroke:col,"stroke-width":3},g); icon(a,g,ic,mx-42,cy,.46); el("text",{x:mx+22,y:cy+9,"text-anchor":"middle","font-size":26,"font-weight":800,fill:col,text:km},g); return {ar,g}; };
    R.t=[trajet("ecole","1 km","walker",C.walk,-30),trajet("sport","5 km","bike",C.bike,40),trajet("super","12 km","car",C.car,70),trajet("gp","60 km","car",C.car,40)];
    // 2. en une heure : jusqu'où ?
    const m2=a.layer("m2"); R.m2=m2;
    el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff",rx:14},m2);
    R.clock=el("text",{x:800,y:76,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink},m2);
    const X0=300, KM=1040/50;
    for(let k=0;k<=50;k+=10){ el("line",{x1:X0+k*KM,y1:130,x2:X0+k*KM,y2:760,stroke:"#E1E5EC","stroke-width":2},m2); el("text",{x:X0+k*KM,y:800,"text-anchor":"middle","font-size":24,"font-weight":700,fill:"#3A4458",text:k+(k===50?" km":"")},m2); }
    el("text",{x:X0-14,y:800,"text-anchor":"end","font-size":24,"font-weight":700,fill:"#3A4458",text:"distance :"},m2);
    R.lanes=MODES.map((m,i)=>{ const y=190+i*150; const g=el("g",{},m2); el("rect",{x:X0-20,y:y-50,width:1100,height:100,rx:14,fill:"#F2F4F7"},g); el("line",{x1:X0,y1:y,x2:X0+1040,y2:y,stroke:C.road,"stroke-width":4,"stroke-dasharray":"16 12"},g);
      el("text",{x:30,y:y-4,"font-size":30,"font-weight":800,fill:m[3],text:m[1]},g); el("text",{x:30,y:y+32,"font-size":24,fill:"#3A4458",text:`≈ ${m[2]} km/h`},g);
      const ic=icon(a,g,m[0],X0,y,.8); const tt=el("text",{x:X0+60,y:y+11,"font-size":32,"font-weight":800,fill:m[3]},g); return {g,ic,tt,y}; });
    el("text",{x:800,y:862,"text-anchor":"middle","font-size":24,fill:"#3A4458",text:"Vitesses moyennes données à titre d'exemple"},m2);
    // 3. plus c'est loin, plus c'est long
    const m3=a.layer("m3"); R.m3=m3;
    el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff",rx:14},m3);
    R.dT=el("text",{x:800,y:76,"text-anchor":"middle","font-size":40,"font-weight":800,fill:C.ink},m3);
    const RX=300, RS=1000/60; el("rect",{x:RX-10,y:164,width:1020,height:14,rx:7,fill:"#E1E5EC"},m3);
    R.dBar=el("rect",{x:RX,y:164,height:14,rx:7,fill:C.teal},m3);
    R.jal=[[1,"école","top"],[5,"club","bot"],[12,"supermarché","top"],[60,"grands-parents","bot"]].map(([km,n,pos])=>{ const g=el("g",{},m3); const x=RX+km*RS; el("circle",{cx:x,cy:171,r:11,fill:"#fff",stroke:C.teal,"stroke-width":4},g); const an=n==="école"?"end":n==="supermarché"?"start":"middle"; el("text",{x:x+(an==="end"?16:an==="start"?-16:0),y:pos==="top"?142:218,"text-anchor":an,"font-size":24,"font-weight":800,fill:C.teal,text:`${n} · ${km} km`},g); return g; });
    R.tok=el("g",{},m3); el("circle",{cx:0,cy:0,r:17,fill:C.or,stroke:"#fff","stroke-width":4},R.tok);
    R.bars=MODES.map((m,i)=>{ const y=330+i*120; const g=el("g",{},m3); icon(a,g,m[0],70,y,.7); el("text",{x:132,y:y-2,"font-size":28,"font-weight":800,fill:m[3],text:m[1].replace(" (ville)","").replace(" (route)","")},g); el("text",{x:132,y:y+30,"font-size":22,fill:"#3A4458",text:`≈ ${m[2]} km/h`},g);
      el("line",{x1:RX+100,y1:y-38,x2:RX+100,y2:y+38,stroke:"#9AA3B2","stroke-width":3},g);
      const b=el("rect",{x:RX+100,y:y-30,height:60,rx:8,fill:m[3],opacity:.85},g); const tt=el("text",{y:y+11,"font-size":32,"font-weight":800,fill:m[3]},g); return {g,b,tt,y}; });
    R.verdict=el("g",{},m3); el("rect",{x:230,y:796,width:1140,height:64,rx:14,fill:"#fff",stroke:C.car,"stroke-width":3},R.verdict); R.verdT=el("text",{x:800,y:838,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.car},R.verdict);
    // 4. ville / campagne
    const m4=a.layer("m4"); R.m4=m4;
    const panel=(x,titre,fill)=>{ const g=el("g",{},m4); el("rect",{x,y:100,width:740,height:420,rx:18,fill,stroke:"#B8C2CC","stroke-width":3},g); el("text",{x:x+370,y:76,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:titre},g); return g; };
    R.pV=panel(40,"En ville",C.city); R.pC=panel(820,"À la campagne",C.green);
    R.netV=el("g",{},m4);
    for(let i=0;i<4;i++) el("line",{x1:60,y1:160+i*100,x2:760,y2:160+i*100,stroke:"#B9B2C9","stroke-width":10},R.netV);
    for(let i=0;i<6;i++) el("line",{x1:70+i*130,y1:120,x2:70+i*130,y2:500,stroke:"#B9B2C9","stroke-width":10},R.netV);
    for(let i=0;i<5;i++) for(let j=0;j<3;j++) el("rect",{x:70+i*130+20,y:160+j*100+20,width:90,height:60,rx:6,fill:["#D7CFE6","#CFC6E0","#E0D8EC"][(i+j)%3]},R.netV);
    R.busV=el("path",{d:"M70,160 L330,160 L330,360 L590,360 L590,460",fill:"none",stroke:C.bus,"stroke-width":10},m4); R.tram=el("path",{d:"M50,260 L770,260",fill:"none",stroke:"#7B3F98","stroke-width":10},m4);
    R.arrets=[[70,160],[200,160],[330,160],[330,260],[330,360],[460,360],[590,360],[590,460],[70,260],[200,260],[460,260],[590,260],[720,260]].map(([x,y])=>el("circle",{cx:x,cy:y,r:11,fill:"#fff",stroke:C.ink,"stroke-width":4},m4));
    R.vT=el("g",{},m4); a.label(R.vT,410,560,"bus, tramway, vélo, à pied : beaucoup de choix",{size:24,stroke:"#7B3F98",color:"#5A2D73",w:700});
    R.netC=el("g",{},m4); const road="M850,490 Q1010,400 1190,330 T1540,170";
    el("path",{d:road,fill:"none",stroke:"#BFB49A","stroke-width":14},R.netC); el("path",{d:"M1190,330 Q1250,430 1290,490",fill:"none",stroke:"#BFB49A","stroke-width":10},R.netC);
    [[910,440],[1190,310],[1460,190],[1300,450]].forEach(([x,y])=>{ for(let i=0;i<2;i++){ el("rect",{x:x-30+i*36,y:y-20,width:30,height:24,fill:"#EADBC0",stroke:"#7A6A4E"},R.netC); el("path",{d:`M${x-33+i*36},${y-18} l18,-16 l18,16Z`,fill:"#B9A27A"},R.netC);} });
    for(let i=0;i<6;i++) el("rect",{x:860+(i%3)*190+(i>2?40:0),y:130+Math.floor(i/3)*60+(i%2)*190,width:130,height:62,rx:6,fill:"#E2C77A",opacity:.85},R.netC);
    R.arretC=el("circle",{cx:1190,cy:330,r:13,fill:"#fff",stroke:C.ink,"stroke-width":4},m4); R.arretCt=el("text",{x:1215,y:372,"font-size":24,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":5,"paint-order":"stroke",text:"1 seul arrêt de car"},m4);
    R.carC=icon(a,m4,"car",0,0,.55); R.carPath=el("path",{d:road,fill:"none"},m4);
    R.cT=el("g",{},m4); a.label(R.cT,1190,560,"tout est loin, peu de bus : surtout la voiture",{size:24,stroke:C.teal,color:"#14504A",w:700});
    R.phV=ph(a,m4,{id:"g-a1-tram-dijon",x:240,y:660,w:340,h:150,cap:"Le tramway de Dijon",rot:-1.5});
    R.phC=ph(a,m4,{id:"g-a1-village-rural",x:1020,y:660,w:340,h:150,cap:"Un village de campagne",rot:1.5});
    // 5. monde
    const m5=a.layer("m5"); R.m5=m5; const W=WORLD;
    el("path",{d:W.sphere,fill:"#DCEBF5",stroke:"#9FB8CC","stroke-width":2},m5); el("path",{d:W.grat,fill:"none",stroke:"#C8DAE8","stroke-width":1},m5); el("path",{d:W.land,fill:"#EDE6D3",stroke:"#B8AC93","stroke-width":1},m5);
    const EX=[["Pays-Bas","bike","Pays-Bas","vélo : pays plat,\npistes cyclables partout",[880,40]],["Japon","train","Japon (Tokyo)","à pied ou en train,\nsouvent seuls dès l'école",[1160,330]],["Kenya","walker","Kenya (campagne)","à pied, parfois plusieurs\nkilomètres chaque jour",[960,600]],["Canada","bus","Canada","le bus scolaire jaune :\nmaisons très éloignées",[30,60]]];
    R.ex=EX.map(([k,ic,t,d,off])=>{ const [x,y]=W.pts[k]; const g=el("g",{},m5); const bx=off[0], by=off[1], bw=410, bh=170;
      el("line",{x1:x,y1:y,x2:Math.max(bx,Math.min(bx+bw,x)),y2:Math.max(by,Math.min(by+bh,y)),stroke:C.teal,"stroke-width":3},g); el("circle",{cx:x,cy:y,r:10,fill:C.teal,stroke:"#fff","stroke-width":3},g);
      el("rect",{x:bx,y:by,width:bw,height:bh,rx:14,fill:"#fff",stroke:C.teal,"stroke-width":3},g); icon(a,g,ic,bx+58,by+bh/2,.9); el("text",{x:bx+120,y:by+44,"font-size":26,"font-weight":800,fill:C.teal,text:t},g);
      const tt=el("text",{x:bx+120,y:by+82,"font-size":22,fill:C.ink},g); d.split("\n").forEach((l,j)=>el("tspan",{x:bx+120,dy:j?28:0,text:l},tt)); return g; });
    R.frPt=el("g",{},m5); { const [x,y]=W.pts.France; el("circle",{cx:x,cy:y,r:12,fill:"#E07A1F",stroke:"#fff","stroke-width":3},R.frPt); el("text",{x:x-18,y:y+42,"text-anchor":"end","font-size":26,"font-weight":800,fill:"#B35A0A",stroke:"#fff","stroke-width":5,"paint-order":"stroke",text:"France : moi"},R.frPt); }
    // 6. synthèse
    const m6=a.layer("m6"); R.m6=m6; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},m6);
    el("text",{x:800,y:80,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink,text:"Le choix du transport dépend de…"},m6);
    R.f4=[["regle","la distance","court : à pied, à vélo\nlong : bus, voiture, train"],["rails","l'offre de transport","routes, pistes, bus, trains :\ny en a-t-il près de chez moi ?"],["ville","le lieu où l'on vit","ville dense ou campagne,\nrelief, climat"],["pieces","les moyens","tout le monde n'a pas\nde voiture"]].map((f,i)=>{ const g=el("g",{},m6); const x=215+i*390; el("rect",{x:x-180,y:120,width:360,height:310,rx:18,fill:"#F1F7F5",stroke:C.teal,"stroke-width":3},g); icon(a,g,f[0],x,205,1.1); el("text",{x,y:292,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.teal,text:f[1]},g); const t=el("text",{x,y:340,"text-anchor":"middle","font-size":22,fill:C.ink},g); f[2].split("\n").forEach((l,j)=>el("tspan",{x,dy:j?30:0,text:l},t)); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,200,480,1200,"Partout dans le monde, les enfants vont à l'école comme moi.","Selon la distance, les routes, les transports disponibles et les moyens des familles, on se déplace très différemment d'un pays à l'autre.");
    // manipulation : la distance
    a.manip.innerHTML=`<span style="font-size:24px"><b>À vous :</b> distance à parcourir</span> <input type="range" id="mD" min="1" max="60" step="1" value="60" aria-label="Distance en kilomètres"> <b id="mDv" style="display:inline-block;min-width:96px;font-size:28px">60 km</b>`;
    R.mD=document.getElementById("mD"); R.mDv=document.getElementById("mDv");
    R.mD.oninput=e=>{ dist=+e.target.value; manuel=true; majCurseur(); a.redraw(); };
  },
  reset(a){ [R.m1,R.m2,R.m3,R.m4,R.m5,R.m6,R.myth,...R.ex,R.frPt,R.vT,R.cT,R.busV,R.tram,...R.arrets,R.arretC,R.arretCt,R.carC,R.phV,R.phC,R.verdict,R.tok].forEach(e=>a.op(e,0)); Object.values(R.l).forEach(e=>a.op(e,0)); R.t.forEach(x=>{a.op(x.ar,0);a.op(x.g,0);}); },
  etapes:[
  { titre:"Mes déplacements", duree:9000,
    legende:"Chaque semaine, je me déplace : à l'école, au sport, faire les courses, voir ma famille. Les distances sont très différentes : 1 km, 5 km, 12 km, 60 km !",
    voix:"Chaque semaine, je me déplace pour aller à l'école, au club de sport, faire les courses ou voir ma famille. Regarde : les distances sont très différentes. Un kilomètre jusqu'à l'école, cinq kilomètres jusqu'au sport, douze jusqu'au supermarché et soixante chez mes grands-parents. On n'utilise pas le même moyen de transport pour un kilomètre ou pour soixante kilomètres.",
    anim(t,a){ const s=a.seg; a.op(R.m1,1); a.op(R.l.maison,s(t,0,.1)); const ks=["ecole","sport","super","gp"];
      R.t.forEach((x,i)=>{ const v=s(t,.12+i*.2,.27+i*.2); a.op(R.l[ks[i]],s(t,.1+i*.2,.18+i*.2)); a.op(x.ar,v>0?1:0); a.draw(x.ar.path,v); a.op(x.g,s(t,.25+i*.2,.32+i*.2)); }); } },
  { titre:"En une heure, jusqu'où ?", duree:10000,
    legende:"Partons tous en même temps. En une heure : 5 km à pied, 15 km à vélo, 20 km en bus et 50 km en voiture. Plus on va vite, plus on va loin.",
    voix:"Partons tous en même temps, et regardons jusqu'où chacun arrive en une heure. À pied, on avance d'environ cinq kilomètres par heure. À vélo, quinze. En bus, en ville, vingt. Et en voiture, sur la route, environ cinquante. Ce sont des vitesses moyennes, données comme exemple. Plus on va vite, plus on va loin en une heure.",
    anim(t,a){ const s=a.seg; a.op(R.m1,1-s(t,0,.1)); a.op(R.m2,s(t,0,.1)); const p=s(t,.1,.9,true), mn=Math.round(p*60);
      R.clock.textContent=mn>=60?"Temps écoulé : 1 heure":"Temps écoulé : "+mn+" min";
      R.lanes.forEach((l,i)=>{ const km=MODES[i][2]*p; a.tr(l.ic,300+km*1040/50,l.y,.8); l.tt.setAttribute("x",300+km*1040/50+58); l.tt.textContent=fk(km)+" km"; }); } },
  { titre:"Plus c'est loin, plus c'est long", duree:13000,
    legende:"La distance à parcourir augmente : 1 km, 5 km, 12 km, 60 km. À vous : déplacez le curseur de distance, regardez le temps de chaque transport.",
    voix:"Maintenant, la distance à parcourir augmente toute seule. D'abord un kilomètre, jusqu'à l'école. Puis cinq kilomètres, jusqu'au club de sport. Douze kilomètres, jusqu'au supermarché. Enfin soixante kilomètres, chez les grands-parents. Regarde les barres : le temps nécessaire grandit pour tout le monde, mais beaucoup plus vite à pied qu'en voiture. À vous maintenant : déplacez le curseur pour choisir la distance, et regardez ce qui change pour chaque transport. À partir de quelle distance la marche devient-elle trop longue ?",
    anim(t,a){ const s=a.seg; if(fresh(t)){ manuel=false; dist=60; majCurseur(); }
      a.op(R.m2,1-s(t,0,.08)); a.op(R.m3,s(t,0,.08));
      let d=dist;
      if(!manuel&&t<1){ d=0; for(const [d0,d1,a0,a1] of [[0,1,.05,.15],[1,5,.2,.32],[5,12,.37,.5],[12,60,.55,.85]]){ if(t>=a0) d=a.lerp(d0,d1,s(t,a0,a1)); } majCurseur(d); }
      R.dT.textContent="Distance à parcourir : "+fk(d)+" km";
      a.set(R.dBar,{width:Math.max(.1,d*1000/60)}); a.tr(R.tok,300+d*1000/60,171,1);
      R.jal.forEach((g,i)=>a.op(g,d>=[1,5,12,60][i]-.001?1:.45));
      R.bars.forEach((b,i)=>{ const h=d/MODES[i][2]; const w=h*1000/12; a.set(b.b,{width:Math.max(2,w)}); b.tt.setAttribute("x",400+Math.max(2,w)+14); b.tt.textContent=fmt(h); });
      R.verdT.textContent="Pour "+fk(d)+" km : "+fmt(d/50)+" en voiture, "+fmt(d/5)+" à pied"+(d>=20?" !":"");
      a.op(R.verdict,manuel||t>=1?1:s(t,.88,.95)); } },
  { titre:"En ville ou à la campagne", duree:11000,
    legende:"En ville, les lieux sont proches et il y a beaucoup de transports en commun. À la campagne, tout est plus loin et les bus sont rares : on prend surtout la voiture.",
    voix:"En ville, les écoles, les magasins et les maisons sont proches les uns des autres, et il existe beaucoup de transports en commun : bus, tramway, parfois métro. À la campagne, tout est plus loin, et les bus sont rares. Les habitants prennent donc surtout la voiture, et les enfants le car scolaire.",
    anim(t,a){ const s=a.seg; a.op(R.m3,1-s(t,0,.1)); a.op(R.m4,s(t,0,.1)); a.op(R.busV,s(t,.15,.2)); a.draw(R.busV,s(t,.15,.35)); a.op(R.tram,s(t,.2,.25)); a.draw(R.tram,s(t,.2,.4)); R.arrets.forEach((d,i)=>a.op(d,s(t,.3+i*.008,.32+i*.008))); a.op(R.vT,s(t,.42,.5));
      a.op(R.arretC,s(t,.55,.6)); a.op(R.arretCt,s(t,.58,.62)); const v=s(t,.6,.9); a.op(R.carC,v>0?1:0); const q=a.along(R.carPath,v); a.tr(R.carC,q.x,q.y-14,.55); a.op(R.cT,s(t,.85,.95));
      a.op(R.phV,s(t,.45,.6)); a.op(R.phC,s(t,.88,1)); } },
  { titre:"Et ailleurs dans le monde ?", duree:12000,
    legende:"Ailleurs, on se déplace autrement : vélo aux Pays-Bas, train au Japon, marche au Kenya, bus scolaire au Canada. Chaque fois, cela dépend du lieu et des moyens.",
    voix:"Et ailleurs dans le monde ? Aux Pays-Bas, pays plat couvert de pistes cyclables, beaucoup d'enfants vont à l'école à vélo. Au Japon, à Tokyo, les enfants prennent souvent seuls le train ou marchent. Dans les campagnes du Kénia, beaucoup d'enfants marchent plusieurs kilomètres, faute de routes et de véhicules. Au Canada, où les maisons sont dispersées, le grand bus scolaire jaune ramasse les élèves.",
    anim(t,a){ const s=a.seg; a.op(R.m4,1-s(t,0,.1)); a.op(R.m5,s(t,0,.12)); a.op(R.frPt,s(t,.1,.18)); R.ex.forEach((e,i)=>{ const v=s(t,.18+i*.18,.3+i*.18); a.op(e,v); }); } },
  { titre:"Synthèse", duree:9000,
    legende:"Pour choisir comment se déplacer, on tient compte de la distance, des transports disponibles, du lieu où l'on vit et des moyens de chacun.",
    voix:"Récapitulons. Pour se déplacer, on ne choisit pas au hasard. On tient compte de la distance, des transports qui existent près de chez soi, du lieu où l'on vit, en ville ou à la campagne, et des moyens de chaque famille.",
    anim(t,a){ const s=a.seg; a.op(R.m5,1-s(t,0,.1)); a.op(R.m6,s(t,0,.1)); R.f4.forEach((f,i)=>{ const v=s(t,.1+i*.12,.22+i*.12); a.op(f,v); a.tr(f,0,(1-v)*40); }); a.op(R.myth,s(t,.65,.8)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
