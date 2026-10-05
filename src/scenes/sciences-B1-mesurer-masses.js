/* META {"id":"sciences-B1-mesurer-masses","matiere":"sciences","annee":"B","periode":1,"theme":"La matière : comparer et mesurer des masses","resume":"Soupeser ne suffit pas : balance à plateaux, masses marquées, balance électronique et tare pour comparer et mesurer des masses.","motsCles":["masse","balance","gramme","tare","masses marquées","équilibre"]} */
(function(){
let R={}, manipM=[], manipActive=false, lastMs=[], oi=0; // manipulation : masses ajoutées par l'élève, objet à peser (oi)
const OBJ=[180,130,240]; // masses des pommes proposées en manipulation (la 1re est celle de la démonstration)
const STATES=[[100],[100,50],[100,50,50],[100,50,20],[100,50,20,10]]; // essais automatiques pour la pomme
const hOf=g=>g>=500?80:g>=200?64:g>=100?56:g>=50?48:g>=20?42:36;
const fsOf=g=>Math.max(16,hOf(g)*.34);
const wOf=g=>Math.max(hOf(g)*.9,(g+" g").length*fsOf(g)*.58+10)+6;
const sumOf=m=>m.reduce((x,y)=>x+y,0);
function hand(a,p,x,y,sc){ const g=a.el("g",{transform:`translate(${x},${y}) scale(${sc||1})`},p), f="#F1C9A5", st="#B98A62";
  a.el("rect",{x:-45,y:-10,width:90,height:80,rx:28,fill:f,stroke:st,"stroke-width":4},g);
  [[-33,-60],[-11,-72],[11,-72],[33,-60]].forEach(([dx,top])=>a.el("rect",{x:dx-9,y:top,width:18,height:70,rx:9,fill:f,stroke:st,"stroke-width":4},g));
  a.el("rect",{x:-72,y:10,width:52,height:20,rx:10,fill:f,stroke:st,"stroke-width":4,transform:"rotate(-35 -46 20)"},g); return g; }
const C={beam:"#5B6B7F",pan:"#8C96A6",or:"#E07A1F",bl:"#2563A8",gr:"#2E8B57",red:"#C0392B",ink:"#1E2430",water:"#4A90D9",oil:"#E4C34A"};
const PX=800, PY=380, HALF=330, STR=170, POMME=180;
function massObj(a,p,g){ const G=a.el("g",{},p); const h=hOf(g), w=wOf(g)-6; a.el("rect",{x:-w/2,y:-h,width:w,height:h,rx:6,fill:"#B8A27A",stroke:"#6B5A3A","stroke-width":2.5},G); a.el("rect",{x:-w/4,y:-h-12,width:w/2,height:14,rx:4,fill:"#9C875F",stroke:"#6B5A3A","stroke-width":2},G); a.el("text",{x:0,y:-h/2+7,"text-anchor":"middle","font-size":fsOf(g),"font-weight":800,fill:"#3A2E1A",text:g+" g"},G); G._w=w+6; return G; }
Anim.run({
  titre:"Comparer et mesurer des masses",
  sousTitre:"Sciences et technologie · CM1-CM2 · La matière",
  matiere:"sciences", badge:"Sciences",
  accroche:"Le plus gros objet est-il toujours le plus lourd ?",
  manipDes:4, manipJusqua:4,
  init(a){
    const {el}=a;
    const bal=a.layer("bal"); R.bal=bal;
    el("path",{d:`M${PX-140},800 L${PX+140},800 L${PX+40},760 L${PX-40},760Z`,fill:C.beam},bal); el("rect",{x:PX-14,y:PY,width:28,height:385,fill:C.beam},bal);
    R.beam=el("g",{},bal); el("rect",{x:-HALF-10,y:-10,width:2*HALF+20,height:20,rx:10,fill:C.beam},R.beam); el("path",{d:"M-14,-10 L0,-60 L14,-10Z",fill:C.or},R.beam);
    R.needle=el("line",{x1:0,y1:-10,x2:0,y2:-70,stroke:C.red,"stroke-width":5},R.beam);
    el("circle",{cx:PX,cy:PY,r:16,fill:"#333"},bal);
    R.pans=[-1,1].map(sg=>{ const g=el("g",{},bal); el("line",{x1:-90,y1:STR,x2:0,y2:0,stroke:"#555","stroke-width":3},g); el("line",{x1:90,y1:STR,x2:0,y2:0,stroke:"#555","stroke-width":3},g); el("path",{d:`M-130,${STR} Q0,${STR+40} 130,${STR}Z`,fill:C.pan,stroke:"#5A6475","stroke-width":3},g); g.load=el("g",{transform:`translate(0,${STR})`},g); return g; });
    R.state=el("text",{x:PX,y:860,"text-anchor":"middle","font-size":30,"font-weight":800},bal);
    // objets
    R.ballon=el("g",{},a.svg); el("ellipse",{cx:0,cy:-95,rx:85,ry:95,fill:"#E74C3C",stroke:"#A93226","stroke-width":3},R.ballon); el("ellipse",{cx:-30,cy:-130,rx:18,ry:28,fill:"#fff",opacity:.35},R.ballon); el("path",{d:"M-8,0 L8,0 L0,-12Z",fill:"#A93226"},R.ballon);
    R.boule=el("g",{},a.svg); el("circle",{cx:0,cy:-38,r:38,fill:"#9AA3AE",stroke:"#5A6475","stroke-width":3},R.boule); [-14,0,14].forEach(d=>el("path",{d:`M-36,${-38+d} Q0,${-30+d} 36,${-38+d}`,fill:"none",stroke:"#5A6475","stroke-width":2},R.boule)); el("circle",{cx:-12,cy:-50,r:8,fill:"#fff",opacity:.5},R.boule);
    R.pomme=el("g",{},a.svg); el("path",{d:"M0,-70 C-50,-95 -60,-20 -30,-4 C-15,4 -5,-4 0,-4 C5,-4 15,4 30,-4 C60,-20 50,-95 0,-70Z",fill:"#C0392B",stroke:"#7B241C","stroke-width":3},R.pomme); el("path",{d:"M0,-70 Q4,-90 12,-98",stroke:"#5A3A1A","stroke-width":5,fill:"none"},R.pomme); el("path",{d:"M6,-86 Q30,-100 34,-80 Q16,-76 6,-86Z",fill:"#2E8B57"},R.pomme);
    R.mm=[500,200].map(g=>massObj(a,a.svg,g));
    R.lab=[-1,1].map(()=>el("text",{"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":5,"paint-order":"stroke"},a.svg));
    // mains
    R.mains=el("g",{},a.svg); [450,1150].forEach(x=>hand(a,R.mains,x,570,1.5));
    R.q=el("text",{x:800,y:200,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink},a.svg);
    // balance électronique
    const be=a.layer("be"); R.be=be;
    el("rect",{x:520,y:640,width:560,height:120,rx:18,fill:"#E9EDF2",stroke:"#8C96A6","stroke-width":4},be); el("rect",{x:560,y:610,width:480,height:30,rx:8,fill:"#C9CFD8",stroke:"#8C96A6","stroke-width":3},be);
    el("rect",{x:620,y:670,width:260,height:70,rx:8,fill:"#1E2A20"},be); R.disp=el("text",{x:860,y:725,"text-anchor":"end","font-size":50,"font-weight":800,fill:"#7CFF8A","font-family":"Consolas,monospace"},be);
    R.tareB=el("g",{},be); el("rect",{x:910,y:680,width:130,height:52,rx:10,fill:C.or},R.tareB); el("text",{x:975,y:716,"text-anchor":"middle","font-size":26,"font-weight":800,fill:"#fff",text:"TARE"},R.tareB);
    R.verre=el("g",{},be); R.liq=el("rect",{x:-70,width:140,fill:C.water,opacity:.85},R.verre); el("path",{d:"M-80,-250 L-70,0 L70,0 L80,-250",fill:"none",stroke:"#7E9BB3","stroke-width":5},R.verre);
    R.vT=el("text",{x:0,y:-270,"text-anchor":"middle","font-size":24,"font-weight":800,fill:C.ink},R.verre);
    R.beInfo=el("g",{},be); el("rect",{x:1120,y:250,width:440,height:330,rx:18,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.beInfo); R.bi1=el("text",{x:1145,y:310,"font-size":26,"font-weight":800,fill:C.bl},R.beInfo); R.bi2=el("text",{x:1145,y:360,"font-size":22,fill:C.ink},R.beInfo);
    R.flow=el("path",{fill:C.water,opacity:.85},be);
    // comparaison eau / huile
    R.cmp=el("g",{},be); [["eau",C.water,"250 g",250],["huile",C.oil,"≈ 230 g",230]].forEach(([n,c,m,v],i)=>{ const x=170+i*230; const g=el("g",{},R.cmp); el("rect",{x:x-70,y:520,width:140,height:160,fill:c,opacity:.85},g); el("path",{d:`M${x-80},440 L${x-70},680 L${x+70},680 L${x+80},440`,fill:"none",stroke:"#7E9BB3","stroke-width":5},g); el("text",{x,y:420,"text-anchor":"middle","font-size":24,"font-weight":800,fill:C.ink,text:`250 mL d'${n}`},g); el("text",{x,y:740,"text-anchor":"middle","font-size":34,"font-weight":800,fill:c==C.oil?"#9A7B00":C.bl,text:m},g); });
    // synthèse
    const sy=a.layer("syn"); R.syn=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    el("text",{x:800,y:80,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink,text:"Pour comparer ou mesurer une masse"},sy);
    const ICB=[(g,x)=>hand(a,g,x,195,.7),(g,x)=>{ el("rect",{x:x-6,y:150,width:12,height:90,fill:C.beam},g); el("rect",{x:x-45,y:236,width:90,height:12,rx:4,fill:C.beam},g); el("line",{x1:x-70,y1:165,x2:x+70,y2:165,stroke:C.beam,"stroke-width":8,"stroke-linecap":"round"},g); [-70,70].forEach(d=>{ el("path",{d:`M${x+d},165 L${x+d-30},205 M${x+d},165 L${x+d+30},205`,stroke:"#555","stroke-width":3},g); el("path",{d:`M${x+d-36},205 Q${x+d},225 ${x+d+36},205Z`,fill:C.pan,stroke:"#5A6475","stroke-width":3},g); }); },(g,x)=>{ el("rect",{x:x-70,y:190,width:140,height:50,rx:10,fill:"#E9EDF2",stroke:"#8C96A6","stroke-width":4},g); el("rect",{x:x-60,y:150,width:120,height:20,rx:5,fill:"#C9CFD8",stroke:"#8C96A6","stroke-width":3},g); el("rect",{x:x-45,y:198,width:70,height:32,rx:4,fill:"#1E2A20"},g); el("text",{x:x+20,y:224,"text-anchor":"end","font-size":24,"font-weight":800,fill:"#7CFF8A","font-family":"Consolas,monospace",text:"250"},g); el("rect",{x:x+30,y:200,width:30,height:28,rx:6,fill:C.or},g); }];
    R.s3=[["Soupeser","pas fiable :\non se trompe facilement",C.red],["Balance à plateaux","compare 2 objets ;\nmesure avec des masses marquées",C.bl],["Balance électronique","lit la masse directement ;\nTARE pour les liquides",C.gr]].map((f,i)=>{ const g=el("g",{},sy); const x=290+i*510; el("rect",{x:x-230,y:120,width:460,height:300,rx:18,fill:"#fff",stroke:f[2],"stroke-width":4},g); ICB[i](g,x); el("text",{x,y:285,"text-anchor":"middle","font-size":30,"font-weight":800,fill:f[2],text:f[0]},g); const tt=el("text",{x,y:335,"text-anchor":"middle","font-size":23,fill:C.ink},g); f[1].split("\n").forEach((l,j)=>el("tspan",{x,dy:j?30:0,text:l},tt)); return g; });
    R.unit=el("text",{x:800,y:465,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.ink,text:"Unités : le gramme (g) et le kilogramme (kg) — 1 kg = 1 000 g"},sy);
    R.myth=a.layer("myth"); a.myth(R.myth,200,510,1200,"Le plus gros objet est forcément le plus lourd.","Un gros ballon gonflé pèse quelques grammes, une petite boule de pétanque environ 700 g : la taille (le volume) ne dit pas la masse !");
    R.sumT=el("text",{x:800,y:196,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":6,"paint-order":"stroke"},a.svg);
    R.phRob=a.photo(a.svg,{id:"s-b1-roberval",x:1280,y:300,w:280,h:190,cap:"En vrai : Roberval",size:20,rot:1.5});
    R.phMas=a.photo(a.svg,{id:"s-b1-masses",x:1280,y:300,w:280,h:190,cap:"En vrai : masses marquées",size:20,rot:-1.5});
    // manipulation : ajouter des masses marquées (barre #manip)
    a.manip.innerHTML=`Masses marquées à droite : `+[100,50,20,10].map(g=>`<button data-g="${g}">+ ${g} g</button>`).join("")+` <button data-g="-1">− dernière</button> <button data-g="0">vider</button> <button data-g="x">autre pomme ▶</button>`;
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ const g=b.dataset.g; if(!manipActive){ manipActive=true; manipM=lastMs.slice(); }
      if(g==="x"){ oi=(oi+1)%OBJ.length; manipM=[]; } else if(g==="0") manipM=[]; else if(g==="-1") manipM.pop(); else if(manipM.length<8) manipM.push(+g);
      a.redraw(); });
  },
  reset(a){ [R.bal,R.be,R.syn,R.myth,R.ballon,R.boule,R.pomme,...R.mm,...R.lab,R.mains,R.q,R.cmp,R.verre,R.beInfo,R.flow,R.tareB,R.state,R.sumT,R.phRob,R.phMas].forEach(e=>a.op(e,0)); R.pans.forEach(p=>{ while(p.load.firstChild) p.load.removeChild(p.load.firstChild); }); },
  etapes:[
  { titre:"Soupeser : on se trompe !", duree:8000,
    legende:"Un gros ballon gonflé et une petite boule de pétanque : lequel est le plus lourd ? On a envie de dire le ballon… car il est plus gros. Soupeser ne suffit pas toujours !",
    voix:"Voici un gros ballon gonflé et une petite boule de pétanque. Lequel est le plus lourd ? Beaucoup pensent que c'est le ballon, parce qu'il est plus gros. Mais la taille d'un objet ne dit pas sa masse ! Et en soupesant, on peut facilement se tromper. Il faut un instrument.",
    anim(t,a){ const s=a.seg; a.op(R.mains,s(t,0,.15)); a.op(R.ballon,s(t,.05,.2)); a.op(R.boule,s(t,.1,.25)); const w=Math.sin(t*14)*8*s(t,.3,.5)*(1-s(t,.85,1)); a.tr(R.ballon,450,440+w); a.tr(R.boule,1150,440-w); a.op(R.q,s(t,.3,.4)); R.q.textContent="Lequel est le plus lourd ?"; } },
  { titre:"La balance à plateaux compare", duree:9000,
    legende:"Sur une balance à plateaux, le côté le plus lourd descend. Surprise : c'est la boule ! Elle est plus petite, mais beaucoup plus lourde que le ballon.",
    voix:"Posons les deux objets sur une balance à plateaux. Le fléau est comme une balançoire : le côté le plus lourd descend. Surprise ! C'est la petite boule qui fait descendre son plateau. Elle a une masse bien plus grande que le gros ballon.",
    anim(t,a){ const s=a.seg; a.op(R.mains,1-s(t,0,.1)); a.op(R.q,0); a.op(R.phRob,s(t,.5,.8)); a.op(R.bal,s(t,0,.15)); a.op(R.ballon,1); a.op(R.boule,1); a.op(R.state,s(t,.75,.85));
      const ang=12*s(t,.45,.75); CFG_pose(a,ang,[R.ballon],[R.boule],s(t,.15,.4)); R.state.textContent="La boule est plus lourde que le ballon"; a.set(R.state,{fill:C.red});
      a.op(R.lab[0],s(t,.75,.85)); a.op(R.lab[1],s(t,.75,.85)); R.lab[0].textContent="ballon : quelques grammes"; R.lab[1].textContent="boule : environ 700 g"; } },
  { titre:"Mesurer avec des masses marquées", duree:11000,
    legende:"Pour mesurer, on met la boule d'un côté et des masses marquées de l'autre, jusqu'à l'équilibre : 500 g + 200 g = 700 g. La boule a une masse de 700 g.",
    voix:"Pour mesurer la masse de la boule, on la pose sur un plateau, et on ajoute des masses marquées sur l'autre. Cinq cents grammes : la boule est encore plus lourde. Ajoutons deux cents grammes : la balance est en équilibre, l'aiguille est au milieu ! Cinq cents plus deux cents égale sept cents : la boule a une masse de sept cents grammes.",
    anim(t,a){ const s=a.seg; a.op(R.bal,1); a.op(R.phRob,1-s(t,0,.1)); a.op(R.phMas,s(t,.2,.5)); a.op(R.ballon,1-s(t,0,.1)); a.op(R.boule,1); a.op(R.state,s(t,.85,.95)); R.lab.forEach(l=>a.op(l,0));
      const m1=s(t,.15,.35), m2=s(t,.5,.7); a.op(R.mm[0],m1>0?1:0); a.op(R.mm[1],m2>0?1:0);
      const mR=500*(m1>=1?1:0)+200*(m2>=1?1:0); const ang=a.lerp(-12,0,s(t,0,.1))*0 + (mR===0?-12:mR===500?-5:0);
      const angS=t<.35?a.lerp(-12,-12,1):t<.5?a.lerp(-12,-5,s(t,.35,.45)):a.lerp(-5,0,s(t,.7,.82));
      CFG_pose(a,angS,[R.boule],[R.mm[0],R.mm[1]],1,[m1,m2]);
      R.state.textContent="Équilibre : 500 g + 200 g = 700 g"; a.set(R.state,{fill:C.gr}); a.cls(R.needle,"glow",t>.82); } },
  { titre:"La balance électronique et la tare", duree:13000,
    legende:"La balance électronique affiche directement la masse. Pour peser un liquide, on pose le verre vide, on appuie sur TARE (retour à 0), puis on verse : 250 mL d'eau = 250 g.",
    voix:"La balance électronique affiche directement la masse. Pour mesurer la masse d'un liquide, il y a une astuce : on pose d'abord le verre vide, il pèse cent cinquante grammes. On appuie sur le bouton tare : l'affichage revient à zéro. Puis on verse l'eau : on lit directement la masse du liquide, deux cent cinquante grammes. Et attention : deux cent cinquante millilitres d'huile ne pèsent qu'environ deux cent trente grammes. Même volume, mais pas la même masse !",
    anim(t,a){ const s=a.seg; a.op(R.bal,1-s(t,0,.1)); a.op(R.phMas,1-s(t,0,.08)); a.op(R.boule,1-s(t,0,.1)); R.mm.forEach(m=>a.op(m,1-s(t,0,.1))); a.op(R.state,0); a.op(R.be,s(t,.05,.15));
      const vIn=s(t,.12,.25); a.op(R.verre,vIn>0?1:0); a.tr(R.verre,800,a.lerp(300,610,vIn)); a.op(R.tareB,1); a.op(R.beInfo,s(t,.12,.2));
      const tare=t>.4; a.cls(R.tareB,"glow",t>.32&&t<.42); const pour=s(t,.45,.75); const h=pour*160; a.set(R.liq,{y:-h,height:h});
      a.op(R.flow,pour>0&&pour<1?1:0); a.set(R.flow,{d:`M920,330 Q880,330 860,360 L855,${610-h} L848,${610-h} L852,360 Q870,320 920,320Z`});
      const val=(vIn>=1?150:0)*(tare?0:1)+250*pour; R.disp.textContent=Math.round(val)+" g"; R.vT.textContent=pour>0?"eau : "+Math.round(250*pour)+" mL":"verre vide";
      R.bi1.textContent=t<.32?"1. Je pose le verre vide":t<.45?"2. J'appuie sur TARE → 0 g":"3. Je verse l'eau"; a.wrap(R.bi2,t<.32?"La balance affiche la masse du verre : 150 g.":t<.45?"La masse du verre est « oubliée ».":"Je lis la masse de l'eau seule : 250 mL d'eau ≈ 250 g.",30);
      a.op(R.cmp,s(t,.8,.92)); } },
  { titre:"À vous : quelle est la masse de la pomme ?", duree:16000,
    legende:"La pomme est sur le plateau de gauche : on ajoute des masses marquées à droite jusqu'à l'équilibre. À vous : ajoutez ou retirez des masses avec les boutons, regardez l'aiguille.",
    voix:"Quelle est la masse de cette pomme ? Posons-la sur le plateau de gauche, et ajoutons des masses marquées à droite, une par une. Cent grammes : la pomme est encore plus lourde. Ajoutons cinquante grammes : toujours trop léger. Encore cinquante grammes, cela fait deux cents : cette fois, c'est trop lourd ! On enlève cette masse, et on essaie vingt grammes, puis dix grammes. Cent plus cinquante plus vingt plus dix : cent quatre-vingts grammes. L'aiguille est au milieu : la pomme a une masse de cent quatre-vingts grammes. À vous maintenant : ajoutez ou retirez des masses avec les boutons, regardez ce qui change. Vous pouvez aussi essayer une autre pomme. Prenez votre temps.",
    anim(t,a){ const s=a.seg; if(t<.02){ manipActive=false; oi=0; manipM=[]; }
      a.op(R.be,1-s(t,0,.1)); a.op(R.bal,s(t,0,.15)); a.op(R.pomme,s(t,.05,.15)); a.op(R.state,1); a.op(R.sumT,s(t,.1,.2));
      R.pans[1].load.innerHTML=""; let ms, ang, newest=-1, dp=1, fade=null, settled=true, W4=STATES[4].reduce((x,g)=>x+wOf(g),0), sc=Math.min(1.35,240/W4), off0=-W4/2; const PM=manipActive?OBJ[oi]:POMME;
      if(manipActive){ ms=manipM; ang=Math.max(-12,Math.min(12,(sumOf(ms)-PM)/6)); const W=ms.reduce((x,g)=>x+wOf(g),0); sc=Math.min(1.35,240/Math.max(W,1)); off0=-W/2; }
      else { const t0=.14, w=(.97-t0)/STATES.length, k=t<t0?-1:Math.min(STATES.length-1,Math.floor((t-t0)/w)), u=k<0?0:Math.min(1,(t-t0-k*w)/w);
        ms=k<0?[]:STATES[k]; const prev=k<=0?-12:Math.max(-12,Math.min(12,(sumOf(STATES[k-1])-POMME)/6)); const nw=k<0?-12:Math.max(-12,Math.min(12,(sumOf(ms)-POMME)/6));
        ang=a.lerp(prev,nw,s(u,.3,.75)); newest=k<0?-1:(k===3?2:ms.length-1); dp=s(u,0,.35); settled=u>.75; if(k===3) fade=1-s(u,0,.3); }
      lastMs=ms.slice(); R.pans[1].load.setAttribute("transform",`translate(0,${STR}) scale(${sc})`);
      let off=off0; const objs=ms.map((g,i)=>{ const o=massObj(a,R.pans[1].load,g); const x=off+o._w/2; off+=o._w; a.tr(o,x,i===newest?-(1-dp)*200:0); a.op(o,i===newest?Math.min(1,dp*3):1); return o; });
      if(fade!==null&&fade>0){ const o=massObj(a,R.pans[1].load,50); a.tr(o,off0+wOf(100)+wOf(50)+wOf(50)/2,-(1-fade)*90); a.op(o,fade); }
      CFG_pose(a,ang,[R.pomme],[],1); const sm=sumOf(ms), d=sm-PM;
      R.sumT.textContent=ms.length?(ms.length>1&&ms.length<=5?ms.join(" g + ")+" g = ":ms.length>5?ms.length+" masses : ":"")+sm+" g":"Masses marquées : aucune"; a.op(R.lab[0],1); a.op(R.lab[1],ms.length?1:0);
      R.lab[0].textContent=(d===0&&settled)?`pomme : ${PM} g`:"pomme : ? g"; R.lab[1].textContent=`${sm} g`;
      R.state.textContent=!ms.length?(manipActive?"Ajoutez des masses avec les boutons":"On pose la pomme sur la balance"):!settled&&d!==0?"On ajoute une masse…":d===0?`Équilibre ! La pomme a une masse de ${PM} g`:d<0?"La pomme est encore plus lourde":manipActive?"Trop lourd ! Retirez une masse":"Trop lourd ! On enlève cette masse"; a.set(R.state,{fill:d===0&&settled?C.gr:d>0&&settled?C.red:C.ink}); a.cls(R.needle,"glow",d===0&&settled); } },
  { titre:"Synthèse", duree:9000,
    legende:"Pour comparer des masses, on utilise une balance à plateaux ; pour les mesurer, des masses marquées ou une balance électronique (avec la tare pour les liquides). La taille ne dit pas la masse !",
    voix:"Récapitulons. Soupeser ne suffit pas. La balance à plateaux permet de comparer deux masses, et de les mesurer avec des masses marquées. La balance électronique donne directement la masse, et la tare permet de peser un liquide sans son récipient. La masse s'exprime en grammes et en kilogrammes. Et n'oublie pas : un objet gros n'est pas forcément lourd !",
    anim(t,a){ const s=a.seg; a.op(R.bal,1-s(t,0,.1)); a.op(R.pomme,1-s(t,0,.1)); a.op(R.state,0); a.op(R.sumT,0); R.lab.forEach(l=>a.op(l,0)); a.op(R.syn,s(t,0,.1)); R.s3.forEach((f,i)=>{ const v=s(t,.1+i*.15,.25+i*.15); a.op(f,v); a.tr(f,0,(1-v)*40); }); a.op(R.unit,s(t,.55,.65)); a.op(R.myth,s(t,.7,.82)); a.cls(R.myth.faux,"pulse",t>.82&&t<1); } },
  ]
});
// pose : angle du fléau (degrés, + = droite descend), objets à gauche/droite, progression de dépose
function CFG_pose(a,ang,left,right,drop,drops){
  R.beam.setAttribute("transform",`translate(${PX},${PY}) rotate(${ang})`);
  const rad=ang*Math.PI/180; [-1,1].forEach((sg,i)=>{ const x=PX+sg*HALF*Math.cos(rad), y=PY+sg*HALF*Math.sin(rad); R.pans[i].setAttribute("transform",`translate(${x},${y})`); R.pans[i]._x=x; R.pans[i]._y=y+STR; });
  const place=(objs,i,dl)=>{ let off=-(objs.length-1)*45; objs.forEach((o,k)=>{ const v=dl?dl[k]:drop; const x=R.pans[i]._x+off, y=R.pans[i]._y+2; a.tr(o,x,a.lerp(y-260,y,v)); off+=90; }); };
  place(left,0); place(right,1,drops);
  R.lab[0].setAttribute("x",R.pans[0]._x); R.lab[0].setAttribute("y",R.pans[0]._y+70); R.lab[1].setAttribute("x",R.pans[1]._x); R.lab[1].setAttribute("y",R.pans[1]._y+70);
}
})();
