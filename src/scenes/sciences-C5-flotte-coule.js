/* META {"id":"sciences-C5-flotte-coule","matiere":"sciences","annee":"B","periode":1,"theme":"Matière : masse et volume, flotter ou couler","resume":"Un objet flotte s'il est plus léger que l'eau de même volume, pas simplement s'il est « léger » : c'est pourquoi un bateau en acier à coque creuse flotte et qu'une petite bille d'acier coule.","motsCles":["flotter","couler","masse","volume","bateau","acier","iceberg","glace","eau de même volume"]} */
(function(){
const C={ink:"#1E2430",or:"#E07A1F",bl:"#2563A8",gr:"#2E8B57",red:"#C0392B",sea:"#4A90D9"};
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
const MANIP=3;
const WY=400, FY=700, TX0=60, TX1=860;            // niveau de l'eau, fond, bords de la cuve
// objets : nom, masse (g), volume (cm³), type de dessin, largeur, hauteur (px)  -- valeurs d'exemple réalistes
const K=[
 {s:"bouchon de liège",n:"bouchon de liège",m:3,v:12,k:0,w:50,h:64},{s:"bûche de pin",n:"bûche de pin",m:500,v:1000,k:1,w:210,h:80},{s:"glaçon",n:"glaçon",m:18,v:20,k:2,w:90,h:90},{s:"balle de ping-pong",n:"balle de ping-pong",m:3,v:33,k:3,w:88,h:88},
 {s:"bille d'acier",n:"bille d'acier",m:4,v:.5,k:4,w:40,h:40},{s:"caillou",n:"caillou",m:270,v:100,k:5,w:130,h:90},{s:"bloc d'acier plein",n:"bloc d'acier plein",m:1000,v:127,k:6,w:76,h:76},{s:"bateau en acier",n:"bateau en acier (coque creuse)",m:1000,v:4000,k:7,w:330,h:140}];
const NB=[{n:"bois (pin)",m:50,k:8,sc:.62},{n:"glace",m:92,k:2,sc:.62},{n:"pierre",m:270,k:5,sc:.6}];   // 100 cm³ chacun
const SZ={0:[50,64],1:[210,80],2:[90,90],3:[88,88],4:[40,40],5:[130,90],6:[76,76],7:[330,140],8:[80,80],9:[80,80]};
const fmt=v=>(Math.round(v*10)/10).toLocaleString("fr-FR");
let R={}, sel=0, T0=0, RT=0, manipActive=false, lastSel=0;

function obj(a,p,k){ const g=a.el("g",{},p), e=a.el;
  if(k===0){ e("rect",{x:-25,y:0,width:50,height:64,rx:5,fill:"#E3C79A",stroke:"#A98A55","stroke-width":3},g); for(let i=0;i<7;i++) e("circle",{cx:-16+rnd(i,1)*32,cy:8+rnd(i,2)*48,r:2.5,fill:"#B8955E"},g); }
  if(k===1){ e("rect",{x:-105,y:0,width:196,height:80,rx:12,fill:"#A0703C",stroke:"#6B4A2A","stroke-width":4},g); [20,40,60].forEach(y=>e("line",{x1:-90,y1:y,x2:70,y2:y,stroke:"#7C5530","stroke-width":2.5},g)); e("ellipse",{cx:90,cy:40,rx:15,ry:40,fill:"#D9B27C",stroke:"#6B4A2A","stroke-width":4},g); e("ellipse",{cx:90,cy:40,rx:7,ry:22,fill:"none",stroke:"#9C7440","stroke-width":2.5},g); }
  if(k===2){ e("rect",{x:-45,y:0,width:90,height:90,rx:8,fill:"#D8F1FB",stroke:"#6FB3D4","stroke-width":4},g); e("line",{x1:-30,y1:18,x2:-12,y2:12,stroke:"#fff","stroke-width":6,"stroke-linecap":"round"},g); e("line",{x1:-30,y1:40,x2:-6,y2:32,stroke:"#fff","stroke-width":6,"stroke-linecap":"round"},g); }
  if(k===3){ e("circle",{cx:0,cy:44,r:44,fill:"#fff",stroke:"#9AA3B2","stroke-width":4},g); e("circle",{cx:0,cy:44,r:11,fill:"none",stroke:C.or,"stroke-width":3},g); e("path",{d:"M-12,40 L12,40 M0,28 L0,52",stroke:C.or,"stroke-width":3},g); }
  if(k===4){ e("circle",{cx:0,cy:20,r:20,fill:"#8C96A6",stroke:"#3E4658","stroke-width":4},g); e("circle",{cx:-7,cy:12,r:6,fill:"#fff",opacity:.7},g); }
  if(k===5){ e("path",{d:"M-65,62 L-52,16 L-10,0 L36,8 L65,42 L50,88 L-30,90Z",fill:"#8C8C8C",stroke:"#555","stroke-width":4,"stroke-linejoin":"round"},g); e("path",{d:"M-30,30 L10,22 M0,60 L40,52",stroke:"#6B6B6B","stroke-width":3},g); }
  if(k===6){ e("rect",{x:-38,y:0,width:76,height:76,rx:4,fill:"#7C8594",stroke:"#3E4658","stroke-width":4},g); e("path",{d:"M-30,10 L-30,60",stroke:"#B9C1CE","stroke-width":6,"stroke-linecap":"round"},g); }
  if(k===7){ e("path",{d:"M-165,66 L165,66 L122,140 L-122,140Z",fill:"#3E6FA8",stroke:"#1E3E6A","stroke-width":4,"stroke-linejoin":"round"},g); e("path",{d:"M-150,74 L150,74 L114,132 L-114,132Z",fill:"#EAF4FB",opacity:.55},g); e("rect",{x:60,y:0,width:62,height:66,fill:"#fff",stroke:"#7C8594","stroke-width":3},g); [[-140,"#C0392B"],[-95,"#E07A1F"],[-50,"#2E8B57"],[-5,"#2563A8"]].forEach(([x,c])=>e("rect",{x,y:30,width:42,height:36,fill:c,stroke:"#1E2430","stroke-width":2},g)); e("rect",{x:70,y:10,width:20,height:16,fill:"#9CC6EA"},g); }
  if(k===8){ e("rect",{x:-40,y:0,width:80,height:80,rx:4,fill:"#C99A5B",stroke:"#7A5530","stroke-width":4},g); [18,38,58].forEach(y=>e("path",{d:`M-30,${y} Q0,${y-8} 30,${y}`,fill:"none",stroke:"#9C7440","stroke-width":3},g)); }
  if(k===9){ e("rect",{x:-40,y:0,width:80,height:80,rx:6,fill:"#BFE0F7",stroke:C.bl,"stroke-width":4},g); [26,46,66].forEach(y=>e("path",{d:`M-28,${y} q10,-8 20,0 t20,0 t20,0`,fill:"none",stroke:"#fff","stroke-width":3.5},g)); }
  return g; }

Anim.run({
  titre:"Flotte ou coule ?",
  sousTitre:"Sciences et technologie · CM1-CM2 · Matière : masse et volume",
  matiere:"sciences", badge:"Sciences",
  accroche:"Pourquoi un énorme bateau en acier flotte-t-il, alors qu'une petite bille d'acier coule ?",
  manipDes:MANIP, manipJusqua:MANIP,
  init(a){
    const {el}=a, svg=a.svg;
    R.title=el("text",{x:800,y:70,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink},svg);
    // ===== cuve (étapes 1, 3, 4, 6) =====
    const tk=a.layer("tk"); R.tk=tk;
    R.ob=el("g",{},tk); R.O=K.map(o=>{ const g=obj(a,R.ob,o.k); a.op(g,0); return g; });
    el("rect",{x:TX0+10,y:WY,width:TX1-TX0-20,height:FY-WY,fill:C.sea,opacity:.38},tk); el("line",{x1:TX0+10,y1:WY,x2:TX1-10,y2:WY,stroke:"#2F6FB5","stroke-width":4},tk);
    el("path",{d:`M${TX0},${WY-150} L${TX0},${FY+10} L${TX1},${FY+10} L${TX1},${WY-150}`,fill:"none",stroke:"#7E9BB3","stroke-width":8,"stroke-linejoin":"round"},tk);
    R.rip=[0,1].map(()=>el("ellipse",{fill:"none",stroke:"#fff","stroke-width":4},tk));
    R.lab1=[0,1,2,3].map(()=>a.label(tk,0,0,"x\ny",{size:24,w:150,stroke:"#9AA3B2",sw:3}));
    R.cm=a.label(tk,460,260,"Le poids seul ne décide pas !",{size:30,w:520,stroke:C.or,color:"#8A4A0E",sw:3});
    R.tbl=el("g",{},tk); el("text",{x:1230,y:160,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"Ce qu'on observe"},R.tbl);
    R.rows=[0,1,2,3].map(i=>{ const g=el("g",{},R.tbl), y=190+i*100; g.r=el("rect",{x:910,y,width:640,height:84,rx:14,fill:"#fff",stroke:C.ink,"stroke-width":3.5},g); g.t=el("text",{x:935,y:y+54,"font-size":30,"font-weight":700,fill:C.ink},g); g.v=el("text",{x:1530,y:y+54,"text-anchor":"end","font-size":34,"font-weight":800},g); return g; });
    // 3 : chiffres du bateau
    R.n3=el("g",{},tk); el("rect",{x:900,y:130,width:660,height:330,rx:18,fill:"#fff",stroke:C.ink,"stroke-width":4},R.n3); R.n3t=[0,1,2,3,4].map(i=>el("text",{x:930,y:180+i*55,"font-size":28,"font-weight":i===4?800:600,fill:C.ink},R.n3));
    R.disL=a.label(tk,580,590,"eau repoussée : 1 000 g\n(autant que le bateau pèse)",{size:24,w:380,stroke:C.or,color:"#8A4A0E",sw:3});
    R.ph3=a.photo(tk,{id:"s-c5-cargo",x:1260,y:520,w:280,h:180,cap:"Un cargo en acier",size:20,rot:1.5});
    // ===== balance (étapes 2 et 4) =====
    const bl=a.layer("bal"); R.bal=bl; R.B=el("g",{},bl);
    el("path",{d:"M-70,330 L0,0 L70,330Z",fill:"#C9CFD8",stroke:"#7C8594","stroke-width":5,"stroke-linejoin":"round"},R.B); el("rect",{x:-110,y:326,width:220,height:20,rx:8,fill:"#8C96A6"},R.B);
    R.beam=el("line",{stroke:"#4A5468","stroke-width":12,"stroke-linecap":"round"},R.B); R.sl=[0,1].map(()=>[el("line",{stroke:"#4A5468","stroke-width":4},R.B),el("line",{stroke:"#4A5468","stroke-width":4},R.B)]); R.pan=[0,1].map(()=>el("rect",{width:190,height:16,rx:8,fill:"#8C96A6",stroke:"#4A5468","stroke-width":3},R.B));
    el("circle",{cx:0,cy:0,r:16,fill:"#4A5468"},R.B);
    R.BO=[0,1,2,3,4,5,6,7,8].map(k=>{ const g=obj(a,R.B,k); a.op(g,0); return g; }); R.BW=obj(a,R.B,9);
    R.bT=[0,1].map(()=>({a:el("text",{"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.ink},R.B),b:el("text",{"text-anchor":"middle","font-size":40,"font-weight":800},R.B)}));
    R.bV=el("text",{x:0,y:420,"text-anchor":"middle","font-size":34,"font-weight":800},R.B); R.bV2=el("text",{x:0,y:462,"text-anchor":"middle","font-size":26,"font-weight":700,fill:"#4A5468"},R.B);
    R.eau=el("g",{},bl); el("rect",{x:60,y:170,width:600,height:470,rx:18,fill:"#F3F6FC",stroke:C.bl,"stroke-width":4},R.eau); el("text",{x:360,y:228,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.bl,text:"L'eau, notre référence"},R.eau);
    R.er=[["1 cm³ d'eau","pèse 1 g"],["100 cm³ d'eau","pèsent 100 g"],["1 litre d'eau","pèse 1 kg"]].map(([t1,t2],i)=>{ const g=el("g",{},R.eau); const y=290+i*110; el("rect",{x:90,y,width:540,height:88,rx:14,fill:"#fff",stroke:C.bl,"stroke-width":3},g); el("text",{x:115,y:y+55,"font-size":32,"font-weight":700,fill:C.ink,text:t1},g); el("text",{x:610,y:y+55,"text-anchor":"end","font-size":34,"font-weight":800,fill:C.bl,text:t2},g); return g; });
    R.bsub=el("text",{x:1000,y:150,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.or},bl);
    // ===== iceberg =====
    const ic=a.layer("ice"); R.ice=ic; el("rect",{x:60,y:140,width:800,height:200,fill:"#EAF4FB"},ic); R.sea5=el("rect",{x:60,y:340,width:800,height:460,fill:C.sea,opacity:.35},ic);
    R.ib=el("g",{},ic); const kk=1.15, top=[[-120,0],[-80,-50],[-30,-110],[20,-70],[60,-95],[110,-30],[135,0]].map(([x,y])=>[x*kk,y*kk]), U=[[1,0],[.9,.35],[.55,.8],[0,1],[-.5,.9],[-.9,.45],[-1,0]];
    const ar=pts=>{ let s=0; for(let i=0;i<pts.length;i++){ const p=pts[i],q=pts[(i+1)%pts.length]; s+=p[0]*q[1]-q[0]*p[1]; } return Math.abs(s)/2; }; const aT=ar(top), W=300, aU=ar(U.map(([x,y])=>[x*W,y])), D=9*aT/aU;   // surface immergée = 9 x surface émergée
    const bot=U.map(([x,y])=>[x*W,y*D]); const bd=D;
    R.ibB=el("path",{d:"M"+bot.map(p=>p.join(",")).join(" L")+"Z",fill:"#CBEAF7",stroke:"#6FB3D4","stroke-width":4,"stroke-linejoin":"round",opacity:.9},R.ib); R.ibT=el("path",{d:"M"+top.map(p=>p.join(",")).join(" L")+"Z",fill:"#fff",stroke:"#9CC6EA","stroke-width":4,"stroke-linejoin":"round"},R.ib);
    R.ibd=bd; R.iw=el("line",{x1:60,y1:340,x2:860,y2:340,stroke:"#2F6FB5","stroke-width":4},ic); R.ivr=el("rect",{x:60,y:340,width:800,height:460,fill:C.sea,opacity:.18},ic);
    R.il1=a.label(ic,720,265,"environ 1/10\nhors de l'eau",{size:26,w:240,stroke:C.bl,color:C.bl,sw:3}); R.il2=a.label(ic,740,520,"environ 9/10\nsous l'eau !",{size:28,w:250,stroke:C.red,color:C.red,sw:3});
    R.ph5=a.photo(ic,{id:"s-c5-iceberg",x:1000,y:150,w:380,h:250,cap:"Un iceberg",rot:1.5});
    R.ic5=el("g",{},ic); el("rect",{x:900,y:480,width:660,height:250,rx:18,fill:"#fff",stroke:C.bl,"stroke-width":4},R.ic5); const it=el("text",{x:930,y:535,"font-size":29,fill:C.ink},R.ic5); a.wrap(it,"1 litre d'eau pèse 1 kg.\n1 litre de glace pèse environ 0,92 kg.\nLa glace est un peu plus légère que l'eau : elle flotte, comme un glaçon dans un verre.",42,1.38);
    // ===== idée fausse =====
    const my=a.layer("myth"); R.my=my; R.myC=a.layer("mythC"); a.myth(R.myC,900,130,660,"« Ce qui est lourd coule, ce qui est léger flotte. »","Ce n'est pas le poids seul qui compte : on compare l'objet à de l'eau de même volume. Une grosse bûche lourde flotte, une toute petite bille légère coule.");
    R.rule=el("g",{},my); el("rect",{x:900,y:540,width:660,height:200,rx:18,fill:"#FFF8EC",stroke:C.or,"stroke-width":5},R.rule); el("text",{x:930,y:592,"font-size":30,"font-weight":800,fill:"#8A4A0E",text:"La bonne question :"},R.rule); const rt=el("text",{x:930,y:640,"font-size":29,fill:C.ink},R.rule); a.wrap(rt,"l'objet est-il plus léger ou plus lourd que l'eau de même volume ?",44,1.35);
    // ===== synthèse =====
    const sy=a.layer("syn"); R.syn=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy); el("text",{x:800,y:70,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink,text:"À retenir"},sy);
    R.sC=[["1","On compare à l'eau de même volume","on regarde si l'objet pèse plus ou moins que la même quantité d'eau.",C.bl],["2","Plus léger que l'eau : il flotte","plus lourd que l'eau : il coule. Le bois, la glace et le liège flottent ; la pierre et l'acier plein coulent.",C.or],["3","Un bateau en acier flotte","sa coque creuse occupe un grand volume : au total, il est plus léger que l'eau qu'il remplace.",C.gr]].map(([n,t,d,c],i)=>{ const g=el("g",{},sy), y=130+i*230; el("rect",{x:60,y,width:900,height:200,rx:18,fill:"#fff",stroke:c,"stroke-width":4},g); el("circle",{cx:128,cy:y+100,r:38,fill:c},g); el("text",{x:128,y:y+114,"text-anchor":"middle","font-size":42,"font-weight":800,fill:"#fff",text:n},g); el("text",{x:190,y:y+68,"font-size":33,"font-weight":800,fill:c,text:t},g); const tx=el("text",{x:190,y:y+114,"font-size":27,fill:C.ink},g); a.wrap(tx,d,50,1.25); return g; });
    R.synP=el("g",{},sy); R.ph7a=a.photo(R.synP,{id:"s-c5-cargo",x:1060,y:160,w:420,h:260,cap:"Un cargo en acier",rot:1.5}); R.ph7b=a.photo(R.synP,{id:"s-c5-iceberg",x:1090,y:520,w:360,h:220,cap:"Un iceberg",rot:-1.5});
    // ===== manipulation =====
    a.manip.innerHTML=`Plonger : `+K.map((o,i)=>`<button data-o="${i}">${o.s}</button>`).join(" ");
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ manipActive=true; sel=+b.dataset.o; T0=performance.now()/1000; RT=T0; a.redraw(); });
    const loop=()=>{ if(a.step()===MANIP){ RT=performance.now()/1000; a.redraw(); } requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  },
  reset(a){ [R.tk,R.bal,R.ice,R.my,R.myC,R.syn,R.tbl,R.n3,R.disL,R.ph3,R.cm,R.eau,R.synP,R.ic5,R.ph5,R.il1,R.il2,R.rule,...R.O,...R.BO,R.BW,...R.lab1,...R.rip].forEach(e=>a.op(e,0)); R.title.textContent=""; R.bsub.textContent=""; a.op(R.B,1); },
  etapes:[
  { titre:"Flotte ou coule ?", duree:12000,
    legende:"On plonge quatre objets dans l'eau. La bûche (500 g) flotte, mais la petite bille d'acier (4 g) coule ! Est-ce le poids qui décide ?",
    voix:"Plongeons quatre objets dans l'eau. Le bouchon de liège, très léger, flotte. La grosse bûche de pin, qui pèse cinq cents grammes, flotte aussi. Le caillou coule. Et la petite bille d'acier, qui ne pèse que quatre grammes, coule ! La bûche est beaucoup plus lourde que la bille, pourtant c'est elle qui flotte. Alors, est-ce vraiment le poids qui décide ?",
    anim(t,a){ const s=a.seg; CLR(a); a.op(R.tk,1); R.title.textContent="Qui flotte ? Qui coule ?"; a.op(R.tbl,1); const L=[[0,170],[1,380],[5,600],[4,775]]; L.forEach(([ki,x],i)=>{ const o=K[ki], p=s(t,.06+i*.2,.24+i*.2,true); DROP(a,ki,x,p,i); const lb=R.lab1[i]; a.tr(lb,x,170); a.op(lb,s(t,.02+i*.05,.1+i*.05)); SETLAB(lb,[o.s==="bouchon de liège"?"liège":o.s.split(" ")[0],o.m+" g"],150); const row=R.rows[i], fl=o.m/o.v<1; a.op(row,s(t,.26+i*.2,.34+i*.2)); row.t.textContent=(ki===0?"bouchon de liège":ki===1?"bûche de pin":ki===5?"caillou":"bille d'acier")+" : "+o.m+" g"; row.v.textContent=fl?"FLOTTE":"COULE"; a.set(row.v,{fill:fl?C.gr:C.red}); a.set(row.r,{stroke:fl?C.gr:C.red}); });
      a.op(R.cm,s(t,.9,.98)); } },
  { titre:"À volume égal : l'eau de référence", duree:13000,
    legende:"Pour comparer, on prend le même volume : 100 cm³. 100 cm³ d'eau pèsent 100 g. Le bois (50 g) et la glace (92 g) sont plus légers : ils flottent. La pierre (270 g) est plus lourde : elle coule.",
    voix:"Pour savoir si un objet flotte, on le compare à de l'eau, mais de même volume. Un centimètre cube d'eau pèse un gramme. Cent centimètres cubes d'eau pèsent donc cent grammes, et un litre d'eau pèse un kilogramme. Sur la balance : cent centimètres cubes de bois de pin pèsent cinquante grammes, c'est plus léger que l'eau, donc le bois flotte. La glace pèse quatre-vingt-douze grammes : plus légère que l'eau, elle flotte aussi. La pierre pèse deux cent soixante-dix grammes : plus lourde que l'eau, elle coule.",
    anim(t,a){ const s=a.seg; CLR(a); a.op(R.tk,1-s(t,0,.08)); a.op(R.bal,s(t,0,.1)); R.title.textContent="Comparer à l'eau de même volume"; a.op(R.eau,1); R.er.forEach((g,i)=>a.op(g,s(t,.05+i*.07,.15+i*.07))); R.bsub.textContent="Chaque objet : 100 cm³"; a.set(R.bsub,{x:1050,y:150,"font-size":32,fill:"#8A4A0E"}); a.tr(R.B,1050,300);
      const ci=t<.34?0:t<.64?1:2, st=[.33,.64][ci-1]||0; const ang=i=>BAL(NB[i].m,100); const prev=ci===0?0:ang(ci-1), p=s(t,(ci===0?.18:ci===1?.36:.66),(ci===0?.3:ci===1?.48:.78)); BAL_DRAW(a,NB[ci],NB[ci].m,100,prev+(ang(ci)-prev)*p,"bloc de "+NB[ci].n.replace(/\(.*\)/,"").trim()+" (100 cm³)",p,NB[ci].k,NB[ci].sc); } },
  { titre:"Le bateau en acier", duree:13000,
    legende:"1 kg d'acier plein coule. Façonné en coque creuse, il occupe un grand volume : la même masse d'acier est plus légère que l'eau de même volume. Le bateau flotte !",
    voix:"Et le bateau en acier ? Un bloc d'acier plein d'un kilogramme coule : il occupe seulement cent vingt-sept centimètres cubes, et l'eau de ce volume ne pèse que cent vingt-sept grammes. Maintenant, façonnons le même acier en coque creuse, pleine d'air. La masse est toujours d'un kilogramme, mais le bateau occupe un très grand volume, quatre mille centimètres cubes. L'eau de ce volume pèserait quatre kilogrammes : le bateau est plus léger, donc il flotte. Il s'enfonce juste assez pour repousser autant d'eau qu'il pèse.",
    anim(t,a){ const s=a.seg; CLR(a); a.op(R.bal,1-s(t,0,.08)); a.op(R.eau,0); a.op(R.tk,s(t,0,.08)); R.title.textContent="Le même acier : plein, puis en coque creuse"; a.op(R.n3,s(t,.08,.18));
      const p1=s(t,.1,.42,true), p2=s(t,.55,.88,true); DROP(a,6,460,p1,0,s(t,.5,.58)); DROP(a,7,460,p2,1);
      const N=R.n3t; N[0].textContent="Masse d'acier : 1 000 g (inchangée)"; N[1].textContent=t<.5?"Bloc plein : volume 127 cm³":"Coque creuse : volume 4 000 cm³"; N[2].textContent=t<.5?"Eau de même volume : 127 g":"Eau de même volume : 4 000 g"; N[3].textContent=t<.45?(p1>.5?"1 000 g > 127 g : plus lourd que l'eau":""):(p2>.5?"1 000 g < 4 000 g : plus léger que l'eau":""); N[4].textContent=t<.45?(p1>.5?"Le bloc COULE":""):(p2>.5?"Le bateau FLOTTE":""); a.set(N[4],{fill:t<.5?C.red:C.gr}); a.set(N[3],{fill:t<.5?C.red:C.gr});
      a.op(R.disL,s(t,.9,.98)); a.op(R.ph3,s(t,.78,.95)); } },
  { titre:"À vous : plongez un objet", duree:14000,
    legende:"À vous : choisissez un objet avec les boutons et regardez s'il flotte ou s'il coule. Sur la balance, comparez sa masse à celle de l'eau de même volume.",
    voix:"À vous maintenant ! Choisissez un objet avec les boutons : le liège, la bûche, le glaçon, la balle de ping-pong, la bille, le caillou, le bloc d'acier ou le bateau. Regardez s'il flotte ou s'il coule. Puis regardez la balance : l'objet est-il plus lourd ou plus léger que l'eau de même volume ? Essayez le bloc d'acier, puis le bateau : que remarquez-vous ? Prenez votre temps.",
    anim(t,a){ const s=a.seg; CLR(a); if(t<.02){ manipActive=false; sel=7; } a.op(R.bal,s(t,0,.06)>0?1:0); a.op(R.tk,1); a.op(R.eau,0); R.title.textContent="À vous : flotte ou coule ?"; let ki,p; if(manipActive){ ki=sel; p=a.clamp((RT-T0)/1.6,0,1); } else { const sl=a.clamp(t/.96*8,0,7.9999); ki=Math.floor(sl); p=a.clamp((sl-ki)/.7,0,1); } lastSel=ki;
      const o=K[ki]; DROP(a,ki,310,p,0); a.tr(R.B,1235,300); const vol=o.v, mw=vol, name=o.s; R.bsub.textContent="Comparaison à volume égal"; a.set(R.bsub,{x:1235,y:150,"font-size":30,fill:"#8A4A0E"});
      const ang=BAL(o.m,mw); BAL_DRAW(a,{n:name,m:o.m},o.m,mw,ang*a.ease(p),name,p,o.k,K[ki].k===7?.42:K[ki].k===1?.55:K[ki].k===4?1:.6,fmt(vol)+" cm³");
      if(a.manip) a.manip.querySelectorAll("button").forEach(b=>b.classList.toggle("sel",manipActive&&+b.dataset.o===sel)); } },
  { titre:"La glace flotte : l'iceberg", duree:11000,
    legende:"La glace est un peu plus légère que l'eau : elle flotte. Un iceberg dépasse de l'eau d'environ un dixième seulement : les neuf dixièmes sont sous l'eau !",
    voix:"La glace aussi flotte, comme un glaçon dans un verre. Un litre de glace pèse environ zéro virgule quatre-vingt-douze kilogramme, un peu moins qu'un litre d'eau. Un iceberg flotte donc, mais il est presque aussi lourd que l'eau qu'il repousse. Seul environ un dixième dépasse de l'eau : les neuf dixièmes sont cachés sous la surface.",
    anim(t,a){ const s=a.seg; CLR(a); a.op(R.bal,0); a.op(R.tk,1-s(t,0,.08)); a.op(R.ice,s(t,0,.08)); R.title.textContent="Un iceberg flotte"; const bob=Math.sin(t*14)*3; a.tr(R.ib,460,340+bob*.0); a.op(R.ibB,.35+.65*s(t,.3,.6)); a.op(R.il1,s(t,.2,.32)); a.op(R.il2,s(t,.5,.65)); a.op(R.ph5,s(t,.6,.78)); a.op(R.ic5,s(t,.7,.9)); } },
  { titre:"Lourd coule, léger flotte ?", duree:12000,
    legende:"Idée fausse : « ce qui est lourd coule ». Un bateau d'un kilogramme flotte, une bille de 4 grammes coule. Il faut comparer à l'eau de même volume.",
    voix:"Une idée fausse très répandue dit que ce qui est lourd coule, et que ce qui est léger flotte. Regardez : le bateau pèse un kilogramme et il flotte, la petite bille ne pèse que quatre grammes et elle coule ! Ce n'est pas le poids seul qui compte. La bonne question est : l'objet est-il plus léger ou plus lourd que l'eau de même volume ?",
    anim(t,a){ const s=a.seg; CLR(a); a.op(R.ice,0); a.op(R.tk,s(t,0,.08)); a.op(R.tbl,0); a.op(R.n3,0); a.op(R.ph3,0); R.title.textContent=""; a.op(R.my,1); a.op(R.myC,s(t,.45,.6)); a.op(R.rule,s(t,.72,.85));
      DROP(a,7,360,1,0); DROP(a,4,720,1,1); a.set(R.lab1[0],{}); a.tr(R.lab1[0],360,255); a.op(R.lab1[0],s(t,.1,.2)); a.tr(R.lab1[1],720,585); a.op(R.lab1[1],s(t,.18,.28)); SETLAB(R.lab1[0],["bateau : 1 000 g","FLOTTE"],250); SETLAB(R.lab1[1],["bille : 4 g","COULE"],190); a.op(R.lab1[2],0); a.op(R.lab1[3],0); } },
  { titre:"À retenir", duree:9000,
    legende:"On compare l'objet à l'eau de même volume : plus léger, il flotte ; plus lourd, il coule. Un bateau en acier flotte grâce à sa coque creuse.",
    voix:"À retenir. Un : pour savoir si un objet flotte, on le compare à l'eau de même volume. Deux : s'il est plus léger que cette eau, il flotte ; s'il est plus lourd, il coule. Trois : un bateau en acier flotte parce que sa coque creuse occupe un grand volume : au total, il est plus léger que l'eau qu'il remplace.",
    anim(t,a){ const s=a.seg; CLR(a); a.op(R.tk,1-s(t,0,.1)); a.op(R.my,1-s(t,0,.1)); a.op(R.myC,0); a.op(R.syn,s(t,0,.1)); R.sC.forEach((g,i)=>{ const v=s(t,.1+i*.15,.25+i*.15); a.op(g,v); a.tr(g,0,(1-v)*30); }); a.op(R.synP,s(t,.5,.75)); } },
  ]
});
// angle de la balance : >0 = côté de l'objet plus bas (objet plus lourd)
function CLR(a){ [R.tbl,R.n3,R.disL,R.ph3,R.cm,R.eau,R.ph5,R.ic5,R.il1,R.il2,R.rule,R.myC,...R.lab1,...R.rip,...R.O,...R.BO,R.BW].forEach(e=>a.op(e,0)); R.bsub.textContent=""; }
function SETLAB(g,lines,w){ const lt=g.querySelector("text"); lt.innerHTML=""; lines.forEach((ln,j)=>{ const ts=document.createElementNS("http://www.w3.org/2000/svg","tspan"); ts.setAttribute("x",0); ts.setAttribute("dy",j?27:0); ts.textContent=ln; lt.appendChild(ts); }); const r=g.querySelector("rect"); r.setAttribute("x",-w/2); r.setAttribute("width",w); }
function BAL(mO,mW){ const r=Math.log(mO/mW); return Math.sign(r)*Math.min(14,Math.max(4,Math.abs(r)*9)); }
function BAL_DRAW(a,o,mO,mW,ang,name,p,kind,sc,volTxt){
  const L=200, th=ang*Math.PI/180, lx=-L*Math.cos(th), ly=L*Math.sin(th), rx=L*Math.cos(th), ry=-L*Math.sin(th);
  a.set(R.beam,{x1:lx,y1:ly,x2:rx,y2:ry}); const H=120;
  [[lx,ly,0],[rx,ry,1]].forEach(([x,y,i])=>{ const py=y+H; a.set(R.sl[i][0],{x1:x,y1:y,x2:x-80,y2:py}); a.set(R.sl[i][1],{x1:x,y1:y,x2:x+80,y2:py}); a.set(R.pan[i],{x:x-95,y:py}); });
  R.BO.forEach((g,k)=>a.op(g,k===kind?1:0)); const g=R.BO[kind], h=SZ[kind][1]; a.tr(g,lx,ly+H-h*sc,sc); a.tr(R.BW,rx,ry+H-80*.62,.62); a.op(R.BW,1);
  const T=R.bT; const wt=T[0], wt2=T[1]; const nm=name; wt.a.textContent=nm; wt.b.textContent=fmt(mO)+" g"; a.set(wt.a,{x:lx,y:H+268}); a.set(wt.b,{x:lx,y:H+312,fill:C.red}); wt2.a.textContent="eau de même volume"; wt2.b.textContent=fmt(mW)+" g"; a.set(wt2.a,{x:rx,y:H+268}); a.set(wt2.b,{x:rx,y:H+312,fill:C.bl});
  const fl=mO<mW; R.bV.textContent=p>.55?(fl?"plus léger que l'eau : il FLOTTE":"plus lourd que l'eau : il COULE"):""; a.set(R.bV,{fill:fl?C.gr:C.red,y:H+372}); R.bV2.textContent=volTxt&&p>.2?"volume de l'objet : "+volTxt:""; a.set(R.bV2,{y:H+412}); }
// chute d'un objet dans la cuve : p = progression (0..1), x = position horizontale ; fadeOut = disparition
function DROP(a,ki,x,p,ri,fadeOut){ const o=K[ki], g=R.O[ki], d=o.m/o.v, fl=d<1, f=Math.min(d,1), s=a.seg;
  const y0=180, yc=WY-o.h, yf=fl?WY-(1-f)*o.h:FY-o.h-4; let y;
  const u1=s(p,0,.4,true), u2=s(p,.4,1);
  if(p<=0){ a.op(g,0); return; }
  y=a.lerp(y0,yc,u1*u1); if(p>.4){ y=fl?a.lerp(yc,yf,a.ease(Math.min(1,u2*1.4)))+(1-u2)*Math.sin(u2*16)*8*(1-u2):a.lerp(yc,yf,a.ease(u2)); }
  const sway=fl?0:Math.sin(u2*7)*14*(1-u2); a.tr(g,x+sway,y,1,fl?Math.sin(u2*10)*3*(1-u2):(1-u2)*Math.sin(u2*9)*10); a.op(g,fadeOut!==undefined?1-fadeOut:1);
  const rp=R.rip[ri%2], uu=s(p,.36,.7,true); a.set(rp,{cx:x,cy:WY,rx:20+90*uu,ry:6+14*uu}); a.op(rp,uu>0&&uu<1?(1-uu)*.9:0); }
})();
