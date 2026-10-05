/* META {"id":"sciences-D4-thermometre","matiere":"sciences","annee":"connexe","periode":1,"theme":"Mouvement, objets techniques, capteurs : le thermomètre","resume":"Le liquide du thermomètre se dilate quand il fait chaud ; l'échelle Celsius (0 °C glace fondante, 100 °C eau qui bout) ; où placer le thermomètre pour mesurer la température de l'air.","motsCles":["thermomètre","température","degré Celsius","dilatation","capteur","abri météo"]} */
(function(){
let R={}, E=null, a=null;
let Tm=20, spin=0; // manipulation : température choisie (°C) ; temps écoulé dans l'étape de manipulation (ms)
const KM=3;
const C={liq:"#D63A2F",blue:"#2563A8",or:"#E07A1F",gr:"#2E8B57",ink:"#1E2430",gris:"#5A6478",glass:"#EAF4FB",edge:"#7E9BB3",water:"#4A90D9",wood:"#8A5A2B"};
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const f0=v=>Math.round(v).toString().replace("-","−");
const panel=(parent,x,y,w,h,col)=>E("rect",{x,y,width:w,height:h,rx:16,fill:"#fff",stroke:col||"#D6DBE4","stroke-width":3},parent);
const txt=(parent,x,y,s,o)=>{ o=o||{}; return E("text",{x,y,"font-size":o.size||24,"font-weight":o.w||700,fill:o.color||C.ink,"text-anchor":o.anchor||"start",text:s,stroke:o.halo?"#fff":null,"stroke-width":o.halo?5:null,"paint-order":o.halo?"stroke":null},parent); };
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
// thermomètre : bulbe en (cx,yb), échelle de Tmin à Tmax, k pixels par degré
function mkThermo(parent,cx,yb,Tmin,Tmax,k,o){ o=o||{}; const g=E("g",{},parent); const y=T=>yb-34-(T-Tmin)*k; const yt=y(Tmax)-26;
  E("rect",{x:cx-17,y:yt,width:34,height:yb-yt,rx:17,fill:C.glass,stroke:C.edge,"stroke-width":4},g);
  E("circle",{cx,cy:yb,r:34,fill:C.glass,stroke:C.edge,"stroke-width":4},g);
  g.col=E("rect",{x:cx-8,width:16,rx:3,fill:C.liq},g); E("circle",{cx,cy:yb,r:27,fill:C.liq},g);
  const sd=o.left?-1:1;
  for(let T=Math.ceil(Tmin/5)*5;T<=Tmax;T+=5){ if(o.hideBelow!==undefined&&y(T)>o.hideBelow) continue; const mj=T%10===0; E("line",{x1:cx+sd*20,y1:y(T),x2:cx+sd*(mj?46:35),y2:y(T),stroke:C.ink,"stroke-width":mj?3:2},g);
    if(o.lab&&T%o.lab===0) E("text",{x:cx+sd*54,y:y(T)+8,"text-anchor":o.left?"end":"start","font-size":o.size||22,"font-weight":700,fill:C.ink,text:f0(T)+" °C"},g); }
  g.set=T=>{ const yy=y(clamp(T,Tmin,Tmax)); g.col.setAttribute("y",yy); g.col.setAttribute("height",yb-yy); }; g.y=y; g.cx=cx; g.yb=yb; return g; }
// zoom : les particules du liquide
function mkZoom(parent,x,y,w,h,bot){ const g=E("g",{},parent); panel(g,x,y,w,h); txt(g,x+w/2,y+44,"Zoom dans le liquide",{size:26,w:800,anchor:"middle"});
  g.liq=E("rect",{x:x+30,width:w-60,fill:"#FBE3E0",stroke:C.liq,"stroke-width":3},g); g.parts=[...Array(40)].map(()=>E("circle",{r:11,fill:C.liq},g));
  txt(g,x+w/2,y+h-54,"40 particules :",{size:22,anchor:"middle"}); txt(g,x+w/2,y+h-26,"toujours le même nombre !",{size:22,anchor:"middle"}); g.x=x; g.w=w; g.bot=bot; return g; }
function setZoom(z,T,tt){ const hh=140+(T+20)*2.3, top=z.bot-hh, amp=1+(T+20)*.065; a.set(z.liq,{y:top,height:hh}); const cw=(z.w-60)/8;
  z.parts.forEach((p,i)=>{ const cx=z.x+30+((i%8)+.5)*cw, cy=top+(Math.floor(i/8)+.5)*(hh/5); a.set(p,{cx:cx+Math.sin(tt+i*1.7)*amp,cy:cy+Math.cos(tt*1.3+i*2.3)*amp}); }); }
function mkBeaker(parent,cx,y0,y1,w){ const g=E("g",{},parent); g.water=E("rect",{x:cx-w/2+4,y:y0+40,width:w-8,height:y1-y0-44,fill:"#BFDDF5",opacity:.9},g);
  E("path",{d:`M${cx-w/2},${y0} L${cx-w/2},${y1} L${cx+w/2},${y1} L${cx+w/2},${y0}`,fill:"none",stroke:C.edge,"stroke-width":6,"stroke-linejoin":"round"},g); g.cx=cx; g.y0=y0; g.y1=y1; g.w=w; return g; }
function mkCubes(parent,cx,y,half){ return [-half+8,-half+54,half-98,half-52].map((dx,i)=>E("rect",{x:cx+dx,y:y+(i%2)*10,width:44,height:44,rx:8,fill:"#E4F3FC",stroke:"#8FC3E6","stroke-width":3,opacity:.95},parent)); }
function mkBubbles(parent,n){ return [...Array(n)].map(()=>E("circle",{r:6,fill:"#fff",stroke:"#9CC4E8","stroke-width":2},parent)); }
function mkFlame(parent,cx,y){ const g=E("g",{},parent); [-50,0,50].forEach(dx=>E("path",{d:`M${cx+dx},${y} q-22,-26 0,-62 q8,22 22,34 q8,18 -22,28 z`,fill:"#F6A21E",stroke:"#D9480F","stroke-width":3},g)); return g; }
function mkSun(parent,x,y,r){ const g=E("g",{},parent); E("circle",{cx:x,cy:y,r,fill:"#F6C445"},g); for(let i=0;i<12;i++){ const t=i/12*Math.PI*2; E("line",{x1:x+(r+14)*Math.cos(t),y1:y+(r+14)*Math.sin(t),x2:x+(r+40)*Math.cos(t),y2:y+(r+40)*Math.sin(t),stroke:"#F6C445","stroke-width":8,"stroke-linecap":"round"},g); } return g; }

Anim.run({
  titre:"Le thermomètre : mesurer la température",
  sousTitre:"Sciences et technologie · CM1-CM2 · Capteurs et mesures",
  matiere:"sciences", badge:"Sciences",
  accroche:"Comment un thermomètre mesure-t-il la température ? Et que veut dire 0 °C ?",
  manipDes:KM, manipJusqua:KM,
  init(api){
    a=api; E=a.el;
    // ================= 1. mécanisme : bain d'eau chauffé puis refroidi
    const L1=a.layer("t1"); R.L1=L1;
    R.bk1=mkBeaker(L1,330,600,790,260); R.cu1=mkCubes(L1,330,628,130); R.th1=mkThermo(L1,330,690,-20,110,4,{lab:20,hideBelow:596});
    R.fl1=mkFlame(L1,330,860); E("rect",{x:230,y:792,width:200,height:10,rx:4,fill:"#8C96A6"},L1);
    R.cap1=txt(L1,296,552,"",{size:26,anchor:"end",color:C.gris});
    R.rd1=txt(L1,330,100,"",{size:44,w:800,anchor:"middle",color:C.liq});
    R.zm1=mkZoom(L1,640,200,380,600,722); R.zl1=E("path",{stroke:"#9AA3B2","stroke-width":2,"stroke-dasharray":"8 6",fill:"none"},L1);
    R.tx1=E("g",{},L1); panel(R.tx1,1050,130,510,340,C.liq); R.tx1t=E("text",{x:1080,y:185,"font-size":28,"font-weight":700,fill:C.ink},R.tx1);
    R.ph1=a.photo(L1,{id:"s-d4-thermometre",x:1130,y:520,w:350,h:233,cap:"Un thermomètre à liquide coloré",rot:1.5,size:21});
    // ================= 2. deux repères : 0 °C et 100 °C
    const L2=a.layer("t2"); R.L2=L2;
    R.bkI=mkBeaker(L2,330,610,790,260); R.cuI=mkCubes(L2,330,636,130); a.set(R.bkI.water,{fill:"#D5ECFA"});
    R.bkB=mkBeaker(L2,1270,610,790,260); a.set(R.bkB.water,{fill:"#BFDDF5"}); R.bub=mkBubbles(L2,14); R.flB=mkFlame(L2,1270,860); E("rect",{x:1170,y:792,width:200,height:10,rx:4,fill:"#8C96A6"},L2);
    R.vap=E("g",{},L2); [1210,1270,1330].forEach(x=>E("path",{d:`M${x},590 q-18,-30 0,-60 q18,-30 0,-60`,fill:"none",stroke:"#B8C4D2","stroke-width":8,"stroke-linecap":"round"},R.vap));
    R.th2=E("g",{},L2); R.th2i=mkThermo(R.th2,0,700,-30,110,3.6,{lab:50,hideBelow:600}); // dessiné en x=0, déplacé ensuite
    R.l0=E("g",{},L2); txt(R.l0,292,500,"0 °C",{size:34,w:800,anchor:"end",color:C.blue}); txt(R.l0,292,536,"la glace fondante",{size:26,w:700,anchor:"end",color:C.blue}); txt(R.l0,292,568,"(l'eau gèle, la glace fond)",{size:21,w:600,anchor:"end",color:C.gris});
    R.l100=E("g",{},L2); txt(R.l100,1120,690,"100 °C",{size:34,w:800,anchor:"end",color:C.liq}); txt(R.l100,1120,726,"l'eau qui bout",{size:26,w:700,anchor:"end",color:C.liq}); txt(R.l100,1120,758,"(au niveau de la mer)",{size:21,w:600,anchor:"end",color:C.gris});
    R.rd2=txt(L2,800,100,"",{size:44,w:800,anchor:"middle",color:C.liq});
    R.br=E("g",{},L2); R.brL=E("path",{stroke:C.or,"stroke-width":6,fill:"none","stroke-linecap":"round"},R.br); R.brT=E("text",{x:0,y:0,"font-size":26,"font-weight":800,fill:C.or,"text-anchor":"end"},R.br);
    R.tx2=E("g",{},L2); panel(R.tx2,500,150,420,330,C.or); R.tx2t=E("text",{x:530,y:205,"font-size":27,"font-weight":700,fill:C.ink},R.tx2);
    // ================= 3. repères du quotidien (exemples)
    const L3=a.layer("t3"); R.L3=L3; R.th3=mkThermo(L3,440,820,-20,100,5.2,{lab:20,size:20,left:true});
    R.neg=E("g",{},L3); E("rect",{x:60,y:R.th3.y(0)+12,width:210,height:R.th3.y(-20)-R.th3.y(0)+22,rx:10,fill:"#E4F3FC",stroke:C.blue,"stroke-width":3},R.neg); [["sous zéro :",0],["températures",1],["négatives",2]].forEach(([l,i])=>E("text",{x:165,y:R.th3.y(0)+46+i*28,"text-anchor":"middle","font-size":23,"font-weight":800,fill:C.blue,text:l},R.neg));
    R.mk=[[100,"eau qui bout","100 °C",C.liq,162],[37,"corps humain (environ)","37 °C",C.or,445],[20,"salle de classe (exemple)","20 °C",C.gr,540],[4,"réfrigérateur (exemple)","4 °C",C.blue,625],[0,"glace fondante","0 °C",C.blue,700],[-18,"congélateur (exemple)","−18 °C",C.blue,776]].map(([T,nom,val,col,ly])=>{
      const g=E("g",{},L3), y=R.th3.y(T); E("path",{d:`M${470},${y} L640,${ly}`,stroke:col,"stroke-width":3,fill:"none"},g); E("circle",{cx:440,cy:y,r:7,fill:col},g);
      panel(g,640,ly-30,500,60,col); txt(g,658,ly+9,val,{size:28,w:800,color:col}); txt(g,780,ly+9,nom,{size:25,w:600}); g.T=T; return g; });
    R.ph3=a.photo(L3,{id:"s-d4-thermometre",x:1220,y:120,w:300,h:200,cap:"Thermomètre à liquide",rot:2,size:21});
    R.th3r=txt(L3,440,100,"",{size:44,w:800,anchor:"middle",color:C.liq});
    // ================= 4. MANIPULATION : température du bain
    const L4=a.layer("t4"); R.L4=L4; R.bk4=mkBeaker(L4,300,700,860,320); R.cu4=mkCubes(L4,300,732,160); R.th4=mkThermo(L4,300,780,-30,110,4.2,{lab:20,hideBelow:696});
    R.z0=E("g",{},L4); R.z0l=E("line",{x1:120,x2:280,stroke:C.blue,"stroke-width":4,"stroke-dasharray":"10 6"},R.z0); R.z0t=txt(R.z0,270,0,"glace fondante",{size:22,anchor:"end",color:C.blue}); R.z100=E("g",{},L4); R.z100l=E("line",{x1:120,x2:280,stroke:C.liq,"stroke-width":4,"stroke-dasharray":"10 6"},R.z100); R.z100t=txt(R.z100,270,0,"eau qui bout",{size:22,anchor:"end",color:C.liq});
    R.zm4=mkZoom(L4,560,110,380,680,700); R.rp4=E("g",{},L4); panel(R.rp4,1010,110,550,150,C.liq); R.rd4=txt(R.rp4,1285,200,"",{size:62,w:800,anchor:"middle",color:C.liq}); R.st4=txt(R.rp4,1285,240,"",{size:26,w:700,anchor:"middle"});
    R.bub4=mkBubbles(L4,16); R.vap4=E("g",{},L4); [205,395].forEach(x=>E("path",{d:`M${x},680 q-18,-30 0,-60 q18,-30 0,-60`,fill:"none",stroke:"#B8C4D2","stroke-width":8,"stroke-linecap":"round"},R.vap4));
    R.nt4=E("g",{},L4); panel(R.nt4,1010,310,550,300,C.or); const tn4=E("text",{x:1040,y:370,"font-size":27,"font-weight":700,fill:C.ink},R.nt4); a.wrap(tn4,"Repères à retrouver :\n0 °C : la glace fond\n100 °C : l'eau bout\nSous zéro : températures négatives",32);
    // ================= 5. où placer le thermomètre ?
    const L5=a.layer("t5"); R.L5=L5; E("rect",{x:0,y:760,width:1600,height:140,fill:"#DDEBD3"},L5); E("line",{x1:0,y1:760,x2:1600,y2:760,stroke:"#9DB78C","stroke-width":5},L5);
    R.sun5=mkSun(L5,130,170,56); R.ray=E("g",{},L5); [[200,230,300,640],[215,215,330,625],[190,250,260,650]].forEach(([x1,y1,x2,y2])=>a.arrow(R.ray,`M${x1},${y1} L${x2},${y2}`,{color:"#F0A818",w:6,head:3,dash:"14 10"}));
    E("rect",{x:700,y:490,width:200,height:270,fill:"#D9A58C",stroke:"#A8704F","stroke-width":4},L5); for(let r=0;r<6;r++){ E("line",{x1:700,y1:490+r*45,x2:900,y2:490+r*45,stroke:"#A8704F","stroke-width":2},L5); }
    [330,800].forEach(x=>E("rect",{x:x-8,y:734,width:16,height:26,fill:C.wood},L5));
    R.ths=[[330,700],[800,700],[1270,560]].map(([cx,yb])=>mkThermo(L5,cx,yb,10,45,5,{lab:10,size:20}));
    E("rect",{x:1255,y:600,width:30,height:160,fill:C.wood},L5);
    R.ab=E("g",{},L5); E("rect",{x:1120,y:290,width:300,height:310,rx:10,fill:"#fff",stroke:"#9AA3B2","stroke-width":5},R.ab); for(let i=0;i<8;i++) E("path",{d:`M1120,${312+i*36} L1420,${312+i*36+16}`,stroke:"#B8BEC8","stroke-width":8},R.ab); // volets à claire-voie
    E("rect",{x:1210,y:300,width:120,height:290,fill:"#fff",opacity:.85},R.ab); R.ths[2].parentNode.appendChild(R.ths[2]); E("line",{x1:1445,y1:600,x2:1445,y2:760,stroke:C.gr,"stroke-width":4},L5); E("line",{x1:1430,y1:600,x2:1460,y2:600,stroke:C.gr,"stroke-width":4},L5); E("line",{x1:1430,y1:760,x2:1460,y2:760,stroke:C.gr,"stroke-width":4},L5); txt(L5,1470,690,"1,5 m",{size:24,w:800,color:C.gr});
    R.ab.setAttribute("opacity",1);
    R.lb=[[330,"en plein soleil",C.liq],[800,"contre un mur\nchauffé par le soleil",C.liq],[1270,"à l'ombre, dans un abri,\nà 1,5 m du sol",C.gr]].map(([x,t,col],i)=>{ const g=E("g",{},L5); const ls=t.split("\n"); ls.forEach((l,j)=>txt(g,x,808+j*30,l,{size:24,w:800,anchor:"middle",color:col})); return g; });
    R.rd5=[330,800,1270].map((x,i)=>txt(L5,x,[428,428,248][i],"",{size:40,w:800,anchor:"middle",color:C.liq,halo:1}));
    R.vd=[[330,"✗"],[800,"✗"],[1270,"✓"]].map(([x,s],i)=>{ const g=E("g",{},L5); txt(g,x+120,[600,600,300][i],s,{size:60,w:800,color:i<2?C.liq:C.gr}); return g; });
    R.air=E("g",{},L5); a.label(R.air,860,62,"La vraie température de l'air : 22 °C (exemple)",{size:28,stroke:C.gr,color:C.gr,fill:"#E8F6EE"});
    R.ph5=a.photo(L5,{id:"s-d4-abri-meteo",x:600,y:130,w:230,h:153,cap:"Abri météo",rot:-2,size:20});
    // ================= synthèse
    const sy=a.layer("syn"); R.syn=sy; E("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy); txt(sy,800,70,"À retenir",{size:38,w:800,anchor:"middle"});
    R.pts=[["1","Quand il fait chaud, le liquide se dilate : il prend plus de place et monte dans le tube.",C.liq],["2","Échelle Celsius : 0 °C = glace fondante, 100 °C = eau qui bout.",C.blue],["3","On mesure la température de l'air à l'ombre, à l'abri, à environ 1,5 m du sol.",C.gr]].map(([n,t,c],i)=>{
      const g=E("g",{},sy); E("rect",{x:150,y:110+i*105,width:1300,height:88,rx:16,fill:"#fff",stroke:c,"stroke-width":4},g); E("circle",{cx:205,cy:154+i*105,r:28,fill:c},g); E("text",{x:205,y:166+i*105,"text-anchor":"middle","font-size":34,"font-weight":800,fill:"#fff",text:n},g);
      E("text",{x:255,y:164+i*105,"font-size":26,"font-weight":700,fill:C.ink,text:t},g); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,150,450,1300,"0 °C, c'est l'absence de chaleur : il n'y a plus rien de chaud.","0 °C est seulement la température de la glace qui fond. Il peut faire plus froid : −18 °C dans un congélateur. Ces températures sont négatives.");
    // manipulation
    a.manip.innerHTML=`Température du bain d'eau : <input type="range" id="mT" min="-20" max="110" step="1" value="${Tm}" aria-label="Température du bain d'eau"> <b id="mTv" style="min-width:90px">${f0(Tm)} °C</b>`;
    document.getElementById("mT").oninput=e=>{ Tm=+e.target.value; document.getElementById("mTv").textContent=f0(Tm)+" °C"; spin=0; a.redraw(); };
    let last=performance.now(); setInterval(()=>{ const now=performance.now(), dt=Math.min(now-last,100); last=now; if(a.step()===KM){ spin+=dt; a.redraw(); } },40);
  },
  reset(a){ [R.L1,R.L2,R.L3,R.L4,R.L5,R.syn,R.myth,R.fl1,...R.cu1,R.tx1,R.ph1,R.cap1,R.rd1,R.zl1,R.l0,R.l100,R.vap,R.br,R.tx2,R.neg,R.ph3,R.ph5,R.rp4,R.nt4,R.air,R.ray,R.vap4,R.flB,...R.cuI,...R.bub,...R.bub4,...R.cu4,...R.mk,...R.lb,...R.vd,...R.rd5,R.rd2,R.th3r].forEach(e=>a.op(e,0));
    R.pts.forEach(g=>a.op(g,0)); },
  etapes:[
  { titre:"Le liquide se dilate", duree:13000,
    legende:"Quand l'eau chauffe, les particules du liquide s'agitent et s'écartent : le liquide se dilate, prend plus de place et monte dans le tube fin. Quand l'eau refroidit, il se contracte et descend.",
    voix:"Plongeons un thermomètre dans de l'eau qu'on chauffe. Le liquide coloré du thermomètre se réchauffe. Ses particules s'agitent et s'écartent un peu : le liquide se dilate, il prend plus de place. Comme le tube est très fin, le liquide monte nettement. Ensuite, on ajoute des glaçons : l'eau refroidit, le liquide se contracte et redescend. Attention : il y a toujours le même nombre de particules, il ne s'en ajoute pas !",
    anim(t,a){ const s=a.seg; a.op(R.L1,1); const heat=t<.5, T=t<.5?a.lerp(20,80,s(t,.08,.45)):a.lerp(80,3,s(t,.55,.9));
      a.op(R.fl1,heat?s(t,.04,.1)*(1-s(t,.45,.5)):0); R.cu1.forEach(c=>a.op(c,heat?0:s(t,.5,.58))); a.op(R.cap1,1); R.cap1.textContent=heat?"on chauffe l'eau":"on ajoute des glaçons";
      R.th1.set(T); R.rd1.setAttribute("x",330); R.rd1.textContent=f0(T)+" °C"; a.op(R.rd1,1); a.set(R.bk1.water,{fill:T>40?"#F4C9A8":"#BFDDF5"});
      a.op(R.zm1,s(t,.04,.12)); setZoom(R.zm1,T,t*12000/180); a.set(R.zl1,{d:`M364,690 L640,740`}); a.op(R.zl1,s(t,.04,.12));
      a.op(R.tx1,s(t,.06,.14)); a.wrap(R.tx1t,heat?"Il fait plus chaud : les particules s'agitent et s'écartent. Le liquide prend plus de place et monte dans le tube fin.":"Il fait plus froid : les particules s'agitent moins et se rapprochent. Le liquide prend moins de place et descend.",30); a.op(R.ph1,s(t,.5,.7)); } },
  { titre:"Deux repères : 0 °C et 100 °C", duree:15000,
    legende:"Pour graduer un thermomètre, on utilise deux repères : dans la glace fondante, le liquide marque 0 °C ; dans l'eau qui bout, il marque 100 °C. On partage ensuite l'intervalle en 100 graduations égales.",
    voix:"Pour graduer un thermomètre, on choisit deux repères faciles à retrouver. Premier repère : la glace fondante. Le liquide descend, et on marque zéro degré Celsius. Deuxième repère : l'eau qui bout, au niveau de la mer. Le liquide monte, et on marque cent degrés Celsius. Entre les deux, on partage l'intervalle en cent graduations égales : chaque graduation vaut un degré.",
    anim(t,a){ const s=a.seg; a.op(R.L1,1-s(t,0,.06)); a.op(R.L2,1); const mv=s(t,.36,.5); const x=a.lerp(330,1270,mv); const lift=-70*Math.sin(Math.PI*mv);
      const T=t<.36?a.lerp(20,0,s(t,.06,.28)):a.lerp(0,100,s(t,.5,.78)); R.th2i.set(T); a.tr(R.th2,x,lift); a.op(R.th2,1);
      R.rd2.textContent=f0(T)+" °C"; a.op(R.rd2,1); R.rd2.setAttribute("x",x); R.rd2.setAttribute("y",118+lift); R.cuI.forEach(c=>a.op(c,1)); a.op(R.bkI.water,1);
      a.op(R.l0,s(t,.26,.34)*(1-s(t,.4,.46))+s(t,.9,.96)*0); a.op(R.l100,s(t,.74,.82)); a.op(R.flB,s(t,.46,.52)); a.op(R.vap,s(t,.7,.8));
      R.bub.forEach((b,i)=>{ const ph=((t*15000/900)+rnd(i,1))%1; a.set(b,{cx:1270-100+rnd(i,2)*200,cy:780-ph*150}); a.op(b,t>.5?1:0); });
      const yy=R.th2i.y(100), y0=R.th2i.y(0); a.op(R.br,s(t,.85,.95)); a.set(R.brL,{d:`M${1270-50},${yy} Q${1270-70},${yy} ${1270-70},${yy+20} L${1270-70},${(yy+y0)/2-14} L${1270-82},${(yy+y0)/2} L${1270-70},${(yy+y0)/2+14} L${1270-70},${y0-20} Q${1270-70},${y0} ${1270-50},${y0}`}); R.brT.setAttribute("x",1270-92); R.brT.setAttribute("y",(yy+y0)/2-6); a.wrap(R.brT,"100 graduations\négales : 1 °C\npar graduation",16); R.brT.setAttribute("text-anchor","end"); [...R.brT.children].forEach(c=>c.setAttribute("text-anchor","end"));
      a.op(R.tx2,s(t,.1,.2)); a.wrap(R.tx2t,"Deux repères :\n0 °C : glace fondante\n100 °C : eau qui bout\nL'intervalle est partagé en 100 parties égales : les degrés Celsius.",24); } },
  { titre:"Les températures de la vie courante", duree:13000,
    legende:"Quelques repères (exemples) : −18 °C dans un congélateur, 0 °C glace fondante, 4 °C au réfrigérateur, 20 °C en classe, 37 °C pour le corps, 100 °C eau qui bout.",
    voix:"Regardons quelques repères de la vie courante. Dans un congélateur, il fait environ moins dix-huit degrés : c'est une température négative, sous zéro. La glace fondante, c'est zéro degré. Dans un réfrigérateur, environ quatre degrés. Dans une salle de classe, vingt degrés. Notre corps est à environ trente-sept degrés. Et l'eau qui bout, cent degrés. Ces valeurs sont des exemples.",
    anim(t,a){ const s=a.seg; a.op(R.L2,1-s(t,0,.06)); a.op(R.L3,1); const T=a.lerp(-20,100,s(t,.06,.9,true)); R.th3.set(T); R.th3r.textContent=f0(T)+" °C"; a.op(R.th3r,1);
      R.mk.forEach(g=>a.op(g,clamp((T-g.T+8)/5,0,1))); a.op(R.neg,s(t,.2,.3)); a.op(R.ph3,s(t,.7,.9)); } },
  { titre:"À vous : changez la température", duree:6000,
    legende:"À vous : déplacez le curseur pour changer la température du bain d'eau et regardez ce qui change : le liquide du thermomètre, ses particules, et l'eau elle-même. Que se passe-t-il à 0 °C ? à 100 °C ?",
    voix:"À vous ! Déplacez le curseur pour changer la température de l'eau. Regardez le liquide du thermomètre monter ou descendre, et ses particules s'agiter plus ou moins. Regardez aussi l'eau : que se passe-t-il à zéro degré ? Et à cent degrés ? Essayez de descendre sous zéro : la température devient négative. Prenez votre temps.",
    anim(t,a){ const s=a.seg; a.op(R.L3,1-s(t,0,.1)); a.op(R.L4,1); a.op(R.th3r,0); const bump=s(t,0,.4)*(1-s(t,.5,.9)); const T=t<1?Tm+(70-Tm)*bump:Tm;
      R.th4.set(T); setZoom(R.zm4,T,t<1?t*6000/180:spin/180); a.op(R.zm4,s(t,0,.12));
      a.set(R.z0l,{y1:R.th4.y(0),y2:R.th4.y(0)}); a.set(R.z0t,{y:R.th4.y(0)-10}); a.set(R.z100l,{y1:R.th4.y(100),y2:R.th4.y(100)}); a.set(R.z100t,{y:R.th4.y(100)-10}); a.op(R.z0,s(t,.1,.2)); a.op(R.z100,s(t,.1,.2));
      a.op(R.rp4,s(t,.05,.15)); R.rd4.textContent=f0(T)+" °C";
      R.st4.textContent=T<-.5?"glace (température négative)":T<.5?"la glace fond, l'eau gèle":T<99.5?"l'eau est liquide":T<100.5?"l'eau bout":"vapeur d'eau";
      const ice=T<=.5, boil=T>=99.5; a.set(R.bk4.water,{fill:ice?"#E4F3FC":T>45?"#F4C9A8":"#BFDDF5"}); R.cu4.forEach(c=>a.op(c,ice?1:0)); R.bub4.forEach((b,i)=>{ const ph=((spin/900)+rnd(i,3))%1; a.set(b,{cx:300-140+rnd(i,4)*280,cy:830-ph*110}); a.op(b,boil?1:0); }); a.op(R.vap4,boil?1:0); a.op(R.nt4,s(t,.15,.3)); } },
  { titre:"Où placer le thermomètre ?", duree:14000,
    legende:"Pour mesurer la température de l'air, on place le thermomètre à l'ombre, à l'abri du soleil direct, à environ 1,5 m du sol. Au soleil ou contre un mur chaud, il mesure sa propre chaleur : la mesure est fausse !",
    voix:"Où placer le thermomètre pour mesurer la température de l'air ? En plein soleil, le thermomètre est chauffé directement par les rayons : il indique plus que la température de l'air. Contre un mur chauffé par le soleil, c'est pareil. La bonne place, c'est à l'ombre, dans un abri aéré, à environ un mètre cinquante du sol. Là, il indique la vraie température de l'air : vingt-deux degrés dans cet exemple.",
    anim(t,a){ const s=a.seg; a.op(R.L4,1-s(t,0,.06)); a.op(R.L5,1); a.op(R.air,s(t,.03,.12)); a.op(R.ray,s(t,.1,.2)); a.op(R.ph5,s(t,.7,.9));
      const Ts=[a.lerp(22,36,s(t,.2,.45)),a.lerp(22,31,s(t,.32,.55)),22]; Ts.forEach((T,i)=>{ R.ths[i].set(T); R.rd5[i].textContent=f0(T)+" °C"; a.op(R.rd5[i],s(t,.18+i*.1,.28+i*.1)); a.op(R.lb[i],s(t,.1+i*.08,.2+i*.08)); a.op(R.vd[i],s(t,.5+i*.08,.6+i*.08)); }); } },
  { titre:"Synthèse", duree:10000,
    legende:"Le liquide se dilate quand il fait chaud. Échelle Celsius : 0 °C glace fondante, 100 °C eau qui bout. On mesure à l'ombre, à l'abri, à 1,5 m du sol.",
    voix:"Pour retenir. Quand il fait chaud, le liquide du thermomètre se dilate : il prend plus de place et monte dans le tube. L'échelle Celsius a deux repères : zéro degré pour la glace fondante, cent degrés pour l'eau qui bout. Et pour mesurer la température de l'air, on place le thermomètre à l'ombre, dans un abri, à environ un mètre cinquante du sol. Attention : zéro degré, ce n'est pas l'absence de chaleur. Il existe des températures plus basses, que l'on appelle négatives.",
    anim(t,a){ const s=a.seg; a.op(R.L5,1-s(t,0,.1)); a.op(R.syn,s(t,0,.1)); R.pts.forEach((g,i)=>a.op(g,s(t,.08+i*.12,.18+i*.12))); a.op(R.myth,s(t,.55,.7)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
