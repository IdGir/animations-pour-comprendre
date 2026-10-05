/* META {"id":"sciences-C4-eau-potable-station","matiere":"sciences","annee":"B","periode":1,"theme":"Matière, mélanges, eau : de l'eau de rivière à l'eau du robinet (séparer, filtrer, désinfecter)","resume":"Dégrillage, décantation, filtration, désinfection : comment une station transforme une eau brute en eau potable, et pourquoi une eau limpide n'est pas forcément potable (exemple : l'usine Henri Navier à Dijon).","motsCles":["eau potable","station de traitement","dégrillage","décantation","filtration","désinfection","chlore","ultrafiltration","Dijon","Morcueil"]} */
(function(){
const C={ink:"#1E2430",or:"#E07A1F",bl:"#2563A8",gr:"#2E8B57",red:"#C0392B",mud:"#B08D5B",mudD:"#8B6B44",clear:"#DCEEF9",bed:"#A38B6C"};
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
const MANIP=5, NM=9;
const NAMES=["Dégrillage","Décantation","Filtration","Désinfection"];
let R={}, J={dech:1,boue:1,mic:1}, BAR={cur:-1,dn:0,all:false}, manipActive=false, man=[0,0,0,0], lastDemo=[0,0,0,0], RT=0;
const mixc=(c1,c2,t)=>{ const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)); const a=p(c1),b=p(c2); return "#"+a.map((v,i)=>Math.round(v+(b[i]-v)*t).toString(16).padStart(2,"0")).join(""); };
const potable=()=>J.dech<.01&&J.boue<.01&&J.mic<.01;

function microbe(a,p){ const g=a.el("g",{},p); g.b=a.el("g",{},g); a.el("ellipse",{cx:0,cy:0,rx:15,ry:8,fill:"#6CBF4B",stroke:"#2F7A2B","stroke-width":2.5},g.b); [[-15,0,-24,-6],[-15,0,-24,6],[15,0,24,-6],[15,0,24,6]].forEach(([x1,y1,x2,y2])=>a.el("line",{x1,y1,x2,y2,stroke:"#2F7A2B","stroke-width":2.5,"stroke-linecap":"round"},g.b)); a.el("circle",{cx:-4,cy:-1,r:2.5,fill:"#2F7A2B"},g.b); a.el("circle",{cx:5,cy:1,r:2.5,fill:"#2F7A2B"},g.b);
  g.x=a.el("g",{},g); a.el("line",{x1:-12,y1:-12,x2:12,y2:12,stroke:C.red,"stroke-width":5,"stroke-linecap":"round"},g.x); a.el("line",{x1:12,y1:-12,x2:-12,y2:12,stroke:C.red,"stroke-width":5,"stroke-linecap":"round"},g.x);
  g.st=(dead)=>{ a.set(g.b.firstChild,{fill:dead?"#B9BFC9":"#6CBF4B",stroke:dead?"#7C8594":"#2F7A2B"}); a.op(g.x,dead?1:0); }; return g; }
function debris(a,p,k){ const g=a.el("g",{},p);
  if(k===0){ a.el("line",{x1:-34,y1:5,x2:34,y2:-5,stroke:"#6B4A2A","stroke-width":9,"stroke-linecap":"round"},g); a.el("line",{x1:6,y1:-1,x2:22,y2:-20,stroke:"#6B4A2A","stroke-width":5,"stroke-linecap":"round"},g); }
  if(k===1){ a.el("rect",{x:-30,y:-12,width:50,height:24,rx:9,fill:"#CFE6F2",stroke:"#6A8CA6","stroke-width":3},g); a.el("rect",{x:20,y:-6,width:12,height:12,rx:2,fill:"#E07A1F"},g); }
  if(k===2){ a.el("ellipse",{cx:0,cy:0,rx:22,ry:11,fill:"#6BA544",stroke:"#3E7228","stroke-width":2.5},g); a.el("line",{x1:-20,y1:0,x2:20,y2:0,stroke:"#3E7228","stroke-width":2},g); }
  if(k===3){ a.el("path",{d:"M-24,8 Q-30,-14 -6,-12 Q18,-20 26,-2 Q28,12 4,12 Z",fill:"#EAEFF3",stroke:"#9AA8B5","stroke-width":2.5},g); }
  return g; }
function jarShape(a,p,cx,top,w,h){ const g=a.el("g",{},p); g.liq=a.el("rect",{x:cx-w/2+4,y:top+h*.12,width:w-8,height:h*.88,fill:C.mud},g); g.cx=cx; g.top=top; g.w=w; g.h=h;
  return g; }

Anim.run({
  titre:"De l'eau de rivière à l'eau du robinet",
  sousTitre:"Sciences et technologie · CM1-CM2 · Matière, mélanges, eau",
  matiere:"sciences", badge:"Sciences",
  accroche:"Une eau limpide est-elle forcément bonne à boire ? Visitons une usine d'eau potable.",
  manipDes:MANIP, manipJusqua:MANIP,
  init(a){
    const {el}=a, svg=a.svg;
    R.title=el("text",{x:800,y:70,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink},svg);
    // ===== S2 dégrillage (canal vu de côté) =====
    const s2=a.layer("s2"); R.s2=s2;
    el("rect",{x:50,y:300,width:1040,height:60,fill:"#8FB57A"},s2); el("rect",{x:50,y:360,width:1040,height:170,fill:C.mud,opacity:.85},s2); el("rect",{x:50,y:530,width:1040,height:70,fill:C.bed},s2);
    R.cw=el("path",{fill:"none",stroke:"#fff","stroke-width":3,opacity:.5},s2);
    R.mud2=[...Array(34)].map(()=>el("circle",{r:4.5,fill:C.mudD},s2));
    R.gril=el("g",{},s2); el("line",{x1:600,y1:530,x2:668,y2:326,stroke:"#4A5468","stroke-width":9,"stroke-linecap":"round"},R.gril); for(let k=0;k<9;k++){ const f=k/8, x=600+68*f, y=530-204*f; el("line",{x1:x-4,y1:y,x2:x+24,y2:y,stroke:"#4A5468","stroke-width":5,"stroke-linecap":"round"},R.gril); }
    R.bin=el("g",{},s2); el("path",{d:"M720,250 L860,250 L848,326 L732,326Z",fill:"#7C8594",stroke:"#4A5468","stroke-width":4},R.bin);
    R.d2=[0,1,2,3,0,2].map((k,i)=>debris(a,s2,k)); R.l2=[...[["grille\n(les barreaux laissent\npasser l'eau)",470,660],["benne à déchets",790,230]].map(([t,x,y])=>{ const g=a.label(s2,x,y,t,{size:24,stroke:C.or,color:"#8A4A0E",sw:3}); return g; })];
    R.l2b=a.label(s2,300,215,"gros déchets : branches,\nbouteilles, feuilles…",{size:24,stroke:C.red,color:C.red,sw:3}); R.l2c=a.label(s2,860,650,"l'eau reste trouble :\nil faut la nettoyer encore",{size:24,stroke:C.red,color:C.red,sw:3});
    // ===== S3 décantation =====
    const s3=a.layer("s3"); R.s3=s3;
    el("rect",{x:60,y:330,width:100,height:36,fill:"#8C96A6",stroke:"#5A6475","stroke-width":3},s3); el("rect",{x:930,y:330,width:110,height:36,fill:"#8C96A6",stroke:"#5A6475","stroke-width":3},s3);
    R.bw=el("rect",{x:164,y:300,width:760,height:300,fill:C.mud},s3); R.sl=el("rect",{x:164,width:760,fill:C.mudD},s3);
    el("path",{d:"M160,280 L160,604 L928,604 L928,280",fill:"none",stroke:"#5A6475","stroke-width":8,"stroke-linejoin":"round"},s3);
    R.fl=[...Array(60)].map((_,i)=>{ const f=i%10; const c=el("circle",{r:5.5,fill:C.mudD},s3); c.f=f; c.i=i; return c; });
    R.fb=[...Array(10)].map(()=>el("circle",{fill:C.mudD,"fill-opacity":.25,stroke:C.mudD,"stroke-width":2},s3));
    R.co=el("g",{},s3); el("rect",{x:300,y:150,width:130,height:70,rx:10,fill:"#F2CF4A",stroke:"#B9922A","stroke-width":4},R.co); el("rect",{x:350,y:220,width:30,height:60,fill:"#C9CFD8",stroke:"#8C96A6","stroke-width":3},R.co); R.cd=[...Array(6)].map(()=>el("circle",{r:7,fill:"#F2CF4A",stroke:"#B9922A","stroke-width":2},s3));
    R.l3=a.label(s3,640,190,"on ajoute un produit :\nles petites particules\nse collent en flocons",{size:24,stroke:C.or,color:"#8A4A0E",sw:3}); R.l3b=a.label(s3,540,660,"les flocons tombent au fond : ce sont les boues",{size:26,w:620,stroke:C.or,color:"#8A4A0E",sw:3});
    R.l3c=a.label(s3,985,260,"eau plus claire\nvers la suite",{size:24,stroke:C.bl,color:C.bl,sw:3}); R.out3=[...Array(6)].map(()=>el("circle",{r:7,fill:"#CFE6F5",stroke:C.bl,"stroke-width":2},s3));
    // ===== S4 filtration =====
    const s4=a.layer("s4"); R.s4=s4;
    el("path",{d:"M120,250 L400,250",stroke:"#8C96A6","stroke-width":28,"stroke-linecap":"round",fill:"none"},s4);
    R.fw=el("rect",{x:384,width:312,fill:C.mud},s4); el("rect",{x:384,y:360,width:312,height:130,fill:"#E8C874"},s4); el("rect",{x:384,y:490,width:312,height:80,fill:"#9AA3B2"},s4);
    R.sg=[...Array(70)].map((_,i)=>el("circle",{cx:392+rnd(i,1)*296,cy:366+rnd(i,2)*118,r:4+rnd(i,3)*2,fill:"#D9AE4D",stroke:"#B88B2C","stroke-width":1},s4)); R.gv=[...Array(22)].map((_,i)=>el("circle",{cx:398+(i%11)*28+(Math.floor(i/11)*14),cy:512+Math.floor(i/11)*34,r:15,fill:"#B8BEC9",stroke:"#7C8594","stroke-width":2},s4));
    el("path",{d:"M380,210 L380,576 L700,576 L700,210",fill:"none",stroke:"#5A6475","stroke-width":8,"stroke-linejoin":"round"},s4); el("rect",{x:384,y:572,width:312,height:14,fill:"#5A6475"},s4); el("rect",{x:520,y:586,width:40,height:46,fill:"#8C96A6"},s4);
    R.tp=[...Array(22)].map((_,i)=>el("circle",{r:5,fill:C.mudD},s4)); R.fd=[...Array(8)].map(()=>el("circle",{r:6,fill:"#CFE6F5",stroke:C.bl,"stroke-width":2},s4));
    R.cj=el("g",{},s4); const cjx=800,cjy=420,cjw=230,cjh=210; R.cjW=el("rect",{x:cjx+4,width:cjw-8,fill:C.clear},R.cj); el("path",{d:`M${cjx},${cjy} L${cjx},${cjy+cjh} L${cjx+cjw},${cjy+cjh} L${cjx+cjw},${cjy}`,fill:"none",stroke:"#7E9BB3","stroke-width":6,"stroke-linejoin":"round"},R.cj); el("path",{d:"M540,632 L540,652 Q540,664 560,664 L800,664",fill:"none",stroke:"#8C96A6","stroke-width":12,"stroke-linecap":"round"},s4);
    R.l4=a.label(s4,220,380,"couche de sable :\nelle retient les\nparticules restantes",{size:24,stroke:C.or,color:"#8A4A0E",sw:3}); R.l4b=a.label(s4,910,340,"eau limpide…",{size:28,stroke:C.bl,color:C.bl,sw:3}); R.l4c=a.label(s4,845,720,"…mais il reste des microbes, invisibles !",{size:26,w:520,stroke:C.red,color:C.red,sw:3});
    R.l4g=a.label(s4,220,540,"gravier",{size:24,w:130,stroke:"#7C8594",color:"#4A5468",sw:3});
    // ===== S5 désinfection =====
    const s5=a.layer("s5"); R.s5=s5;
    el("rect",{x:60,y:430,width:880,height:110,fill:C.clear,stroke:"#5A6475","stroke-width":8},s5); R.cl=el("rect",{x:440,y:437,width:497,height:96,fill:"#E4F2B8"},s5); el("rect",{x:60,y:436,width:30,height:98,fill:C.clear},s5);
    R.ch=el("g",{},s5); el("rect",{x:380,y:260,width:120,height:100,rx:12,fill:"#F2CF4A",stroke:"#B9922A","stroke-width":4},R.ch); el("text",{x:440,y:325,"text-anchor":"middle","font-size":40,"font-weight":800,fill:"#7A5A12",text:"Cl"},R.ch); el("rect",{x:432,y:360,width:16,height:70,fill:"#C9CFD8",stroke:"#8C96A6","stroke-width":3},R.ch); R.chd=[...Array(4)].map(()=>el("circle",{r:7,fill:"#E4F2B8",stroke:"#9BB52A","stroke-width":2},s5));
    R.m5=[...Array(8)].map(()=>microbe(a,s5));
    R.tap=el("g",{},s5); el("path",{d:"M940,485 L1000,485 Q1040,485 1040,525 L1040,560",fill:"none",stroke:"#5A6475","stroke-width":28,"stroke-linecap":"round"},R.tap); el("path",{d:"M940,485 L1000,485 Q1040,485 1040,525 L1040,560",fill:"none",stroke:C.clear,"stroke-width":14,"stroke-linecap":"round"},R.tap); R.td=[...Array(3)].map(()=>el("path",{d:"M0,-10 C6,-2 10,4 10,9 C10,15 5,19 0,19 C-5,19 -10,15 -10,9 C-10,4 -6,-2 0,-10Z",fill:"#7FB8E6",stroke:"#2F6FB5","stroke-width":2},s5));
    R.l5=a.label(s5,640,330,"le chlore détruit\nles microbes",{size:28,stroke:C.gr,color:C.gr,sw:3}); R.l5b=a.label(s5,420,640,"microbes (très grossis)",{size:24,w:300,stroke:"#2F7A2B",color:"#2F7A2B",sw:3}); R.l5c=a.label(s5,600,676,"On peut aussi utiliser l'ozone ou des rayons ultraviolets.\nUn peu de chlore reste pour protéger l'eau dans les tuyaux.",{size:24,w:900,stroke:C.or,color:"#8A4A0E",sw:3});
    // ===== jarre (étape 1 et manipulation) =====
    const sj=a.layer("sj"); R.sj=sj; const jx=360, jt=190, jw=360, jh=430;
    R.jR=jarShape(a,sj,jx,jt,jw,jh); R.jmud=[...Array(46)].map((_,i)=>el("circle",{cx:jx-jw/2+20+rnd(i,1)*(jw-40),cy:jt+jh*.12+14+rnd(i,2)*(jh*.88-30),r:4.5,fill:C.mudD},sj));
    R.jd=[0,1,2,3,0,2,1].map((k,i)=>{ const g=debris(a,sj,k); g.k=k; return g; });
    el("path",{d:`M${jx-jw/2},${jt} L${jx-jw/2},${jt+jh} L${jx+jw/2},${jt+jh} L${jx+jw/2},${jt}`,fill:"none",stroke:"#7E9BB3","stroke-width":7,"stroke-linejoin":"round"},sj);
    R.jt=el("text",{x:jx,y:jt+jh+46,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink},sj);
    R.lp=el("g",{},sj); const lx=860, ly=340, lr=165; const lc=el("clipPath",{id:"c4l"},el("defs",{},R.lp)); el("circle",{cx:lx,cy:ly,r:lr-4},lc); R.lpc=el("circle",{cx:lx,cy:ly,r:lr,fill:"#F4FAFE",stroke:"#5A6478","stroke-width":6},R.lp); R.lpi=el("g",{"clip-path":"url(#c4l)"},R.lp);
    R.lm=[...Array(8)].map((_,i)=>{ const g=microbe(a,R.lpi); g.bx=lx+(rnd(i,1)-.5)*210; g.by=ly+(rnd(i,2)-.5)*210; return g; }); R.lmd=[...Array(9)].map((_,i)=>el("circle",{r:4,fill:"#9AA8B5"},R.lpi));
    el("text",{x:lx,y:ly-lr-18,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Zoom : une goutte de cette eau"},R.lp); R.lpT=el("text",{x:lx,y:ly+lr+40,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.red},R.lp);
    R.tip=el("text",{x:60,y:722,"font-size":26,"font-weight":700,fill:"#8A4A0E"},sj); R.cnt=el("text",{x:860,y:620,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ink},sj);
    // ===== barre des étapes + panneau qualité =====
    const bar=a.layer("bar"); R.bar=bar; R.ch4=[...NAMES,"Robinet"].map((n,i)=>{ const g=el("g",{},bar), x=60+i*250+(i===4?30:0), w=i===4?200:230; g.r=el("rect",{x,y:752,width:w,height:62,rx:14,fill:"#fff",stroke:"#9AA3B2","stroke-width":4},g); g.t=el("text",{x:x+w/2,y:792,"text-anchor":"middle","font-size":i===4?26:25,"font-weight":800,fill:"#6B7683",text:(i<4?(i+1)+" ":"")+n},g); if(i<4) a.arrow(g,`M${x+w+4},783 L${x+w+18},783`,{color:"#9AA3B2",w:4,head:3}); return g; });
    R.q=a.layer("q"); const q=R.q; el("rect",{x:1120,y:120,width:440,height:610,rx:18,fill:"#fff",stroke:C.ink,"stroke-width":4},q); el("text",{x:1340,y:166,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"Qualité de l'eau"},q);
    R.qr=[["Gros déchets","(branches, bouteilles…)"],["Particules","(eau trouble)"],["Microbes","(invisibles à l'œil nu)"]].map(([t1,t2],i)=>{ const g=el("g",{},q), y=200+i*118; g.bg=el("rect",{x:1140,y,width:400,height:100,rx:12,fill:"#FDECEA",stroke:C.red,"stroke-width":3},g); g.ic=el("text",{x:1180,y:y+66,"text-anchor":"middle","font-size":54,"font-weight":800,fill:C.red},g); el("text",{x:1218,y:y+40,"font-size":29,"font-weight":800,fill:C.ink,text:t1},g); el("text",{x:1218,y:y+70,"font-size":22,fill:"#4A5468",text:t2},g); g.st=el("text",{x:1218,y:y+94,"font-size":22,"font-weight":800,fill:C.red},g); return g; });
    R.vd=el("g",{},q); R.vdR=el("rect",{x:1140,y:560,width:400,height:150,rx:14,stroke:C.red,"stroke-width":5},R.vd); el("text",{x:1340,y:600,"text-anchor":"middle","font-size":28,"font-weight":700,fill:C.ink,text:"Eau potable ?"},R.vd); R.vdT=el("text",{x:1340,y:662,"text-anchor":"middle","font-size":48,"font-weight":800},R.vd); R.vdS=el("text",{x:1340,y:696,"text-anchor":"middle","font-size":22,"font-weight":700,fill:"#4A5468"},R.vd);
    // ===== S7 idée fausse + Dijon =====
    const s7=a.layer("s7"); R.s7=s7; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s7); el("text",{x:800,y:70,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink,text:"Limpide ne veut pas dire potable"},s7);
    el("rect",{x:50,y:110,width:740,height:700,rx:18,fill:"#F3F6FC",stroke:C.bl,"stroke-width":4},s7); el("text",{x:420,y:162,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.bl,text:"À Dijon : l'usine Henri Navier"},s7);
    R.ph7=a.photo(s7,{id:"s-c4-station",x:250,y:200,w:340,h:210,cap:"Une usine d'eau potable",rot:-1});
    R.dj=el("text",{x:80,y:520,"font-size":26,fill:C.ink},s7); a.wrap(R.dj,"L'eau vient de la source du Morcueil, près de Fleurey-sur-Ouche, par une conduite de plus de 16 km. L'usine la filtre avec une membrane aux trous minuscules : elle arrête tout ce qui dépasse 0,02 micron, c'est environ 50 000 fois plus petit qu'un millimètre.",50,1.3);
    R.my=a.layer("myth"); a.myth(R.my,830,120,720,"« Une eau limpide est une eau potable. »","Une eau peut être limpide et contenir des microbes ou des produits dissous, invisibles. Pour être potable, l'eau doit être traitée, puis contrôlée régulièrement.");
    R.inv=el("g",{},s7); el("rect",{x:830,y:560,width:720,height:250,rx:18,fill:"#fff",stroke:C.or,"stroke-width":4},R.inv); el("text",{x:860,y:610,"font-size":30,"font-weight":800,fill:"#8A4A0E",text:"Ce que l'œil ne voit pas :"},R.inv); const iv=el("text",{x:860,y:658,"font-size":27,fill:C.ink},R.inv); a.wrap(iv,"• des microbes, minuscules\n• des produits dissous, comme le sel dans l'eau de mer : ils passent même à travers un filtre !",44,1.35);
    // ===== S8 synthèse =====
    const sy=a.layer("syn"); R.syn=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy); el("text",{x:800,y:70,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink,text:"À retenir : les 4 étapes"},sy);
    const IC=[(g,x,y)=>{ el("rect",{x:x-44,y:y-40,width:88,height:80,fill:"#E9EDF2",stroke:"#4A5468","stroke-width":4},g); for(let i=-3;i<=3;i++) el("line",{x1:x+i*13,y1:y-40,x2:x+i*13,y2:y+40,stroke:"#4A5468","stroke-width":4},g); },
      (g,x,y)=>{ el("rect",{x:x-50,y:y-40,width:100,height:80,fill:C.clear,stroke:"#5A6475","stroke-width":4},g); for(let i=0;i<6;i++) el("circle",{cx:x-40+i*16,cy:y+30,r:7,fill:C.mudD},g); },
      (g,x,y)=>{ el("path",{d:`M${x-50},${y-40} L${x+50},${y-40} L${x+14},${y+4} L${x+14},${y+40} L${x-14},${y+40} L${x-14},${y+4}Z`,fill:"#E8C874",stroke:"#5A6475","stroke-width":4,"stroke-linejoin":"round"},g); },
      (g,x,y)=>{ el("circle",{cx:x,cy:y,r:42,fill:"#E4F2B8",stroke:"#9BB52A","stroke-width":4},g); el("text",{x,y:y+14,"text-anchor":"middle","font-size":40,"font-weight":800,fill:"#5E7414",text:"Cl"},g); }];
    R.sy=[["Dégrillage","retire les gros déchets"],["Décantation","les flocons de boue\ntombent au fond"],["Filtration","le sable retient\nles particules"],["Désinfection","détruit les microbes"]].map(([t,d],i)=>{ const g=el("g",{},sy), x=70+i*385; el("rect",{x,y:130,width:350,height:400,rx:18,fill:"#F3F6FC",stroke:C.bl,"stroke-width":4},g); el("text",{x:x+175,y:190,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.bl,text:(i+1)+". "+t},g); IC[i](g,x+175,300); const tx=el("text",{x:x+175,y:410,"text-anchor":"middle","font-size":27,fill:C.ink},g); d.split("\n").forEach((l,j)=>el("tspan",{x:x+175,dy:j?34:0,text:l},tx)); if(i<3) a.arrow(g,`M${x+352},330 L${x+383},330`,{color:"#9AA3B2",w:6,head:3}); return g; });
    R.syB=el("g",{},sy); a.label(R.syB,800,640,"Limpide ne veut pas dire potable :\nl'eau du robinet est traitée, puis contrôlée régulièrement.",{size:32,w:1200,stroke:C.or,color:"#8A4A0E",sw:4});
    // ===== manipulation =====
    a.manip.innerHTML=`Traiter l'eau : `+NAMES.map((n,i)=>`<button data-t="${i}">${i+1}. ${n}</button>`).join(" ")+` <button data-t="r" style="border-style:dashed">eau brute ↺</button>`;
    const loop=()=>{ if(a.step()===MANIP){ RT=performance.now()/1000; a.redraw(); } requestAnimationFrame(loop); }; requestAnimationFrame(loop);
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ if(!manipActive){ manipActive=true; man=lastDemo.slice(); } if(b.dataset.t==="r") man=[0,0,0,0]; else man[+b.dataset.t]=1; a.redraw(); });
  },
  reset(a){ [R.s2,R.s3,R.s4,R.s5,R.sj,R.s7,R.syn,R.my,R.inv,R.l2b,R.l2c,...R.l2,R.l3,R.l3b,R.l3c,R.l4,R.l4b,R.l4c,R.l4g,R.l5,R.l5b,R.l5c,R.cj,R.syB,R.bar,R.q,R.ph7].forEach(e=>a.op(e,0)); a.op(R.q,0); R.title.textContent=""; R.tip.textContent=""; R.cnt.textContent=""; },
  after(a,k,t){ // barre d'étapes et panneau qualité (communs aux étapes 1 à 6)
    const on=k<=5; a.op(R.bar,on?1:0); a.op(R.q,on?1:0); if(!on) return;
    R.ch4.forEach((g,i)=>{ const done=BAR.man?(i<4&&BAR.man[i]>.5):(BAR.all?true:i<BAR.dn), cur=i===BAR.cur; const col=cur?C.or:done?C.gr:"#9AA3B2"; a.set(g.r,{stroke:col,fill:cur?"#FFE9D2":done?"#E8F6EE":"#fff"}); a.set(g.t,{fill:cur?"#8A4A0E":done?"#14532D":"#6B7683"}); });
    const st=[["présents","éliminés"],["trouble","limpide"],["présents","éliminés"]], v=[J.dech,J.boue,J.mic];
    R.qr.forEach((g,i)=>{ const x=v[i]; const ok=x<.01, mid=!ok&&x<.99&&i===1; const col=ok?C.gr:mid?C.or:C.red; a.set(g.bg,{fill:ok?"#E8F6EE":mid?"#FFF3E3":"#FDECEA",stroke:col}); g.ic.textContent=ok?"✓":mid?"~":"✗"; a.set(g.ic,{fill:col}); g.st.textContent=ok?(i===1?"eau limpide":"éliminés"):mid?"moins trouble":(i===1?"eau trouble":"présents"); a.set(g.st,{fill:col}); });
    const p=potable(); a.op(R.vd,1); a.set(R.vdR,{fill:p?"#E8F6EE":"#FDECEA",stroke:p?C.gr:C.red}); R.vdT.textContent=p?"OUI":"NON"; a.set(R.vdT,{fill:p?C.gr:C.red}); R.vdS.textContent=p?"toutes les étapes sont faites":"il reste quelque chose à retirer"; }
  ,
  etapes:[
  { titre:"L'eau brute", duree:11000,
    legende:"L'eau prise dans une rivière est de l'eau brute : elle contient des gros déchets, de la boue et des microbes, invisibles. On ne peut pas la boire telle quelle.",
    voix:"L'eau d'une rivière ou d'un lac, qu'on appelle l'eau brute, n'est pas bonne à boire. Elle contient de gros déchets, comme des branches, des feuilles ou des bouteilles. Elle est trouble, à cause de la boue et des petites particules. Et avec une loupe très puissante, on découvrirait des microbes, invisibles à l'œil nu. Une usine de traitement va nettoyer cette eau, étape par étape.",
    anim(t,a){ const s=a.seg; BAR={cur:-1,dn:0,all:false}; J={dech:1,boue:1,mic:1}; R.title.textContent="L'eau brute, prise dans la rivière"; a.op(R.sj,1); JAR(a,t,"eau brute",s(t,0,.2),s(t,.25,.45),s(t,.6,.8)); } },
  { titre:"1. Le dégrillage", duree:11000,
    legende:"L'eau passe à travers une grille : les gros déchets (branches, bouteilles, feuilles) sont arrêtés puis ramassés. L'eau, elle, passe entre les barreaux.",
    voix:"Première étape : le dégrillage. L'eau passe à travers une grande grille. Les barreaux laissent passer l'eau, mais ils arrêtent les gros déchets : les branches, les bouteilles, les feuilles. Un râteau les remonte, et ils sont jetés dans une benne. Mais attention : l'eau reste trouble.",
    anim(t,a){ const s=a.seg; BAR={cur:0,dn:0,all:false}; J={dech:1-s(t,.55,.85),boue:1,mic:1}; a.op(R.sj,1-s(t,0,.08)); a.op(R.s2,s(t,0,.08)); R.title.textContent="1. Le dégrillage"; DEG(a,t); } },
  { titre:"2. La décantation", duree:12000,
    legende:"On ajoute un produit : les petites particules se collent en gros flocons. Plus lourds que l'eau, les flocons tombent au fond : c'est la décantation. L'eau devient plus claire.",
    voix:"Deuxième étape : la décantation. On ajoute un produit qui fait coller les petites particules entre elles : elles forment de gros flocons. Les flocons sont plus lourds que l'eau : ils tombent lentement au fond du bassin, et forment les boues. En surface, l'eau est devenue plus claire, et elle part vers l'étape suivante.",
    anim(t,a){ const s=a.seg; BAR={cur:1,dn:1,all:false}; J={dech:0,boue:1-.5*s(t,.5,.9),mic:1}; a.op(R.s2,1-s(t,0,.08)); a.op(R.s3,s(t,0,.08)); R.title.textContent="2. La décantation"; DEC(a,t); } },
  { titre:"3. La filtration", duree:12000,
    legende:"L'eau traverse une épaisse couche de sable : le sable retient les dernières particules. L'eau qui sort est limpide… mais il reste des microbes, invisibles !",
    voix:"Troisième étape : la filtration. L'eau traverse une épaisse couche de sable et de gravier. Les grains de sable retiennent les dernières particules. L'eau qui sort du filtre est limpide, transparente. Mais attention : elle contient encore des microbes, qu'on ne voit pas.",
    anim(t,a){ const s=a.seg; BAR={cur:2,dn:2,all:false}; J={dech:0,boue:.5-.5*s(t,.45,.85),mic:1}; a.op(R.s3,1-s(t,0,.08)); a.op(R.s4,s(t,0,.08)); R.title.textContent="3. La filtration"; FIL(a,t); } },
  { titre:"4. La désinfection", duree:12000,
    legende:"On ajoute un peu de chlore à l'eau : il détruit les microbes. On peut aussi utiliser l'ozone ou des rayons ultraviolets. L'eau est maintenant potable.",
    voix:"Quatrième étape : la désinfection. On ajoute un peu de chlore dans l'eau. Les microbes, invisibles mais dangereux pour la santé, sont détruits. On peut aussi utiliser l'ozone, ou des rayons ultraviolets. Un peu de chlore reste dans l'eau pour la protéger dans les tuyaux. L'eau est maintenant potable : elle arrive au robinet.",
    anim(t,a){ const s=a.seg; BAR={cur:3,dn:3,all:s(t,.9,1)>.5}; J={dech:0,boue:0,mic:1-s(t,.35,.8)}; a.op(R.s4,1-s(t,0,.08)); a.op(R.s5,s(t,0,.08)); R.title.textContent="4. La désinfection"; DES(a,t); } },
  { titre:"À vous : traitez l'eau !", duree:12000,
    legende:"À vous : traitez l'eau avec les boutons, dans l'ordre que vous voulez. Regardez l'eau, le zoom et le tableau de qualité : quand l'eau est-elle potable ?",
    voix:"À vous maintenant ! Voici de l'eau brute. Traitez-la avec les boutons : dégrillage, décantation, filtration, désinfection. Regardez comment change l'eau, ce que montre le zoom, et le tableau de qualité. Essayez de vous arrêter avant la désinfection : l'eau est limpide, mais est-elle potable ? Prenez votre temps.",
    anim(t,a){ const s=a.seg; if(t<.02){ manipActive=false; man=[0,0,0,0]; } let v; if(manipActive) v=man.slice(); else v=[0,1,2,3].map(i=>s(t,.12+i*.17,.24+i*.17)); lastDemo=v.map(x=>x>.5?1:0);
      J={dech:1-v[0],boue:1-.5*v[1]-.5*v[2],mic:1-v[3]}; BAR={cur:-1,dn:0,all:false}; R.title.textContent="À vous : traitez l'eau brute"; a.op(R.s5,1-s(t,0,.06)); a.op(R.sj,s(t,0,.06)); JAR(a,t,"eau en cours de traitement",1,1,1);
      const n=v.filter(x=>x>.5).length; R.cnt.textContent=n+" étape"+(n>1?"s":"")+" sur 4"; let tip=""; if(v[2]>.5&&!(v[1]>.5)) tip="Sans décantation, le filtre s'encrasse vite : on décante d'abord."; else if(v[3]>.5&&!(v[2]>.5)) tip="Le désinfectant agit mieux sur une eau déjà claire."; else if(n===0) tip="Cliquez sur un traitement pour nettoyer l'eau."; else if(potable()) tip="Bravo : l'eau est potable !"; else if(J.boue<.01&&J.mic>.5) tip="Limpide… mais encore des microbes !"; R.tip.textContent=tip;
      BAR.man=v;
      if(a.manip) a.manip.querySelectorAll("button").forEach(b=>{ const i=+b.dataset.t; if(!isNaN(i)) b.classList.toggle("sel",v[i]>.5&&manipActive); }); } },
  { titre:"Limpide ne veut pas dire potable", duree:12000,
    legende:"Une eau limpide peut contenir des microbes ou des produits dissous. À Dijon, l'usine Henri Navier traite l'eau de la source du Morcueil avec une membrane aux trous minuscules.",
    voix:"Une idée fausse très répandue dit qu'une eau limpide est une eau potable. Non ! Une eau peut être transparente et contenir des microbes, ou des produits dissous, comme le sel dans l'eau de mer. Pour être potable, l'eau doit être traitée, puis contrôlée régulièrement. À Dijon, l'usine Henri Navier traite l'eau de la source du Morcueil, amenée par une conduite de plus de seize kilomètres. Elle la filtre avec une membrane aux trous minuscules, environ cinquante mille fois plus petits qu'un millimètre.",
    anim(t,a){ const s=a.seg; a.op(R.sj,1-s(t,0,.1)); a.op(R.s7,s(t,0,.1)); R.title.textContent=""; a.op(R.ph7,s(t,.15,.35)); a.op(R.my,s(t,.3,.45)); a.op(R.inv,s(t,.55,.7)); a.cls(R.my.faux,"pulse",t>.5&&t<1); } },
  { titre:"À retenir", duree:9000,
    legende:"Dégrillage, décantation, filtration, désinfection : chaque étape retire quelque chose. Limpide ne veut pas dire potable.",
    voix:"À retenir. L'eau brute passe par quatre étapes. Le dégrillage retire les gros déchets. La décantation fait tomber la boue au fond. La filtration retient les particules avec du sable. La désinfection détruit les microbes. Et souvenez-vous : limpide ne veut pas dire potable.",
    anim(t,a){ const s=a.seg; a.op(R.s7,1-s(t,0,.1)); a.op(R.my,1-s(t,0,.1)); a.op(R.syn,s(t,0,.1)); R.sy.forEach((g,i)=>{ const v=s(t,.1+i*.14,.24+i*.14); a.op(g,v); a.tr(g,0,(1-v)*30); }); a.op(R.syB,s(t,.7,.85)); } },
  ]
});
// ---------- dessins ----------
function JAR(a,t,txt,aIn,bIn,cIn){ // jarre + zoom ; état J
  const jx=360,jt=190,jw=360,jh=430;
  a.set(R.jR.liq,{fill:mixc(C.mud,C.clear,1-J.boue)}); R.jmud.forEach((c,i)=>{ a.set(c,{cx:jx-jw/2+20+rnd(i,1)*(jw-40)+Math.sin(RT*1.5+t*8+i)*3,cy:jt+jh*.12+14+rnd(i,2)*(jh*.88-30)+Math.cos(t*7+i*2)*3}); a.op(c,J.boue>.01?Math.min(1,J.boue*1.2)*aIn:0); });
  R.jd.forEach((g,i)=>{ const x=jx-120+(i%4)*80+rnd(i,3)*30, y=jt+jh*.12+16+Math.floor(i/4)*50+rnd(i,4)*30+Math.sin(t*6+i)*4; a.tr(g,x,y+(1-J.dech)*40,1,-12+i*14); a.op(g,J.dech>.01?J.dech*aIn:0); });
  R.jt.textContent=txt; a.op(R.jR.liq.parentNode,aIn>0?1:0);
  a.op(R.lp,bIn); R.lm.forEach((g,i)=>{ const d=(1-J.mic)*8-i, dead=d>0; g.st(dead); a.tr(g,g.bx+Math.sin(RT*1.6+t*9+i*2)*10,g.by+Math.cos(RT*1.4+t*8+i*3)*10,1.4,Math.sin(i+t*9)*30); a.op(g,i<8?(d>=1?0:1)*bIn:0); }); R.lmd.forEach((c,i)=>{ const x=860+(rnd(i,5)-.5)*260, y=340+(rnd(i,6)-.5)*260; a.set(c,{cx:x+Math.sin(t*5+i)*4,cy:y}); a.op(c,J.boue>.01?J.boue*.9*bIn:0); });
  R.lpT.textContent=J.mic>.99?"des microbes (très grossis)":J.mic<.01?"plus de microbes":"les microbes disparaissent…"; a.set(R.lpT,{fill:J.mic<.01?C.gr:C.red}); a.op(R.tip,1); a.op(R.cnt,1); }
function DEG(a,t){ const s=a.seg;
  R.cw.setAttribute("d",[...Array(6)].map((_,i)=>`M${90+i*170+((t*180)%40)},${380+(i%3)*40} q12,-8 24,0 t24,0`).join(" "));
  R.mud2.forEach((c,i)=>{ const x=((rnd(i,1)*1040+t*500)%1040)+50, y=395+rnd(i,2)*120; a.set(c,{cx:x,cy:y+Math.sin(t*8+i)*3}); a.op(c,1); });
  const pos=[[612,352],[636,355],[600,358],[624,347],[648,356],[590,350]];
  R.d2.forEach((g,i)=>{ const a1=s(t,.04+i*.05,.5+i*.02), a2=s(t,.55+i*.04,.82+i*.03); const sx=70+i*90, sy=350+(i%2)*6; const x1=a.lerp(sx,pos[i][0],a1), y1=a.lerp(sy,pos[i][1],a1); const bx=745+(i%3)*38, by=312-Math.floor(i/3)*8; const x=a.lerp(x1,bx,a2), y=a.lerp(y1,by,a2)-Math.sin(Math.PI*a2)*70; a.tr(g,x,y+Math.sin(t*10+i)*(1-a1)*2,1,(i*25)%40-20); a.op(g,1); });
  a.op(R.l2[0],s(t,.35,.5)); a.op(R.l2[1],s(t,.7,.85)); a.op(R.l2b,s(t,0,.1)*(1-s(t,.3,.4))); a.op(R.l2c,s(t,.88,.98)); }
function DEC(a,t){ const s=a.seg; const B={y0:300,y1:600};
  const mix=s(t,.5,.92); a.set(R.bw,{fill:mixc(C.mud,"#CFE6F5",mix*.9)}); const sh=60*s(t,.5,.92); a.set(R.sl,{y:B.y1-sh,height:sh});
  R.cd.forEach((d,i)=>{ const f=((t*7+i/6)%1+1)%1; a.set(d,{cx:365+Math.sin(i)*3,cy:280+f*(340-280+(1-0)*0)}); a.op(d,t>.12&&t<.3?1:0); });
  const FX=[...Array(10)].map((_,f)=>({x:230+f*72+rnd(f,1)*20,y:380+rnd(f,2)*120}));
  R.fl.forEach((c,i)=>{ const f=c.f, F=FX[f]; const x0=190+rnd(i,3)*700, y0=320+rnd(i,4)*260; const g1=s(t,.32,.55), g2=s(t,.55,.9); const cx=F.x+Math.cos(i*1.7)*(8+(i/10)*2.2), cy=F.y+Math.sin(i*1.7)*(8+(i/10)*2.2); let x=a.lerp(x0,cx,g1), y=a.lerp(y0,cy,g1); const fy=B.y1-sh+8+rnd(i,5)*(sh-18)-0; x=a.lerp(x,F.x+(rnd(i,6)-.5)*60,g2); y=a.lerp(y,fy,g2); const jig=(1-g1)*Math.sin(t*20+i)*3; a.set(c,{cx:x+jig,cy:y,r:5.5}); a.op(c,1); });
  R.fb.forEach((c,f)=>{ const F=FX[f], g1=s(t,.38,.55), g2=s(t,.55,.9); a.set(c,{cx:a.lerp(F.x,F.x,g2),cy:a.lerp(F.y,B.y1-sh+20,g2),r:g1*(20)*(1-g2*.7)}); a.op(c,g1*(1-g2)); });
  R.out3.forEach((d,i)=>{ const f=((t*3+i/6)%1+1)%1; a.set(d,{cx:930+f*110,cy:348+Math.sin(f*6)*2}); a.op(d,mix>.2?1:0); });
  a.op(R.co,s(t,.05,.15)*(1-s(t,.35,.45))); a.op(R.l3,s(t,.15,.28)*(1-s(t,.5,.6))); a.op(R.l3b,s(t,.7,.82)); a.op(R.l3c,s(t,.85,.95)); }
function FIL(a,t){ const s=a.seg; const lv=(1-0)*1;
  a.set(R.fw,{y:250,height:110}); R.fw.setAttribute("fill",mixc(C.mud,"#CFE6F5",.5*s(t,.5,.9)));
  R.tp.forEach((c,i)=>{ const f=((t*4+i/22)%1+1)%1; const y=a.lerp(262,366+rnd(i,2)*22,a.ease(Math.min(1,f*1.3))); a.set(c,{cx:400+rnd(i,1)*280,cy:y}); a.op(c,(f<.8?1:0)*(1-s(t,.7,.9)*.0)); });
  R.fd.forEach((d,i)=>{ const f=((t*3+i/8)%1+1)%1; const u1=a.clamp(f/.35,0,1), u2=a.clamp((f-.35)/.65,0,1); a.set(d,{cx:540+u2*255,cy:(u2>0?664:600+u1*64)}); a.op(d,s(t,.15,.25)*(f<.97?1:0)); });
  const fill=s(t,.2,.9); a.set(R.cjW,{y:420+210*(1-.8*fill),height:210*.8*fill}); R.cjW.setAttribute("fill",C.clear);
  a.op(R.cj,s(t,.1,.2)); a.op(R.l4,s(t,.2,.32)*(1-s(t,.6,.7))); a.op(R.l4g,s(t,.2,.32)); a.op(R.l4b,s(t,.7,.8)); a.op(R.l4c,s(t,.85,.95)); }
function DES(a,t){ const s=a.seg; a.set(R.cl,{opacity:s(t,.2,.4)*.75});
  R.chd.forEach((d,i)=>{ const f=((t*6+i/4)%1+1)%1; a.set(d,{cx:440,cy:365+f*(445-365)}); a.op(d,t>.15&&t<.85?1:0); });
  R.m5.forEach((g,i)=>{ const p=s(t,i*.04,.7+i*.03,true); const x=100+p*(840-100), y=470+((i%4)-1.5)*20+Math.sin(t*10+i*2)*5; const dead=x>470+i*4; g.st(dead); a.tr(g,x,y,1.3,Math.sin(t*8+i)*20); a.op(g,s(t,0,.06)*(x>740?1-s(x,740,820,true):1)); });
  a.op(R.l5,s(t,.35,.5)); a.op(R.l5b,s(t,.05,.15)*(1-s(t,.5,.6))); a.op(R.l5c,s(t,.8,.95));
  R.td.forEach((d,i)=>{ const f=((t*3+i/3)%1+1)%1; a.tr(d,1040,575+f*60); a.op(d,s(t,.85,.95)*(1-f*.8)); }); }
})();
