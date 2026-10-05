/* META {"id":"sciences-C1-cycle-de-l-eau","matiere":"sciences","annee":"B","periode":1,"theme":"Matière, mélanges, eau : le cycle de l'eau et les changements d'état","resume":"Évaporation, condensation, précipitations, ruissellement : l'eau change d'état et de place entre la mer et la Côte-d'Or, mais il y en a toujours autant.","motsCles":["cycle de l'eau","évaporation","condensation","précipitations","ruissellement","infiltration","nappe","vapeur d'eau","nuage","Côte-d'Or","Ouche","Saône"]} */
(function(){
const C={ink:"#1E2430",or:"#E07A1F",bl:"#2563A8",gr:"#2E8B57",red:"#C0392B",water:"#4A90D9",waterL:"#BFE0F7",soil:"#A3825A",soilD:"#8B6B44",grass:"#5FA85A",rock:"#7C7F86"};
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
const SURF="M0,430 C110,310 250,285 370,340 C470,386 560,545 690,592 L1050,602";
const LC={x:770,y:310,r:180};            // « loupe » (zoom sur les particules)
const WP=[[1250,640],[1250,300],[400,215],[380,160],[470,400],[690,592],[1050,602],[1330,650]]; // trajet de la goutte
let R={}, Z={}, SP=[];
const surfY=x=>{ let lo=0,hi=SP.length-1; while(hi-lo>1){ const m=(lo+hi)>>1; if(SP[m].x<x) lo=m; else hi=m; } const p=SP[lo],q=SP[hi]; return q.x===p.x?p.y:p.y+(q.y-p.y)*(x-p.x)/(q.x-p.x); };
const pack=(k,sp)=>({x:sp*Math.sqrt(k+.5)*Math.cos(k*2.39996),y:sp*Math.sqrt(k+.5)*Math.sin(k*2.39996)});
function mascot(a,p){ const g=a.el("g",{},p); g.liq=a.el("g",{},g); g.gas=a.el("g",{},g); g.ice=a.el("g",{},g);
  a.el("path",{d:"M0,-30 L26,-15 L26,15 L0,30 L-26,15 L-26,-15Z",fill:"#EAF6FF",stroke:C.bl,"stroke-width":3,"stroke-linejoin":"round"},g.ice); [0,60,120].forEach(r=>a.el("line",{x1:0,y1:-30,x2:0,y2:30,stroke:"#9CC6EA","stroke-width":2.5,transform:`rotate(${r})`},g.ice));
  a.el("path",{d:"M0,-34 C10,-18 22,-8 22,6 C22,20 12,28 0,28 C-12,28 -22,20 -22,6 C-22,-8 -10,-18 0,-34Z",fill:C.water,stroke:"#1E5FA8","stroke-width":3},g.liq);
  a.el("path",{d:"M0,-34 C10,-18 22,-8 22,6 C22,20 12,28 0,28 C-12,28 -22,20 -22,6 C-22,-8 -10,-18 0,-34Z",fill:"#fff","fill-opacity":.65,stroke:C.bl,"stroke-width":3,"stroke-dasharray":"6 5"},g.gas);
  const f=a.el("g",{},g); [-8,8].forEach(x=>{ a.el("circle",{cx:x,cy:2,r:5.5,fill:"#fff",stroke:C.ink,"stroke-width":1.5},f); a.el("circle",{cx:x+1,cy:3,r:2.4,fill:C.ink},f); });
  a.el("path",{d:"M-8,14 Q0,22 8,14",fill:"none",stroke:C.ink,"stroke-width":2.5,"stroke-linecap":"round"},f);
  g.st=(gas,ice)=>{ a.op(g.liq,gas||ice?0:1); a.op(g.gas,gas?1:0); a.op(g.ice,ice?1:0); }; return g; }
// manipulation : où est la goutte ? (lieu, position, état, texte)
const PL=[
 {b:"la mer",x:1250,y:655,etat:"liquide",col:"#2563A8",t1:"La goutte est dans la mer.",t2:"Le Soleil la réchauffe : elle va s'évaporer.",nx:1},
 {b:"l'air",x:1180,y:335,etat:"gaz (vapeur d'eau)",col:"#7A3FA0",gas:1,t1:"La goutte est dans l'air.",t2:"En montant, elle se refroidit : elle va se condenser.",nx:2},
 {b:"le nuage",x:372,y:150,etat:"liquide (gouttelette)",col:"#2563A8",t1:"La goutte est dans un nuage.",t2:"Elle grossit avec d'autres : elle va tomber.",nx:3},
 {b:"la pluie",x:432,y:330,etat:"liquide",col:"#2563A8",t1:"La goutte tombe en pluie.",t2:"Elle va ruisseler vers la rivière ou s'infiltrer.",nx:5},
 {b:"la neige",x:250,y:0,etat:"solide (glace)",col:"#1E7C8C",ice:1,t1:"La goutte tombe en neige.",t2:"Au printemps, elle fondra et rejoindra les ruisseaux.",nx:5},
 {b:"la rivière",x:890,y:566,etat:"liquide",col:"#2563A8",t1:"La goutte est dans la rivière.",t2:"L'Ouche, la Saône puis le Rhône l'emmènent.",nx:0},
 {b:"la nappe",x:600,y:797,etat:"liquide",col:"#2563A8",t1:"La goutte est dans la nappe.",t2:"Sous terre, elle coule très lentement vers la mer.",nx:0}];
let place=0, lastPlace=0, manipActive=false;
function reset0(){ Z={clk:0,vap:0,mAlpha:0,mp:0,loupe:0,ev:0,mode:1,co:0,me:0,fa:0,cloud:0,dark:0,rain:0,snowfall:0,snow:0,run:0,infil:0,nap:0,riv:0,
  chip:{ev:0,co:0,pr:0,ru:0,inf:0,geo:0},lt1:"",lt2:"",ltitle:"",ph1:0,ph2:0,ph1b:0,restart:0,
  mOver:null,mpanel:0,over:0,jev:0,jcon:0,jfall:0,jp:[0,0,0],jar:0,myth:0,syn:[0,0,0],synG:0}; }
Anim.run({
  titre:"Le cycle de l'eau",
  sousTitre:"Sciences et technologie · CM1-CM2 · Matière, mélanges, eau",
  matiere:"sciences", badge:"Sciences",
  accroche:"Où va l'eau d'une flaque qui sèche ? Suivons une particule d'eau, de la mer aux collines de Côte-d'Or.",
  manipDes:5, manipJusqua:5,
  init(a){
    const {el}=a, svg=a.svg;
    const defs=el("defs",{},svg);
    const gr=el("linearGradient",{id:"c1sky",x1:0,y1:0,x2:0,y2:1},defs); el("stop",{offset:0,"stop-color":"#BFE0F7"},gr); el("stop",{offset:1,"stop-color":"#EEF7FD"},gr);
    const cp=el("clipPath",{id:"c1lc"},defs); el("circle",{cx:LC.x,cy:LC.y,r:LC.r-4},cp);
    // échantillonnage du relief
    const sp=el("path",{d:SURF,fill:"none"},svg); const L=sp.getTotalLength(); for(let i=0;i<=400;i++){ const q=sp.getPointAtLength(L*i/400); SP.push({x:q.x,y:q.y}); } svg.removeChild(sp);
    // ===== paysage =====
    const land=a.layer("land"); R.land=land;
    el("rect",{x:0,y:0,width:1600,height:610,fill:"url(#c1sky)"},land);
    R.sun=el("g",{},land); el("circle",{cx:0,cy:0,r:44,fill:"#FFC83D",stroke:"#E8A317","stroke-width":4},R.sun);
    R.rays=[...Array(12)].map((_,i)=>el("line",{x1:60,y1:0,x2:92,y2:0,stroke:"#F5A91F","stroke-width":6,"stroke-linecap":"round",transform:`rotate(${i*30})`},R.sun)); a.tr(R.sun,1130,92);
    // mer
    el("rect",{x:1050,y:600,width:550,height:300,fill:C.water},land); el("rect",{x:1050,y:600,width:550,height:300,fill:"#2F6FB5",opacity:.35},land);
    R.waves=el("path",{fill:"none",stroke:"#fff","stroke-width":3,opacity:.7},land);
    // sol
    el("path",{d:SURF+" L1050,900 L0,900 Z",fill:C.soil},land);
    el("rect",{x:0,y:735,width:1050,height:165,fill:C.rock,opacity:.9},land);
    R.nappe=el("rect",{x:0,y:762,width:1050,height:70,fill:"#7FB8E6"},land);
    el("rect",{x:0,y:735,width:1050,height:27,fill:C.soilD,opacity:.6},land); el("rect",{x:0,y:832,width:1050,height:68,fill:"#6B6E75"},land);
    el("path",{d:SURF,fill:"none",stroke:C.grass,"stroke-width":14,"stroke-linecap":"butt"},land);
    // forêt du Morvan
    for(let i=0;i<9;i++){ const x=40+i*34+rnd(i,1)*12, y=surfY(x)-4; if(x>80&&x<400||x<=80){ el("path",{d:`M${x},${y-46} L${x-17},${y} L${x+17},${y}Z`,fill:"#2F7D3C"},land); el("rect",{x:x-3,y,width:6,height:10,fill:"#6B4A2A"},land); } }
    // neige au sommet
    R.snowcap=el("path",{fill:"#fff",stroke:"#C9D6E3","stroke-width":2},land);
    // rivière (la Saône) + flot
    el("path",{d:"M600,570 C640,590 660,596 700,598 L1055,603",fill:"none",stroke:C.water,"stroke-width":16,"stroke-linecap":"round"},land);
    R.flow=el("path",{d:"M600,570 C640,590 660,596 700,598 L1055,603",fill:"none",stroke:"#fff","stroke-width":6,"stroke-dasharray":"16 22",opacity:.9},land);
    // Dijon
    const dj=el("g",{},land); [[740,40,56],[784,34,40],[826,44,64],[876,36,48]].forEach(([x,w,h],i)=>{ el("rect",{x,y:598-h,width:w,height:h,fill:["#D9C7A8","#CDB791","#E2D3B8","#D0BC98"][i],stroke:"#7A6A4E","stroke-width":2},dj); el("path",{d:`M${x-3},${598-h} L${x+w/2},${598-h-18} L${x+w+3},${598-h}Z`,fill:"#B5543A"},dj); });
    // ruissellement
    const rp=[]; for(let x=336;x<=692;x+=6) rp.push([x,surfY(x)+3]); R.rup="M"+rp.map(p=>p.join(",")).join(" L");
    R.run=el("path",{d:R.rup,fill:"none",stroke:C.water,"stroke-width":9,"stroke-linecap":"round"},land);
    // eau souterraine : étiquette et particules
    R.inf=[...Array(22)].map((_,i)=>el("circle",{r:6,fill:"#7FB8E6",stroke:"#1E5FA8","stroke-width":2},land));
    R.nf=[...Array(16)].map((_,i)=>el("circle",{r:6,fill:"#fff",stroke:"#1E5FA8","stroke-width":2},land));
    // nuage
    R.cloud=el("g",{},land); [[-70,10,52],[-20,-16,66],[40,-6,60],[88,12,48],[8,22,56],[-36,24,46],[60,26,44]].forEach(([x,y,r])=>el("circle",{cx:x,cy:y,r,fill:"#fff"},R.cloud));
    R.cloudD=el("g",{},land); [[-70,10,52],[-20,-16,66],[40,-6,60],[88,12,48],[8,22,56],[-36,24,46],[60,26,44]].forEach(([x,y,r])=>el("circle",{cx:x,cy:y,r,fill:"#8C98A8"},R.cloudD));
    // vapeur
    R.vap=[...Array(52)].map((_,i)=>{ const c=el("circle",{r:11,fill:"#fff","fill-opacity":.55,stroke:C.bl,"stroke-width":2.5,"stroke-dasharray":"4 3"},land); c._o=rnd(i,1); c._x=i<38?1100+rnd(i,2)*450:660+rnd(i,2)*370; c._y=i<38?590:588; return c; });
    // pluie / neige
    R.rain=[...Array(46)].map((_,i)=>el("path",{d:"M0,0 L-3,14",stroke:"#2F6FB5","stroke-width":4,"stroke-linecap":"round"},land));
    R.snowf=[...Array(24)].map((_,i)=>el("circle",{r:6,fill:"#fff",stroke:"#9DB2C7","stroke-width":2},land));
    // chips
    const chip=(k,x,y,s,c)=>{ R["ch_"+k]=a.label(land,x,y,s,{size:26,w:Math.ceil(s.length*18.5+30),stroke:c,color:c,sw:3}); };
    chip("ev",1462,430,"ÉVAPORATION",C.or); chip("co",360,44,"CONDENSATION",C.bl); chip("pr",132,140,"PRÉCIPITATIONS",C.bl);
    chip("ru",545,672,"RUISSELLEMENT","#1E5FA8"); chip("inf",215,672,"INFILTRATION","#1E5FA8");
    R.geo=el("g",{},land); a.label(R.geo,150,520,"collines de Côte-d'Or",{size:24,w:290,fill:"#fff"}); a.label(R.geo,885,676,"l'Ouche, la Saône\npuis le Rhône",{size:24,w:260,fill:"#fff"}); a.label(R.geo,1325,770,"la mer (Méditerranée)",{size:26,w:340,fill:"#fff"}); a.label(R.geo,810,500,"Dijon",{size:24,w:100,fill:"#fff"}); a.label(R.geo,300,797,"nappe d'eau souterraine",{size:24,w:320,fill:"#EAF4FB"});
    R.restart=a.label(land,800,48,"Et tout recommence : c'est un cycle !",{size:30,w:560,stroke:C.or,color:"#8A4A0E",sw:3});
    // goutte (mascotte)
    R.m=mascot(a,land); R.mT=el("text",{"font-size":22,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":5,"paint-order":"stroke","text-anchor":"start",text:"Goutte"},land);
    // ===== loupe =====
    const lp=a.layer("loupe"); R.lp=lp;
    el("circle",{cx:LC.x,cy:LC.y,r:LC.r,fill:"#F4FAFE",stroke:"#5A6478","stroke-width":6},lp);
    const lg=el("g",{"clip-path":"url(#c1lc)"},lp); R.lg=lg;
    R.surfL=el("rect",{x:LC.x-LC.r,y:LC.y+20,width:2*LC.r,height:LC.r,fill:"#CFE6F7"},lg);
    R.cold=el("rect",{x:LC.x-LC.r,y:LC.y-LC.r,width:2*LC.r,height:2*LC.r,fill:"#C7D9F0"},lg);
    // particules d'évaporation
    R.lq=[]; for(let row=0;row<5;row++) for(let col=0;col<12;col++){ const x=LC.x-188+col*34+(row%2)*17, y=LC.y+44+row*31; if(Math.hypot(x-LC.x,y-LC.y)<LC.r-10) R.lq.push({x,y,row,col}); }
    R.lq.forEach((q,i)=>{ const esc=(q.row===0&&rnd(i,3)>.42)||(q.row===1&&rnd(i,4)>.8); q.esc=esc; q.ti=.1+.6*rnd(i,5); q.sp=110+60*rnd(i,6); q.c=el("circle",{r:11,fill:"#7FB8E6",stroke:"#2F6FB5","stroke-width":2},lg); });
    let mi=0,bd=1e9; R.lq.forEach((q,i)=>{ if(q.row===0&&Math.abs(q.x-LC.x)<bd){ bd=Math.abs(q.x-LC.x); mi=i; } }); R.mq=R.lq[mi]; R.mq.esc=true; R.mq.ti=.32; R.mq.sp=150; R.mq.c.style.display="none";
    // particules de condensation
    R.co=[...Array(36)].map((_,i)=>{ const d=Math.floor(i/6), j=i%6; const ang=d/6*Math.PI*2+.4, rr=d%2?95:115; const dc={x:LC.x+Math.cos(ang)*rr*(d>1?1:.8)*.9,y:LC.y+Math.sin(ang)*rr*.9}; const o=pack(j,19); const bg=pack(i,19); return {c:el("circle",{r:10.5,fill:"#7FB8E6",stroke:"#2F6FB5","stroke-width":2},lg),gx:LC.x-165+rnd(i,7)*330,gy:LC.y-150+rnd(i,8)*300,vx:(rnd(i,9)-.5)*2,vy:(rnd(i,10)-.5)*2,dx:dc.x+o.x,dy:dc.y+o.y,bx:LC.x+bg.x,by:LC.y+bg.y-10,d}; });
    R.dr=[...Array(6)].map(()=>el("circle",{r:0,fill:"#7FB8E6","fill-opacity":.2,stroke:"#2F6FB5","stroke-width":2.5},lg)); R.big=el("circle",{r:0,fill:"#7FB8E6","fill-opacity":.2,stroke:"#2F6FB5","stroke-width":3.5},lg);
    R.lm=mascot(a,lg); R.lm.setAttribute("data-s",1);
    R.ltg=el("g",{},lp); el("rect",{x:LC.x-290,y:LC.y-LC.r-76,width:580,height:86,rx:12,fill:"#fff",stroke:"#5A6478","stroke-width":3},R.ltg);
    R.ltitleT=el("text",{x:LC.x,y:LC.y-LC.r-40,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink},R.ltg); R.lt1=el("text",{x:LC.x,y:LC.y-LC.r-8,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.bl},R.ltg);
    R.link=el("line",{stroke:"#9AA3B2","stroke-width":3,"stroke-dasharray":"8 6"},lp);
    // ===== photos =====
    const ph=a.layer("photos"); R.ph1=a.photo(ph,{id:"s-c1-nuages",x:1240,y:34,w:300,h:196,cap:"De vrais nuages",rot:2}); R.ph2=a.photo(ph,{id:"s-c1-lac-kir",x:1230,y:34,w:310,h:200,cap:"Le lac Kir, à Dijon",rot:-2});
    // ===== manipulation : suivre la goutte =====
    const mp=a.layer("mpan"); R.mp=mp; R.mpBox=el("rect",{x:1085,y:190,width:495,height:215,rx:16,fill:"#fff",stroke:C.or,"stroke-width":4},mp);
    R.mpT1=el("text",{x:1105,y:236,"font-size":26,"font-weight":800,fill:C.ink},mp); R.mpEt=el("text",{x:1105,y:282,"font-size":28,"font-weight":800},mp); R.mpT2=el("text",{x:1105,y:326,"font-size":25,fill:C.ink},mp);
    R.mpH=el("text",{x:1580,y:440,"text-anchor":"end","font-size":26,"font-weight":800,fill:C.or},mp);
    a.manip.innerHTML=`Où est la goutte ? `+PL.map((q,i)=>`<button data-p="${i}">${q.b}</button>`).join("")+` <button data-p="next" style="border-style:dashed">et ensuite ▶</button>`;
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ if(!manipActive){ manipActive=true; place=lastPlace; } place=b.dataset.p==="next"?PL[place].nx:+b.dataset.p; a.redraw(); });
    // ===== bocal fermé =====
    const ov=a.layer("over"); R.over=ov; el("rect",{x:-12,y:-12,width:1624,height:924,fill:"#fff"},ov);
    const J=el("g",{},ov); R.J=J; const jx=380;
    R.jSun=el("g",{},J); el("circle",{cx:0,cy:0,r:36,fill:"#FFC83D",stroke:"#E8A317","stroke-width":4},R.jSun); [...Array(8)].forEach((_,i)=>el("line",{x1:48,y1:0,x2:72,y2:0,stroke:"#F5A91F","stroke-width":5,"stroke-linecap":"round",transform:`rotate(${i*45})`},R.jSun)); a.tr(R.jSun,jx,130);
    R.jWater=el("rect",{x:jx-146,y:500,width:292,height:136,fill:C.water,opacity:.9},J);
    el("path",{d:`M${jx-150},290 L${jx-150},630 Q${jx-150},640 ${jx-140},640 L${jx+140},640 Q${jx+150},640 ${jx+150},630 L${jx+150},290`,fill:"none",stroke:"#7E9BB3","stroke-width":6},J);
    el("rect",{x:jx-160,y:258,width:320,height:34,rx:8,fill:"#8C96A6",stroke:"#5A6475","stroke-width":3},J);
    R.jLine=el("line",{x1:jx-190,y1:500,x2:jx+150,y2:500,stroke:C.red,"stroke-width":3,"stroke-dasharray":"8 6"},J); R.jLineT=el("text",{x:jx-196,y:490,"text-anchor":"end","font-size":22,"font-weight":700,fill:C.red,text:"niveau"},J); el("text",{x:jx-196,y:516,"text-anchor":"end","font-size":22,"font-weight":700,fill:C.red,text:"de départ"},J);
    R.jv=[...Array(10)].map((_,i)=>el("circle",{r:8,fill:"#fff","fill-opacity":.6,stroke:C.bl,"stroke-width":2.5,"stroke-dasharray":"4 3"},J));
    R.jd=[...Array(12)].map((_,i)=>el("circle",{r:0,fill:"#BFE0F7",stroke:"#2F6FB5","stroke-width":2.5},J));
    el("text",{x:jx,y:238,"text-anchor":"middle","font-size":24,"font-weight":800,fill:C.ink,text:"bocal fermé"},J);
    el("rect",{x:jx-190,y:660,width:380,height:34,rx:8,fill:"#C9CFD8",stroke:"#8C96A6","stroke-width":3},J); el("rect",{x:jx-210,y:694,width:420,height:96,rx:16,fill:"#E9EDF2",stroke:"#8C96A6","stroke-width":4},J); el("rect",{x:jx-130,y:710,width:260,height:62,rx:8,fill:"#1E2A20"},J);
    R.jBal=el("text",{x:jx+112,y:757,"text-anchor":"end","font-size":44,"font-weight":800,fill:"#7CFF8A","font-family":"Consolas,monospace",text:"450 g"},J); el("text",{x:jx,y:826,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:"masse totale (exemple) : elle ne change pas !"},J);
    R.jP=[["1","Évaporation : le niveau baisse.",C.or],["2","Condensation : des gouttes sur le couvercle.",C.bl],["3","Elles retombent dans l'eau : rien n'est perdu.",C.gr]].map(([n,t,c],i)=>{ const g=el("g",{},J); const y=520+i*100; el("rect",{x:740,y,width:780,height:84,rx:14,fill:"#fff",stroke:c,"stroke-width":4},g); el("circle",{cx:790,cy:y+42,r:26,fill:c},g); el("text",{x:790,y:y+53,"text-anchor":"middle","font-size":32,"font-weight":800,fill:"#fff",text:n},g); el("text",{x:834,y:y+52,"font-size":28,"font-weight":700,fill:C.ink,text:t},g); return g; });
    R.mythL=a.layer("myth"); R.mythL.setAttribute("transform","translate(0,0)"); a.myth(R.mythL,740,170,780,"« L'eau qui s'évapore disparaît. Les nuages, c'est de la fumée. »","L'eau ne disparaît pas : elle devient de la vapeur d'eau, un gaz invisible. En refroidissant, elle forme de minuscules gouttes d'eau liquide : c'est cela, un nuage.");
    // synthèse
    const sy=a.layer("syn"); R.syn=sy; R.synC=[["1","L'eau change d'état","liquide, gaz (vapeur), solide (neige, glace) : toujours la même eau.",C.bl],["2","Elle circule","mer, nuage, pluie, neige, rivière, nappe : un grand cycle.",C.or],["3","Il y en a toujours autant","rien ne disparaît et rien ne se crée : l'eau change d'état et de place.",C.gr]].map(([n,t,d,c],i)=>{ const g=el("g",{},sy); const y=120+i*215; el("rect",{x:60,y,width:860,height:185,rx:18,fill:"#fff",stroke:c,"stroke-width":4},g); el("circle",{cx:125,cy:y+92,r:38,fill:c},g); el("text",{x:125,y:y+106,"text-anchor":"middle","font-size":42,"font-weight":800,fill:"#fff",text:n},g); el("text",{x:190,y:y+68,"font-size":34,"font-weight":800,fill:c,text:t},g); const tx=el("text",{x:190,y:y+112,"font-size":27,fill:C.ink},g); a.wrap(tx,d,44,1.25); return g; });
    R.synP=a.layer("synp"); R.ph3=a.photo(R.synP,{id:"s-c1-nuages",x:1010,y:84,w:440,h:260,cap:"Nuages (gouttelettes d'eau)",rot:1.5}); R.ph4=a.photo(R.synP,{id:"s-c1-lac-kir",x:1010,y:460,w:440,h:260,cap:"Le lac Kir, à Dijon",rot:-1.5});
    el("text",{x:800,y:58,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink,text:"À retenir"},sy);
    reset0();
  },
  reset(a){ reset0(); },
  after(a,k,t){ const s=a.seg, clk=k+t; Z.clk=clk;
    const Zc=Z, lerp=a.lerp;
    // paysage
    a.op(R.land,1); a.tr(R.sun,1130,92); R.rays.forEach((r,i)=>r.setAttribute("transform",`rotate(${i*30+clk*40})`));
    R.waves.setAttribute("d",[...Array(10)].map((_,i)=>{ const x=1080+i*52+Math.sin(clk*3+i)*8, y=640+(i%3)*50+((i*37)%20); return `M${x},${y} q10,-10 20,0 t20,0`; }).join(" "));
    // vapeur
    R.vap.forEach((c,i)=>{ const p=((clk*1.3+c._o)%1+1)%1; let x,y; const tx=380+rnd(i,3)*110; if(p<.38){ const u=p/.38; x=c._x-(c._x-lerp(c._x,tx+400,.25))*u*.3; y=lerp(c._y,260,u); } else { const u=(p-.38)/.62; const x0=c._x-(c._x-lerp(c._x,tx+400,.25))*.3; x=lerp(x0,tx,u); y=lerp(260,185+rnd(i,4)*40,u); }
      const al=Z.vap*Math.sin(Math.PI*Math.min(1,p*1.05))*(i>=24&&false?0:1); x+=Math.sin(clk*6+i)*5; a.set(c,{cx:x,cy:y}); a.op(c,al); });
    // nuage
    const cs=Z.cloud; a.tr(R.cloud,360,140,.35+.65*cs); a.op(R.cloud,cs>0?Math.min(1,cs*2):0); a.tr(R.cloudD,360,140,.35+.65*cs); a.op(R.cloudD,Z.dark*Math.min(1,cs*2)*.9);
    // pluie / neige
    R.rain.forEach((d,i)=>{ const x=300+rnd(i,1)*260, sy=surfY(x), p=((clk*2.2+rnd(i,2))%1+1)%1, y=lerp(190,sy-6,p); a.set(d,{transform:`translate(${x},${y})`}); a.op(d,Z.rain*(p<.95?1:0)); });
    R.snowf.forEach((d,i)=>{ const x=150+rnd(i,1)*170, sy=surfY(x), p=((clk*1.0+rnd(i,2))%1+1)%1, y=lerp(180,sy-8,p); a.set(d,{cx:x+Math.sin(clk*5+i)*10,cy:y}); a.op(d,Z.snowfall*(p<.97?1:0)); });
    const sc=Z.snow, pts=[]; for(let x=150;x<=350;x+=10){ const w=Math.sin(Math.PI*(x-150)/200); pts.push([x,surfY(x)-9-26*w*sc]); } const back=[]; for(let x=350;x>=150;x-=10) back.push([x,surfY(x)-5]);
    R.snowcap.setAttribute("d",sc>0.01?"M"+pts.concat(back).map(p=>p.join(",")).join(" L")+"Z":""); a.op(R.snowcap,sc>.01?1:0);
    // ruissellement
    a.draw(R.run,Z.run); a.op(R.run,Z.run>0?1:0);
    R.inf.forEach((c,i)=>{ const x=400+rnd(i,1)*130, y0=surfY(x)+14, p=((clk*1.2+rnd(i,2))%1+1)%1; a.set(c,{cx:x+Math.sin(clk*4+i)*6,cy:lerp(y0,764+rnd(i,3)*40,p)}); a.op(c,Z.infil*Math.sin(Math.PI*p)); });
    R.nf.forEach((c,i)=>{ const p=((clk*.7+i/16)%1+1)%1; a.set(c,{cx:lerp(380,1060,p),cy:785+Math.sin(i*2)*12}); a.op(c,Z.nap*.9*Math.sin(Math.PI*Math.min(1,p*1.1))); });
    R.nappe.setAttribute("fill",Z.nap>0?"#8EC4EC":"#7FB8E6"); a.op(R.flow,Z.riv); R.flow.style.strokeDashoffset=-(clk*90)%38;
    Object.keys(Z.chip).forEach(k=>a.op(R["ch_"+k],Z.chip[k])); a.op(R.geo,Z.chip.geo); a.op(R.restart,Z.restart);
    // goutte (paysage)
    { const mp=Math.max(0,Math.min(WP.length-1,Z.mp)), i=Math.min(WP.length-2,Math.floor(mp)), u=mp-i; const e=a.ease(u); let x=lerp(WP[i][0],WP[i+1][0],e), y=lerp(WP[i][1],WP[i+1][1],e);
      if(i===1) y=lerp(WP[1][1],WP[2][1],e)-Math.sin(Math.PI*u)*40; x+=Math.sin(clk*7)*3; if(i===4){ const sx=lerp(WP[4][0],WP[5][0],u); x=sx; y=surfY(sx)-30; }
      let gas=(mp>.12&&mp<2.9), ice=false; if(Z.mOver){ x=Z.mOver.x+Math.sin(clk*7)*3; y=Z.mOver.y||surfY(Z.mOver.x)-62; gas=!!Z.mOver.gas; ice=!!Z.mOver.ice; }
      R.m.st(gas,ice); a.tr(R.m,x,y,1.15); a.op(R.m,Z.mAlpha); a.set(R.mT,{x:x-32,y:y-30,"text-anchor":"end"}); a.op(R.mT,Z.mAlpha); }
    // loupe
    a.op(R.lp,Z.loupe); R.ltitleT.textContent=Z.ltitle; R.lt1.textContent=Z.lt1;
    const m1=Z.mode===1, ev=Z.ev;
    a.op(R.surfL,m1?1:0); a.op(R.cold,m1?0:1); R.cold.setAttribute("fill",Z.me>0?"#B9CBE6":"#C7D9F0");
    R.lq.forEach((q,i)=>{ const c=q.c; if(q===R.mq||!m1){ a.op(c,0); return; } let x=q.x+Math.sin(clk*9+i)*4, y=q.y+Math.cos(clk*8+i*2)*4, gas=false; if(q.esc&&ev>q.ti){ const w=ev-q.ti; y=q.y-w*q.sp; x=q.x+Math.sin(w*14+i)*18+(rnd(i,11)-.5)*130*w; gas=y<LC.y+12; }
      a.set(c,{cx:x,cy:y,fill:gas?"#fff":"#7FB8E6",stroke:gas?C.bl:"#2F6FB5","stroke-dasharray":gas?"4 3":null,"fill-opacity":gas?.55:1}); a.op(c,1); });
    { const q=R.mq; let x=q.x+Math.sin(clk*9)*4, y=q.y+Math.cos(clk*8)*4, gas=false; if(ev>q.ti){ const w=ev-q.ti; y=q.y-w*q.sp; x=q.x+Math.sin(w*14)*14; gas=y<LC.y+12; } R.lmPos=[x,y,gas]; }
    R.co.forEach((p,i)=>{ const c=p.c; if(m1){ a.op(c,0); return; } a.op(c,1); const g=Z.co, me=Z.me, fa=Z.fa; const gxx=LC.x-165+(1-Math.abs(1-((((p.gx-LC.x+165)/330+p.vx*clk*.35)%2)+2)%2))*330, gyy=LC.y-150+(1-Math.abs(1-((((p.gy-LC.y+150)/300+p.vy*clk*.35)%2)+2)%2))*300;
      let x=lerp(gxx,p.dx+Math.sin(clk*9+i)*3,a.ease(g)), y=lerp(gyy,p.dy+Math.cos(clk*8+i)*3,a.ease(g)); x=lerp(x,p.bx,a.ease(me)); y=lerp(y,p.by,a.ease(me)); y+=fa*430; a.set(c,{cx:x,cy:y,fill:g>.6?"#7FB8E6":"#fff","fill-opacity":g>.6?1:.55,stroke:g>.6?"#2F6FB5":C.bl,"stroke-dasharray":g>.6?null:"4 3"}); if(i===0) R.lmPos=[x,y,g<.6]; });
    R.dr.forEach((c,i)=>{ const p0=R.co[i*6], o=pack(0,19), dcx=p0.dx-o.x, dcy=p0.dy-o.y, e=a.ease(Z.me); const rad=(19*Math.sqrt(6)+12)*Math.min(1,Math.max(0,(Z.co-.55)*4))*Math.max(0,1-Z.me*2);
      a.set(c,{cx:lerp(dcx,LC.x,e),cy:lerp(dcy,LC.y-10,e),r:rad}); a.op(c,m1?0:1); });
    a.set(R.big,{cx:LC.x,cy:LC.y-10+Z.fa*430,r:(Z.me>.5&&!m1)?(19*6+14)*Math.min(1,(Z.me-.5)*2):0}); a.op(R.big,m1?0:1);
    const lm=R.lmPos||[LC.x,LC.y,false]; a.tr(R.lm,lm[0],lm[1],1.1); R.lm.st(lm[2]); a.op(R.lm,Z.loupe>0?1:0);
    const lnk=Z.mode===1?[1210,610]:[450,200]; a.set(R.link,{x1:LC.x+(lnk[0]>LC.x?1:-1)*LC.r*.7,y1:LC.y+LC.r*.7*(lnk[1]>LC.y?1:-1)*(lnk[1]>400?1:.2),x2:lnk[0],y2:lnk[1]}); a.op(R.link,Z.loupe);
    // photos
    a.op(R.ph1,Z.ph1); a.op(R.ph2,Z.ph2);
    // panneau de la manipulation
    a.op(R.mp,Z.mpanel); if(Z.mOver){ const q=Z.mOver.q; R.mpT1.textContent=""; a.wrap(R.mpT1,q.t1,30,1.15); R.mpEt.textContent="État : "+q.etat; R.mpEt.setAttribute("fill",q.col); R.mpT2.textContent=""; a.wrap(R.mpT2,q.t2,36,1.2); R.mpH.textContent=Z.mHint?"À vous : choisissez un lieu":""; }
    // bocal fermé
    a.op(R.over,Z.over); a.op(R.J,Z.jar); const jev=Z.jev; const lv=jev*34*(1-.85*Z.jfall); a.set(R.jWater,{y:500+lv,height:136-lv}); R.jP.forEach((g,i)=>a.op(g,Z.jp[i])); a.set(R.jLine,{}); R.jBal.textContent="450 g";
    R.jv.forEach((c,i)=>{ a.set(c,{cx:250+rnd(i,1)*260+Math.sin(clk*5+i)*10,cy:300+rnd(i,2)*180+Math.cos(clk*4+i)*8}); a.op(c,jev>.15?Math.min(1,jev*1.5)*(1-Z.jcon*.45):0); });
    R.jd.forEach((c,i)=>{ const x=240+rnd(i,3)*280, top=292+rnd(i,4)*18; const f=Z.jfall; const y=top+f*(560-top-rnd(i,5)*50); a.set(c,{cx:x,cy:y,r:Z.jcon*(7+rnd(i,6)*5)}); a.op(c,Z.jcon>0?(1-Math.max(0,(f-.8)/.2)):0); });
    a.op(R.mythL,Z.myth); a.op(R.syn,Z.synG); R.synC.forEach((g,i)=>a.op(g,Z.syn[i])); a.op(R.synP,Z.synG); a.op(R.ph3,Z.synG*Z.ph1b); a.op(R.ph4,Z.synG*Z.ph1b);
  },
  etapes:[
  { titre:"Évaporation", duree:9500,
    legende:"Le Soleil réchauffe la mer, les rivières et les lacs. En surface, des particules d'eau s'échappent dans l'air : c'est l'évaporation. La vapeur d'eau est un gaz invisible.",
    voix:"Le Soleil réchauffe la mer, les rivières et les lacs. Zoomons sur la surface de l'eau avec notre loupe. Suivons une particule d'eau que nous appelons Goutte. Chauffée par le Soleil, elle s'échappe dans l'air : c'est l'évaporation. L'eau est devenue un gaz, la vapeur d'eau. On ne la voit pas, mais elle est bien là.",
    anim(t,a){ const s=a.seg; Z.vap=s(t,0,.3); Z.mAlpha=s(t,0,.12); Z.mp=1*s(t,.15,1); Z.loupe=s(t,0,.12); Z.mode=1; Z.ev=s(t,.08,1,true); Z.chip.ev=s(t,.2,.3);
      Z.ltitle="Zoom sur la surface de la mer"; Z.lt1=t<.4?"eau liquide : particules serrées":"vapeur d'eau : gaz invisible (en pointillés)"; } },
  { titre:"Condensation", duree:9500,
    legende:"En altitude, l'air est froid. La vapeur d'eau se refroidit : ses particules se rassemblent en minuscules gouttes d'eau liquide. Des milliards de gouttelettes forment un nuage.",
    voix:"La vapeur monte, emportée par le vent, jusqu'au-dessus des collines de Côte-d'Or. En altitude, l'air est froid. La vapeur se refroidit : ses particules se rapprochent et se regroupent en minuscules gouttes d'eau liquide. C'est la condensation. Des milliards de gouttelettes forment un nuage. Un nuage n'est pas de la fumée : c'est de l'eau.",
    anim(t,a){ const s=a.seg; Z.vap=1-.7*s(t,.5,1); Z.mAlpha=1; Z.mp=1+2*s(t,.1,.9); Z.loupe=1; Z.mode=t<.04?1:2; Z.ev=1; Z.co=s(t,.15,.85); Z.cloud=s(t,.25,1); Z.chip.ev=1; Z.chip.co=s(t,.3,.4);
      Z.ltitle="Zoom dans l'air froid, en altitude"; Z.lt1=t<.5?"l'air froid ralentit les particules":"elles forment des gouttelettes liquides"; } },
  { titre:"Précipitations", duree:9500,
    legende:"Les gouttelettes se rassemblent et grossissent. Devenues trop lourdes, elles tombent : pluie, ou neige quand il fait très froid, comme sur les hauteurs de Côte-d'Or en hiver.",
    voix:"Les gouttelettes se rassemblent et grossissent. Quand elles sont trop lourdes, elles tombent : ce sont les précipitations. Il pleut sur les collines de Côte-d'Or. Quand il fait très froid, l'eau gèle en cristaux de glace et il neige sur les hauteurs.",
    anim(t,a){ const s=a.seg; Z.vap=.3*(1-s(t,0,.4)); Z.mAlpha=1; Z.mp=3+s(t,.45,1); Z.mode=2; Z.ev=1; Z.co=1; Z.me=s(t,.05,.45); Z.fa=s(t,.5,.95); Z.loupe=1-s(t,.9,1); Z.cloud=1; Z.dark=s(t,0,.4); Z.rain=s(t,.45,.6); Z.snowfall=s(t,.45,.6); Z.snow=s(t,.55,1);
      Z.chip.ev=1; Z.chip.co=1; Z.chip.pr=s(t,.4,.5); Z.ph1=s(t,.1,.3); Z.ltitle="Zoom dans le nuage"; Z.lt1=t<.4?"les gouttelettes se rassemblent":"la goutte, trop lourde, tombe"; } },
  { titre:"Ruissellement et infiltration", duree:10000,
    legende:"L'eau de pluie ruisselle sur le sol vers les rivières. Une partie s'infiltre dans la terre jusqu'à la nappe d'eau souterraine. La neige, en fondant, alimente aussi les ruisseaux.",
    voix:"L'eau de pluie ruisselle sur la pente, vers les ruisseaux et les rivières. Une autre partie s'infiltre dans le sol, entre les grains de terre, jusqu'à la nappe d'eau souterraine. Au printemps, la neige fond et alimente aussi les ruisseaux.",
    anim(t,a){ const s=a.seg; Z.vap=0; Z.cloud=1; Z.dark=1; Z.mAlpha=1; Z.mp=4+s(t,.1,.8); Z.loupe=1-s(t,0,.12); Z.mode=2; Z.ev=1; Z.co=1; Z.me=1; Z.fa=1; Z.rain=1-s(t,.55,.9); Z.snowfall=1-s(t,.1,.4); Z.snow=1-.7*s(t,.3,1); Z.run=s(t,.1,.7); Z.infil=s(t,.3,.5); Z.chip.ev=1; Z.chip.co=1; Z.chip.pr=1; Z.chip.ru=s(t,.15,.25); Z.chip.inf=s(t,.35,.45); Z.chip.geo=s(t,0,.2);
      Z.cloud=1-.6*s(t,.6,1); Z.ph1=1-s(t,0,.15); Z.ph2=s(t,.2,.4); } },
  { titre:"Retour à la mer", duree:9000,
    legende:"Les ruisseaux, l'Ouche, la Saône puis le Rhône ramènent l'eau à la mer. La nappe coule aussi, très lentement, vers la mer. Le cycle peut recommencer : c'est toujours la même eau.",
    voix:"Les ruisseaux se jettent dans l'Ouche, la rivière de Dijon. L'Ouche rejoint la Saône, qui rejoint le Rhône, et le Rhône se jette dans la mer Méditerranée. L'eau de la nappe coule aussi, très lentement, vers la mer. Et le Soleil réchauffe de nouveau la mer : le cycle recommence. C'est toujours la même eau qui voyage.",
    anim(t,a){ const s=a.seg; Z.vap=s(t,.55,.9); Z.mAlpha=1; Z.mp=5+2*s(t,.1,.85); Z.loupe=0; Z.mode=2; Z.ev=1; Z.co=1; Z.me=1; Z.fa=1; Z.rain=0; Z.snowfall=0; Z.snow=.3; Z.cloud=.4*(1-s(t,.3,.8)); Z.dark=1; Z.run=1; Z.infil=1-s(t,.2,.5); Z.nap=s(t,0,.3); Z.riv=s(t,0,.2); Z.chip.ev=s(t,.7,.8); Z.chip.co=0; Z.chip.pr=0; Z.chip.ru=1; Z.chip.inf=1; Z.chip.geo=1; Z.restart=s(t,.7,.85); Z.ph2=0; } },
  { titre:"À vous : suivez la goutte", duree:11000,
    legende:"Voici le cycle complet. À vous : cliquez sur un lieu (mer, air, nuage, pluie, neige, rivière, nappe) pour y placer la goutte, ou sur « et ensuite » : regardez son état et ce qui va lui arriver.",
    voix:"Voici le cycle complet. Regardez notre goutte voyager : la mer, l'air, le nuage, la pluie, la neige, la rivière et la nappe souterraine. À chaque endroit, elle est liquide, gazeuse ou solide. À vous maintenant : cliquez sur un lieu pour y placer la goutte, ou sur le bouton et ensuite. Regardez son état et ce qui va lui arriver. Prenez votre temps.",
    anim(t,a){ const s=a.seg; if(t<.02){ manipActive=false; place=0; }
      let p; if(manipActive) p=place; else p=t>=.9?0:Math.min(PL.length-1,Math.floor(Math.max(0,t-.03)/.87*PL.length)); lastPlace=p; const q=PL[p];
      Z.mAlpha=1; Z.loupe=0; Z.mode=2; Z.ev=1; Z.co=1; Z.me=1; Z.fa=1; Z.run=1; Z.nap=1; Z.riv=1; Z.infil=p===3?1:0; Z.chip.ev=0; Z.chip.co=0; Z.chip.pr=0; Z.chip.ru=1; Z.chip.inf=1; Z.chip.geo=1;
      Z.cloud=(p===2||p===3||p===4)?1:.35; Z.dark=(p===3||p===4)?1:.3; Z.rain=p===3?1:0; Z.snowfall=p===4?1:0; Z.snow=(p===4||p===5)?1:.5; Z.vap=(p===0||p===1)?.8:.15; Z.ph1=Z.ph2=0; Z.restart=0;
      Z.mOver={x:q.x,y:q.y,gas:q.gas,ice:q.ice,q}; Z.mpanel=s(t,0,.06); Z.mHint=(!manipActive&&t>.9)?1:0;
      if(a.manip) a.manip.querySelectorAll("button").forEach(b=>b.classList.toggle("sel",manipActive&&+b.dataset.p===place)); } },
  { titre:"L'eau ne disparaît pas", duree:11000,
    legende:"Dans un bocal fermé, l'eau s'évapore puis se condense sur les parois et retombe : la balance indique toujours la même masse. L'eau a changé d'état, elle n'a pas disparu.",
    voix:"Vérifions avec un bocal fermé posé sur une balance. Au soleil, l'eau s'évapore : le niveau baisse. Mais la vapeur se condense sur le couvercle, et les gouttes retombent. La balance indique toujours la même masse. L'eau n'a pas disparu : elle a seulement changé d'état. Attention, c'est une idée fausse de croire que l'eau qui s'évapore disparaît, et que les nuages sont de la fumée.",
    anim(t,a){ const s=a.seg; Z.mOver=null; Z.mpanel=0; Z.snow=.3; Z.rain=0; Z.snowfall=0; Z.over=s(t,0,.12); Z.jar=s(t,.05,.2); Z.jev=s(t,.15,.55); Z.jcon=s(t,.35,.65); Z.jfall=s(t,.6,.95); Z.jp=[s(t,.2,.3),s(t,.4,.5),s(t,.65,.75)]; Z.myth=s(t,.8,.92); Z.restart=0; Z.mAlpha=0; Z.loupe=0; Z.vap=0; Z.chip.ev=Z.chip.ru=Z.chip.inf=Z.chip.geo=1; } },
  { titre:"À retenir", duree:9000,
    legende:"L'eau change d'état (liquide, gaz, solide), elle circule, et il y en a toujours autant : rien ne disparaît.",
    voix:"À retenir. Un : l'eau change d'état, elle peut être liquide, gazeuse ou solide. Deux : elle circule, de la mer aux nuages, puis à la pluie, aux rivières et aux nappes. Trois : il y en a toujours autant. Rien ne disparaît, l'eau change seulement d'état et de place.",
    anim(t,a){ const s=a.seg; Z.over=1; Z.jar=1-s(t,0,.2); Z.jev=1; Z.jcon=1; Z.jfall=1; Z.jp=[1,1,1]; Z.myth=1-s(t,0,.2); Z.synG=s(t,.05,.2); Z.syn=[s(t,.15,.35),s(t,.4,.6),s(t,.65,.85)]; Z.ph1b=s(t,.3,.5); Z.mAlpha=0; Z.loupe=0; Z.vap=0; } }
  ]
});
})();
