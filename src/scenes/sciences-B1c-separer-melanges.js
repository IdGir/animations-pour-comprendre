/* META {"id":"sciences-B1c-separer-melanges","matiere":"sciences","annee":"B","periode":1,"theme":"La matière : séparer les constituants d'un mélange","resume":"Tamiser, décanter, filtrer, évaporer : à chaque mélange sa méthode de séparation, avec un mini-quiz commenté et les marais salants comme exemple.","motsCles":["séparation","tamisage","décantation","filtration","évaporation","marais salants"]} */
(function(){
let R={}, q=0, rep=null, manipActive=false, lastQ=0; // manipulation du quiz : q = question choisie, rep = méthode choisie par l'élève (manipActive : la démonstration automatique cède la place)
const C={water:"#BFE0F7",muddy:"#C9B48A",sand:"#D9B26A",gravel:"#8C8C8C",salt:"#FFFFFF",ink:"#1E2430",or:"#E07A1F",gr:"#2E8B57",bl:"#2563A8",red:"#C0392B"};
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
const METH=["le tamisage","la décantation","la filtration","l'évaporation"];
// hes : méthodes envisagées avant la bonne (on hésite) ; no : pourquoi la première ne convient pas ; why : pourquoi la bonne
const QUIZ=[
 {q:"du sable et des graviers",ok:0,hes:[3,0],no:"L'évaporation sert à récupérer un solide dissous : ici, rien n'est dissous.",why:"Les graviers sont plus gros que les trous du tamis : ils restent dessus."},
 {q:"de l'eau boueuse",ok:2,hes:[0,2],no:"La terre est assez fine pour passer à travers les trous du tamis.",why:"Le papier filtre retient la terre : l'eau qui coule est limpide."},
 {q:"de l'eau salée (pour récupérer le sel)",ok:3,hes:[2,3],no:"Le sel est dissous : il passe à travers le filtre avec l'eau.",why:"L'eau s'évapore, le sel reste au fond : on le récupère."},
 {q:"de l'eau et de l'huile",ok:1,hes:[0,1],no:"Un tamis ne retient pas un liquide : l'eau et l'huile passent à travers.",why:"L'huile flotte au-dessus de l'eau : on laisse reposer, puis on sépare les deux liquides."}];
function beaker(a,p,x,y,w,h){ const g=a.el("g",{},p); g.liq=a.el("rect",{x:x-w/2+4,width:w-8,fill:C.water},g); a.el("path",{d:`M${x-w/2-8},${y-h} L${x-w/2},${y-h+8} L${x-w/2},${y} L${x+w/2},${y} L${x+w/2},${y-h+8} L${x+w/2+8},${y-h}`,fill:"none",stroke:"#7E9BB3","stroke-width":5,"stroke-linejoin":"round"},g); g.x=x; g.y=y; g.w=w; g.h=h; g.set=(lvl,col)=>{ a.set(g.liq,{y:y-lvl,height:Math.max(0,lvl),fill:col||C.water}); }; return g; }
function pill(a,p,x,y,w,txt,col,fs){ const g=a.el("g",{},p); a.el("rect",{x:x-w/2,y:y-28,width:w,height:56,rx:14,fill:"#fff",stroke:col,"stroke-width":3},g); a.el("text",{x,y:y+9,"text-anchor":"middle","font-size":fs||26,"font-weight":800,fill:col,text:txt},g); return g; }
Anim.run({
  titre:"Séparer les constituants d'un mélange",
  sousTitre:"Sciences et technologie · CM1-CM2 · La matière",
  matiere:"sciences", badge:"Sciences",
  accroche:"Comment récupérer le gravier, le sable, l'eau et le sel d'un même mélange ?",
  manipDes:5, manipJusqua:5,
  init(a){
    const {el}=a;
    R.title=el("text",{x:800,y:70,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink},a.svg);
    // ---- station 1 : le mélange
    const s1=a.layer("s1"); R.s1=s1; R.b0=beaker(a,s1,430,800,300,420);
    R.grav=[...Array(14)].map(()=>el("ellipse",{rx:20,ry:14,fill:C.gravel,stroke:"#555","stroke-width":2},s1));
    R.sandP=[...Array(80)].map(()=>el("circle",{r:6,fill:C.sand},s1));
    R.ingR=[["graviers","gros solides : on les voit",0],["sable","petits solides : on les voit",1],["eau","le liquide",2],["sel dissous","invisible, mais bien présent !",3]].map(([n,sub,k],i)=>{ const g=el("g",{},s1), y=240+i*120;
      if(k===0) el("ellipse",{cx:880,cy:y,rx:28,ry:20,fill:C.gravel,stroke:"#555","stroke-width":2},g);
      if(k===1) [[-12,-6],[8,-10],[14,6],[-6,8],[0,0]].forEach(([dx,dy])=>el("circle",{cx:880+dx,cy:y+dy,r:7,fill:C.sand,stroke:"#9C7A3A","stroke-width":1},g));
      if(k===2) el("path",{d:`M880,${y-30} Q910,${y+4} 880,${y+22} Q850,${y+4} 880,${y-30}Z`,fill:"#4A90D9"},g);
      if(k===3){ el("circle",{cx:880,cy:y,r:30,fill:"none",stroke:C.ink,"stroke-width":3,"stroke-dasharray":"7 6"},g); [[-12,-8],[10,-12],[12,10],[-8,12]].forEach(([dx,dy])=>el("rect",{x:880+dx-5,y:y+dy-5,width:10,height:10,fill:"#fff",stroke:C.or,"stroke-width":2},g)); }
      el("text",{x:950,y:y+2,"font-size":38,"font-weight":800,fill:k===1?"#8A6A22":k===2?C.bl:k===3?C.ink:"#555",text:n},g); el("text",{x:950,y:y+38,"font-size":26,fill:"#4A5468",text:sub},g); return g; });
    // ---- station 2 : tamis
    const s2=a.layer("s2"); R.s2=s2; R.bT=beaker(a,s2,800,820,320,300);
    R.tamis=el("g",{},s2); el("path",{d:"M630,520 Q800,660 970,520",fill:"#E6E9EF",stroke:"#5A6475","stroke-width":6},R.tamis); for(let i=0;i<10;i++){ const x=650+i*33; el("line",{x1:x,y1:530,x2:x,y2:530+(1-Math.pow((x-800)/170,2))*85,stroke:"#9AA3B2","stroke-width":2},R.tamis); } el("line",{x1:970,y1:520,x2:1090,y2:480,stroke:"#5A6475","stroke-width":11,"stroke-linecap":"round"},R.tamis);
    R.bSrc=beaker(a,s2,330,470,200,260); R.stream=el("path",{fill:"none",stroke:C.muddy,"stroke-width":16,"stroke-linecap":"round"},s2);
    R.gravT=[...Array(14)].map(()=>el("ellipse",{rx:20,ry:14,fill:C.gravel,stroke:"#555","stroke-width":2},s2));
    R.dr2=[...Array(5)].map(()=>el("circle",{r:7,fill:C.muddy},s2));
    R.lab2=el("g",{},s2); a.label(R.lab2,980,260,"Le tamis retient les graviers :\nils sont plus gros que les trous",{size:26,stroke:C.or,color:"#8A4A0E"});
    R.ph2=a.photo(a.svg,{id:"s-b1c-tamis",x:1340,y:140,w:220,h:160,cap:"En vrai : tamis",size:20,rot:1.5});
    // ---- station 3 : décantation
    const s3=a.layer("s3"); R.s3=s3; R.bD=beaker(a,s3,470,810,320,420); R.bD2=beaker(a,s3,1010,810,280,300);
    R.sandD=[...Array(80)].map(()=>el("circle",{r:6,fill:C.sand},R.bD)); R.clock=el("text",{x:470,y:350,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.bl},s3);
    R.pour=el("path",{fill:"none",stroke:"#D9E6EA","stroke-width":14,"stroke-linecap":"round"},s3);
    R.lab3=el("g",{},s3); a.label(R.lab3,1010,200,"On attend : le sable (plus lourd) tombe au fond.\nPuis on verse doucement le liquide\ndans un autre récipient (transvasement).",{size:26,stroke:C.or,color:"#8A4A0E"});
    // ---- station 4 : filtration
    const s4=a.layer("s4"); R.s4=s4; R.bF=beaker(a,s4,420,830,240,250);
    el("path",{d:"M270,320 L570,320 L450,470 L450,560 L390,560 L390,470 Z",fill:"#F4F6F9",stroke:"#7E9BB3","stroke-width":6,"stroke-linejoin":"round"},s4); el("path",{d:"M292,328 L548,328 L420,462 Z",fill:"#FFFDF2",stroke:"#C9B48A","stroke-width":3},s4);
    R.dirt=el("path",{d:"M372,432 L468,432 L420,462Z",fill:"#A88E5E"},s4); R.drip=[...Array(6)].map(()=>el("circle",{r:7,fill:"#8FC3EA"},s4));
    const zx=1000, zy=470; R.zoomF=el("g",{},s4); const cpz=el("clipPath",{id:"zf"},el("defs",{},s4)); el("circle",{cx:zx,cy:zy,r:246},cpz); el("circle",{cx:zx,cy:zy,r:250,fill:"#F7FAFD",stroke:"#7E9BB3","stroke-width":5},R.zoomF);
    el("text",{x:zx,y:zy-270,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Zoom sur le papier filtre"},R.zoomF); const zin=el("g",{"clip-path":"url(#zf)"},R.zoomF);
    R.fil=el("g",{},zin); for(let i=0;i<9;i++){ el("rect",{x:zx-260+i*60,y:zy-12,width:44,height:24,fill:"#C9B48A"},R.fil); }
    R.zp=[...Array(30)].map((_,i)=>{ const kind=i<10?"terre":i<20?"eau":"sel"; const c=el("circle",{r:kind==="terre"?22:kind==="eau"?10:8,fill:kind==="terre"?"#A88E5E":kind==="eau"?"#7FB8E6":"#fff",stroke:kind==="sel"?C.or:"none","stroke-width":3},zin); c.k=kind; c.i=i; return c; });
    R.zl=el("g",{},R.zoomF); [["#A88E5E","terre : trop grosse, elle reste"],["#7FB8E6","eau : passe"],["#fff","sel : passe aussi !"]].forEach(([c,t],i)=>{ el("circle",{cx:zx-200,cy:zy+280+i*36,r:11,fill:c,stroke:c==="#fff"?C.or:"none","stroke-width":3},R.zl); el("text",{x:zx-180,y:zy+289+i*36,"font-size":24,fill:C.ink,text:t},R.zl); });
    R.lab4=el("g",{},s4); a.label(R.lab4,420,200,"L'eau est limpide…\nmais encore salée !",{size:28,stroke:C.red,color:C.red});
    R.ph4=a.photo(a.svg,{id:"s-b1c-filtre-cafe",x:1340,y:140,w:220,h:160,cap:"En vrai : filtre à café",size:20,rot:-1.5});
    // ---- station 5 : évaporation
    const s5=a.layer("s5"); R.s5=s5; R.bE=beaker(a,s5,520,740,380,240);
    R.flame=el("g",{},s5); el("rect",{x:410,y:790,width:220,height:26,rx:6,fill:"#5A6475"},R.flame); R.fl=[...Array(6)].map((_,i)=>el("path",{d:`M${432+i*35},790 q-14,-34 0,-62 q14,28 0,62Z`,fill:i%2?"#F2A53B":"#E8622C"},R.flame));
    R.vap=[...Array(16)].map(()=>el("circle",{r:11,fill:"#7FB8E6",opacity:.6},s5)); R.cris=[...Array(30)].map(()=>el("rect",{width:14,height:14,fill:"#fff",stroke:"#9AA3B2","stroke-width":1.5},s5));
    R.vapT=el("text",{x:520,y:250,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.bl,text:"vapeur d'eau"},s5);
    R.lab5=el("g",{},s5); a.label(R.lab5,980,520,"L'eau s'évapore\n(elle part en vapeur),\nle sel reste au fond :\nc'est le principe\ndes marais salants",{size:28,stroke:C.or,color:"#8A4A0E",w:440});
    R.ph5=a.photo(a.svg,{id:"s-b1c-marais-salants",x:1330,y:140,w:240,h:170,cap:"En vrai : marais salants",size:20,rot:1.5});
    // ---- quiz automatique
    const qz=a.layer("qz"); R.qz=qz; R.qN=el("text",{x:800,y:140,"text-anchor":"middle","font-size":26,"font-weight":700,fill:"#4A5468"},qz); R.qT=el("text",{x:800,y:205,"text-anchor":"middle","font-size":40,"font-weight":800,fill:C.ink},qz);
    R.qI=[0,1,2,3].map(k=>{ const g=el("g",{},qz);
      if(k===0){ el("ellipse",{cx:800,cy:400,rx:130,ry:34,fill:C.sand,stroke:"#9C7A3A","stroke-width":3},g); [[-70,-20],[-20,-34],[40,-26],[80,-8],[10,-6]].forEach(([dx,dy])=>el("ellipse",{cx:800+dx,cy:395+dy,rx:20,ry:14,fill:C.gravel,stroke:"#555","stroke-width":2},g)); for(let i=0;i<40;i++) el("circle",{cx:690+rnd(i,1)*220,cy:392+rnd(i,2)*28,r:5,fill:"#C8A25A"},g); }
      else { const b=beaker(a,g,800,420,200,190); if(k===1) b.set(150,C.muddy); if(k===2){ b.set(150,C.water); for(let i=0;i<10;i++) el("rect",{x:720+rnd(i,3)*150,y:290+rnd(i,4)*110,width:10,height:10,fill:"#fff",stroke:C.or,"stroke-width":2},g); } if(k===3){ b.set(150,C.water); el("rect",{x:704,y:270,width:192,height:40,fill:"#F2CF4A",opacity:.95},g); } }
      return g; });
    const act=(kind,v)=>{ if(!manipActive){ manipActive=true; q=lastQ; rep=null; } if(kind==='next'){ q=(q+1)%QUIZ.length; rep=null; } else rep=v; a.redraw(); };
    R.chips=METH.map((tx,i)=>{ const g=el("g",{style:"cursor:pointer"},qz), x=245+i*370; g.r=el("rect",{x:x-165,y:490,width:330,height:84,rx:16,fill:"#fff",stroke:C.ink,"stroke-width":4},g); g.t=el("text",{x,y:543,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:tx},g); g.addEventListener("click",()=>act("pick",i)); return g; });
    R.qH=el("text",{x:800,y:640,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.or},qz); R.qBf=el("rect",{x:560,y:662,width:480,height:18,rx:9,fill:"#fff",stroke:"#9AA3B2","stroke-width":2},qz); R.qB=el("rect",{x:562,y:664,width:0,height:14,rx:7,fill:C.or},qz);
    R.qNo=el("text",{x:800,y:728,"text-anchor":"middle","font-size":28,"font-weight":700,fill:C.red},qz); R.qR=el("text",{x:800,y:745,"text-anchor":"middle","font-size":42,"font-weight":800,fill:C.gr},qz); R.qW=el("text",{x:800,y:802,"text-anchor":"middle","font-size":30,fill:C.ink},qz);
    a.manip.innerHTML=`Quelle méthode ? `+["tamisage","décantation","filtration","évaporation"].map((m,i)=>`<button data-m="${i}">${m}</button>`).join("")+` <button data-m="next" style="border-style:dashed">question suivante ▶</button>`;
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ if(b.dataset.m==="next") act("next"); else act("pick",+b.dataset.m); });
    // ---- synthèse
    const sy=a.layer("syn"); R.syn=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    const ICS=[(g,x)=>{ el("path",{d:`M${x-50},180 Q${x},250 ${x+50},180`,fill:"#E6E9EF",stroke:"#5A6475","stroke-width":5},g); for(let i=-2;i<=2;i++) el("line",{x1:x+i*18,y1:186,x2:x+i*18,y2:186+(1-Math.pow(i/2.7,2))*40,stroke:"#9AA3B2","stroke-width":2},g); el("line",{x1:x+50,y1:180,x2:x+85,y2:166,stroke:"#5A6475","stroke-width":7,"stroke-linecap":"round"},g); },
      (g,x)=>{ el("path",{d:`M${x-34},160 L${x+34},160 L${x},205 L${x+34},250 L${x-34},250 L${x},205Z`,fill:"#EAF4FB",stroke:C.bl,"stroke-width":5,"stroke-linejoin":"round"},g); el("path",{d:`M${x-22},244 L${x+22},244 L${x},222Z`,fill:C.sand},g); },
      (g,x)=>{ el("path",{d:`M${x-52},165 L${x+52},165 L${x+9},215 L${x+9},255 L${x-9},255 L${x-9},215Z`,fill:"#F4F6F9",stroke:"#7E9BB3","stroke-width":5,"stroke-linejoin":"round"},g); el("path",{d:`M${x-40},170 L${x+40},170 L${x},212Z`,fill:"#FFFDF2",stroke:"#C9B48A","stroke-width":3},g); },
      (g,x)=>{ el("circle",{cx:x,cy:208,r:26,fill:"#F6C445"},g); for(let i=0;i<10;i++){ const t=i/10*Math.PI*2; el("line",{x1:x+36*Math.cos(t),y1:208+36*Math.sin(t),x2:x+54*Math.cos(t),y2:208+54*Math.sin(t),stroke:"#F6C445","stroke-width":6,"stroke-linecap":"round"},g); } }];
    R.s4c=[["Tamiser","solides de tailles\ndifférentes"],["Décanter","un solide lourd\ntombe au fond"],["Filtrer","retient les solides\nnon dissous"],["Évaporer","récupère un solide\ndissous (le sel)"]].map((f,i)=>{ const g=el("g",{},sy); const x=215+i*390; el("rect",{x:x-180,y:110,width:360,height:290,rx:18,fill:"#F3F6FC",stroke:C.bl,"stroke-width":3},g); ICS[i](g,x); el("text",{x,y:292,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.bl,text:f[0]},g); const tt=el("text",{x,y:334,"text-anchor":"middle","font-size":24,fill:C.ink},g); f[1].split("\n").forEach((l,j)=>el("tspan",{x,dy:j?30:0,text:l},tt)); if(i<3) a.arrow(g,`M${x+184},255 L${x+206},255`,{color:"#9AA3B2",w:5,head:3}); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,200,460,1200,"En filtrant de l'eau salée, on enlève le sel.","Le sel dissous passe à travers le filtre avec l'eau. Pour le récupérer, il faut évaporer l'eau.");
  },
  reset(a){ [R.s1,R.s2,R.s3,R.s4,R.s5,R.qz,R.syn,R.myth,R.lab2,R.lab3,R.lab4,R.lab5,R.zoomF,R.stream,R.pour,R.bD2,R.ph2,R.ph4,R.ph5,R.vapT,...R.ingR,...R.cris,...R.vap].forEach(e=>a.op(e,0)); R.title.textContent=""; R.bSrc.removeAttribute("transform"); R.bD.removeAttribute("transform"); },
  etapes:[
  { titre:"Un mélange compliqué", duree:9000,
    legende:"Voici de l'eau de mer ramassée sur la plage, avec du sable et des graviers. Elle contient aussi du sel… dissous, donc invisible. Comment séparer tous ces constituants ?",
    voix:"Voici de l'eau de mer ramassée sur la plage, avec du sable et des graviers. C'est un mélange hétérogène : on voit les graviers et le sable. Mais il contient aussi du sel, dissous dans l'eau, donc invisible. Comment récupérer séparément le gravier, le sable, l'eau et le sel ?",
    anim(t,a){ const s=a.seg; a.op(R.s1,1); R.title.textContent="Le mélange de départ"; R.b0.set(340*s(t,0,.3),C.muddy);
      R.grav.forEach((g,i)=>{ a.op(g,s(t,.2,.3)); a.set(g,{cx:R.b0.x-115+rnd(i,1)*230,cy:788-rnd(i,2)*28}); }); R.sandP.forEach((g,i)=>{ a.op(g,s(t,.25,.35)); a.set(g,{cx:R.b0.x-135+rnd(i,3)*270,cy:540+rnd(i,4)*230}); });
      R.ingR.forEach((g,i)=>a.op(g,s(t,.4+i*.12,.5+i*.12))); } },
  { titre:"1. Tamiser", duree:10000,
    legende:"On verse le mélange dans un tamis. Les graviers, plus gros que les trous, restent dedans. L'eau, le sable et le sel passent.",
    voix:"Première étape : le tamisage. On verse le mélange dans un tamis. Les graviers sont plus gros que les trous : ils restent dans le tamis. L'eau, le sable et le sel, eux, passent à travers.",
    anim(t,a){ const s=a.seg; a.op(R.s1,1-s(t,0,.1)); a.op(R.s2,s(t,0,.1)); R.title.textContent="1. Le tamisage"; const p=s(t,.2,.78);
      R.bSrc.set(190*(1-p),C.muddy); R.bSrc.setAttribute("transform",`rotate(${50*s(t,.1,.2)},438,210)`); a.op(R.stream,p>0&&p<1?1:0); a.set(R.stream,{d:"M446,222 Q540,236 690,520"}); R.bT.set(220*p,C.muddy);
      R.gravT.forEach((g,i)=>{ const v=a.clamp(p*1.6-rnd(i,5)*.6,0,1); a.op(g,p>0?1:0); a.set(g,{cx:a.lerp(690,730+rnd(i,6)*140,v),cy:a.lerp(300,585-Math.pow((rnd(i,6)-.5)*2,2)*40-rnd(i,7)*16,v)}); });
      R.dr2.forEach((d,i)=>{ const ph=((t*10)+i/5)%1; a.op(d,p>0&&p<1?1:0); a.set(d,{cx:790+rnd(i,8)*30,cy:640+ph*(820-220*p-640)}); });
      a.op(R.lab2,s(t,.78,.88)); a.op(R.ph2,s(t,.4,.6)); } },
  { titre:"2. Décanter", duree:11000,
    legende:"On laisse reposer : le sable, plus lourd que l'eau, tombe au fond. C'est la décantation. Puis on verse doucement le liquide dans un autre récipient.",
    voix:"Deuxième étape : la décantation. On laisse reposer le mélange. Le sable, plus lourd que l'eau, tombe peu à peu au fond. Ensuite, on verse doucement le liquide dans un autre récipient, sans faire passer le sable : c'est le transvasement.",
    anim(t,a){ const s=a.seg; a.op(R.s2,1-s(t,0,.1)); a.op(R.ph2,1-s(t,0,.08)); a.op(R.s3,s(t,0,.1)); R.title.textContent="2. La décantation"; const d=s(t,.1,.55);
      R.bD.set(300*(1-.4*s(t,.62,.9)),C.water); R.bD.liq.setAttribute("fill",d<.5?C.muddy:d<1?"#DCCFB2":"#DCE9EF");
      R.sandD.forEach((g,i)=>{ const y0=540+rnd(i,4)*240; const yend=796-Math.floor(i/26)*9-rnd(i,5)*6; a.set(g,{cx:R.bD.x-135+rnd(i,3)*270,cy:a.lerp(y0,yend,a.clamp(d*1.3-rnd(i,6)*.3,0,1))}); });
      R.clock.textContent=t<.58?`on attend… ${Math.round(30*d)} min (exemple)`:""; a.op(R.bD2,s(t,.55,.6)); const p=s(t,.62,.9); R.bD2.set(140*p,"#DCE9EF"); R.bD.setAttribute("transform",`rotate(${40*s(t,.58,.65)*(1-s(t,.92,1))},638,390)`); a.op(R.pour,p>0&&p<1?1:0); a.set(R.pour,{d:"M650,400 Q780,420 990,560"});
      a.op(R.lab3,s(t,.88,1)); } },
  { titre:"3. Filtrer", duree:12000,
    legende:"On filtre le liquide encore trouble : le papier filtre retient les particules de terre, trop grosses. L'eau qui coule est limpide… mais le sel, dissous, est passé avec elle !",
    voix:"Troisième étape : la filtration. Le liquide est encore un peu trouble. On le verse dans un entonnoir garni de papier filtre. Les petites particules de terre, trop grosses pour les trous du filtre, sont retenues. L'eau qui coule en dessous est limpide. Mais attention : les particules de sel, toutes petites, sont passées avec l'eau. L'eau filtrée est encore salée !",
    anim(t,a){ const s=a.seg; a.op(R.s3,1-s(t,0,.1)); a.op(R.s4,s(t,0,.1)); R.title.textContent="3. La filtration"; const p=s(t,.1,.85); R.bF.set(130*p,"#E3F1FB"); a.op(R.dirt,s(t,.1,.4));
      R.drip.forEach((d,i)=>{ const ph=((t*12)+i/6)%1; a.op(d,p>0&&p<1?1:0); a.set(d,{cx:420,cy:570+ph*(830-130*p-575)}); });
      a.op(R.zoomF,s(t,.15,.25)); a.op(R.ph4,s(t,.45,.65)); R.zp.forEach(c=>{ const x0=760+rnd(c.i,1)*480, v=a.clamp(p*1.4-rnd(c.i,2)*.4,0,1); const y=a.lerp(300+rnd(c.i,3)*140,c.k==="terre"?448:540+rnd(c.i,4)*120,a.ease(v)); const x=c.k==="terre"?x0:760+((c.i%9)*60)+22+20-rnd(c.i,5)*10; a.set(c,{cx:c.k==="terre"?x0:a.lerp(x0,x,s(v,.3,.6)),cy:y}); });
      a.op(R.lab4,s(t,.85,.95)); } },
  { titre:"4. Évaporer", duree:11000,
    legende:"Pour récupérer le sel, on chauffe l'eau salée (ou on la laisse au soleil). L'eau s'évapore, le sel reste : on voit apparaître des cristaux.",
    voix:"Dernière étape : l'évaporation. On chauffe doucement l'eau salée, ou on la laisse au soleil. L'eau s'évapore : elle part dans l'air sous forme de vapeur. Le sel, lui, ne s'évapore pas : il reste au fond, et des cristaux blancs apparaissent. C'est ce qui se passe dans les marais salants.",
    anim(t,a){ const s=a.seg; a.op(R.s4,1-s(t,0,.1)); a.op(R.ph4,1-s(t,0,.08)); a.op(R.s5,s(t,0,.1)); R.title.textContent="4. L'évaporation"; const e=s(t,.15,.85); R.bE.set(190*(1-e),"#E3F1FB"); R.fl.forEach((f,i)=>f.setAttribute("transform",`translate(0,${Math.sin(t*80+i)*3})`));
      R.vap.forEach((v,i)=>{ const ph=((t*6)+rnd(i,1))%1; a.op(v,e>0&&e<1?(1-ph)*.7:0); a.set(v,{cx:380+rnd(i,2)*280+Math.sin(ph*6+i)*10,cy:520-ph*250}); }); a.op(R.vapT,e>0&&e<1?s(t,.2,.3):0);
      R.cris.forEach((c,i)=>{ a.op(c,i<Math.floor(30*s(t,.4,.9))?1:0); const cx=360+rnd(i,3)*320; a.set(c,{x:cx,y:722-rnd(i,4)*14,transform:`rotate(${rnd(i,5)*40} ${cx} 730)`}); }); a.op(R.lab5,s(t,.8,.9)); a.op(R.ph5,s(t,.7,.9)); } },
  { titre:"À vous : quelle méthode choisir ?", duree:24000,
    legende:"Pour chaque mélange, on hésite puis on choisit la bonne méthode. À vous : choisissez la méthode avec les boutons, regardez ce qui change, puis passez à la question suivante.",
    voix:"Maintenant, jouons à choisir la bonne méthode. Pour chaque mélange, on hésite un instant, puis on trouve la réponse. Premier mélange : du sable et des graviers. Deuxième : de l'eau boueuse. Troisième : de l'eau salée, dont on veut récupérer le sel. Quatrième : de l'eau et de l'huile. À vous maintenant : choisissez la bonne méthode avec les boutons, regardez ce qui change, puis passez à la question suivante. Prenez votre temps.",
    anim(t,a){ const s=a.seg; a.op(R.s5,1-s(t,0,.06)); a.op(R.ph5,1-s(t,0,.06)); a.op(R.qz,s(t,0,.05)); R.title.textContent="Quelle méthode choisir ?"; if(t<.02){ manipActive=false; q=0; rep=null; }
      let qi,u; if(manipActive){ qi=q; u=rep===null?.05:(rep===QUIZ[qi].ok?.9:.3); } else { const sl=a.clamp((t-.02)/.98*4,0,3.9999); qi=Math.floor(sl); u=sl-qi; }
      lastQ=qi; const Q=QUIZ[qi]; R.qN.textContent=`Mélange ${qi+1} sur ${QUIZ.length}`; R.qT.textContent=`Comment séparer ${Q.q} ?`; R.qI.forEach((g,k)=>a.op(g,k===qi?1:0));
      let ring=-1; if(manipActive) ring=rep===null?-1:rep; else if(u>.1&&u<.3) ring=Q.hes[0]; else if(u>=.3&&u<.55) ring=Q.hes[1];
      const rev=manipActive?(rep===Q.ok):u>=.55;
      R.chips.forEach((c,i)=>{ const isOk=rev&&i===Q.ok, isRing=!rev&&i===ring; a.set(c.r,{fill:isOk?"#D6F0DE":isRing?"#FFE6CC":"#fff",stroke:isOk?C.gr:isRing?(manipActive||u>=.2?C.red:C.or):C.ink,"stroke-width":isOk||isRing?7:4}); a.set(c.t,{fill:isOk?"#14532D":C.ink}); });
      const think=manipActive?false:(u>.1&&u<.55);
      R.qH.textContent=manipActive?(rep===null?"Choisissez la bonne méthode":""):think?"On hésite"+".".repeat(1+Math.floor(t*40)%3):""; a.set(R.qB,{width:manipActive?0:476*s(u,.1,.55)}); a.op(R.qBf,manipActive?0:1); a.op(R.qB,manipActive?0:1);
      R.qNo.textContent=(!rev&&((manipActive&&rep!==null)||(!manipActive&&u>.2&&u<.55)))?(manipActive&&rep!==Q.hes[0]?"Non, essayez encore.":"Non. "+Q.no):"";
      a.wrap(R.qNo,R.qNo.textContent,80);
      R.qR.textContent=rev?`La réponse est : ${METH[Q.ok]} !`:""; a.set(R.qR,{y:745}); a.set(R.qW,{opacity:rev?1:0}); R.qW.textContent=""; a.wrap(R.qW,rev?Q.why:"",78); R.qNo.setAttribute("text-anchor","middle");
      if(a.manip) a.manip.querySelectorAll("button").forEach(b=>b.classList.toggle("sel",manipActive&&rep!==null&&+b.dataset.m===rep)); } },
  { titre:"Synthèse", duree:9000,
    legende:"Tamiser, décanter, filtrer, évaporer : chaque méthode sépare certains constituants. Un solide dissous ne peut être récupéré que par évaporation.",
    voix:"Récapitulons. Le tamisage sépare des solides de tailles différentes. La décantation laisse tomber au fond un solide plus lourd. La filtration retient les solides qui ne sont pas dissous. Et l'évaporation permet de récupérer un solide dissous, comme le sel.",
    anim(t,a){ const s=a.seg; a.op(R.qz,1-s(t,0,.1)); R.title.textContent=""; a.op(R.syn,s(t,0,.1)); R.s4c.forEach((f,i)=>{ const v=s(t,.1+i*.12,.22+i*.12); a.op(f,v); a.tr(f,0,(1-v)*40); }); a.op(R.myth,s(t,.65,.8)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
