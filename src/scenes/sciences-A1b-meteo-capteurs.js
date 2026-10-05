/* META {"id":"sciences-A1b-meteo-capteurs","matiere":"sciences","annee":"A","periode":1,"theme":"La planète Terre : mesurer le temps qu'il fait","resume":"Thermomètre, anémomètre et pluviomètre : comment chaque capteur transforme un phénomène météo en une mesure.","motsCles":["météo","thermomètre","anémomètre","pluviomètre","mesure","dilatation"]} */
(function(){
let R={}, Tair=21; // Tair : température choisie par l'élève (curseur)
const IC={ // petites icônes SVG (pas d'emoji)
  thermo(a,g,x,y,col){ a.el("rect",{x:x-11,y:y-60,width:22,height:90,rx:11,fill:"#EAF4FB",stroke:"#7E9BB3","stroke-width":4},g); a.el("rect",{x:x-5,y:y-20,width:10,height:50,fill:col},g); a.el("circle",{cx:x,cy:y+32,r:19,fill:col,stroke:"#7E9BB3","stroke-width":4},g); },
  vent(a,g,x,y,col){ for(let i=0;i<3;i++){ const r=i*120; const gg=a.el("g",{transform:`translate(${x},${y}) rotate(${r})`},g); a.el("line",{x1:0,y1:0,x2:42,y2:0,stroke:"#555","stroke-width":5},gg); a.el("path",{d:"M42,-15 A15,15 0 0 1 42,15 Z",fill:i?"#D0D5DD":col,stroke:"#555","stroke-width":2},gg);} a.el("circle",{cx:x,cy:y,r:7,fill:"#555"},g); },
  pluie(a,g,x,y,col){ [[-26,0,20],[0,-10,26],[28,2,20]].forEach(([dx,dy,r])=>a.el("circle",{cx:x+dx,cy:y+dy,r,fill:"#9EAAB8"},g)); [-24,0,24].forEach(dx=>a.el("path",{d:`M${x+dx},${y+26} q7,12 0,18 q-7,-6 0,-18Z`,fill:col},g)); }
};
const C={liq:"#D63A2F",blue:"#2563A8",or:"#E07A1F",gr:"#2E8B57",ink:"#1E2430",glass:"#EAF4FB",water:"#4A90D9"};
const TX=330, TB=740, TK=10; // thermomètre : x, y du bulbe, px par °C
const Ty=T=>TB-60-(T+10)*TK;
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
function setT(a,T){ a.set(R.col,{y:Ty(T),height:TB-Ty(T)}); R.read.textContent=Math.round(T)+" °C";
    const h=180+(T+10)*5.5; const y0=700-h; a.set(R.zLiq,{y:y0,height:h});
    const amp=2+(T+10)*.25; const tt=performance.now()/180;
    R.parts.forEach((p,i)=>{ const cx=720+((i%8)+.5)*40, cy=y0+((Math.floor(i/8))+.5)*(h/5); a.set(p,{cx:cx+Math.sin(tt+i)*amp,cy:cy+Math.cos(tt*1.3+i*2)*amp}); });
    R.zN.textContent=`${R.parts.length} particules : toujours le même nombre !`;
    a.set(R.zoomLine,{d:`M${TX+20},${Ty(T)} L700,${y0}`}); a.set(R.rlL,{x1:TX-50,x2:TX+74,y1:Ty(T),y2:Ty(T)}); a.set(R.rlC,{cx:TX,cy:Ty(T)}); }
Anim.run({
  titre:"Mesurer le temps qu'il fait : les capteurs météo",
  sousTitre:"Sciences et technologie · CM1-CM2 · La planète Terre",
  matiere:"sciences", badge:"Sciences",
  accroche:"Comment un thermomètre, un anémomètre et un pluviomètre mesurent-ils la météo ?",
  manipDes:1, manipJusqua:1,
  init(a){
    const {el}=a;
    // ---- THERMOMÈTRE
    const th=a.layer("th"); R.th=th;
    el("rect",{x:TX-34,y:Ty(42)-20,width:68,height:TB-Ty(42)+20,rx:34,fill:C.glass,stroke:"#7E9BB3","stroke-width":4},th);
    el("circle",{cx:TX,cy:TB,r:48,fill:C.glass,stroke:"#7E9BB3","stroke-width":4},th);
    R.col=el("rect",{x:TX-9,width:18,fill:C.liq,rx:4},th); el("circle",{cx:TX,cy:TB,r:38,fill:C.liq},th);
    for(let T=-10;T<=40;T+=5){ const y=Ty(T); el("line",{x1:TX+40,y1:y,x2:TX+(T%10===0?72:58),y2:y,stroke:C.ink,"stroke-width":T%10===0?3:2},th); if(T%10===0) el("text",{x:TX+82,y:y+8,"font-size":24,"font-weight":700,fill:C.ink,text:T+" °C"},th); }
    R.read=el("text",{x:TX,y:Ty(42)-50,"text-anchor":"middle","font-size":40,"font-weight":800,fill:C.liq},th);
    // zoom particules
    const zp=el("g",{},th); R.zp=zp; el("rect",{x:620,y:180,width:520,height:560,rx:18,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},zp);
    el("text",{x:880,y:225,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Zoom dans le liquide"},zp);
    R.zLiq=el("rect",{x:700,width:360,fill:"#FBE3E0",stroke:C.liq,"stroke-width":3},zp);
    R.parts=[...Array(40)].map(()=>el("circle",{r:11,fill:C.liq},zp));
    R.zN=el("text",{x:880,y:720,"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.ink},zp);
    R.zoomLine=el("path",{d:"",stroke:"#9AA3B2","stroke-width":2,"stroke-dasharray":"8 6",fill:"none"},th);
    R.sun=el("g",{},th); el("circle",{cx:1330,cy:250,r:70,fill:"#F6C445"},R.sun); for(let i=0;i<12;i++){ const a0=i/12*Math.PI*2; el("line",{x1:1330+90*Math.cos(a0),y1:250+90*Math.sin(a0),x2:1330+120*Math.cos(a0),y2:250+120*Math.sin(a0),stroke:"#F6C445","stroke-width":8,"stroke-linecap":"round"},R.sun); }
    R.cold=el("g",{},th); for(let i=0;i<3;i++){ const r=i*60; const g=el("g",{transform:`translate(1330,250) rotate(${r})`},R.cold); el("line",{x1:-80,y1:0,x2:80,y2:0,stroke:"#4A90D9","stroke-width":10,"stroke-linecap":"round"},g); [-1,1].forEach(sg=>{ el("line",{x1:sg*50,y1:0,x2:sg*72,y2:-20,stroke:"#4A90D9","stroke-width":7,"stroke-linecap":"round"},g); el("line",{x1:sg*50,y1:0,x2:sg*72,y2:20,stroke:"#4A90D9","stroke-width":7,"stroke-linecap":"round"},g); }); }
    R.rl=el("g",{},th); R.rlL=el("line",{stroke:C.liq,"stroke-width":4,"stroke-dasharray":"10 6"},R.rl); R.rlC=el("circle",{r:12,fill:"none",stroke:C.liq,"stroke-width":5},R.rl);
    R.phA=a.photo(a.svg,{id:"s-a1b-abri-meteo",x:1230,y:70,w:300,h:200,cap:"En vrai : abri météo",size:21,rot:1.5});
    R.thT=el("g",{},th); const t1=el("text",{x:1180,y:480,"font-size":26,"font-weight":700,fill:C.ink},R.thT); a.wrap(t1,"Il fait chaud : le liquide se dilate (il prend plus de place) et monte dans le tube fin.",28);
    // ---- ANÉMOMÈTRE
    const an=a.layer("an"); R.an=an; const AX=520, AY=420;
    el("rect",{x:AX-8,y:AY,width:16,height:360,fill:"#8C96A6"},an);
    R.rot=el("g",{},an); for(let i=0;i<3;i++){ const g=el("g",{transform:`rotate(${i*120})`},R.rot); el("line",{x1:0,y1:0,x2:150,y2:0,stroke:"#555","stroke-width":8},g); el("path",{d:"M150,-34 A34,34 0 0 1 150,34 Z",fill:i===0?C.or:"#D0D5DD",stroke:"#555","stroke-width":3},g); }
    el("circle",{cx:AX,cy:AY,r:18,fill:"#555"},an); R.rot.setAttribute("transform",`translate(${AX},${AY})`);
    R.winds=[...Array(6)].map((_,i)=>el("path",{d:"",fill:"none",stroke:"#7FB0DA","stroke-width":6,"stroke-linecap":"round"},an));
    R.anP=el("g",{},an); el("rect",{x:900,y:170,width:640,height:300,rx:18,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.anP);
    R.an1=el("text",{x:930,y:240,"font-size":30,"font-weight":800,fill:C.or},R.anP); R.an2=el("text",{x:930,y:300,"font-size":30,"font-weight":800,fill:C.blue},R.anP); R.an3=el("text",{x:930,y:360,"font-size":22,fill:C.ink},R.anP); R.an4=el("text",{x:930,y:420,"font-size":22,fill:"#4A5468"},R.anP);
    R.gir=el("g",{},an); el("rect",{x:1100,y:560,width:12,height:220,fill:"#8C96A6"},R.gir); R.girA=el("g",{transform:"translate(1106,560)"},R.gir); el("path",{d:"M-90,0 L60,0 M60,-30 L110,0 L60,30Z M-90,0 L-120,-30 L-100,0 L-120,30Z",fill:"#333",stroke:"#333","stroke-width":6,"stroke-linejoin":"round"},R.girA);
    R.phW=a.photo(a.svg,{id:"s-a1b-anemometre",x:1350,y:500,w:210,h:150,cap:"En vrai : anémomètre",size:19,rot:-1.5});
    R.girT=el("text",{x:1106,y:820,"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.ink,text:"la girouette indique d'où vient le vent"},R.gir);
    // ---- PLUVIOMÈTRE
    const pl=a.layer("pl"); R.pl=pl;
    const tube=(x,w,lab)=>{ const g=el("g",{},pl); const liq=el("rect",{x:x-w/2+4,width:w-8,fill:C.water,opacity:.85},g); el("path",{d:`M${x-w/2},380 L${x-w/2},780 L${x+w/2},780 L${x+w/2},380`,fill:"none",stroke:"#7E9BB3","stroke-width":5},g);
      for(let mm=0;mm<=40;mm+=5){ const y=780-mm*9; el("line",{x1:x+w/2,y1:y,x2:x+w/2+(mm%10?14:24),y2:y,stroke:C.ink,"stroke-width":2},g); if(mm%10===0) el("text",{x:x+w/2+30,y:y+7,"font-size":20,fill:C.ink,text:mm+" mm"},g); }
      el("text",{x,y:830,"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.ink,text:lab},g); g.liq=liq; g.x=x; g.w=w; return g; };
    R.tA=tube(380,80,"pluviomètre étroit"); R.tB=tube(780,260,"récipient large");
    R.drops=[...Array(36)].map(()=>el("path",{d:"M0,-14 Q8,0 0,6 Q-8,0 0,-14Z",fill:C.water},pl));
    R.cloud=el("g",{},pl); [[320,150,70],[420,130,90],[540,150,80],[680,140,90],[800,160,70],[880,150,60]].forEach(([x,y,r])=>el("circle",{cx:x,cy:y,r,fill:"#9EAAB8"},R.cloud));
    R.plT=el("g",{},pl); el("rect",{x:1080,y:300,width:470,height:300,rx:18,fill:"#fff",stroke:C.water,"stroke-width":3},R.plT); R.plR=el("text",{x:1110,y:370,"font-size":32,"font-weight":800,fill:C.water},R.plT); R.plR2=el("text",{x:1110,y:430,"font-size":22,fill:C.ink},R.plT);
    R.phR=a.photo(a.svg,{id:"s-a1b-pluviometre",x:1180,y:650,w:270,h:130,cap:"En vrai : pluviomètre",size:21,rot:1.5});
    // ---- RELEVÉ
    const rv=a.layer("rv"); R.rv=rv; const days=["lun.","mar.","mer.","jeu.","ven."], T=[12,14,16,13,9], V=[10,25,15,40,20], P=[0,2,0,12,5]; R.data={T,V,P};
    el("text",{x:800,y:70,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"Notre relevé météo de la semaine (exemple)"},rv);
    const cols=["","Température (°C)","Vent (km/h)","Pluie (mm)"];
    cols.forEach((c,j)=>el("text",{x:[110,430,760,1040][j],y:140,"text-anchor":j?"middle":"start","font-size":24,"font-weight":800,fill:[C.ink,C.liq,C.or,C.water][j],text:c},rv));
    R.cells=days.map((d,i)=>{ el("text",{x:110,y:190+i*50,"font-size":24,"font-weight":700,fill:C.ink,text:d},rv); el("line",{x1:100,y1:205+i*50,x2:1150,y2:205+i*50,stroke:"#E6E9EF","stroke-width":2},rv); return [T[i],V[i],P[i]].map((v,j)=>el("text",{x:[430,760,1040][j],y:190+i*50,"text-anchor":"middle","font-size":26,"font-weight":800,fill:[C.liq,C.or,C.water][j],text:String(v)},rv)); });
    // graphique
    const gx=180, gy=830, gw=1000, gh=300; R.gr=el("g",{},rv); el("line",{x1:gx,y1:gy,x2:gx+gw,y2:gy,stroke:C.ink,"stroke-width":3},R.gr); el("line",{x1:gx,y1:gy,x2:gx,y2:gy-gh-20,stroke:C.ink,"stroke-width":3},R.gr);
    R.bars=P.map((p,i)=>el("rect",{x:gx+60+i*200-30,width:60,fill:C.water,opacity:.7},R.gr)); R.barT=P.map((p,i)=>el("text",{x:gx+60+i*200,y:gy-p*8-12,"text-anchor":"middle","font-size":22,"font-weight":800,fill:"#1D5C99",text:p?p+" mm":""},R.gr)); days.forEach((d,i)=>el("text",{x:gx+60+i*200,y:gy+30,"text-anchor":"middle","font-size":20,fill:C.ink,text:d},R.gr));
    R.line=el("path",{d:"M"+T.map((v,i)=>`${gx+60+i*200},${gy-v*14}`).join(" L"),fill:"none",stroke:C.liq,"stroke-width":5},R.gr); R.pts=T.map((v,i)=>el("circle",{cx:gx+60+i*200,cy:gy-v*14,r:8,fill:C.liq},R.gr)); R.ptT=T.map((v,i)=>el("text",{x:gx+60+i*200+16,y:gy-v*14-14,"font-size":22,"font-weight":800,fill:C.liq,stroke:"#fff","stroke-width":5,"paint-order":"stroke",text:v+" °C"},R.gr));
    el("rect",{x:gx+gw+20,y:gy-150,width:28,height:8,fill:C.liq},R.gr); el("text",{x:gx+gw+58,y:gy-142,"font-size":22,fill:C.liq,"font-weight":700,text:"température"},R.gr); el("rect",{x:gx+gw+20,y:gy-110,width:28,height:22,fill:C.water,opacity:.7},R.gr); el("text",{x:gx+gw+58,y:gy-90,"font-size":22,fill:"#1D5C99","font-weight":700,text:"pluie"},R.gr);
    R.concl=el("g",{},rv); a.label(R.concl,1360,380,"Jeudi : vent fort,\nbeaucoup de pluie,\net vendredi la\ntempérature baisse",{size:22,stroke:C.blue,color:C.blue,w:330});
    // synthèse
    const sy=a.layer("syn"); R.syn=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    el("text",{x:800,y:80,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink,text:"Un capteur → une grandeur → une unité"},sy);
    R.s3=[["thermo","thermomètre","la température","degrés Celsius (°C)",C.liq],["vent","anémomètre","la vitesse du vent","kilomètres par heure (km/h)",C.or],["pluie","pluviomètre","la hauteur de pluie","millimètres (mm)",C.water]].map((f,i)=>{ const g=el("g",{},sy); const x=290+i*510; el("rect",{x:x-230,y:120,width:460,height:300,rx:18,fill:"#fff",stroke:f[4],"stroke-width":4},g); IC[f[0]](a,g,x,200,f[4]); el("text",{x,y:285,"text-anchor":"middle","font-size":30,"font-weight":800,fill:f[4]==C.water?"#1D5C99":f[4],text:f[1]},g); el("text",{x,y:330,"text-anchor":"middle","font-size":24,fill:C.ink,text:"mesure "+f[2]},g); el("text",{x,y:375,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:"en "+f[3]},g); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,200,470,1200,"Dans un récipient plus large, on mesure plus de pluie.","La hauteur d'eau est la même dans un récipient droit, étroit ou large : c'est pour ça qu'on mesure la pluie en millimètres de hauteur.");
    // manipulation : curseur de température (barre #manip)
    a.manip.innerHTML=`Température de l'air : <input type="range" id="mT" min="-10" max="40" step="1" value="${Tair}" aria-label="Température de l'air"> <b id="mTv" style="min-width:80px">${Tair} °C</b>`;
    document.getElementById("mT").oninput=e=>{ Tair=+e.target.value; document.getElementById("mTv").textContent=Tair+" °C"; a.redraw(); };
  },
  reset(a){ [R.th,R.an,R.pl,R.rv,R.syn,R.myth,R.sun,R.cold,R.thT,R.zp,R.concl,R.anP,R.gir,R.plT,R.rl,R.phA,R.phW,R.phR,...R.drops].forEach(e=>a.op(e,0)); },
  etapes:[
  { titre:"Le thermomètre", duree:12000,
    legende:"Quand il fait chaud, le liquide du thermomètre se dilate : ses particules s'agitent et s'écartent, il prend plus de place et monte. Il y a toujours la même quantité de liquide !",
    voix:"Le thermomètre contient un liquide coloré. Quand l'air se réchauffe, les particules du liquide s'agitent et s'écartent un peu : le liquide se dilate, il prend plus de place. Comme le tube est très fin, il monte nettement. Quand il fait froid, c'est l'inverse : le liquide se contracte et descend. Attention : on n'ajoute pas de liquide, il y en a toujours la même quantité !",
    anim(t,a){ const s=a.seg; a.op(R.th,1); a.op(R.zp,s(t,.05,.15)); const T=t<.5?a.lerp(15,35,s(t,.1,.45)):a.lerp(35,-5,s(t,.55,.9));
      a.op(R.sun,t<.5?s(t,.08,.15):1-s(t,.5,.56)); a.op(R.cold,s(t,.55,.62)); a.op(R.thT,1); const tx=R.thT.querySelector("text"); a.wrap(tx,t<.5?"Il fait chaud : le liquide se dilate (il prend plus de place) et monte dans le tube fin.":"Il fait froid : le liquide se contracte (il prend moins de place) et descend.",28);
      setT(a,T); } },
  { titre:"À vous : faites varier la température", duree:9000,
    legende:"À vous : déplacez le curseur pour changer la température de l'air, regardez ce qui change. On lit la température en face du haut de la colonne, en degrés Celsius (°C).",
    voix:"À vous ! Déplacez le curseur pour changer la température de l'air, et regardez ce qui change : le liquide monte ou descend, et ses particules s'agitent plus ou moins. Pour lire la température, on regarde la graduation juste en face du haut de la colonne. On l'exprime en degrés Celsius. Essayez de monter jusqu'à trente degrés, puis de descendre sous zéro. Le thermomètre est placé à l'ombre, dans un abri, pour mesurer la température de l'air. Prenez votre temps.",
    anim(t,a){ const s=a.seg; a.op(R.th,1); a.op(R.zp,1); a.op(R.sun,0); a.op(R.cold,0); a.op(R.rl,s(t,.05,.15)); a.op(R.phA,s(t,.1,.25)); a.op(R.thT,s(t,.1,.2));
      const T=t<.5?a.lerp(-5,33,s(t,0,.5)):a.lerp(33,Tair,s(t,.5,.9)); const r=Math.round(T);
      a.wrap(R.thT.querySelector("text"),`Je lis en face du haut\nde la colonne :\n${r} °C : ${r<0?"il gèle":r<12?"il fait frais":r<26?"température agréable":"il fait très chaud"}`,28); setT(a,T); } },
  { titre:"L'anémomètre et la girouette", duree:12000,
    legende:"Le vent pousse les coupelles de l'anémomètre, qui tournent. Plus le vent est fort, plus elles tournent vite : on compte les tours pour connaître la vitesse du vent, en km/h.",
    voix:"L'anémomètre mesure la vitesse du vent. Le vent pousse ses coupelles, qui se mettent à tourner. Plus le vent est fort, plus elles tournent vite. En comptant les tours par minute, on calcule la vitesse du vent, en kilomètres par heure. À côté, la girouette, elle, indique d'où vient le vent.",
    anim(t,a){ const s=a.seg; a.op(R.th,1-s(t,0,.08)); a.op(R.phA,1-s(t,0,.08)); a.op(R.an,s(t,0,.1)); a.op(R.anP,s(t,.05,.12)); a.op(R.gir,s(t,.6,.7)); a.op(R.phW,s(t,.3,.5));
      const v=t<.4?a.lerp(5,15,s(t,.1,.4)):a.lerp(15,45,s(t,.45,.85)); const ang=(t*12000/1000)*(v*6)*(1); R.rot.setAttribute("transform",`translate(520,420) rotate(${ang})`);
      R.winds.forEach((w,i)=>{ const ph=((t*12000/1000)*(v/20)+i/6)%1; const y=260+i*50; const x=-80+ph*700; a.set(w,{d:`M${x},${y} q30,-${4+v/6} 60,0 t60,0`,"stroke-width":2+v/7}); a.op(w,Math.sin(ph*Math.PI)); });
      const tpm=Math.round(v*2.2); R.an1.textContent=`Vent : ${Math.round(v)} km/h`; R.an2.textContent=`≈ ${tpm} tours par minute (exemple)`; R.an3.textContent=v>35?"Vent fort !":v>15?"Vent modéré":"Vent faible"; R.an4.textContent="plus le vent est fort, plus ça tourne vite";
      R.girA.setAttribute("transform","translate(1106,560) rotate(180)"); } },
  { titre:"Le pluviomètre", duree:12000,
    legende:"Le pluviomètre recueille la pluie. On mesure la hauteur d'eau, en millimètres. Regarde : dans un récipient étroit ou large, la hauteur est la même !",
    voix:"Le pluviomètre recueille l'eau de pluie. On mesure la hauteur d'eau tombée, en millimètres. Regarde bien : sous la même pluie, un récipient étroit et un récipient large se remplissent à la même hauteur ! Le large contient plus d'eau, mais elle est répartie sur une plus grande surface. Un millimètre de pluie, c'est un litre d'eau sur chaque mètre carré.",
    anim(t,a){ const s=a.seg; a.op(R.an,1-s(t,0,.08)); a.op(R.phW,1-s(t,0,.08)); a.op(R.pl,s(t,0,.1)); a.op(R.cloud,1); const mm=25*s(t,.15,.85,true);
      [R.tA,R.tB].forEach(tb=>a.set(tb.liq,{y:780-mm*9,height:mm*9}));
      R.drops.forEach((d,i)=>{ const ph=((t*12000/700)+rnd(i,1))%1; const x=260+rnd(i,2)*650; a.op(d,t>.12&&t<.88?1:0); a.tr(d,x,200+ph*560); });
      a.op(R.plT,s(t,.2,.3)); a.op(R.phR,s(t,.5,.7)); R.plR.textContent=`Pluie : ${mm.toFixed(0)} mm`; a.wrap(R.plR2,t>.6?"Même hauteur dans les deux ! On mesure la hauteur, pas la quantité. 1 mm = 1 litre d'eau par m².":"L'eau monte dans les deux récipients…",34); } },
  { titre:"Relever et exploiter les mesures", duree:12000,
    legende:"Chaque jour, on relève les mesures dans un tableau. Le graphique permet de comparer les jours et de voir comment le temps change.",
    voix:"Chaque jour à la même heure, on relève les mesures et on les note dans un tableau. Avec un graphique, on compare facilement les jours : ici, la température monte jusqu'à mercredi puis baisse, et jeudi est le jour le plus venteux et le plus pluvieux.",
    anim(t,a){ const s=a.seg; a.op(R.pl,1-s(t,0,.08)); a.op(R.phR,1-s(t,0,.08)); a.op(R.phW,0); a.op(R.rv,s(t,0,.1)); R.cells.forEach((row,i)=>row.forEach((c,j)=>a.op(c,s(t,.08+i*.07+j*.02,.12+i*.07+j*.02))));
      R.bars.forEach((b,i)=>{ const h=R.data.P[i]*8*s(t,.5,.75); a.set(b,{y:830-h,height:h}); a.op(R.barT[i],s(t,.7,.8)); }); a.draw(R.line,s(t,.55,.85)); R.pts.forEach((p,i)=>{ a.op(p,s(t,.55+i*.06,.6+i*.06)); a.op(R.ptT[i],s(t,.6+i*.06,.65+i*.06)); }); a.op(R.concl,s(t,.85,.95)); } },
  { titre:"Synthèse", duree:9000,
    legende:"Thermomètre → température en °C ; anémomètre → vitesse du vent en km/h ; pluviomètre → hauteur de pluie en mm.",
    voix:"Récapitulons. Le thermomètre mesure la température, en degrés Celsius. L'anémomètre mesure la vitesse du vent, en kilomètres par heure. Le pluviomètre mesure la hauteur de pluie, en millimètres. En notant ces mesures chaque jour, on peut décrire et comparer le temps qu'il fait.",
    anim(t,a){ const s=a.seg; a.op(R.rv,1-s(t,0,.1)); a.op(R.syn,s(t,0,.1)); R.s3.forEach((f,i)=>{ const v=s(t,.1+i*.15,.25+i*.15); a.op(f,v); a.tr(f,0,(1-v)*40); }); a.op(R.myth,s(t,.65,.8)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
