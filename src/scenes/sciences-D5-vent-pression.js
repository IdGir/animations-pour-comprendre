/* META {"id":"sciences-D5-vent-pression","matiere":"sciences","annee":"connexe","periode":1,"theme":"Mouvement, capteurs : le vent et la pression de l'air","resume":"Le vent est de l'air qui va des hautes vers les basses pressions (l'air chaud monte, brise de mer) ; girouette, anémomètre et baromètre mesurent d'où il vient, sa vitesse et la pression.","motsCles":["vent","pression","air chaud","brise de mer","girouette","anémomètre","baromètre","hectopascal"]} */
(function(){
let R={}, E=null, a=null;
let dP=12, flow=0, rot=0, sw=0, sp=0; // manipulation : écart de pression (hPa) ; phase des particules, angle de l'anémomètre, balancement de la girouette
const GX=470, GY=480, GR=280; // compas de la girouette
const KM=5; // indice de l'étape de manipulation
const C={H:"#2563A8",B:"#E07A1F",warm:"#D63A2F",cold:"#2563A8",gr:"#2E8B57",ink:"#1E2430",gris:"#5A6478",air:"#6FA3D8",wind:"#E07A1F"};
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
const f0=v=>Math.round(v).toString();
const panel=(parent,x,y,w,h,col)=>E("rect",{x,y,width:w,height:h,rx:16,fill:"#fff",stroke:col||"#D6DBE4","stroke-width":3},parent);
const txt=(parent,x,y,s,o)=>{ o=o||{}; return E("text",{x,y,"font-size":o.size||24,"font-weight":o.w||700,fill:o.color||C.ink,"text-anchor":o.anchor||"start",text:s,stroke:o.halo?"#fff":null,"stroke-width":o.halo?5:null,"paint-order":o.halo?"stroke":null},parent); };
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mix=(c1,c2,k)=>{ const A=hex(c1),B=hex(c2); return "rgb("+A.map((v,i)=>Math.round(v+(B[i]-v)*k)).join(",")+")"; };
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const dots=(parent,n,fill,r)=>[...Array(n)].map(()=>E("circle",{r:r||8,fill,stroke:"#fff","stroke-width":1.5},parent));
// boucle de convection : départ en bas à gauche, vers la droite au sol, monte à droite, revient en haut, redescend à gauche
function loopPos(u,x1,x2,yt,yb){ const w=x2-x1,h=yb-yt,L=2*(w+h); let s=(((u%1)+1)%1)*L;
  if(s<w) return {x:x1+s,y:yb,seg:0,th:s/w}; s-=w;
  if(s<h) return {x:x2,y:yb-s,seg:1,th:1}; s-=h;
  if(s<w) return {x:x2-s,y:yt,seg:2,th:1-s/w}; s-=w;
  return {x:x1,y:yt+s,seg:3,th:0}; }
// anémomètre à coupelles (vu de dessus) ; g.rot = groupe qui tourne
function mkAnemo(parent,cx,cy,len,cup,nomast){ const g=E("g",{},parent); if(!nomast) E("rect",{x:cx-8,y:cy,width:16,height:len*2.4,fill:"#8C96A6"},g);
  const r=E("g",{},g); for(let i=0;i<3;i++){ const q=E("g",{transform:`rotate(${i*120})`},r); E("line",{x1:0,y1:0,x2:len,y2:0,stroke:"#555","stroke-width":Math.max(5,len/16)},q); E("path",{d:`M${len},${-cup} A${cup},${cup} 0 0 1 ${len},${cup} Z`,fill:i===0?C.B:"#D0D5DD",stroke:"#555","stroke-width":3},q); }
  r.setAttribute("transform",`translate(${cx},${cy})`); E("circle",{cx,cy,r:Math.max(9,len/9),fill:"#555"},g); g.rot=r; g.cx=cx; g.cy=cy; return g; }
const rotA=(g,deg)=>g.rot.setAttribute("transform",`translate(${g.cx},${g.cy}) rotate(${deg})`);
// girouette vue de dessus : la pointe montre D'OÙ vient le vent (angle = cap de la provenance, 0 = nord, 90 = est)
function mkVane(parent,k){ const g=E("g",{},parent); const b=E("g",{},g); k=k||1;
  E("path",{d:`M0,${-170*k} L${-22*k},${-118*k} L${22*k},${-118*k} Z`,fill:C.warm,stroke:"#7A1D12","stroke-width":3,"stroke-linejoin":"round"},b);
  E("line",{x1:0,y1:-118*k,x2:0,y2:120*k,stroke:"#444","stroke-width":9*k,"stroke-linecap":"round"},b);
  E("path",{d:`M0,${96*k} L${-44*k},${178*k} L${44*k},${178*k} Z`,fill:"#8C96A6",stroke:"#444","stroke-width":3,"stroke-linejoin":"round"},b);
  E("circle",{r:12*k,fill:"#333"},g); g.body=b; return g; }
const setVane=(g,x,y,deg)=>{ g.setAttribute("transform",`translate(${x},${y})`); g.body.setAttribute("transform",`rotate(${deg})`); };
// arc de cadran (0 = haut, sens des aiguilles)
const pt=(cx,cy,r,deg)=>[cx+r*Math.sin(deg*Math.PI/180), cy-r*Math.cos(deg*Math.PI/180)];
const arc=(cx,cy,r,a0,a1)=>{ const [x0,y0]=pt(cx,cy,r,a0),[x1,y1]=pt(cx,cy,r,a1); return `M${x0},${y0} A${r},${r} 0 ${a1-a0>180?1:0} 1 ${x1},${y1}`; };
const angP=p=>(p-1000)*2.7; // 950 hPa -> -135°, 1050 hPa -> +135°
function mkDial(parent,cx,cy,r,o){ o=o||{}; const g=E("g",{},parent);
  E("circle",{cx,cy,r:r+14,fill:"#8C96A6"},g); E("circle",{cx,cy,r,fill:"#FBFCFE"},g);
  E("path",{d:arc(cx,cy,r-18,angP(950),angP(1013)),fill:"none",stroke:"#F9D9B4","stroke-width":26},g);
  E("path",{d:arc(cx,cy,r-18,angP(1013),angP(1050)),fill:"none",stroke:"#C9DBF5","stroke-width":26},g);
  for(let p=950;p<=1050;p+=5){ const mj=p%10===0, [x0,y0]=pt(cx,cy,r-2,angP(p)), [x1,y1]=pt(cx,cy,r-(mj?20:11),angP(p)); E("line",{x1:x0,y1:y0,x2:x1,y2:y1,stroke:C.ink,"stroke-width":mj?3:2},g);
    if(p%25===0 || (o.all&&mj)){ const [tx,ty]=pt(cx,cy,r-44,angP(p)); E("text",{x:tx,y:ty+8,"text-anchor":"middle","font-size":o.fs||22,"font-weight":700,fill:C.ink,text:p},g); } }
  const [mx0,my0]=pt(cx,cy,r+2,angP(1013)), [mx1,my1]=pt(cx,cy,r-34,angP(1013)); E("line",{x1:mx0,y1:my0,x2:mx1,y2:my1,stroke:C.gr,"stroke-width":6},g);
  txt(g,cx,cy+r*.62,"hPa",{size:o.fs||24,anchor:"middle",color:C.gris});
  const nd=E("g",{},g); E("path",{d:`M-7,16 L0,${-(r-30)} L7,16 Z`,fill:C.warm,stroke:"#7A1D12","stroke-width":2},nd); E("circle",{r:11,fill:C.ink},nd);
  g.set=p=>nd.setAttribute("transform",`translate(${cx},${cy}) rotate(${angP(clamp(p,950,1050))})`); g.set(1013); return g; }
const vitName=v=>v<1?"calme":v<20?"vent faible":v<39?"vent modéré":v<62?"vent fort":v<89?"coup de vent":"tempête";

Anim.run({
  titre:"Le vent : de l'air qui va des hautes vers les basses pressions",
  sousTitre:"Sciences et technologie · CM1-CM2 · Capteurs et mesures",
  matiere:"sciences", badge:"Sciences",
  accroche:"Pourquoi y a-t-il du vent ? Et comment le mesure-t-on ?",
  manipDes:KM, manipJusqua:KM,
  init(api){
    a=api; E=a.el;
    // =============== 1. haute et basse pression : l'air se déplace
    const L1=a.layer("v1"); R.L1=L1;
    E("rect",{x:80,y:170,width:1440,height:490,rx:10,fill:"#fff",stroke:"#9AA3B2","stroke-width":4},L1);
    E("rect",{x:92,y:182,width:690,height:466,rx:6,fill:"#E3EEFA"},L1); E("rect",{x:818,y:182,width:690,height:466,rx:6,fill:"#FDF0E2"},L1);
    E("rect",{x:80,y:660,width:1440,height:56,fill:"#C9DDB5",stroke:"#9DB78C","stroke-width":3},L1);
    R.hd1=E("g",{},L1); txt(R.hd1,437,80,"HAUTE PRESSION",{size:38,w:800,anchor:"middle",color:C.H}); txt(R.hd1,437,128,"beaucoup d'air · 1025 hPa (exemple)",{size:26,anchor:"middle"});
    txt(R.hd1,1163,80,"BASSE PRESSION",{size:38,w:800,anchor:"middle",color:C.B}); txt(R.hd1,1163,128,"peu d'air · 1000 hPa (exemple)",{size:26,anchor:"middle"});
    R.pL=[...Array(54)].map((_,i)=>({x:120+rnd(i,1)*630,y:215+rnd(i,2)*400})); R.pR=[...Array(14)].map((_,i)=>({x:850+rnd(i,3)*630,y:215+rnd(i,4)*400}));
    R.dL=dots(L1,54,C.air,9); R.dR=dots(L1,14,C.air,9);
    R.tr=[...Array(16)].map((_,i)=>({x0:130+rnd(i,5)*520,y:235+rnd(i,6)*380,len:760+rnd(i,7)*80})); R.dT=dots(L1,16,"#1B4F8F",9);
    R.ar1=E("g",{},L1); [330,430,530].forEach((y,i)=>{ const g=a.arrow(R.ar1,`M560,${y} L1040,${y}`,{color:C.wind,w:16,head:2.6}); g.setAttribute("opacity",.55); });
    R.vt1=E("g",{},L1); a.label(R.vt1,800,430,"VENT",{size:34,stroke:C.wind,color:C.wind,w:150});
    R.bt1=E("g",{},L1); a.label(R.bt1,800,790,"Le vent va de la haute pression vers la basse pression",{size:30,stroke:C.wind,color:C.ink,w:1180,h:70});
    // =============== 2. l'air chaud monte
    const L2=a.layer("v2"); R.L2=L2;
    E("rect",{x:80,y:150,width:1440,height:550,rx:10,fill:"#fff",stroke:"#9AA3B2","stroke-width":4},L2);
    E("rect",{x:80,y:700,width:720,height:60,fill:"#BFD6B0"},L2); E("rect",{x:800,y:700,width:720,height:60,fill:"#E8B98A"},L2);
    R.sun2=E("g",{},L2); E("circle",{cx:1250,cy:205,r:46,fill:"#F6C445"},R.sun2); for(let i=0;i<12;i++){ const t=i/12*Math.PI*2; E("line",{x1:1250+62*Math.cos(t),y1:205+62*Math.sin(t),x2:1250+86*Math.cos(t),y2:205+86*Math.sin(t),stroke:"#F6C445","stroke-width":7,"stroke-linecap":"round"},R.sun2); }
    R.rays2=E("g",{},L2); [[1275,268,1250,690],[1240,268,1210,690],[1205,268,1170,690]].forEach(([x1,y1,x2,y2])=>a.arrow(R.rays2,`M${x1},${y1} L${x2},${y2}`,{color:"#F0A818",w:6,head:3,dash:"14 10"}));
    R.cl2=E("g",{},L2); [[200,215,34],[245,200,44],[298,214,34]].forEach(([x,y,r])=>E("circle",{cx:x,cy:y,r,fill:"#9EAAB8"},R.cl2));
    R.arr2=E("g",{},L2); const A2=(d,c)=>{ const g=a.arrow(R.arr2,d,{color:c,w:14,head:2.8}); g.setAttribute("opacity",.45); };
    A2("M560,670 L1040,670",C.wind); A2("M1120,590 L1120,320",C.warm); A2("M1040,266 L560,266",C.warm); A2("M480,320 L480,590",C.cold);
    R.dC=dots(L2,34,"#999",9);
    R.lp2=[0,1].map(k=>{ const g=E("g",{},L2), cx=k?1385:240, cy=395, n=k?6:13; E("circle",{cx,cy,r:76,fill:k?"#FDEDEA":"#EAF2FC",stroke:k?C.warm:C.cold,"stroke-width":4},g); g.pp=[...Array(n)].map(()=>E("circle",{r:8,fill:k?C.warm:C.cold},g)); g.cx=cx; g.cy=cy; g.k=k; return g; });
    R.tx2=E("g",{},L2);
    txt(R.tx2,240,510,"Air frais :",{size:26,w:800,anchor:"middle",color:C.cold}); txt(R.tx2,240,544,"particules serrées,",{size:23,anchor:"middle"}); txt(R.tx2,240,574,"air plus lourd :",{size:23,anchor:"middle"}); txt(R.tx2,240,604,"il descend",{size:23,w:800,anchor:"middle",color:C.cold});
    txt(R.tx2,1385,510,"Air chaud :",{size:26,w:800,anchor:"middle",color:C.warm}); txt(R.tx2,1385,544,"particules écartées,",{size:23,anchor:"middle"}); txt(R.tx2,1385,574,"air plus léger :",{size:23,anchor:"middle"}); txt(R.tx2,1385,604,"il monte",{size:23,w:800,anchor:"middle",color:C.warm});
    R.gl2=E("g",{},L2); txt(R.gl2,440,810,"HAUTE pression au sol",{size:30,w:800,anchor:"middle",color:C.H}); txt(R.gl2,440,845,"(plus d'air)",{size:24,anchor:"middle"});
    txt(R.gl2,1160,810,"BASSE pression au sol",{size:30,w:800,anchor:"middle",color:C.B}); txt(R.gl2,1160,845,"(moins d'air : l'air chaud est monté)",{size:24,anchor:"middle"});
    R.vt2=E("g",{},L2); a.label(R.vt2,800,708,"VENT au sol",{size:28,stroke:C.wind,color:C.wind,w:200,h:48});
    // =============== 3. la brise de mer
    const L3=a.layer("v3"); R.L3=L3;
    E("rect",{x:60,y:130,width:1480,height:570,rx:10,fill:"#EAF4FB",stroke:"#9AA3B2","stroke-width":4},L3);
    R.nuit3=E("rect",{x:60,y:130,width:1480,height:570,rx:10,fill:"#1B2A4A"},L3);
    E("rect",{x:60,y:520,width:730,height:180,fill:"#7DB4E0"},L3); for(let i=0;i<5;i++) E("path",{d:`M${110+i*140},560 q20,-16 40,0 t40,0`,fill:"none",stroke:"#fff","stroke-width":4,opacity:.8},L3);
    E("path",{d:"M790,520 L1540,520 L1540,700 L790,700 Z",fill:"#C9DDB5"},L3); E("path",{d:"M720,700 L790,520 L860,520 L860,700 Z",fill:"#EAD7A8"},L3);
    // bateau et maison
    E("path",{d:"M300,540 L400,540 L380,566 L320,566 Z",fill:"#8A5A2B"},L3); E("line",{x1:350,y1:540,x2:350,y2:470,stroke:"#444","stroke-width":5},L3); E("path",{d:"M354,474 L354,534 L396,534 Z",fill:"#fff",stroke:"#999","stroke-width":2},L3);
    E("rect",{x:1330,y:450,width:100,height:70,fill:"#F2E3D0",stroke:"#8A5A2B","stroke-width":3},L3); E("path",{d:"M1320,450 L1380,400 L1440,450 Z",fill:"#B5543A"},L3); E("rect",{x:1368,y:480,width:24,height:40,fill:"#8A5A2B"},L3);
    R.sun3=E("g",{},L3); E("circle",{cx:1250,cy:195,r:42,fill:"#F6C445"},R.sun3); for(let i=0;i<12;i++){ const t=i/12*Math.PI*2; E("line",{x1:1250+56*Math.cos(t),y1:195+56*Math.sin(t),x2:1250+78*Math.cos(t),y2:195+78*Math.sin(t),stroke:"#F6C445","stroke-width":7,"stroke-linecap":"round"},R.sun3); }
    R.moon3=E("g",{},L3); E("circle",{cx:1250,cy:195,r:40,fill:"#F4F1DE",stroke:"#C9C5A8","stroke-width":3},R.moon3); [[1236,182,9],[1262,206,7],[1244,212,5]].forEach(([x,y,r])=>E("circle",{cx:x,cy:y,r,fill:"#DAD6BC"},R.moon3)); [[1130,170],[1380,230],[1180,260],[1420,170],[980,200]].forEach(([x,y])=>E("circle",{cx:x,cy:y,r:4,fill:"#F4F1DE"},R.moon3));
    R.arD=E("g",{},L3); R.arN=E("g",{},L3);
    [[R.arD,["M520,498 L1040,498","M1160,440 L1160,290","M1040,230 L540,230","M420,290 L420,440"],C.wind],[R.arN,["M1040,498 L520,498","M420,440 L420,290","M540,230 L1040,230","M1160,290 L1160,440"],C.cold]].forEach(([g,ds,c])=>ds.forEach(d=>{ const q=a.arrow(g,d,{color:c,w:14,head:2.6}); q.setAttribute("opacity",.35); }));
    R.dB=dots(L3,34,"#999",9);
    R.dn3=txt(L3,100,190,"",{size:44,w:800,color:C.ink});
    R.tm3=E("g",{},L3); R.tL=txt(R.tm3,1160,620,"",{size:32,w:800,anchor:"middle",color:C.ink}); R.tS=txt(R.tm3,420,620,"",{size:32,w:800,anchor:"middle",color:C.ink});
    txt(R.tm3,1160,664,"terre",{size:26,anchor:"middle",color:C.gris}); txt(R.tm3,420,664,"mer",{size:26,anchor:"middle",color:C.gris});
    R.bt3=E("g",{},L3); R.btj=E("g",{},R.bt3); a.label(R.btj,800,775,"BRISE DE MER : l'air frais vient de la mer vers la terre",{size:30,stroke:C.wind,color:C.ink,w:1060,h:66}); R.btn=E("g",{},R.bt3); a.label(R.btn,800,775,"BRISE DE TERRE : l'air vient de la terre vers la mer",{size:30,stroke:C.cold,color:C.ink,w:1060,h:66});
    R.ex3=txt(L3,1520,690,"températures : exemple",{size:22,w:600,anchor:"end",color:C.gris});
    // =============== 4. la girouette : d'où vient le vent ?
    const L4=a.layer("v4"); R.L4=L4;
    const cp=E("clipPath",{id:"clipG"},L4); E("circle",{cx:GX,cy:GY,r:GR-4},cp);
    E("circle",{cx:GX,cy:GY,r:GR,fill:"#F7FAFD",stroke:"#9AA3B2","stroke-width":5},L4);
    for(let i=0;i<16;i++){ const t=i*22.5, [x0,y0]=pt(GX,GY,GR-(i%4?14:28),t), [x1,y1]=pt(GX,GY,GR,t); E("line",{x1:x0,y1:y0,x2:x1,y2:y1,stroke:"#9AA3B2","stroke-width":i%4?2:4},L4); }
    [["N",0],["E",90],["S",180],["O",270]].forEach(([s,d])=>{ const [x,y]=pt(GX,GY,GR+34,d); txt(L4,x,y+11,s,{size:36,w:800,anchor:"middle",color:C.ink}); });
    R.st4=E("g",{"clip-path":"url(#clipG)"},L4); R.ws=[...Array(18)].map(()=>E("path",{d:"",fill:"none",stroke:"#7FB0DA","stroke-width":6,"stroke-linecap":"round"},R.st4));
    R.v4=mkVane(L4,1);
    R.cd4=E("g",{},L4); panel(R.cd4,900,130,660,330,C.wind); R.n4=txt(R.cd4,930,205,"",{size:50,w:800,color:C.wind}); R.f4=txt(R.cd4,930,280,"",{size:34,w:800,color:C.warm}); R.t4=txt(R.cd4,930,338,"",{size:30,w:700,color:C.gris});
    R.k4=E("g",{},L4); E("rect",{x:930,y:372,width:600,height:62,rx:12,fill:"#E8F6EE",stroke:C.gr,"stroke-width":3},R.k4); txt(R.k4,1230,414,"la pointe montre D'OÙ il vient",{size:30,w:800,anchor:"middle",color:C.gr});
    R.ph4=a.photo(L4,{id:"s-d5-girouette",x:1130,y:520,w:330,h:220,cap:"Une girouette",rot:2});
    // =============== 5. anémomètre et baromètre
    const L5=a.layer("v5"); R.L5=L5;
    R.an5=E("g",{},L5); R.am=mkAnemo(R.an5,330,330,130,36); R.st5=E("g",{},R.an5); R.w5=[...Array(6)].map(()=>E("path",{d:"",fill:"none",stroke:"#7FB0DA","stroke-width":6,"stroke-linecap":"round"},R.st5));
    R.rd5=E("g",{},R.an5); panel(R.rd5,60,650,560,150,C.wind); R.v5=txt(R.rd5,90,715,"",{size:44,w:800,color:C.wind}); R.v5n=txt(R.rd5,90,770,"",{size:30,w:700}); txt(R.an5,330,225-124,"anémomètre",{size:30,w:800,anchor:"middle",color:C.ink});
    R.ph5=a.photo(L5,{id:"s-d5-anemometre",x:650,y:250,w:240,h:160,cap:"Un anémomètre",size:21,rot:-2});
    R.ba5=E("g",{},L5); R.dl5=mkDial(R.ba5,1230,350,180,{fs:21}); txt(R.ba5,1230,130,"baromètre",{size:30,w:800,anchor:"middle",color:C.ink});
    txt(R.ba5,1105,548,"basse",{size:22,w:700,anchor:"middle",color:C.B}); txt(R.ba5,1355,548,"haute",{size:22,w:700,anchor:"middle",color:C.H});
    R.bd5=E("g",{},R.ba5); panel(R.bd5,1030,558,400,90,C.H); R.p5=txt(R.bd5,1230,622,"",{size:44,w:800,anchor:"middle",color:C.H});
    R.cap5=E("g",{},R.ba5); R.cr5=E("rect",{x:830,width:200,rx:26,fill:"#C9CED8",stroke:"#5A6478","stroke-width":4},R.cap5); R.cl5=[...Array(4)].map(()=>E("line",{x1:850,x2:1010,stroke:"#5A6478","stroke-width":3,opacity:.6},R.cap5));
    R.ca5=[...Array(10)].map((_,i)=>a.arrow(R.cap5,"M0,0 L0,10",{color:C.H,w:5,head:3}));
    R.ct5=E("text",{x:1060,y:730,"font-size":23,"font-weight":600,fill:C.ink},R.cap5); a.wrap(R.ct5,"Dans le baromètre : une capsule fermée, presque sans air. Plus la pression monte, plus elle est écrasée.",30);
    // =============== 6. MANIPULATION : l'écart de pression
    const L6=a.layer("v6"); R.L6=L6;
    E("rect",{x:40,y:160,width:970,height:470,rx:10,fill:"#fff",stroke:"#9AA3B2","stroke-width":4},L6); E("rect",{x:52,y:172,width:458,height:446,rx:6,fill:"#E3EEFA"},L6); E("rect",{x:540,y:172,width:458,height:446,rx:6,fill:"#FDF0E2"},L6);
    E("rect",{x:40,y:630,width:970,height:50,fill:"#C9DDB5",stroke:"#9DB78C","stroke-width":3},L6); txt(L6,70,666,"ouest",{size:24,color:C.gris}); txt(L6,980,666,"est",{size:24,color:C.gris,anchor:"end"});
    R.h6=E("g",{},L6); txt(R.h6,280,70,"HAUTE PRESSION",{size:30,w:800,anchor:"middle",color:C.H}); txt(R.h6,760,70,"BASSE PRESSION",{size:30,w:800,anchor:"middle",color:C.B}); R.pH=txt(R.h6,280,125,"",{size:46,w:800,anchor:"middle",color:C.H}); R.pB=txt(R.h6,760,125,"",{size:46,w:800,anchor:"middle",color:C.B});
    R.eL=[...Array(52)].map((_,i)=>({x:70+rnd(i,11)*430,y:200+rnd(i,12)*390})); R.eR=[...Array(52)].map((_,i)=>({x:555+rnd(i,13)*430,y:200+rnd(i,14)*390}));
    R.d6L=dots(L6,52,C.air,10); R.d6R=dots(L6,52,C.air,10); R.t6=[...Array(14)].map((_,i)=>({y:215+rnd(i,15)*360})); R.d6T=dots(L6,14,"#1B4F8F",9);
    R.ar6=a.arrow(L6,"M300,400 L740,400",{color:C.wind,w:20,head:2.4}); R.ar6.setAttribute("opacity",.5);
    R.an6=mkAnemo(L6,1150,330,98,30,true); txt(L6,1150,470,"anémomètre",{size:26,w:800,anchor:"middle"});
    R.vn6=mkVane(L6,.7); txt(L6,1420,470,"girouette",{size:26,w:800,anchor:"middle"});
    R.rd6=E("g",{},L6); panel(R.rd6,1040,500,520,250,C.wind); R.r6a=txt(R.rd6,1070,555,"",{size:28,w:800,color:C.H}); R.r6b=txt(R.rd6,1070,622,"",{size:42,w:800,color:C.wind}); R.r6c=txt(R.rd6,1070,670,"",{size:30,w:700}); R.r6d=txt(R.rd6,1070,718,"",{size:26,w:600,color:C.gris});
    R.nt6=txt(L6,525,730,"Même distance entre les deux zones. Vitesses données : exemple.",{size:24,w:600,anchor:"middle",color:C.gris});
    // =============== synthèse
    const sy=a.layer("syn"); R.syn=sy; E("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy); txt(sy,800,70,"À retenir",{size:38,w:800,anchor:"middle"});
    R.pts=[["1","Le vent, c'est de l'air qui va de la haute vers la basse pression. Plus l'écart est grand, plus il est fort.",C.wind],["2","L'air chaud monte : la pression baisse au sol et l'air frais arrive (brise de mer le jour).",C.warm],["3","Girouette : d'où vient le vent. Anémomètre : sa vitesse (km/h). Baromètre : la pression (hPa).",C.H]].map(([n,t,c],i)=>{
      const g=E("g",{},sy); E("rect",{x:110,y:110+i*105,width:1380,height:88,rx:16,fill:"#fff",stroke:c,"stroke-width":4},g); E("circle",{cx:165,cy:154+i*105,r:28,fill:c},g); E("text",{x:165,y:166+i*105,"text-anchor":"middle","font-size":34,"font-weight":800,fill:"#fff",text:n},g);
      const tt=E("text",{x:215,y:152+i*105,"font-size":25,"font-weight":700,fill:C.ink},g); a.wrap(tt,t,76,1.25); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,110,450,1380,"La girouette montre où va le vent.","Elle montre d'où il vient : sa pointe est tournée vers le vent. Un vent d'ouest vient de l'ouest (et souffle vers l'est).");
    // manipulation : curseur de l'écart de pression
    a.manip.innerHTML=`Écart de pression : <input type="range" id="mP" min="0" max="30" step="1" value="${dP}" aria-label="Écart de pression entre les deux zones"> <b id="mPv" style="min-width:90px">${dP} hPa</b>`;
    document.getElementById("mP").oninput=e=>{ dP=+e.target.value; document.getElementById("mPv").textContent=dP+" hPa"; a.redraw(); };
    let last=performance.now(); setInterval(()=>{ const now=performance.now(), dt=Math.min(now-last,100); last=now; if(a.step()===KM){ const v=dP*3; flow+=dt/1000*v/60; rot+=dt/1000*v*10; sw+=dt/1000; sp+=dt/1000; a.redraw(); } },40);
  },
  reset(a){ [R.L1,R.L2,R.L3,R.L4,R.L5,R.L6,R.syn,R.myth,R.hd1,R.ar1,R.vt1,R.bt1,R.sun2,R.rays2,R.cl2,R.arr2,R.tx2,R.gl2,R.vt2,R.sun3,R.moon3,R.tm3,R.bt3,R.cd4,R.k4,R.ph4,R.an5,R.ba5,R.ph5,R.bd5,R.cap5,R.rd5,R.rd6,R.h6,...R.lp2].forEach(e=>a.op(e,0)); R.pts.forEach(g=>a.op(g,0)); },
  etapes:[
  { titre:"Haute pression, basse pression", duree:11000,
    legende:"Là où il y a beaucoup d'air, la pression est haute ; là où il y en a peu, elle est basse. Le vent, c'est de l'air qui se déplace de la haute vers la basse pression.",
    voix:"L'air est fait de minuscules particules, et il pèse. Dans une zone où il y a beaucoup d'air, on dit que la pression est haute. Dans une zone où il y en a peu, la pression est basse. Alors l'air se déplace de la haute pression vers la basse pression, comme une foule qui va vers l'endroit où il y a de la place. Ce déplacement d'air, c'est le vent !",
    anim(t,a){ const s=a.seg, tt=t*11; a.op(R.L1,1); a.op(R.hd1,s(t,.04,.16));
      R.dL.forEach((d,i)=>{ const p=R.pL[i]; a.set(d,{cx:p.x+Math.sin(tt*1.3+i)*9,cy:p.y+Math.cos(tt*1.1+i*2)*9}); a.op(d,s(t,.06+rnd(i,8)*.12,.14+rnd(i,8)*.12)); });
      R.dR.forEach((d,i)=>{ const p=R.pR[i]; a.set(d,{cx:p.x+Math.sin(tt*1.3+i)*9,cy:p.y+Math.cos(tt*1.1+i*2)*9}); a.op(d,s(t,.06+rnd(i,9)*.12,.14+rnd(i,9)*.12)); });
      const go=s(t,.4,.5); R.dT.forEach((d,i)=>{ const p=R.tr[i], u=((i/16+tt*.07)%1); a.set(d,{cx:p.x0+u*p.len,cy:p.y+Math.sin(u*9+i)*10}); a.op(d,go*Math.min(1,Math.sin(u*Math.PI)*3)); });
      a.op(R.ar1,s(t,.42,.58)); a.op(R.vt1,s(t,.5,.62)); a.op(R.bt1,s(t,.7,.85)); } },
  { titre:"L'air chaud monte", duree:12000,
    legende:"Le soleil chauffe le sol : l'air chaud, plus léger, monte. Au sol, il reste moins d'air : la pression baisse. L'air frais vient alors prendre sa place : c'est du vent.",
    voix:"Le soleil chauffe le sol d'un seul côté. L'air qui touche ce sol chaud se réchauffe : ses particules s'agitent et s'écartent, il devient plus léger, alors il monte. Au sol, il reste moins d'air : la pression baisse. À côté, l'air plus frais, plus lourd, descend, puis glisse près du sol vers l'endroit où la pression est basse, pour remplacer l'air qui est monté. Ce déplacement d'air près du sol, c'est du vent.",
    anim(t,a){ const s=a.seg, tt=t*12; a.op(R.L1,1-s(t,0,.1)); a.op(R.L2,1); a.op(R.sun2,s(t,.04,.12)); a.op(R.cl2,s(t,.04,.12)); a.op(R.rays2,s(t,.1,.2));
      R.dC.forEach((d,i)=>{ const p=loopPos(i/34+tt*.07,480,1120,266,670); const w=Math.sin(tt*2+i*3)*7; a.set(d,{cx:p.x+(p.seg%2?w:0),cy:p.y+(p.seg%2?0:w),fill:mix(C.cold,C.warm,p.th)}); a.op(d,s(t,.18+i*.004,.26+i*.004)); });
      a.op(R.arr2,s(t,.3,.45)); a.op(R.tx2,s(t,.4,.55)); a.op(R.vt2,s(t,.55,.65)); a.op(R.gl2,s(t,.65,.8));
      R.lp2.forEach(g=>{ a.op(g,s(t,.38,.5)); const am=g.k?9:3.5; g.pp.forEach((p,i)=>{ const n=g.pp.length, ang=i/n*6.2832+rnd(i,g.k+1)*2, rr=g.k?18+(i%3)*18:12+(i%3)*10; a.set(p,{cx:g.cx+Math.cos(ang)*rr+Math.sin(tt*(g.k?4:2)+i*2)*am,cy:g.cy+Math.sin(ang)*rr+Math.cos(tt*(g.k?4:2)+i*3)*am}); }); }); } },
  { titre:"La brise de mer", duree:15000,
    legende:"Le jour, la terre chauffe plus vite que la mer : l'air chaud monte au-dessus de la terre et l'air frais vient de la mer, c'est la brise de mer. La nuit, c'est l'inverse : la brise de terre.",
    voix:"Au bord de la mer, voici ce qui se passe le jour. Le soleil réchauffe la terre plus vite que la mer. L'air chaud au-dessus de la terre monte, et la pression baisse au sol. L'air plus frais qui est au-dessus de la mer arrive alors vers la terre : c'est la brise de mer, un vent qui vient de la mer. La nuit, la terre se refroidit plus vite que la mer. Tout s'inverse : le vent souffle de la terre vers la mer. C'est la brise de terre.",
    anim(t,a){ const s=a.seg, D=15, day=1-s(t,.4,.5), nig=s(t,.5,.6); a.op(R.L2,1-s(t,0,.08)); a.op(R.L3,1);
      a.set(R.nuit3,{opacity:.25*s(t,.42,.58)}); a.op(R.sun3,day); a.op(R.moon3,nig);
      R.dn3.textContent=t<.5?"Le jour":"La nuit";
      const ud=Math.min(t,.5)*D*.06, un=-(Math.max(t,.5)-.5)*D*.06;
      R.dB.forEach((d,i)=>{ const pd=loopPos(i/34+ud,420,1160,230,480), pn=loopPos(i/34+un,420,1160,230,480); const isDay=t<.5, p=isDay?pd:pn; const w=Math.sin(t*D*2+i*3)*7;
        a.set(d,{cx:p.x+(p.seg%2?w:0),cy:p.y+(p.seg%2?0:w),fill:mix(C.cold,C.warm,isDay?p.th:1-p.th)}); a.op(d,Math.min(1,s(t,.04+i*.003,.12+i*.003))*(isDay?day:nig)); });
      const k=s(t,.42,.58); a.op(R.tm3,s(t,.15,.25)); R.tL.textContent=f0(28+(12-28)*k)+" °C"; R.tS.textContent=f0(19+(18-19)*k)+" °C"; R.tL.setAttribute("fill",k<.5?C.warm:C.cold);
      a.op(R.bt3,1); a.op(R.btj,day*s(t,.3,.4)); a.op(R.btn,nig); a.op(R.arD,day*s(t,.15,.3)); a.op(R.arN,nig); a.op(R.ex3,s(t,.15,.25)); } },
  { titre:"La girouette : d'où vient le vent ?", duree:14000,
    legende:"La girouette tourne avec le vent : sa pointe est tournée vers l'endroit d'où vient le vent. Un vent d'ouest vient de l'ouest et souffle vers l'est.",
    voix:"La girouette tourne librement autour de son axe. Le vent pousse sa grande queue, et sa pointe se tourne vers le vent. La pointe de la girouette montre donc d'où vient le vent. Ici, le vent vient de l'ouest : c'est un vent d'ouest, qui souffle vers l'est. Maintenant, le vent vient du nord : c'est un vent du nord, qui souffle vers le sud. Puis il vient de l'est : un vent d'est. Retenez bien : la girouette montre d'où vient le vent, pas où il va !",
    anim(t,a){ const s=a.seg, D=14; a.op(R.L3,1-s(t,0,.08)); a.op(R.L4,1);
      const al=t<.34?270:t<.44?a.lerp(270,360,s(t,.34,.44)):t<.62?360:a.lerp(360,450,s(t,.62,.72)); const th=al*Math.PI/180; setVane(R.v4,GX,GY,al);
      const fx=Math.sin(th), fy=-Math.cos(th), qx=Math.cos(th), qy=Math.sin(th), wv=s(t,.05,.12);
      R.ws.forEach((p,i)=>{ const lane=(i%9)-4, ph=((i<9?0:.5)+t*D*.16)%1, d=GR-ph*2*GR, x=GX+fx*d+qx*lane*56, y=GY+fy*d+qy*lane*56;
        a.set(p,{d:`M${x},${y} L${x-fx*70},${y-fy*70} M${x-fx*70+fx*14+qx*14},${y-fy*70+fy*14+qy*14} L${x-fx*70},${y-fy*70} L${x-fx*70+fx*14-qx*14},${y-fy*70+fy*14-qy*14}`}); a.op(p,wv*.9); });
      const idx=al<315?0:al<405?1:2, ok=Math.abs(al-[270,360,450][idx])<4; a.op(R.cd4,s(t,.08,.16)); a.op(R.k4,s(t,.2,.3)); a.op(R.ph4,s(t,.5,.7));
      R.n4.textContent=ok?["vent d'ouest","vent du nord","vent d'est"][idx]:"le vent tourne…"; R.f4.textContent=ok?["Il vient de l'ouest","Il vient du nord","Il vient de l'est"][idx]:"";
      R.t4.textContent=ok?["et souffle vers l'est","et souffle vers le sud","et souffle vers l'ouest"][idx]:""; } },
  { titre:"Anémomètre et baromètre", duree:14000,
    legende:"L'anémomètre mesure la vitesse du vent en km/h : plus il tourne vite, plus le vent est fort. Le baromètre mesure la pression de l'air en hPa : en moyenne, environ 1013 hPa.",
    voix:"Pour mesurer le vent, on utilise deux instruments. L'anémomètre mesure la vitesse du vent : plus le vent est fort, plus ses coupelles tournent vite. On lit la vitesse en kilomètres par heure. Le baromètre mesure la pression de l'air, en hectopascals. Au niveau de la mer, la pression moyenne est d'environ mille treize hectopascals. Dans le baromètre, une petite capsule fermée est plus ou moins écrasée par l'air, et elle fait bouger l'aiguille.",
    anim(t,a){ const s=a.seg, D=14; a.op(R.L4,1-s(t,0,.08)); a.op(R.L5,1); a.op(R.an5,s(t,0,.1)); a.op(R.rd5,s(t,.08,.16)); a.op(R.ph5,s(t,.25,.4));
      const v=10+50*s(t,.1,.5,true), I=t<.1?10*t:t<.5?1+10*(t-.1)+62.5*(t-.1)*(t-.1):15+60*(t-.5); rotA(R.am,6*D*I);
      R.w5.forEach((p,i)=>{ const ph=((t*D*(v/60))*.35+i/6)%1, y=250+i*42, x=-40+ph*330; a.set(p,{d:`M${x},${y} l70,0 m-18,-12 l18,12 l-18,12`}); a.op(p,Math.sin(ph*Math.PI)*.9*s(t,.08,.14)); });
      R.v5.textContent="Vent : "+f0(v)+" km/h"; R.v5n.textContent=vitName(v);
      a.op(R.ba5,s(t,.5,.6)); a.op(R.bd5,s(t,.5,.6)); a.op(R.cap5,s(t,.5,.6));
      const p=t<.72?a.lerp(1013,1028,s(t,.58,.72)):a.lerp(1028,1002,s(t,.74,.95)); R.dl5.set(p); R.p5.textContent=f0(p)+" hPa"; R.p5.setAttribute("fill",p>=1013?C.H:C.B);
      const h=44+(1040-p)*1.2, yc=765, y0=yc-h/2; a.set(R.cr5,{y:y0,height:h}); R.cl5.forEach((l,i)=>{ const y=y0+h*(i+1)/5; a.set(l,{y1:y,y2:y}); });
      const na=clamp(Math.round(1+(p-1000)/6),1,5); R.ca5.forEach((g,i)=>{ const top=i<5, k=i%5, vis=k<na; a.op(g,vis?.9:0); const x=855+k*36; g.path.setAttribute("d",top?`M${x},${y0-50} L${x},${y0-6}`:`M${x},${y0+h+50} L${x},${y0+h+6}`); }); } },
  { titre:"À vous : changez l'écart de pression", duree:9000,
    legende:"À vous : déplacez le curseur pour changer l'écart de pression entre les deux zones, et regardez ce qui change : le vent, l'anémomètre, la girouette. Que se passe-t-il quand l'écart est nul ?",
    voix:"À vous ! Avec le curseur, changez l'écart de pression entre la zone de haute pression et la zone de basse pression, et regardez ce qui change. Plus l'écart est grand, plus le vent est fort, et plus l'anémomètre tourne vite. Que se passe-t-il quand l'écart est nul ? Regardez aussi la girouette : sa pointe est tournée vers la haute pression, d'où vient le vent. Prenez votre temps.",
    anim(t,a){ const s=a.seg; a.op(R.L5,1-s(t,0,.1)); a.op(R.L6,1); a.op(R.h6,s(t,0,.15)); a.op(R.rd6,s(t,.1,.25));
      const v=dP*3, pH=1013+dP/2, pB=1013-dP/2, nL=Math.round(24+dP*.9), nR=Math.round(24-dP*.6), tm=sp;
      R.pH.textContent=f0(pH)+" hPa"; R.pB.textContent=f0(pB)+" hPa";
      R.d6L.forEach((d,i)=>{ const p=R.eL[i]; a.set(d,{cx:p.x+Math.sin(tm*1.3+i)*9,cy:p.y+Math.cos(tm*1.1+i*2)*9}); a.op(d,i<nL?1:0); });
      R.d6R.forEach((d,i)=>{ const p=R.eR[i]; a.set(d,{cx:p.x+Math.sin(tm*1.3+i)*9,cy:p.y+Math.cos(tm*1.1+i*2)*9}); a.op(d,i<nR?1:0); });
      const fl=flow, g=Math.min(1,dP/3); R.d6T.forEach((d,i)=>{ const u=((i/14+fl)%1); a.set(d,{cx:80+u*900,cy:R.t6[i].y+Math.sin(u*9+i)*10}); a.op(d,g*Math.min(1,Math.sin(u*Math.PI)*3)); });
      R.ar6.path.setAttribute("stroke-width",4+dP*1.1); a.op(R.ar6,dP>0?.5:0);
      rotA(R.an6,rot);
      const wob=dP>=4?0:(1-dP/4)*Math.sin(sw*1.4)*80; setVane(R.vn6,1420,330,270+wob+(dP>=4?Math.sin(sw*.8)*3:0));
      R.r6a.textContent="Écart de pression : "+dP+" hPa"; R.r6b.textContent="Vent : "+f0(v)+" km/h"; R.r6c.textContent=vitName(v)+(v>0?"":" : il n'y a pas de vent");
      R.r6d.textContent=dP>0?"il vient de la haute pression":"la girouette ne se fixe pas"; } },
  { titre:"Synthèse", duree:11000,
    legende:"Le vent va de la haute vers la basse pression ; plus l'écart est grand, plus il est fort. Girouette : d'où il vient. Anémomètre : sa vitesse. Baromètre : la pression.",
    voix:"Pour retenir. Le vent, c'est de l'air qui se déplace de la haute pression vers la basse pression. Plus l'écart de pression est grand, plus le vent est fort. L'air chaud monte, la pression baisse au sol, et l'air frais arrive : c'est ce qui crée la brise de mer. La girouette montre d'où vient le vent. L'anémomètre mesure sa vitesse, et le baromètre mesure la pression. Attention : la girouette ne montre pas où va le vent, mais d'où il vient !",
    anim(t,a){ const s=a.seg; a.op(R.L6,1-s(t,0,.1)); a.op(R.syn,s(t,0,.1)); R.pts.forEach((g,i)=>a.op(g,s(t,.08+i*.12,.18+i*.12))); a.op(R.myth,s(t,.55,.7)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
