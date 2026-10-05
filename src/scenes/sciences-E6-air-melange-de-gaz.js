/* META {"id":"sciences-E6-air-melange-de-gaz","matiere":"sciences","annee":"B","periode":1,"theme":"La matière : l'air, un mélange de gaz qui a une masse","resume":"L'air est invisible mais bien présent : il occupe de la place, se comprime et a une masse (1 L d'air ≈ 1,2 g). C'est un mélange de gaz (≈ 78 % de diazote, ≈ 21 % de dioxygène, ≈ 1 % d'autres gaz). Dans l'eau gazeuse, un gaz est dissous et s'échappe quand on ouvre.","motsCles":["air","gaz","mélange","diazote","dioxygène","masse de l'air","compression","eau gazeuse","gaz dissous"]} */
(function(){
const R={}; let manActive=false, manN=6, curN=6;
const C={ink:"#1E2430",or:"#E07A1F",gr:"#2E8B57",bl:"#2563A8",red:"#C0392B",wat:"#4A90D9",n2:"#4A90D9",o2:"#E07A1F",ot:"#8C8F98"};
const M0=430, PUMP=0.3;                       // exemple : ballon de football dégonflé 430 g ; 1 coup de pompe ≈ 0,25 L d'air ≈ 0,3 g
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
const f1=v=>v.toFixed(1).replace(".",",");
function scale(a,parent,tx,ty,w){ const {el}=a; const g=el("g",{transform:`translate(${tx},${ty})`},parent); const h=w/2;
  el("rect",{x:-h,y:22,width:w,height:128,rx:20,fill:"#E9EDF2",stroke:"#8C96A6","stroke-width":4},g); el("rect",{x:-h+40,y:0,width:w-80,height:24,rx:8,fill:"#C9CFD8",stroke:"#8C96A6","stroke-width":3},g);
  el("rect",{x:-h+90,y:46,width:w-180,height:78,rx:8,fill:"#1E2A20"},g); g.disp=el("text",{x:h-96,y:106,"text-anchor":"end","font-size":56,"font-weight":800,fill:"#7CFF8A","font-family":"Consolas,monospace"},g); return g; }
function panel(a,parent,x,y,w,h,col){ const g=a.el("g",{},parent); a.el("rect",{x,y,width:w,height:h,rx:18,fill:"#fff",stroke:col||"#D6DBE4","stroke-width":3},g); return g; }
function txt(a,parent,x,y,str,o){ o=o||{}; const t=a.el("text",{x,y,"font-size":o.size||28,"font-weight":o.w||600,fill:o.fill||C.ink,"text-anchor":o.anchor||"start"},parent); if(str) a.wrap(t,str,o.n||40,1.25); return t; }

Anim.run({
  titre:"L'air : un mélange de gaz qui a une masse",
  sousTitre:"Sciences et technologie · CM1-CM2 · La matière",
  matiere:"sciences", badge:"Sciences", manipDes:3, manipJusqua:3,
  accroche:"On ne voit pas l'air. Pourtant, il est là : de quoi est-il fait, et pèse-t-il quelque chose ?",
  init(a){
    const {el}=a;
    /* ===== 0. le verre dans l'eau ===== */
    const G=a.layer("G"); R.G=G; const TX0=180, TW=520, WTOP=400, TB=760;
    el("rect",{x:TX0,y:WTOP,width:TW,height:TB-WTOP,fill:C.wat,"fill-opacity":.4},G);
    R.gg=el("g",{},G);
    R.gIn=el("path",{d:"M-90,0 L-90,-230 L90,-230 L90,0 Z",fill:"#fff"},R.gg); R.gWat=el("rect",{x:-88,y:0,width:176,height:0,fill:"#9CCBF0"},R.gg);
    R.gPap=el("g",{},R.gg); el("path",{d:"M-44,-200 L-30,-228 L-6,-218 L18,-230 L44,-206 L30,-196 L-20,-196 Z",fill:"#fff",stroke:"#9AA3B2","stroke-width":3,"stroke-linejoin":"round"},R.gPap);
    el("path",{d:"M-90,0 L-90,-230 L90,-230 L90,0",fill:"none",stroke:"#5F7C94","stroke-width":6,"stroke-linejoin":"round"},R.gg);
    el("path",{d:`M${TX0},${WTOP-110} L${TX0},${TB} L${TX0+TW},${TB} L${TX0+TW},${WTOP-110}`,fill:"none",stroke:"#7E9BB3","stroke-width":6,"stroke-linejoin":"round"},G); el("line",{x1:TX0,y1:WTOP,x2:TX0+TW,y2:WTOP,stroke:C.wat,"stroke-width":4},G);
    R.gBub=[...Array(9)].map(()=>el("circle",{r:12,fill:"#fff","fill-opacity":.7,stroke:"#7E9BB3","stroke-width":3},G));
    R.gArr=a.arrow(G,"M620,150 L620,240",{color:C.or,w:8,head:3.2});
    R.gL1=a.label(G,440,60,"On enfonce le verre à l'envers",{size:26,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    R.gL2=a.label(G,960,590,"l'eau n'entre presque pas :\nle verre est plein d'air",{size:26,stroke:C.bl,color:C.bl});
    R.gL3=a.label(G,440,830,"Le papier reste sec",{size:26,stroke:C.gr,color:C.gr,fill:"#E8F6EE"});
    R.gL4=a.label(G,440,830,"On incline : l'air s'échappe en bulles",{size:26,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3",w:480});
    R.gP=panel(a,G,780,120,780,330); txt(a,R.gP,810,180,"Ce qu'on observe",{size:30,w:800,fill:C.or});
    R.gT=txt(a,R.gP,810,236,"Un verre « vide » est plein d'air. Quand on l'enfonce à l'envers dans l'eau, l'air garde sa place : l'eau n'entre presque pas, et le papier reste sec.",{n:52});
    /* ===== 1. composition de l'air ===== */
    const K=a.layer("K"); R.K=K; const BX=470, BY=490, BR=290;
    el("text",{x:BX,y:150,"text-anchor":"middle","font-size":28,"font-weight":700,fill:"#4A5468",text:"Un peu d'air, vu avec un microscope imaginaire"},K);
    el("clipPath",{id:"bc6"},K).appendChild(el("circle",{cx:BX,cy:BY,r:BR-4}));
    el("circle",{cx:BX,cy:BY,r:BR,fill:"#F2F8FD",stroke:"#7E9BB3","stroke-width":5},K); const bg=el("g",{"clip-path":"url(#bc6)"},K);
    R.kp=[...Array(100)].map((_,i)=>{ const col=i<78?C.n2:i<99?C.o2:C.ot; const c=el("circle",{r:12,fill:col,stroke:"#fff","stroke-width":2},bg); const r=Math.sqrt(rnd(i,1))*(BR-30), an=rnd(i,2)*Math.PI*2; c._x=BX+r*Math.cos(an); c._y=BY+r*Math.sin(an); return c; });
    el("text",{x:930,y:150,"font-size":30,"font-weight":800,fill:C.ink,text:"Sur 100 particules d'air"},K);
    R.kw=[...Array(100)].map((_,i)=>{ const col=i<78?C.n2:i<99?C.o2:C.ot; return el("rect",{x:930+(i%10)*34,y:180+Math.floor(i/10)*34,width:30,height:30,rx:5,fill:col},K); });
    R.kl=[[C.n2,"78 sur 100 : diazote","environ 78 %",620],[C.o2,"21 sur 100 : dioxygène","environ 21 % : celui qu'on respire",692],[C.ot,"1 sur 100 : autres gaz","environ 1 % : argon, gaz carbonique…",764]].map(([c,t1,t2,y],i)=>{ const g=el("g",{},K); el("rect",{x:930,y:y-26,width:30,height:30,rx:5,fill:c},g); el("text",{x:974,y,"font-size":28,"font-weight":800,fill:C.ink,text:t1},g); el("text",{x:974,y:y+30,"font-size":23,fill:"#4A5468",text:t2},g); return g; });
    R.kn=el("text",{x:930,y:850,"font-size":24,fill:"#4A5468",text:"Valeurs arrondies, pour l'air sec, en volume."},K);
    /* ===== 2. l'air se comprime (seringue) ===== */
    const S=a.layer("S"); R.S=S; const SX0=330, SX1=870, SY=380; const SG=el("g",{transform:"translate(-40,-60) scale(1.4)"},S);
    el("text",{x:800,y:360,"text-anchor":"middle","font-size":28,"font-weight":600,fill:"#4A5468",text:"Une seringue fermée avec le doigt"},S);
    el("rect",{x:290,y:SY+22,width:40,height:20,fill:"#DDE2EA",stroke:"#8C96A6","stroke-width":3},SG); el("ellipse",{cx:282,cy:SY+32,rx:26,ry:34,fill:"#F2C9A8",stroke:"#B88A66","stroke-width":3},SG);
    R.sAir=el("rect",{x:SX0,y:SY,width:SX1-SX0,height:100,fill:"#EAF4FB"},SG); R.sPt=[...Array(26)].map((_,i)=>el("circle",{r:8,fill:C.n2,stroke:"#fff","stroke-width":1.5},SG));
    R.sPl=el("g",{},SG); el("rect",{x:-14,y:SY+2,width:28,height:96,fill:"#8C96A6",stroke:"#5C6677","stroke-width":3},R.sPl); el("line",{x1:0,y1:SY+50,x2:170,y2:SY+50,stroke:"#8C96A6","stroke-width":14},R.sPl); el("rect",{x:164,y:SY+10,width:22,height:80,rx:6,fill:"#5C6677"},R.sPl);
    el("rect",{x:SX0,y:SY,width:SX1+14-SX0,height:100,fill:"none",stroke:"#5F7C94","stroke-width":6},SG);
    [0,20,40,60].forEach(v=>{ const x=SX0+(SX1-SX0)*v/60; el("line",{x1:x,y1:SY+100,x2:x,y2:SY+112,stroke:C.ink,"stroke-width":3},SG); el("text",{x,y:SY+142,"text-anchor":"middle","font-size":22,fill:C.ink,text:v},SG); });
    el("text",{x:SX1+44,y:SY+142,"font-size":22,fill:"#4A5468",text:"mL"},SG);
    R.sV=el("text",{x:800,y:740,"text-anchor":"middle","font-size":50,"font-weight":800,fill:C.bl},S);
    R.sN=el("text",{x:800,y:800,"text-anchor":"middle","font-size":28,"font-weight":600,fill:C.ink},S);
    /* ===== 3. manipulation : le ballon et la balance ===== */
    const M=a.layer("M"); R.M=M; const MG=el("g",{transform:"translate(-60,-90) scale(1.15)"},M); R.sc=scale(a,MG,460,700,480);
    R.ball=el("g",{transform:"translate(460,586)"},MG); el("circle",{r:112,fill:"#fff",stroke:C.ink,"stroke-width":6},R.ball);
    [[0,0,22],[0,-76,14],[72,-24,14],[44,62,14],[-44,62,14],[-72,-24,14]].forEach(([x,y,r])=>el("circle",{cx:x,cy:y,r,fill:"#D6DBE4"},R.ball));
    el("clipPath",{id:"ballc"},MG).appendChild(el("circle",{cx:460,cy:586,r:106}));
    R.mdots=[...Array(80)].map((_,i)=>{ const r=Math.sqrt(rnd(i,3))*92, an=rnd(i,4)*Math.PI*2; const c=el("circle",{r:6,fill:C.n2,stroke:"#fff","stroke-width":1.5,"clip-path":"url(#ballc)"},MG); c._x=460+r*Math.cos(an); c._y=586+r*Math.sin(an); return c; });
    R.mPump=el("g",{},MG); el("rect",{x:760,y:420,width:44,height:290,rx:8,fill:"#8C96A6",stroke:"#5C6677","stroke-width":4},R.mPump); R.mHnd=el("g",{},R.mPump); el("rect",{x:780,y:300,width:8,height:150,fill:"#5C6677"},R.mHnd); el("rect",{x:730,y:288,width:108,height:20,rx:8,fill:C.red},R.mHnd); el("rect",{x:730,y:700,width:118,height:16,rx:6,fill:"#5C6677"},R.mPump);
    el("text",{x:782,y:748,"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.ink,text:"pompe"},MG);
    R.mPn=panel(a,M,930,90,630,570,C.or); txt(a,R.mPn,956,148,"Ballon de football (exemple)",{size:30,w:800,fill:C.or});
    R.m1=txt(a,R.mPn,956,206,"",{size:28}); R.m2=txt(a,R.mPn,956,262,"",{size:28,fill:C.bl,w:800}); R.m3=txt(a,R.mPn,956,326,"",{size:28,w:800,fill:C.gr}); R.m4=txt(a,R.mPn,956,384,"",{size:28,w:700,fill:C.red}); R.m5=txt(a,R.mPn,956,472,"",{size:26,fill:"#4A5468"});
    R.m6=txt(a,R.mPn,956,596,"",{size:26,fill:"#4A5468"});
    a.manip.innerHTML=`Pompe : <button data-a="moins" aria-label="un coup de pompe de moins">− 1 coup</button> <b id="mN" style="min-width:36px;text-align:center">6</b> <button data-a="plus" aria-label="un coup de pompe de plus">+ 1 coup de pompe</button> <button data-a="zero">à zéro</button>`;
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ if(!manActive){ manActive=true; manN=curN; } const k=b.dataset.a; if(k==="plus"&&manN<12) manN++; else if(k==="moins"&&manN>0) manN--; else if(k==="zero") manN=0; a.redraw(); });
    /* ===== 4. eau gazeuse ===== */
    const B=a.layer("B"); R.B=B; R.bs=scale(a,B,380,690,400);
    R.bt=el("g",{transform:"translate(380,690)"},B);
    el("path",{d:"M-62,0 L-62,-250 Q-62,-300 -22,-330 L-22,-420 L22,-420 L22,-330 Q62,-300 62,-250 L62,0 Z",fill:"#EAF4FB",stroke:"#5F7C94","stroke-width":6,"stroke-linejoin":"round","fill-opacity":.9},R.bt);
    R.bw=el("path",{d:"M-60,0 L-60,-250 Q-60,-280 -40,-298 L40,-298 Q60,-280 60,-250 L60,0 Z",fill:"#BFE0F7"},R.bt);
    R.bb=[...Array(12)].map(()=>el("circle",{r:6,fill:"#fff","fill-opacity":.9,stroke:"#7E9BB3","stroke-width":2},R.bt));
    R.bcap=el("rect",{x:-27,y:-446,width:54,height:26,rx:6,fill:C.red},R.bt);
    R.bps=el("g",{},B); [[-30,-20],[0,-40],[30,-18]].forEach(([dx,dy])=>el("path",{d:`M${380+dx},${240+dy} q${dx},-30 ${dx*1.6},-50`,fill:"none",stroke:"#9ACBEF","stroke-width":5,"stroke-linecap":"round"},R.bps));
    const zx=1250, zy=270, zr=180; R.bz=el("g",{},B);
    el("line",{x1:440,y1:520,x2:zx-zr*.8,y2:zy+zr*.6,stroke:"#9AA3B2","stroke-width":2,"stroke-dasharray":"8 6"},R.bz); el("circle",{cx:zx,cy:zy,r:zr,fill:"#EAF4FB",stroke:"#7E9BB3","stroke-width":5},R.bz);
    el("clipPath",{id:"zc6"},R.bz).appendChild(el("circle",{cx:zx,cy:zy,r:zr-4})); const zg=el("g",{"clip-path":"url(#zc6)"},R.bz);
    R.bwp=[...Array(60)].map((_,i)=>{ const c=el("circle",{r:9,fill:"#7FB8E6"},zg); c._x=zx-zr+rnd(i,3)*2*zr; c._y=zy-zr+rnd(i,4)*2*zr; return c; });
    R.bgp=[...Array(14)].map((_,i)=>{ const c=el("circle",{r:13,fill:"#4A5468",stroke:"#fff","stroke-width":2},R.bz); c._x=zx-zr*.8+rnd(i,7)*zr*1.6; c._y=zy-zr*.6+rnd(i,8)*zr*1.4; c._t=.4+i*.03; return c; });
    R.bzl=el("g",{},R.bz); el("circle",{cx:zx-150,cy:zy+zr+36,r:9,fill:"#7FB8E6"},R.bzl); el("text",{x:zx-132,y:zy+zr+44,"font-size":22,fill:C.ink,text:"eau"},R.bzl); el("circle",{cx:zx-60,cy:zy+zr+36,r:12,fill:"#4A5468"},R.bzl); el("text",{x:zx-42,y:zy+zr+44,"font-size":22,fill:C.ink,text:"gaz carbonique dissous"},R.bzl);
    R.bph=a.photo(B,{id:"s-e6-bouteille-petillante",x:820,y:610,w:330,h:190,cap:"Une eau gazeuse qui pétille",rot:-2,size:20});
    R.bT=txt(a,B,1190,640,"Le gaz dissous s'échappe en bulles quand on ouvre.",{n:20,size:26});
    R.bSt=el("text",{x:380,y:880,"text-anchor":"middle","font-size":24,"font-weight":700,fill:"#4A5468"},B);
    /* ===== 5. idée fausse ===== */
    const Y=a.layer("Y"); R.Y=Y; R.mc=null; R.myth=a.layer("myth"); R.mc=a.myth(R.myth,860,80,700,"L'air, c'est du vide : il ne pèse rien.","Non : l'air est de la matière. Un litre d'air pèse environ 1,2 g. L'air d'une salle de classe de 60 m² pèse à peu près 200 kg !");
    // un litre (carton) et une salle de classe (boîte en perspective)
    R.yL=el("g",{},Y); el("rect",{x:150,y:400,width:100,height:200,fill:"#fff",stroke:C.ink,"stroke-width":4},R.yL); el("text",{x:200,y:520,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.bl,text:"1 L"},R.yL); el("text",{x:200,y:650,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"d'air"},R.yL); el("text",{x:200,y:690,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.or,text:"≈ 1,2 g"},R.yL);
    R.yC=el("g",{},Y); el("path",{d:"M380,330 L700,330 L700,640 L380,640 Z",fill:"#EAF4FB",stroke:C.ink,"stroke-width":5},R.yC); el("path",{d:"M380,330 L450,270 L770,270 L700,330 M770,270 L770,580 L700,640",fill:"#F8FBFE",stroke:C.ink,"stroke-width":5,"stroke-linejoin":"round"},R.yC);
    el("text",{x:540,y:470,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"une salle de classe"},R.yC); el("text",{x:540,y:512,"text-anchor":"middle","font-size":24,"font-weight":600,fill:"#4A5468",text:"(60 m² × 2,8 m ≈ 170 m³)"},R.yC); el("text",{x:540,y:575,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.or,text:"air ≈ 200 kg"},R.yC);
    /* ===== synthèse ===== */
    R.syn=a.layer("syn"); el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},R.syn);
    el("text",{x:800,y:78,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink,text:"À retenir"},R.syn);
    R.pts=[["L'air est un mélange de gaz : environ 78 % de diazote, 21 % de dioxygène et 1 % d'autres gaz.",C.bl],["L'air est de la matière : il occupe de la place, on peut le comprimer, et il a une masse (1 litre d'air ≈ 1,2 g).",C.or],["Un gaz peut être dissous dans l'eau (eau gazeuse) : il s'échappe en bulles quand on ouvre la bouteille.",C.gr]].map(([tx,c],i)=>{
      const g=el("g",{},R.syn); const y=140+i*210; el("rect",{x:60,y,width:930,height:170,rx:18,fill:"#fff",stroke:c,"stroke-width":4},g); el("circle",{cx:120,cy:y+85,r:34,fill:c},g); el("text",{x:120,y:y+98,"text-anchor":"middle","font-size":38,"font-weight":800,fill:"#fff",text:i+1},g);
      const t=el("text",{x:180,y:y+62,"font-size":28,"font-weight":600,fill:C.ink},g); a.wrap(t,tx,50,1.2); return g; });
    R.ph2=a.photo(R.syn,{id:"s-e6-bouteille-petillante",x:1060,y:230,w:440,h:300,cap:"Une eau gazeuse",rot:2});
  },
  reset(a){ allOff(a); },
  etapes:[
  { titre:"L'air est invisible mais bien là", duree:13000,
    legende:"On enfonce un verre à l'envers dans l'eau : l'eau n'y entre presque pas, car le verre est plein d'air, et le papier reste sec. Si on incline le verre, l'air s'échappe en bulles.",
    voix:"On ne voit pas l'air, mais il est bien là. Enfonçons un verre à l'envers dans l'eau. Un petit papier est coincé au fond du verre. L'eau n'entre presque pas : le verre est plein d'air, et l'air garde sa place. Le papier reste sec. Maintenant, inclinons le verre : l'air s'échappe en bulles, et l'eau prend sa place.",
    anim(t,a){ sc0(a,t); } },
  { titre:"L'air est un mélange de gaz", duree:13000,
    legende:"L'air est un mélange de gaz : environ 78 % de diazote, 21 % de dioxygène (celui qu'on respire) et environ 1 % d'autres gaz. On ne les voit pas, mais ils sont là.",
    voix:"L'air est un mélange de plusieurs gaz. Imaginons cent particules d'air. Environ soixante-dix-huit sont du diazote. Environ vingt et une sont du dioxygène, le gaz que nous respirons. Et environ une sur cent est un autre gaz, comme l'argon ou le gaz carbonique. Tous ces gaz sont mélangés, et on ne les voit pas.",
    anim(t,a){ sc1(a,t); } },
  { titre:"L'air se comprime", duree:12000,
    legende:"Dans une seringue bouchée, on pousse le piston : le volume de l'air passe de 60 mL à 30 mL. On a comprimé l'air : il y a toujours la même quantité d'air, mais ses particules sont plus serrées.",
    voix:"Prenons une seringue fermée avec le doigt. Elle contient soixante millilitres d'air. Poussons le piston : le volume diminue, jusqu'à trente millilitres. On a comprimé l'air. Il y a toujours la même quantité d'air, mais ses particules sont plus serrées. C'est pour cela qu'on peut faire entrer beaucoup d'air dans un ballon avec une pompe.",
    anim(t,a){ sc2(a,t); } },
  { titre:"À vous : gonflez le ballon, lisez la balance", duree:16000,
    legende:"À vous : donnez des coups de pompe avec les boutons, puis lisez la balance. Chaque coup de pompe ajoute de l'air dans le ballon : le ballon devient plus lourd !",
    voix:"À vous de jouer ! On pèse un ballon de football dégonflé : quatre cent trente grammes. Donnez des coups de pompe avec les boutons, et lisez la balance. À chaque coup de pompe, on ajoute un peu d'air dans le ballon, et la balance indique un peu plus. Un litre d'air pèse environ un gramme et deux dixièmes. Prenez votre temps.",
    anim(t,a){ sc3(a,t); } },
  { titre:"L'eau gazeuse : un gaz dissous", duree:14000,
    legende:"Dans l'eau gazeuse, du gaz carbonique est dissous. Quand on ouvre la bouteille, il s'échappe en bulles : la masse diminue un peu. Le gaz n'a pas disparu : il est parti dans l'air.",
    voix:"Dans une bouteille d'eau gazeuse, il y a du gaz carbonique dissous dans l'eau, comme le sucre dans l'eau sucrée. Quand on ouvre la bouteille, le gaz s'échappe en bulles. La balance indique alors un peu moins : la bouteille a perdu un peu de masse. Le gaz n'a pas disparu : il est parti dans l'air de la pièce.",
    anim(t,a){ sc4(a,t); } },
  { titre:"Idée fausse : l'air ne pèse rien", duree:12000,
    legende:"On croit que l'air, c'est du vide qui ne pèse rien. Faux : l'air est de la matière. Un litre d'air pèse environ 1,2 g, et l'air d'une salle de classe pèse à peu près 200 kg !",
    voix:"On entend parfois que l'air, c'est du vide et qu'il ne pèse rien. C'est faux ! L'air est de la matière. Un litre d'air pèse environ un gramme et deux dixièmes. Et l'air d'une salle de classe, qui fait environ cent soixante-dix mètres cubes, pèse à peu près deux cents kilogrammes.",
    anim(t,a){ sc5(a,t); a.cls(R.mc.faux,"pulse",t>.7); } },
  { titre:"À retenir", duree:9000,
    legende:"L'air est un mélange de gaz (78 % de diazote, 21 % de dioxygène, 1 % d'autres gaz) ; il occupe de la place et il a une masse ; un gaz peut se dissoudre dans l'eau.",
    voix:"À retenir. Un : l'air est un mélange de gaz, environ soixante-dix-huit pour cent de diazote, vingt et un pour cent de dioxygène et un pour cent d'autres gaz. Deux : l'air est de la matière, il occupe de la place, on peut le comprimer, et il a une masse : un litre d'air pèse environ un gramme et deux dixièmes. Trois : un gaz peut être dissous dans l'eau, comme dans l'eau gazeuse.",
    anim(t,a){ const s=a.seg; allOff(a); a.op(R.syn,1); R.pts.forEach((g,i)=>a.op(g,s(t,.1+i*.22,.3+i*.22))); a.op(R.ph2,s(t,.75,.95)); } },
  ]
});
function allOff(a){ [R.G,R.K,R.S,R.M,R.B,R.Y,R.myth,R.syn,R.ph2,R.bph].forEach(e=>a.op(e,0)); }
/* 0 : verre dans l'eau */
function sc0(a,t){ const s=a.seg; allOff(a); a.op(R.G,1); const WTOP=400, GX=440;
  const push=s(t,.08,.4), tilt=s(t,.66,.95); const mouth=a.lerp(340,620,push), d=Math.max(0,mouth-WTOP);
  const hin=Math.min(228,.2*d+tilt*(120+.5*d)); const rot=tilt*38, cr=Math.cos(rot*Math.PI/180), sr=Math.sin(rot*Math.PI/180), rimX=GX+90-180*cr, rimY=mouth-180*sr;
  R.gg.setAttribute("transform",`translate(${GX+90*0},${mouth}) translate(90,0) rotate(${rot}) translate(-90,0)`);
  R.gWat.setAttribute("height",hin); R.gWat.setAttribute("y",-hin);
  R.gBub.forEach((b,i)=>{ const p=a.clamp((tilt-.1-i*.07)/.4,0,1), vis=p>0&&p<1; a.op(b,vis?1:0); a.set(b,{cx:rimX+rnd(i,1)*40-10+Math.sin(p*9+i)*6,cy:a.lerp(rimY-6,WTOP+5,p)}); });
  a.op(R.gArr,s(t,.05,.12)*(1-s(t,.4,.45))); a.tr(R.gArr,0,s(t,.08,.4)*280); a.op(R.gL1,s(t,.05,.12)*(1-s(t,.45,.5)));
  a.op(R.gL2,s(t,.45,.55)*(1-s(t,.64,.7))); a.op(R.gL3,s(t,.5,.58)*(1-s(t,.64,.7))); a.op(R.gL4,s(t,.7,.8)); a.op(R.gP,s(t,.5,.62)); }
/* 1 : composition */
function sc1(a,t){ const s=a.seg; allOff(a); a.op(R.K,1); const fi=s(t,.03,.15);
  R.kp.forEach((c,i)=>{ a.op(c,fi); a.set(c,{cx:c._x+Math.sin(t*40+i*1.7)*7,cy:c._y+Math.cos(t*34+i*2.3)*7}); });
  R.kw.forEach((r,i)=>{ const a0=i<78?.2+i/78*.28:i<99?.52+(i-78)/21*.18:.74; a.op(r,s(t,a0,a0+.03)); });
  R.kl.forEach((g,i)=>a.op(g,s(t,[.46,.7,.8][i],[.52,.76,.86][i]))); a.op(R.kn,s(t,.88,.97)); }
/* 2 : seringue */
function sc2(a,t){ const s=a.seg; allOff(a); a.op(R.S,1); const SX0=330, SX1=870, SY=380;
  const V=60-30*s(t,.3,.62); const xp=SX0+(SX1-SX0)*V/60; a.tr(R.sPl,xp,0); a.set(R.sAir,{width:xp-SX0});
  R.sPt.forEach((p,i)=>{ const u=rnd(i,1), v=rnd(i,2); a.set(p,{cx:SX0+12+u*(xp-SX0-24)+Math.sin(t*40+i)*3,cy:SY+14+v*72+Math.cos(t*35+i)*3}); });
  R.sV.textContent="Volume d'air : "+Math.round(V)+" mL"; R.sN.textContent=V<45?"L'air est comprimé : les particules sont plus serrées":"On part de 60 mL d'air (exemple)"; }
/* 3 : manip ballon */
function sc3(a,t){ const s=a.seg; allOff(a); a.op(R.M,1); if(t<.02) manActive=false;
  const n=manActive?manN:Math.min(6,Math.floor(s(t,.1,.8,true)*6.999)); curN=n; const mass=M0+PUMP*n;
  R.sc.disp.textContent=f1(mass)+" g"; a.cls(R.sc.disp,"glow",n>0&&(manActive||t>.85));
  const cnt=12+n*5; R.mdots.forEach((c,i)=>{ a.op(c,i<cnt?1:0); a.set(c,{cx:c._x+Math.sin(t*40+i)*2,cy:c._y+Math.cos(t*33+i)*2}); });
  const ph=manActive?0:(s(t,.1,.8,true)*6.999%1); a.tr(R.mHnd,0,Math.abs(Math.sin(ph*Math.PI))*80*(!manActive&&t>.1&&t<.8?1:0));
  R.m1.textContent="Au départ, ballon dégonflé : 430,0 g"; R.m2.textContent=n?`${n} coup${n>1?"s":""} × 0,3 g = ${f1(PUMP*n)} g d'air`:"Aucun coup de pompe"; R.m3.textContent=`430,0 g + ${f1(PUMP*n)} g = ${f1(mass)} g`; R.m4.textContent=""; if(n) a.wrap(R.m4,"L'air a une masse : le ballon est plus lourd !",38,1.25);
  R.m5.textContent=""; a.wrap(R.m5,"Exemple : 1 coup de pompe ≈ 0,25 L d'air, et 1 L d'air ≈ 1,2 g, donc ≈ 0,3 g par coup.",42,1.25); R.m6.textContent=""; a.wrap(R.m6,"La balance de précision indique le dixième de gramme. Valeurs d'exemple.",44,1.25);
  const mn=document.getElementById("mN"); if(mn) mn.textContent=n; }
/* 4 : eau gazeuse */
function sc4(a,t){ const s=a.seg; allOff(a); a.op(R.B,1); const open=s(t,.28,.36), ex=s(t,.4,.9); R.bcap.setAttribute("transform",`translate(${open*40},${-open*80}) rotate(${open*50} 0 -433)`); a.op(R.bcap,1-s(t,.34,.42));
  a.op(R.bps,s(t,.28,.34)*(1-s(t,.38,.46)));
  const exited=ex; const mass=Math.round(1530-4*exited); R.bs.disp.textContent=mass+" g"; a.cls(R.bs.disp,"glow",t>.92);
  R.bb.forEach((b,i)=>{ const p=((t*3+i*.17)%1), vis=ex>0&&ex<1&&t>.4; a.op(b,vis?1:0); a.set(b,{cx:-45+rnd(i,1)*90,cy:-20-p*270}); });
  R.bwp.forEach((c,i)=>a.set(c,{cx:c._x+Math.sin(t*30+i)*4,cy:c._y+Math.cos(t*27+i)*4}));
  const zx=1250,zy=270,zr=180; R.bgp.forEach((c,i)=>{ const p=a.clamp((t-.42-i*.03)/.2,0,1); a.set(c,{cx:c._x+Math.sin(t*25+i)*4+(p*(rnd(i,9)-.5)*60),cy:a.lerp(c._y,zy-zr-40,a.ease(p))+Math.cos(t*22+i)*3}); a.op(c,p<.97?1:0); });
  a.op(R.bz,s(t,.0,.12)); a.op(R.bph,s(t,.6,.8)); a.op(R.bT,s(t,.7,.85)); R.bSt.textContent=t<.3?"Bouteille fermée (masses d'exemple)":t<.9?"On ouvre : le gaz s'échappe…":"Bouteille ouverte : un peu moins lourde"; }
/* 5 : idée fausse */
function sc5(a,t){ const s=a.seg; allOff(a); a.op(R.Y,1); a.op(R.yL,s(t,.05,.2)); a.op(R.yC,s(t,.25,.4)); a.op(R.myth,s(t,.5,.68)); }
})();
