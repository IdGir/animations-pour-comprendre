/* META {"id":"sciences-C2-etats-de-la-matiere","matiere":"sciences","annee":"B","periode":1,"theme":"Matière, mélanges, eau : les états de la matière et leurs changements","resume":"Solide, liquide, gaz : l'eau change d'état à 0 °C (fusion) et à 100 °C (ébullition), la température fait un palier ; un gaz comme l'air est de la matière qui a une masse.","motsCles":["état de la matière","solide","liquide","gaz","particules","fusion","ébullition","palier","vapeur d'eau","masse de l'air"]} */
(function(){
const C={ink:"#1E2430",or:"#E07A1F",bl:"#2563A8",gr:"#2E8B57",red:"#C0392B",SOL:"#1E7C8C",LIQ:"#2563A8",GAZ:"#7A3FA0",ice:"#D8F1FB",water:"#BFE0F7"};
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
const tri=v=>1-Math.abs(1-(((v%2)+2)%2));
const MANIP=4;
let R={}, manipActive=false, Tm=20, lastT=20, RT=0;
// ---- courbe de chauffage : u (0..1) -> température, fraction fondue f, fraction vaporisée v
// A (-20 -> 0) · B palier 0 °C (fusion) · C (0 -> 100) · D palier 100 °C (ébullition) · E (100 -> 120, tout est vapeur)
function uState(u){ if(u<.1) return {T:-20+20*u/.1,f:0,v:0,ph:"A"}; if(u<.25) return {T:0,f:(u-.1)/.15,v:0,ph:"B"}; if(u<.55) return {T:100*(u-.25)/.3,f:1,v:0,ph:"C"}; if(u<.9) return {T:100,f:1,v:(u-.55)/.35,ph:"D"}; return {T:100+20*(u-.9)/.1,f:1,v:1,ph:"E"}; }
function tToU(T){ if(T<0) return (T+20)/20*.1; if(T===0) return .175; if(T<100) return .25+T/100*.3; if(T===100) return .725; return .9+(T-100)/20*.1; }
const GX0=1250, GW=300, yG=T=>600-(T+20)/140*370, yTh=T=>740-(T+20)/140*380;
const CX=300, BOT=760, ZC={x:900,y:400,r:226};
// grille hexagonale de particules (zoom)
const GRID=[]; for(let r=-4;r<=4;r++) for(let c=-5;c<=5;c++){ const x=ZC.x+c*52+(r%2?26:0), y=ZC.y+r*45; if(Math.hypot(x-ZC.x,y-ZC.y)<ZC.r-26) GRID.push({x,y}); }
const minus=v=>String(Math.round(v)).replace("-","−");

function jar(a,p,cx,bot,w,h){ const g=a.el("g",{},p); g.in=a.el("g",{},g); a.el("path",{d:`M${cx-w/2},${bot-h} L${cx-w/2},${bot} L${cx+w/2},${bot} L${cx+w/2},${bot-h}`,fill:"none",stroke:"#7E9BB3","stroke-width":6,"stroke-linejoin":"round"},g); a.el("rect",{x:cx-w/2-8,y:bot-h-16,width:w+16,height:16,rx:6,fill:"#8C96A6",stroke:"#5A6475","stroke-width":2},g); g.cx=cx; g.bot=bot; g.w=w; g.h=h; return g; }

Anim.run({
  titre:"Les états de la matière",
  sousTitre:"Sciences et technologie · CM1-CM2 · Matière, mélanges, eau",
  matiere:"sciences", badge:"Sciences",
  accroche:"Pourquoi la glace fond-elle, et pourquoi l'air, qu'on ne voit pas, pèse-t-il quelque chose ?",
  manipDes:MANIP, manipJusqua:MANIP,
  init(a){
    const {el}=a, svg=a.svg;
    const defs=el("defs",{},svg); const cp=el("clipPath",{id:"c2z"},defs); el("circle",{cx:ZC.x,cy:ZC.y,r:ZC.r-4},cp);
    R.title=el("text",{x:800,y:70,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink},svg);
    // ===== 1. trois états, même eau, autre récipient =====
    const s1=a.layer("s1"); R.s1=s1; const ST=[["SOLIDE","la glace",C.SOL],["LIQUIDE","l'eau",C.LIQ],["GAZ","la vapeur d'eau",C.GAZ]];
    R.p1=ST.map(([n,sub,c],k)=>{ const g=el("g",{},s1), x0=30+k*440;
      el("rect",{x:x0,y:105,width:420,height:660,rx:18,fill:c,"fill-opacity":.07,stroke:c,"stroke-width":4},g);
      el("text",{x:x0+210,y:162,"text-anchor":"middle","font-size":40,"font-weight":800,fill:c,text:n},g); el("text",{x:x0+210,y:200,"text-anchor":"middle","font-size":26,fill:C.ink,text:sub+" (invisible)".slice(0,k===2?20:0)},g);
      g.A=jar(a,g,x0+110,560,130,300); g.B=jar(a,g,x0+310,560,190,190);
      el("text",{x:x0+210,y:610,"text-anchor":"middle","font-size":24,"font-weight":700,fill:"#4A5468",text:"même contenu, autre récipient"},g);
      g.fill=[]; // contenus
      if(k===0){ g.cube=el("rect",{width:90,height:90,rx:6,fill:C.ice,stroke:c,"stroke-width":4},g); }
      if(k===1){ g.la=el("rect",{fill:C.water},g.A.in); g.lb=el("rect",{fill:C.water},g.B.in); g.sa=el("line",{stroke:C.bl,"stroke-width":4},g.A.in); g.sb=el("line",{stroke:C.bl,"stroke-width":4},g.B.in); }
      if(k===2){ g.ga=el("g",{},g.A.in); g.gb=el("g",{},g.B.in); [[g.ga,g.A],[g.gb,g.B]].forEach(([gg,J])=>{ el("rect",{x:J.cx-J.w/2,y:J.bot-J.h,width:J.w,height:J.h,fill:c,"fill-opacity":.16},gg); for(let i=0;i<14;i++) el("circle",{cx:J.cx-J.w/2+14+rnd(i,1)*(J.w-28),cy:J.bot-J.h+14+rnd(i,2)*(J.h-28),r:8,fill:"#fff","fill-opacity":.7,stroke:c,"stroke-width":2,"stroke-dasharray":"4 3"},gg); }); }
      g.arr=a.arrow(g,`M${x0+190},470 Q${x0+210},430 ${x0+232},470`,{color:"#9AA3B2",w:5,head:3});
      const txt=[["il garde sa forme","le cube reste un cube"],["il prend la forme du récipient","surface plate (horizontale)"],["il occupe tout le récipient","il remplit tout l'espace disponible"]][k];
      g.t1=el("text",{x:x0+210,y:665,"text-anchor":"middle","font-size":28,"font-weight":800,fill:c,text:txt[0]},g); g.t2=el("text",{x:x0+210,y:710,"text-anchor":"middle","font-size":24,fill:C.ink,text:txt[1]},g); return g; });
    R.s1b=el("g",{},s1); a.label(R.s1b,700,830,"Toujours la même eau, sous trois états différents.",{size:30,w:900,stroke:C.or,color:"#8A4A0E",sw:3});
    R.ph1=a.photo(s1,{id:"s-c2-glacon",x:1385,y:120,w:180,h:120,cap:"En vrai : des glaçons",size:20,rot:1.5}); R.ph1b=a.photo(s1,{id:"s-c2-ebullition",x:1385,y:430,w:180,h:120,cap:"Eau qui bout",size:20,rot:-1.5});
    // ===== 2. particules =====
    const s2=a.layer("s2"); R.s2=s2; R.p2=ST.map(([n,sub,c],k)=>{ const g=el("g",{},s2), x0=30+k*440;
      el("rect",{x:x0,y:105,width:420,height:660,rx:18,fill:c,"fill-opacity":.07,stroke:c,"stroke-width":4},g); el("text",{x:x0+210,y:160,"text-anchor":"middle","font-size":40,"font-weight":800,fill:c,text:n},g);
      el("rect",{x:x0+30,y:185,width:360,height:340,rx:10,fill:"#fff",stroke:c,"stroke-width":3},g);
      const N=k===2?9:25; g.ps=[...Array(N)].map((_,i)=>{ const col=i%5,row=Math.floor(i/5); const hx=x0+80+col*66+(row%2?33:0)-(k===1?0:0), hy=240+row*62; return {c:el("circle",{r:k===2?15:19,fill:k===2?"#fff":(k===0?"#9CC6EA":"#7FB8E6"),stroke:k===2?c:C.bl,"stroke-width":3,"stroke-dasharray":k===2?"5 3":null},g),hx,hy,i}; });
      const tx=[["serrées et rangées","elles vibrent sur place"],["serrées mais désordonnées","elles glissent les unes sur les autres"],["très éloignées","elles filent dans tous les sens"]][k];
      g.t1=el("text",{x:x0+210,y:575,"text-anchor":"middle","font-size":28,"font-weight":800,fill:c,text:tx[0]},g); g.t2=el("text",{x:x0+210,y:620,"text-anchor":"middle","font-size":24,fill:C.ink},g); a.wrap(g.t2,tx[1],26,1.2); return g; });
    R.s2b=el("g",{},s2); a.label(R.s2b,800,830,"Ce sont les mêmes particules d'eau : seuls leur rangement et leur agitation changent.",{size:28,w:1300,stroke:C.or,color:"#8A4A0E",sw:3});
    // ===== 3-4-5. laboratoire : chauffer l'eau =====
    const s3=a.layer("s3"); R.s3=s3;
    // bécher
    R.bech=el("g",{},s3); R.wat=el("rect",{x:CX-146,width:292,fill:"#9CCBEF"},R.bech); R.ice=el("g",{},R.bech); R.iceR=el("rect",{x:CX-90,width:180,rx:8,fill:C.ice,stroke:C.SOL,"stroke-width":4},R.ice); [[-50,.3],[10,.6],[40,.2]].forEach(([dx,fy])=>el("line",{x1:CX+dx,y1:0,x2:CX+dx+20,y2:0,stroke:"#fff","stroke-width":6,"stroke-linecap":"round",class:"hl"},R.ice));
    R.gasT=el("rect",{x:CX-146,y:BOT-400,width:292,height:400,fill:C.GAZ,"fill-opacity":.14},R.bech); R.gasD=[...Array(16)].map(()=>el("circle",{r:10,fill:"#fff","fill-opacity":.7,stroke:C.GAZ,"stroke-width":2.5,"stroke-dasharray":"4 3"},R.bech));
    R.bub=[...Array(14)].map(()=>el("circle",{r:9,fill:"#fff","fill-opacity":.8,stroke:C.bl,"stroke-width":2.5},R.bech));
    el("path",{d:`M${CX-158},${BOT-400} L${CX-150},${BOT} L${CX+150},${BOT} L${CX+158},${BOT-400}`,fill:"none",stroke:"#7E9BB3","stroke-width":6,"stroke-linejoin":"round"},R.bech);
    R.steam=[...Array(12)].map(()=>el("circle",{r:13,fill:"#fff","fill-opacity":.6,stroke:C.GAZ,"stroke-width":2.5,"stroke-dasharray":"4 3"},s3)); R.steamT=a.label(s3,400,205,"vapeur d'eau\n(gaz invisible)",{size:24,w:230,stroke:C.GAZ,color:C.GAZ,sw:3});
    el("rect",{x:CX-110,y:808,width:220,height:28,rx:8,fill:"#5A6475"},s3); R.fl=el("g",{},s3); [-70,-35,0,35,70].forEach((dx,i)=>el("path",{d:`M${CX+dx},806 q-18,-26 0,-52 q18,22 0,52Z`,fill:i%2?"#F2A53B":"#E8622C"},R.fl));
    // thermomètre
    R.th=el("g",{},s3); el("rect",{x:488,y:345,width:24,height:412,rx:12,fill:"#fff",stroke:"#5A6475","stroke-width":4},R.th); R.thM=el("rect",{x:494,width:12,fill:C.red},R.th); el("circle",{cx:500,cy:772,r:26,fill:C.red,stroke:"#5A6475","stroke-width":4},R.th);
    for(let T=-20;T<=120;T+=20){ const y=yTh(T); el("line",{x1:512,y1:y,x2:(T===0||T===100)?528:522,y2:y,stroke:C.ink,"stroke-width":(T===0||T===100)?4:2},R.th); el("text",{x:532,y:y+8,"font-size":(T===0||T===100)?26:22,"font-weight":(T===0||T===100)?800:500,fill:(T===0||T===100)?C.red:"#4A5468",text:minus(T)},R.th); }
    R.thV=el("text",{x:500,y:318,"text-anchor":"middle","font-size":42,"font-weight":800,fill:C.red},R.th);
    // zoom particules
    R.zm=el("g",{},s3); el("circle",{cx:ZC.x,cy:ZC.y,r:ZC.r,fill:"#F4FAFE",stroke:"#5A6478","stroke-width":6},R.zm); const zin=el("g",{"clip-path":"url(#c2z)"},R.zm);
    R.zp=GRID.map((p,i)=>el("circle",{r:17,"stroke-width":3},zin)); R.zT=el("text",{x:ZC.x,y:ZC.y-ZC.r-24,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"Zoom : les particules d'eau"},R.zm);
    R.zl=el("g",{},R.zm); [["#9CC6EA",C.bl,"solide",720],["#7FB8E6",C.bl,"liquide",880],["#fff",C.GAZ,"gaz",1040]].forEach(([f,s,t,x])=>{ el("circle",{cx:x,cy:684,r:13,fill:f,stroke:s,"stroke-width":3,"stroke-dasharray":t==="gaz"?"4 3":null},R.zl); el("text",{x:x+22,y:693,"font-size":24,fill:C.ink,text:t},R.zl); });
    // courbe de chauffage
    R.gr=el("g",{},s3); el("rect",{x:1170,y:170,width:410,height:510,rx:16,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.gr); el("text",{x:1375,y:210,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"Courbe de chauffage"},R.gr);
    el("line",{x1:GX0,y1:600,x2:GX0+GW+10,y2:600,stroke:C.ink,"stroke-width":3},R.gr); el("line",{x1:GX0,y1:600,x2:GX0,y2:235,stroke:C.ink,"stroke-width":3},R.gr);
    [0,100].forEach(T=>{ el("line",{x1:GX0,y1:yG(T),x2:GX0+GW,y2:yG(T),stroke:"#9AA3B2","stroke-width":2,"stroke-dasharray":"7 6"},R.gr); el("text",{x:GX0-10,y:yG(T)+8,"text-anchor":"end","font-size":24,"font-weight":800,fill:C.red,text:String(T)},R.gr); });
    el("text",{x:1400,y:640,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"temps de chauffage (exemple)"},R.gr); const yl=el("text",{x:1200,y:420,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"température (°C)",transform:"rotate(-90 1200 420)"},R.gr);
    R.curve=el("path",{fill:"none",stroke:C.or,"stroke-width":6,"stroke-linejoin":"round","stroke-linecap":"round"},R.gr); R.dot=el("circle",{r:11,fill:C.or,stroke:"#fff","stroke-width":3},R.gr);
    R.gF=el("text",{x:1340,y:577,"text-anchor":"middle","font-size":24,"font-weight":800,fill:C.SOL,text:"fusion"},R.gr); R.gE=el("text",{x:GX0+.725*GW,y:yG(100)-14,"text-anchor":"middle","font-size":24,"font-weight":800,fill:C.GAZ,text:"ébullition"},R.gr);
    // bandeau d'état
    R.band=el("g",{},s3); R.bandR=el("rect",{x:640,y:722,width:930,height:140,rx:16,fill:"#fff",stroke:C.ink,"stroke-width":4},R.band); R.b1=el("text",{x:670,y:777,"font-size":38,"font-weight":800,fill:C.ink},R.band); R.b2=el("text",{x:670,y:826,"font-size":26,fill:C.ink},R.band);
    R.ph3=a.photo(s3,{id:"s-c2-glacon",x:40,y:26,w:190,h:120,cap:"En vrai : de la glace",size:20,rot:-1.5}); R.ph4=a.photo(s3,{id:"s-c2-ebullition",x:40,y:26,w:190,h:120,cap:"En vrai : eau qui bout",size:20,rot:1.5});
    // manipulation : curseur de température
    a.manip.innerHTML=`Température de l'eau : <input type="range" id="c2s" min="-20" max="120" step="1" value="20" aria-label="température de l'eau"> <b id="c2v" style="min-width:90px;text-align:center">20 °C</b> <button data-t="0">0 °C</button> <button data-t="100">100 °C</button>`;
    const sl=a.manip.querySelector("#c2s"); const setT=v=>{ if(!manipActive) manipActive=true; Tm=v; a.redraw(); };
    sl.oninput=()=>setT(+sl.value); a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ sl.value=b.dataset.t; setT(+b.dataset.t); });
    const loop=()=>{ if(a.step()===MANIP){ RT=performance.now()/1000; a.redraw(); } requestAnimationFrame(loop); }; requestAnimationFrame(loop);
    // ===== 6. l'air a une masse =====
    const ar=a.layer("air"); R.ar=ar;
    el("rect",{x:230,y:735,width:440,height:110,rx:16,fill:"#E9EDF2",stroke:"#8C96A6","stroke-width":4},ar); el("rect",{x:260,y:705,width:380,height:30,rx:8,fill:"#C9CFD8",stroke:"#8C96A6","stroke-width":3},ar); el("rect",{x:330,y:755,width:240,height:70,rx:8,fill:"#1E2A20"},ar); R.ad=el("text",{x:552,y:807,"text-anchor":"end","font-size":50,"font-weight":800,fill:"#7CFF8A","font-family":"Consolas,monospace"},ar);
    el("text",{x:450,y:880,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:"masse du ballon (exemple)"},ar);
    R.ball=el("g",{},ar); R.ballC=el("ellipse",{cx:0,cy:0,rx:90,ry:90,fill:"#F2A53B",stroke:C.ink,"stroke-width":5},R.ball); R.ballL=el("g",{},R.ball); el("path",{d:"M-90,0 Q0,-30 90,0",fill:"none",stroke:C.ink,"stroke-width":4},R.ballL); el("path",{d:"M0,-90 Q-35,0 0,90",fill:"none",stroke:C.ink,"stroke-width":4},R.ballL);
    R.tube=el("path",{d:"M190,640 C270,640 280,612 345,612",fill:"none",stroke:"#8C96A6","stroke-width":9,"stroke-linecap":"round"},ar); R.tubeP=R.tube;
    el("rect",{x:110,y:690,width:130,height:20,rx:6,fill:"#5A6475"},ar); el("rect",{x:150,y:560,width:50,height:130,rx:6,fill:"#EAF4FB",stroke:"#5A6475","stroke-width":5},ar); R.hand=el("g",{},ar); el("rect",{x:172,y:-70,width:6,height:70,fill:"#5A6475"},R.hand); el("rect",{x:130,y:-82,width:90,height:16,rx:7,fill:"#E07A1F"},R.hand);
    R.airD=[...Array(12)].map(()=>el("circle",{r:9,fill:"#fff","fill-opacity":.8,stroke:C.GAZ,"stroke-width":2.5,"stroke-dasharray":"4 3"},ar)); R.ballD=[...Array(16)].map(()=>el("circle",{r:8,fill:"#fff","fill-opacity":.75,stroke:C.GAZ,"stroke-width":2.5,"stroke-dasharray":"4 3"},R.ball));
    R.plus=a.label(ar,450,330,"+ 5 g d'air (exemple)",{size:30,w:330,stroke:C.gr,color:C.gr,sw:3});
    R.fact=el("g",{},ar); el("rect",{x:820,y:470,width:730,height:330,rx:18,fill:"#fff",stroke:C.gr,"stroke-width":4},R.fact);
    el("text",{x:850,y:530,"font-size":34,"font-weight":800,fill:C.gr,text:"1 litre d'air pèse environ 1,2 g"},R.fact); el("text",{x:850,y:570,"font-size":24,fill:"#4A5468",text:"(à 20 °C, au niveau de la mer)"},R.fact); R.fx=el("text",{x:850,y:635,"font-size":28,fill:C.ink},R.fact); a.wrap(R.fx,"Exemple : environ 4 litres d'air ajoutés dans le ballon\n4 × 1,2 g ≈ 5 g de plus sur la balance.",44,1.35);
    R.ph5=null; R.my=a.layer("myth"); a.myth(R.my,820,110,730,"« L'air, ce n'est rien : un gaz n'a pas de masse. »","L'air est de la matière : il a une masse et il occupe de la place. On peut le peser !");
    // ===== 7. synthèse =====
    const sy=a.layer("syn"); R.syn=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy); el("text",{x:800,y:150,"text-anchor":"middle","font-size":42,"font-weight":800,fill:C.ink,text:"À retenir : les états de l'eau"},sy);
    const mini=(g,k,cx,cy)=>{ if(k===0){ for(let r=0;r<3;r++) for(let c=0;c<4;c++) el("circle",{cx:cx-60+c*40+(r%2?20:0)-10,cy:cy-45+r*38,r:15,fill:"#9CC6EA",stroke:C.bl,"stroke-width":3},g); } if(k===1){ for(let i=0;i<10;i++) el("circle",{cx:cx-80+rnd(i,1)*160,cy:cy-55+rnd(i,2)*110,r:15,fill:"#7FB8E6",stroke:C.bl,"stroke-width":3},g); } if(k===2){ [[-70,-45],[40,-60],[-20,10],[70,30],[-75,55],[10,60]].forEach(([dx,dy])=>el("circle",{cx:cx+dx,cy:cy+dy,r:14,fill:"#fff",stroke:C.GAZ,"stroke-width":3,"stroke-dasharray":"4 3"},g)); } };
    R.sB=ST.map(([n,sub,c],k)=>{ const g=el("g",{},sy), cx=[230,800,1370][k]; el("rect",{x:cx-130,y:250,width:260,height:300,rx:18,fill:c,"fill-opacity":.08,stroke:c,"stroke-width":4},g); el("text",{x:cx,y:305,"text-anchor":"middle","font-size":36,"font-weight":800,fill:c,text:n},g); mini(g,k,cx,420); el("text",{x:cx,y:525,"text-anchor":"middle","font-size":26,fill:C.ink,text:sub},g); return g; });
    R.sA=[[0,1,"fusion","0 °C",360,1],[1,0,"solidification","",450,0],[1,2,"vaporisation","ébullition à 100 °C",360,1],[2,1,"condensation","",450,0]].map(([f,t,n,sub,y,up])=>{ const g=el("g",{},sy); const xa=[230,800,1370]; const x1=xa[f]+(t>f?138:-138), x2=xa[t]+(t>f?-138:138); const col=up?C.or:C.bl; a.arrow(g,`M${x1},${y} L${x2},${y}`,{color:col,w:7,head:3.5}); a.label(g,(x1+x2)/2,up?y-62:y+62,sub?n+"\n"+sub:n,{size:26,w:(sub?290:250),stroke:col,color:col,sw:3}); return g; });
    R.sP=[["1","Solide, liquide, gaz : trois états d'une même matière."],["2","À 0 °C l'eau fond, à 100 °C elle bout : la température fait un palier."],["3","Un gaz est de la matière : il a une masse et occupe de la place."]].map(([n,t],i)=>{ const g=el("g",{},sy), y=640+i*80; el("circle",{cx:120,cy:y,r:26,fill:[C.bl,C.or,C.gr][i]},g); el("text",{x:120,y:y+11,"text-anchor":"middle","font-size":32,"font-weight":800,fill:"#fff",text:n},g); el("text",{x:170,y:y+10,"font-size":30,"font-weight":700,fill:C.ink,text:t},g); return g; });
  },
  reset(a){ [R.s1,R.s2,R.s3,R.ar,R.my,R.syn,R.s1b,R.s2b,R.ph1,R.ph1b,R.ph3,R.ph4,R.gF,R.gE,R.steamT,R.plus,R.fact].forEach(e=>a.op(e,0)); R.title.textContent=""; },
  etapes:[
  { titre:"Trois états : solide, liquide, gaz", duree:11000,
    legende:"L'eau existe sous trois états : solide (la glace), liquide (l'eau) et gazeux (la vapeur d'eau). Un solide garde sa forme, un liquide prend la forme du récipient, un gaz occupe tout l'espace.",
    voix:"L'eau peut se présenter sous trois états. À l'état solide, c'est la glace : elle garde sa forme, même si on change de récipient. À l'état liquide, c'est l'eau du robinet : elle prend la forme du récipient, et sa surface reste plate. À l'état gazeux, c'est la vapeur d'eau, invisible : elle occupe tout l'espace disponible.",
    anim(t,a){ const s=a.seg; a.op(R.s1,1); R.title.textContent="Un même corps, trois états : l'eau"; const p=s(t,.3,.72);
      R.p1.forEach((g,k)=>{ a.op(g,s(t,.02+k*.06,.14+k*.06)); const A=g.A,B=g.B; const ap=s(t,.22,.3); a.op(g.arr,ap);
        if(k===0){ const x=a.lerp(A.cx,B.cx,p), y=a.lerp(A.bot-90,B.bot-90,p)-Math.sin(Math.PI*p)*80; a.set(g.cube,{x:x-45,y}); }
        if(k===1){ const hA=200*(1-p), hB=200*130/190*p; a.set(g.la,{x:A.cx-65,y:A.bot-hA,width:130,height:hA}); a.set(g.lb,{x:B.cx-95,y:B.bot-hB,width:190,height:hB}); a.set(g.sa,{x1:A.cx-65,x2:A.cx+65,y1:A.bot-hA,y2:A.bot-hA,opacity:hA>2?1:0}); a.set(g.sb,{x1:B.cx-95,x2:B.cx+95,y1:B.bot-hB,y2:B.bot-hB,opacity:hB>2?1:0}); }
        if(k===2){ a.op(g.ga,1-p); a.op(g.gb,p); }
        a.op(g.t1,s(t,.74,.86)); a.op(g.t2,s(t,.78,.9)); });
      a.op(R.s1b,s(t,.88,.98)); a.op(R.ph1,s(t,.45,.65)); a.op(R.ph1b,s(t,.55,.75)); } },
  { titre:"Dans la matière : des particules", duree:11000,
    legende:"La matière est faite de particules minuscules. Solide : serrées et rangées, elles vibrent. Liquide : serrées mais elles glissent. Gaz : très éloignées, elles filent dans tous les sens.",
    voix:"Imaginons que l'on puisse voir les particules d'eau. Dans la glace, elles sont serrées et bien rangées : elles ne font que vibrer sur place. Dans l'eau liquide, elles sont toujours serrées, mais désordonnées : elles glissent les unes sur les autres. Dans la vapeur d'eau, elles sont très éloignées et filent dans tous les sens. Ce sont toujours les mêmes particules d'eau !",
    anim(t,a){ const s=a.seg; a.op(R.s1,1-s(t,0,.08)); a.op(R.ph1,0); a.op(R.ph1b,0); a.op(R.s2,s(t,0,.08)); R.title.textContent="Les particules d'eau, vues au microscope imaginaire"; const clk=t*9+3;
      R.p2.forEach((g,k)=>{ g.ps.forEach(q=>{ const i=q.i; let x,y; if(k===0){ x=q.hx+Math.sin(clk*5+i*1.7)*3.5; y=q.hy+Math.cos(clk*4.6+i*2.3)*3.5; } else if(k===1){ x=q.hx+(rnd(i,3)-.5)*22+Math.sin(clk*1.6+i*2.1)*20; y=q.hy+(rnd(i,4)-.5)*20+Math.cos(clk*1.4+i*1.3)*18; } else { const X0=30+k*440; x=X0+30+22+tri(rnd(i,5)*2+clk*(.5+rnd(i,6)))*316; y=185+22+tri(rnd(i,7)*2+clk*(.4+rnd(i,8)))*296; } a.set(q.c,{cx:x,cy:y}); a.op(q.c,s(t,.1+k*.12,.22+k*.12)); });
        a.op(g.t1,s(t,.35+k*.13,.45+k*.13)); a.op(g.t2,s(t,.4+k*.13,.5+k*.13)); });
      a.op(R.s2b,s(t,.9,1)); } },
  { titre:"Fondre : 0 °C", duree:12000,
    legende:"On chauffe de la glace. À 0 °C elle fond : pendant la fusion, la température ne monte plus (palier à 0 °C). Quand toute la glace a fondu, la température remonte.",
    voix:"Chauffons de la glace sortie du congélateur. La température monte, jusqu'à zéro degré Celsius. À zéro degré, la glace fond : c'est la fusion. Regardez le thermomètre : tant qu'il reste de la glace, la température ne bouge plus. C'est un palier. Quand toute la glace a fondu, la température remonte.",
    anim(t,a){ const s=a.seg; a.op(R.s2,1-s(t,0,.08)); a.op(R.s2b,0); a.op(R.s3,s(t,0,.1)); R.title.textContent="1. On chauffe de la glace"; LAB(a,.32*s(t,.06,.96,true),t*9+9,1); a.op(R.ph3,s(t,.2,.4)); } },
  { titre:"Bouillir : 100 °C", duree:12000,
    legende:"On continue de chauffer : à 100 °C l'eau bout et se transforme en vapeur d'eau (un gaz). Pendant l'ébullition, la température reste à 100 °C : c'est un deuxième palier.",
    voix:"Continuons de chauffer l'eau liquide. La température monte jusqu'à cent degrés Celsius. À cent degrés, l'eau bout : de grosses bulles de vapeur montent et l'eau se transforme en gaz, la vapeur d'eau. Et là aussi, tant qu'il reste de l'eau liquide, la température reste à cent degrés : c'est un deuxième palier. Attention : la vapeur d'eau est invisible. Les petits nuages blancs au-dessus d'une casserole sont de minuscules gouttelettes d'eau liquide.",
    anim(t,a){ const s=a.seg; R.title.textContent="2. On continue de chauffer"; a.op(R.ph3,1-s(t,0,.1)); LAB(a,a.lerp(.32,.8,s(t,.04,.96,true)),t*9+18,1); a.op(R.ph4,s(t,.45,.65)); } },
  { titre:"À vous : le curseur de température", duree:8000,
    legende:"À vous : déplacez le curseur de température (de −20 °C à 120 °C). Regardez l'état de l'eau, les particules et le point sur la courbe. Essayez 0 °C et 100 °C !",
    voix:"À vous maintenant ! Déplacez le curseur de température, de moins vingt à cent vingt degrés Celsius. Regardez l'état de l'eau, les particules dans le zoom, et le point qui se déplace sur la courbe. Essayez aussi les boutons zéro degré et cent degrés : que remarquez-vous ? Prenez votre temps.",
    anim(t,a){ const s=a.seg; if(t<.02){ manipActive=false; Tm=20; } R.title.textContent="À vous : changez la température de l'eau"; a.op(R.ph4,1-s(t,0,.1)); const T=manipActive?Tm:20; lastT=T;
      const sl=a.manip&&a.manip.querySelector("#c2s"), vv=a.manip&&a.manip.querySelector("#c2v"); if(sl&&!manipActive) sl.value=T; if(vv) vv.textContent=minus(T)+" °C";
      LAB(a,tToU(T),RT*2.2,Math.max(0,Math.min(1,(T-15)/25)),T); a.op(R.s3,s(t,0,.05)>0?1:0); } },
  { titre:"L'air a une masse", duree:12000,
    legende:"Un gaz est de la matière : en gonflant un ballon, on ajoute de l'air et la balance indique quelques grammes de plus. Un litre d'air pèse environ 1,2 g.",
    voix:"Et l'air, qui est un gaz, pèse-t-il quelque chose ? Posons un ballon sur une balance : quatre cent vingt grammes, dans cet exemple. Pompons de l'air dans le ballon : il gonfle, et la balance indique plus. L'air a donc une masse ! Un litre d'air pèse environ un virgule deux gramme. Une idée fausse très répandue dit que l'air n'est rien, et qu'un gaz n'a pas de masse : c'est faux.",
    anim(t,a){ const s=a.seg; a.op(R.s3,1-s(t,0,.1)); a.op(R.ph4,0); a.op(R.ar,s(t,0,.1)); R.title.textContent="L'air pèse-t-il quelque chose ?"; const p=s(t,.15,.65,true); const rx=88+22*a.ease(p), ry=78+30*a.ease(p);
      a.set(R.ballC,{rx,ry}); a.tr(R.ball,450,705-ry); R.ballL.setAttribute("transform",`scale(${rx/90},${ry/90})`); R.ad.textContent=Math.round(420+5*p)+" g";
      const ph=p>0&&p<1; const pump=Math.abs(Math.sin(p*Math.PI*6)); a.tr(R.hand,0,560+(ph?60*(1-pump):0));
      R.airD.forEach((d,i)=>{ const f=((p*7+i/12)%1+1)%1; const pt=a.along(R.tube,f); a.set(d,{cx:pt.x,cy:pt.y}); a.op(d,ph?1:0); });
      R.ballD.forEach((d,i)=>{ const th=rnd(i,1)*6.28, rr=Math.sqrt(rnd(i,2))*.8; a.set(d,{cx:Math.cos(th)*rr*rx+Math.sin(t*20+i)*3,cy:Math.sin(th)*rr*ry+Math.cos(t*18+i)*3}); a.op(d,p*s(i/16,0,1)*0+Math.min(1,p*16/ (i+1))); });
      a.op(R.plus,s(t,.65,.75)); a.op(R.my,s(t,.72,.85)); a.op(R.fact,s(t,.85,.97)); } },
  { titre:"Synthèse", duree:10000,
    legende:"Solide, liquide, gaz : l'eau change d'état à 0 °C (fusion) et à 100 °C (ébullition), avec un palier de température. Un gaz est de la matière : il a une masse.",
    voix:"Récapitulons. L'eau peut être solide, liquide ou gazeuse. Quand on la chauffe, elle fond à zéro degré et elle bout à cent degrés. Quand on la refroidit, la vapeur se condense et l'eau liquide se solidifie. Pendant chaque changement d'état, la température fait un palier. Et un gaz, comme l'air ou la vapeur d'eau, est de la matière : il a une masse et il occupe de la place.",
    anim(t,a){ const s=a.seg; a.op(R.ar,1-s(t,0,.1)); a.op(R.my,1-s(t,0,.1)); a.op(R.fact,0); a.op(R.syn,s(t,0,.1)); R.title.textContent=""; R.sB.forEach((g,i)=>a.op(g,s(t,.1+i*.08,.22+i*.08))); R.sA.forEach((g,i)=>a.op(g,s(t,.35+i*.08,.45+i*.08))); R.sP.forEach((g,i)=>a.op(g,s(t,.65+i*.1,.75+i*.1))); } },
  ]
});
// ---- affichage du laboratoire pour une position u sur la courbe de chauffage (clk : horloge d'animation, fl : intensité de la flamme)
function LAB(a,u,clk,fl,Tover){ const st=uState(u), T=st.T, f=st.f, v=st.v, ph=st.ph;
  const Lw=230, lvl=Lw*f*(1-v), hi=200*(1-f); const dsub=Math.min(lvl,.9*hi), ibot=BOT-(lvl-dsub);
  a.set(R.wat,{y:BOT-lvl,height:Math.max(0,lvl)}); R.wat.setAttribute("fill",T>=70?"#B5D8F2":"#9CCBEF");
  a.op(R.ice,hi>1?1:0); a.set(R.iceR,{y:ibot-hi,height:Math.max(0,hi)}); R.ice.querySelectorAll(".hl").forEach((l,i)=>{ a.set(l,{y1:ibot-hi+20+i*34,y2:ibot-hi+8+i*34,opacity:hi>60?1:0}); });
  a.op(R.gasT,ph==="E"?1:0); R.gasD.forEach((d,i)=>{ a.set(d,{cx:CX-125+tri(rnd(i,1)*2+clk*(.4+rnd(i,2)*.6))*250,cy:BOT-380+tri(rnd(i,3)*2+clk*(.35+rnd(i,4)*.5))*370}); a.op(d,ph==="E"?1:0); });
  R.bub.forEach((b,i)=>{ const q=((clk*.5+rnd(i,1))%1+1)%1; a.set(b,{cx:CX-120+rnd(i,2)*240+Math.sin(clk*3+i)*6,cy:BOT-6-q*Math.max(10,lvl-14)}); a.op(b,(ph==="D"&&lvl>20)?1:0); });
  R.steam.forEach((c,i)=>{ const q=((clk*.35+rnd(i,3))%1+1)%1; a.set(c,{cx:CX-50+rnd(i,4)*140+Math.sin(clk*2+i*2)*14,cy:BOT-400-q*170}); a.op(c,(ph==="D"||ph==="E")?Math.min(1,v*5)*Math.sin(Math.PI*q):0); });
  a.op(R.steamT,(ph==="D"||ph==="E")?Math.min(1,v*5):0);
  R.fl.querySelectorAll("path").forEach((p,i)=>p.setAttribute("transform",`translate(0,${806-806*fl}) scale(1,${fl}) translate(0,${-806+806})`)); a.op(R.fl,fl>.05?1:0); R.fl.setAttribute("transform",`translate(0,${(1-fl)*52+Math.sin(clk*9)*2}) `);
  // thermomètre
  a.set(R.thM,{y:yTh(T),height:745-yTh(T)}); R.thV.textContent=minus(T)+" °C"; R.thV.setAttribute("fill",(ph==="B"||ph==="D")?C.or:C.red);
  // zoom
  R.zp.forEach((c,i)=>{ const g=GRID[i]; const qf=a.clamp((f-rnd(i,8)*.9)*10,0,1), qv=a.clamp((v-rnd(i,9)*.9)*10,0,1); const ampS=2+(T+20)/20*2.5, ampL=8+12*Math.max(0,T)/100;
    const sx=g.x+Math.sin(clk*5+i*1.7)*ampS, sy=g.y+Math.cos(clk*4.6+i*2.3)*ampS; const lx=g.x+(rnd(i,3)-.5)*22+Math.sin(clk*1.6+i*2.1)*ampL, ly=g.y+(rnd(i,4)-.5)*20+Math.cos(clk*1.4+i*1.3)*ampL;
    let x=a.lerp(sx,lx,qf), y=a.lerp(sy,ly,qf); const gx=ZC.x+(tri(rnd(i,5)*2+clk*(.5+rnd(i,6)))*2-1)*185, gy=ZC.y+(tri(rnd(i,7)*2+clk*(.4+rnd(i,8)))*2-1)*185; const rr=Math.hypot(gx-ZC.x,gy-ZC.y), k=rr>190?190/rr:1;
    x=a.lerp(x,ZC.x+(gx-ZC.x)*k,qv); y=a.lerp(y,ZC.y+(gy-ZC.y)*k,qv); const gas=qv>.5, liq=!gas&&qf>.5;
    a.set(c,{cx:x,cy:y,fill:gas?"#fff":liq?"#7FB8E6":"#9CC6EA","fill-opacity":gas?.7:1,stroke:gas?C.GAZ:C.bl,"stroke-dasharray":gas?"4 3":null}); });
  // courbe
  const pts=[]; for(let q=0;q<=u+1e-9;q+=.005) pts.push(q); pts.push(u); R.curve.setAttribute("d","M"+pts.map(q=>(GX0+q*GW).toFixed(1)+","+yG(uState(q).T).toFixed(1)).join(" L")); a.set(R.dot,{cx:GX0+u*GW,cy:yG(T)});
  a.op(R.gF,1); a.op(R.gE,1);
  // bandeau
  const msg={A:["SOLIDE : la glace","On chauffe : la température monte, la glace reste solide.",C.SOL],B:["FUSION à 0 °C : glace + eau liquide","Tant qu'il reste de la glace, la température reste à 0 °C (palier).",C.or],C:["LIQUIDE : l'eau","Plus on chauffe, plus les particules s'agitent : la température monte.",C.LIQ],D:["ÉBULLITION à 100 °C : eau liquide + vapeur","Tant qu'il reste de l'eau liquide, la température reste à 100 °C (palier).",C.or],E:["GAZ : la vapeur d'eau","Toute l'eau est vapeur (invisible) : elle remplit tout le récipient.",C.GAZ]}[ph];
  R.b1.textContent=msg[0]; R.b1.setAttribute("fill",msg[2]); R.bandR.setAttribute("stroke",msg[2]); R.b2.textContent=msg[1]; }
})();
