/* META {"id":"sciences-B1b-melanges","matiere":"sciences","annee":"B","periode":1,"theme":"La matière : mélanges homogènes et hétérogènes, dissolution","resume":"Sable, huile, sucre, sel : on distingue mélanges hétérogènes et homogènes, on montre que le sucre dissous n'a pas disparu (la masse se conserve) et qu'une eau saturée ne dissout plus de sel.","motsCles":["mélange","homogène","hétérogène","dissolution","saturation","conservation de la masse"]} */
(function(){
let R={}, cuill=0, manipActive=false, lastN=0; const SAT=6; // cuillères de sel dissoutes au maximum dans le verre (exemple : 6 g chacune, soit ≈ 36 g pour 100 mL)
const C={water:"#BFE0F7",waterD:"#4A90D9",sand:"#D9B26A",oil:"#F2CF4A",sugar:"#FFFFFF",ink:"#1E2430",or:"#E07A1F",gr:"#2E8B57",bl:"#2563A8",red:"#C0392B"};
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
function glass(a,p,x,y,lab){ const g=a.el("g",{},p); g.liq=a.el("rect",{x:x-80,y:y-200,width:160,height:200,fill:C.water},g); g.top=a.el("g",{},g); a.el("path",{d:`M${x-90},${y-260} L${x-80},${y} L${x+80},${y} L${x+90},${y-260}`,fill:"none",stroke:"#7E9BB3","stroke-width":5},g); g.t=a.el("text",{x,y:y+40,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:lab},g); g.x=x; g.y=y; return g; }
Anim.run({
  titre:"Mélanges homogènes et hétérogènes",
  sousTitre:"Sciences et technologie · CM1-CM2 · La matière",
  matiere:"sciences", badge:"Sciences",
  accroche:"Quand le sucre « disparaît » dans l'eau, où est-il passé ?",
  manipDes:3, manipJusqua:3,
  init(a){
    const {el}=a;
    // ---- 1. hétérogènes (dans un sous-groupe agrandi)
    const he=a.layer("he"); R.he=he; const hg=el("g",{transform:"translate(800,720) scale(1.3) translate(-800,-720)"},he);
    R.gS=glass(a,hg,350,700,"eau + sable"); R.gO=glass(a,hg,800,700,"eau + huile"); R.gG=glass(a,hg,1250,700,"eau + graines");
    R.sand=[...Array(70)].map((_,i)=>el("circle",{r:6,fill:C.sand,stroke:"#9C7A3A","stroke-width":1},hg));
    R.oil=el("rect",{x:720,width:160,fill:C.oil,opacity:.95},hg); R.oilDrops=[...Array(14)].map(()=>el("circle",{r:12,fill:C.oil,stroke:"#B8961C","stroke-width":2},hg));
    R.seeds=[...Array(18)].map(()=>el("ellipse",{rx:10,ry:6,fill:"#7A5230"},hg));
    R.heT=el("g",{},he); a.label(R.heT,800,100,"Mélange HÉTÉROGÈNE : on voit encore les différents constituants",{size:30,stroke:C.or,color:"#8A4A0E"});
    R.heC=[["le sable tombe au fond",215],["l'huile flotte sur l'eau",800],["les graines restent visibles",1385]].map(([tx,x])=>{ const g=el("g",{},he); a.label(g,x,830,tx,{size:24,stroke:"#9AA3B2",color:C.ink,sw:2}); return g; });
    // ---- 2. le sucre se dissout (zoom particules)
    const ho=a.layer("ho"); R.ho=ho; R.gU=glass(a,ho,330,720,"eau + sucre");
    R.cubes=el("g",{},ho); R.cube=el("rect",{x:-22,y:-22,width:44,height:44,rx:5,fill:"#fff",stroke:"#9AA3B2","stroke-width":3},R.cubes);
    R.spoon=el("path",{d:"M0,0 L0,-260 M-12,8 Q0,30 12,8Z",stroke:"#8C96A6","stroke-width":8,fill:"#8C96A6"},ho);
    const zx=930, zy=420, zr=290; R.zoom=el("g",{},ho); el("circle",{cx:zx,cy:zy,r:zr,fill:"#EAF4FB",stroke:"#7E9BB3","stroke-width":5},R.zoom);
    el("defs",{},R.zoom).appendChild(Object.assign(document.createElementNS("http://www.w3.org/2000/svg","clipPath"),{id:"zc"})).appendChild(el("circle",{cx:zx,cy:zy,r:zr-4}));
    const zg=el("g",{"clip-path":"url(#zc)"},R.zoom);
    R.wp=[...Array(110)].map((_,i)=>{ const c=el("circle",{r:12,fill:"#7FB8E6"},zg); c._x=zx-zr+rnd(i,3)*2*zr; c._y=zy-zr+rnd(i,4)*2*zr; return c; });
    R.sp=[...Array(25)].map((_,i)=>{ const c=el("circle",{r:13,fill:"#fff",stroke:C.or,"stroke-width":3},zg); c._cx=zx-60+(i%5)*26; c._cy=zy-60+Math.floor(i/5)*26; c._x=zx-zr*.85+rnd(i,7)*zr*1.7; c._y=zy-zr*.85+rnd(i,8)*zr*1.7; return c; });
    R.zT=el("text",{x:zx,y:zy+zr+44,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink},R.zoom);
    el("line",{x1:420,y1:600,x2:zx-zr*.75,y2:zy+zr*.6,stroke:"#9AA3B2","stroke-width":2,"stroke-dasharray":"8 6"},R.zoom);
    R.legP=el("g",{},R.zoom); el("circle",{cx:1290,cy:180,r:12,fill:"#7FB8E6"},R.legP); el("text",{x:1312,y:189,"font-size":24,fill:C.ink,text:"particule d'eau"},R.legP); el("circle",{cx:1290,cy:228,r:13,fill:"#fff",stroke:C.or,"stroke-width":3},R.legP); el("text",{x:1312,y:237,"font-size":24,fill:C.ink,text:"particule de sucre"},R.legP);
    R.hoT=el("g",{},ho); a.label(R.hoT,800,60,"Mélange HOMOGÈNE : on ne distingue plus les constituants",{size:30,stroke:C.bl,color:C.bl});
    R.phS=a.photo(a.svg,{id:"s-b1b-sucre-eau",x:1290,y:320,w:260,h:180,cap:"En vrai : sucre dans l'eau",size:20,rot:1.5});
    // ---- 3. la masse se conserve (balance)
    const co=a.layer("co"); R.co=co; el("text",{x:700,y:80,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"On pèse l'eau avec le sucre, avant et après"},co);
    el("rect",{x:420,y:700,width:560,height:130,rx:18,fill:"#E9EDF2",stroke:"#8C96A6","stroke-width":4},co); el("rect",{x:460,y:670,width:480,height:30,rx:8,fill:"#C9CFD8",stroke:"#8C96A6","stroke-width":3},co);
    el("rect",{x:500,y:725,width:300,height:80,rx:8,fill:"#1E2A20"},co); R.balD=el("text",{x:780,y:785,"text-anchor":"end","font-size":56,"font-weight":800,fill:"#7CFF8A","font-family":"Consolas,monospace"},co);
    R.gB=glass(a,co,700,670,""); R.cub2=[0,1].map(i=>el("rect",{x:-22,y:-22,width:44,height:44,rx:5,fill:"#fff",stroke:"#9AA3B2","stroke-width":3},co));
    R.spoon2=el("path",{d:"M0,0 L0,-250 M-12,8 Q0,30 12,8Z",stroke:"#8C96A6","stroke-width":8,fill:"#8C96A6"},co);
    R.coP=el("g",{},co); el("rect",{x:1040,y:180,width:520,height:420,rx:18,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.coP);
    R.co1=el("text",{x:1075,y:260,"font-size":34,"font-weight":800,fill:C.bl},R.coP); R.co2=el("text",{x:1075,y:340,"font-size":34,"font-weight":800,fill:C.gr},R.coP); R.co3=el("text",{x:1075,y:430,"font-size":30,"font-weight":800,fill:C.ink},R.coP); R.co4=el("text",{x:1075,y:560,"font-size":22,fill:"#4A5468",text:"(masses d'exemple)"},R.coP);
    // ---- 4. saturation (grand verre)
    const sa=a.layer("sa"); R.sa=sa; const GX=480, GY=790;
    R.sLiq=el("rect",{x:GX-146,y:GY-330,width:292,height:330,fill:C.water},sa);
    R.grains=[...Array(40)].map(()=>el("rect",{width:17,height:17,fill:"#fff",stroke:"#9AA3B2","stroke-width":1.5},sa));
    el("path",{d:`M${GX-165},${GY-420} L${GX-150},${GY} L${GX+150},${GY} L${GX+165},${GY-420}`,fill:"none",stroke:"#7E9BB3","stroke-width":6,"stroke-linejoin":"round"},sa);
    el("text",{x:GX,y:GY+48,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"100 mL d'eau"},sa);
    R.fall=[...Array(6)].map(()=>el("rect",{width:11,height:11,fill:"#fff",stroke:"#9AA3B2","stroke-width":1.5},sa));
    R.sel=el("g",{},sa); el("path",{d:"M-70,-10 L-10,-10",stroke:"#8C96A6","stroke-width":8,"stroke-linecap":"round"},R.sel); el("path",{d:"M0,0 L220,-60",stroke:"#8C96A6","stroke-width":9,"stroke-linecap":"round"},R.sel); el("ellipse",{cx:0,cy:0,rx:42,ry:22,fill:"#B8BEC8",stroke:"#6B7585","stroke-width":4},R.sel); R.heap=el("path",{d:"M-30,-4 Q0,-34 30,-4Z",fill:"#fff",stroke:"#9AA3B2","stroke-width":2},R.sel);
    R.saP=el("g",{},sa); el("rect",{x:860,y:110,width:680,height:480,rx:18,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.saP);
    R.sa1=el("text",{x:890,y:175,"font-size":36,"font-weight":800,fill:C.ink},R.saP); R.sa2=el("text",{x:890,y:235,"font-size":32,"font-weight":800},R.saP); R.sa3=el("text",{x:890,y:290,"font-size":26,fill:C.ink},R.saP);
    R.jauge=[...Array(9)].map((_,i)=>el("rect",{x:890+i*70,y:400,width:58,height:58,rx:10,fill:"#fff",stroke:C.ink,"stroke-width":3},R.saP));
    R.jT=el("text",{x:890,y:500,"font-size":24,"font-weight":700,fill:C.ink},R.saP);
    el("text",{x:890,y:560,"font-size":22,fill:"#4A5468",text:"1 cuillère ≈ 6 g de sel (exemple)"},R.saP);
    R.phL=a.photo(a.svg,{id:"s-b1b-sel-mer",x:1110,y:640,w:300,h:140,cap:"En vrai : sel de mer",size:20,rot:-1.5});
    // manipulation : cuillères de sel (barre #manip)
    a.manip.innerHTML=`Cuillères de sel : <button data-c="-1" aria-label="une cuillère de moins">−</button> <b id="mCv" style="min-width:40px;text-align:center">0</b> <button data-c="1" aria-label="une cuillère de plus">+</button> <button data-c="0">à zéro</button>`;
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ const d=+b.dataset.c; if(!manipActive){ manipActive=true; cuill=lastN; } cuill=d?Math.max(0,Math.min(9,cuill+d)):0; a.redraw(); });
    // ---- 5. tri
    const tr=a.layer("tri"); R.tr=tr; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},tr);
    [["HOMOGÈNE",C.bl,50,"on ne voit qu'une seule substance"],["HÉTÉROGÈNE",C.or,820,"on voit plusieurs constituants"]].forEach(([n,c,x,d])=>{ el("rect",{x,y:40,width:730,height:470,rx:18,fill:c,"fill-opacity":.06,stroke:c,"stroke-width":4},tr); el("text",{x:x+365,y:95,"text-anchor":"middle","font-size":34,"font-weight":800,fill:c,text:n},tr); el("text",{x:x+365,y:135,"text-anchor":"middle","font-size":24,fill:C.ink,text:d},tr); });
    R.items=[["eau sucrée",0],["eau salée",0],["sirop + eau",0],["l'air",0],["eau + sable",1],["eau + huile",1],["vinaigrette",1],["sel + poivre",1]].map(([n,k],i)=>{ const g=el("g",{},tr); a.label(g,0,0,n,{size:28,w:290,h:64,stroke:k?C.or:C.bl,color:C.ink}); g._k=k; g._i=i; return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,200,560,1200,"Quand le sucre se dissout, il disparaît.","Le sucre est toujours là : ses particules se sont dispersées entre celles de l'eau. L'eau a un goût sucré et la masse totale n'a pas changé.");
  },
  reset(a){ [R.he,R.ho,R.co,R.sa,R.tr,R.myth,R.heT,...R.heC,R.hoT,R.zoom,R.cubes,R.spoon,R.legP,R.phS,R.phL,R.oil,...R.oilDrops,...R.sand,...R.seeds].forEach(e=>a.op(e,0)); [R.gS,R.gO,R.gG].forEach(g=>a.op(g,1)); },
  etapes:[
  { titre:"Des mélanges qu'on voit : hétérogènes", duree:11000,
    legende:"On verse du sable, de l'huile ou des graines dans l'eau. On voit toujours les différents constituants : le sable tombe au fond, l'huile flotte. Ce sont des mélanges hétérogènes.",
    voix:"Un mélange, c'est au moins deux substances réunies. Versons du sable dans l'eau : on voit les grains, qui tombent au fond. Versons de l'huile : elle reste séparée et flotte au-dessus de l'eau. Et les graines restent bien visibles. Dans ces mélanges, on distingue à l'œil nu les différents constituants : ce sont des mélanges hétérogènes.",
    anim(t,a){ const s=a.seg; a.op(R.he,1); const vS=s(t,.05,.4), vO=s(t,.3,.65), vG=s(t,.55,.85);
      R.sand.forEach((g,i)=>{ const x=R.gS.x-70+rnd(i,1)*140; const ystart=300+rnd(i,2)*40; const yend=690-rnd(i,3)*30-Math.floor(i/14)*4; const v=a.clamp(vS*1.4-rnd(i,4)*.4,0,1); a.op(g,vS>0?1:0); a.set(g,{cx:x,cy:a.lerp(ystart,yend,a.ease(v))}); });
      const oh=50*vO; a.op(R.oil,vO>0?1:0); a.set(R.oil,{y:500-oh,height:oh}); R.gO.liq.setAttribute("y",500); R.gO.liq.setAttribute("height",200);
      R.oilDrops.forEach((d,i)=>{ const v=a.clamp(vO*1.6-rnd(i,5)*.6,0,1); a.op(d,vO>0&&v<1?1:0); a.set(d,{cx:R.gO.x-60+rnd(i,6)*120,cy:a.lerp(680-rnd(i,7)*100,480,v)}); });
      R.seeds.forEach((d,i)=>{ a.op(d,vG>0?1:0); const v=a.clamp(vG*1.4-rnd(i,8)*.4,0,1); a.set(d,{cx:R.gG.x-60+rnd(i,9)*120,cy:a.lerp(300,520+rnd(i,10)*160,a.ease(v)),transform:`rotate(${rnd(i,11)*180} ${R.gG.x-60+rnd(i,9)*120} ${a.lerp(300,520+rnd(i,10)*160,a.ease(v))})`}); });
      a.op(R.heT,s(t,.85,.95)); R.heC.forEach((g,i)=>a.op(g,s(t,.45+i*.15,.55+i*.15))); } },
  { titre:"Le sucre « disparaît »…", duree:14000,
    legende:"Le sucre se dissout dans l'eau : ses particules se détachent et se dispersent entre celles de l'eau. On ne les voit plus, mais elles sont toujours là !",
    voix:"Plongeons un morceau de sucre dans l'eau et remuons. Il semble disparaître ! Regardons avec un microscope imaginaire : les particules de sucre se détachent une à une et se dispersent entre les particules d'eau. Elles sont trop petites pour être vues, mais elles sont toujours là : l'eau a un goût sucré. L'eau sucrée est un mélange homogène.",
    anim(t,a){ const s=a.seg; a.op(R.he,1-s(t,0,.08)); a.op(R.ho,s(t,0,.1)); a.op(R.zoom,s(t,.1,.2)); a.op(R.legP,s(t,.15,.25)); a.op(R.phS,s(t,.5,.7));
      const drop=s(t,.1,.25); const dis=s(t,.3,.85); a.op(R.cubes,drop>0&&dis<1?1:0); a.tr(R.cubes,330,a.lerp(380,670,drop),1-dis*.95); a.op(R.spoon,dis>0&&dis<1?1:0); a.tr(R.spoon,330+Math.sin(t*60)*40,690);
      R.wp.forEach((c,i)=>a.set(c,{cx:c._x+Math.sin(t*30+i)*4,cy:c._y+Math.cos(t*27+i)*4}));
      R.sp.forEach((c,i)=>{ const v=a.clamp(dis*1.5-(i/25)*.5,0,1); a.set(c,{cx:a.lerp(c._cx,c._x,a.ease(v))+Math.sin(t*30+i)*3,cy:a.lerp(c._cy,c._y,a.ease(v))+Math.cos(t*25+i)*3}); });
      R.gU.liq.setAttribute("fill",dis>.5?"#D7ECFA":C.water); R.zT.textContent=dis<.05?"un morceau de sucre (un cristal)":dis<.95?"les particules de sucre se dispersent…":"elles sont toujours là, mélangées à l'eau !";
      a.op(R.hoT,s(t,.88,.98)); } },
  { titre:"La masse ne change pas", duree:11000,
    legende:"On pèse le verre d'eau avec les morceaux de sucre : 260 g. On remue, le sucre se dissout… et la balance affiche toujours 260 g. Rien n'a disparu !",
    voix:"Vérifions avec une balance. Le verre d'eau avec les morceaux de sucre au fond pèse deux cent soixante grammes. Remuons : le sucre se dissout, on ne le voit plus. Et pourtant la balance affiche toujours deux cent soixante grammes. La masse n'a pas changé : le sucre n'a pas disparu, il est dissous dans l'eau.",
    anim(t,a){ const s=a.seg; a.op(R.ho,1-s(t,0,.08)); a.op(R.phS,0); a.op(R.co,s(t,0,.1)); const dis=s(t,.35,.75);
      R.cub2.forEach((c,i)=>{ a.set(c,{x:-22,y:-22}); a.op(c,dis<1?1:0); a.tr(c,670+i*50,648,1-dis*.96); }); a.op(R.spoon2,dis>0&&dis<1?1:0); a.tr(R.spoon2,700+Math.sin(t*50)*34,640);
      R.gB.liq.setAttribute("fill",dis>.5?"#D7ECFA":C.water); R.balD.textContent="260 g"; a.cls(R.balD,"glow",t>.8);
      a.op(R.coP,s(t,.1,.2)); R.co1.textContent="Avant : 260 g (sucre au fond)"; R.co2.textContent="Après : 260 g (sucre dissous)"; a.set(R.co2,{opacity:s(t,.75,.85)});
      a.wrap(R.co3,"La masse ne change pas : le sucre n'a pas disparu !",30); a.set(R.co3,{opacity:s(t,.85,.95)}); } },
  { titre:"À vous : jusqu'où peut-on dissoudre ?", duree:16000,
    legende:"On ajoute du sel, cuillère après cuillère : au-delà de 6 cuillères, l'eau est saturée et le sel reste au fond. À vous : ajoutez ou retirez des cuillères avec les boutons, regardez ce qui change.",
    voix:"Ajoutons maintenant du sel dans cent millilitres d'eau, cuillère après cuillère, en remuant. Au début, le sel se dissout : le mélange reste homogène. Mais l'eau ne peut pas dissoudre une quantité illimitée de sel ! Après six cuillères, dans cet exemple, l'eau est saturée : le sel en trop reste au fond. On voit à nouveau deux constituants : le mélange est devenu hétérogène. À vous maintenant : ajoutez ou retirez des cuillères de sel avec les boutons, et regardez ce qui change. Prenez votre temps.",
    anim(t,a){ const s=a.seg; if(t<.02) manipActive=false; a.op(R.co,1-s(t,0,.08)); a.op(R.sa,s(t,0,.1)); a.op(R.saP,s(t,.05,.12)); a.op(R.phL,s(t,.4,.6));
      let n, k=-1, f=0;
      if(manipActive){ n=cuill; } else { const u=9*s(t,.1,.95,true); k=Math.min(8,Math.floor(u)); f=Math.min(1,u-k); n=Math.min(9,k+(f>.75?1:0)); if(t<.1) n=0; if(t>=.95) n=9; }
      lastN=n; CFG.sat(a,n); const act=!manipActive&&t>.1&&t<.95; const mv=document.getElementById("mCv"); if(mv) mv.textContent=n;
      a.op(R.sel,act?1:0); const sw=a.seg(f,0,.28), bk=a.seg(f,.62,.9), rot=-38*a.seg(f,.28,.42)*(1-a.seg(f,.55,.68));
      a.set(R.sel,{transform:`translate(${a.lerp(a.lerp(930,540,sw),930,bk)},${a.lerp(300,350,sw*(1-bk))}) rotate(${rot})`}); a.op(R.heap,f<.42?1:0);
      R.fall.forEach((g,i)=>{ const p=a.clamp((f-.34-i*.025)/.26,0,1); const extra=k>=SAT; const yy=a.lerp(380,extra?770:520,a.ease(p)); a.op(g,act&&p>0&&p<1?(extra?1:1-a.seg(p,.55,1)):0); a.set(g,{x:GX0-50+rnd(i,21)*60,y:yy}); }); } },
  { titre:"Trier les mélanges", duree:11000,
    legende:"Mélange homogène : on ne voit qu'une seule substance (eau sucrée, eau salée, sirop, air). Mélange hétérogène : on voit plusieurs constituants (eau et sable, vinaigrette…).",
    voix:"Récapitulons en triant quelques mélanges. Homogènes : l'eau sucrée, l'eau salée, le sirop dilué, et même l'air que nous respirons. Hétérogènes : l'eau et le sable, l'eau et l'huile, la vinaigrette, le sel et le poivre. Et n'oublie pas : un solide dissous n'a pas disparu !",
    anim(t,a){ const s=a.seg; a.op(R.sa,1-s(t,0,.08)); a.op(R.phL,0); a.op(R.tr,s(t,0,.1)); R.items.forEach(g=>{ const v=s(t,.1+g._i*.07,.18+g._i*.07); const col=g._k?820:50; const j=g._i%4; const tx=col+200+(j%2)*330, ty=210+Math.floor(j/2)*150+(j%2)*70; a.op(g,v); a.tr(g,a.lerp(800,tx,v),a.lerp(-60,ty,v)); }); a.op(R.myth,s(t,.75,.88)); a.cls(R.myth.faux,"pulse",t>.88&&t<1); } },
  ]
});
const GX0=480;
var CFG={ sat(a,n){ const dis=Math.min(n,SAT), extra=Math.max(0,n-SAT); R.sLiq.setAttribute("fill",n?"#D7ECFA":C.water);
  R.grains.forEach((gr,i)=>{ const show=i<extra*6; a.op(gr,show?1:0); a.set(gr,{x:GX0-135+rnd(i,12)*250,y:790-20-Math.floor(i/14)*12-rnd(i,13)*5}); });
  R.sa1.textContent=n===0?"Aucune cuillère de sel":`${n} cuillère${n>1?"s":""} de sel`; R.sa2.textContent=n===0?"De l'eau pure":extra?"Mélange hétérogène : saturé !":"Mélange homogène"; a.set(R.sa2,{fill:extra?C.or:C.bl});
  a.wrap(R.sa3,n===0?"On va ajouter du sel dans 100 mL d'eau.":extra?`L'eau ne peut plus dissoudre de sel : ${extra} cuillère${extra>1?"s":""} reste${extra>1?"nt":""} au fond.`:"Tout le sel est dissous : on ne le voit plus, mais l'eau est salée.",44);
  R.jauge.forEach((r,i)=>{ a.set(r,{fill:i>=n?"#fff":i<SAT?"#BFE3CB":"#F6C9A0",stroke:i>=n?"#9AA3B2":i<SAT?C.gr:C.or}); });
  R.jT.textContent=n===0?"Chaque case = 1 cuillère":`vert : dissous · orange : reste au fond`; } };
})();
