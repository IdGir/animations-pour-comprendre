/* META {"id":"sciences-E4-conservation-de-la-masse","matiere":"sciences","annee":"B","periode":1,"theme":"Les mélanges : conservation de la masse lors d'une dissolution","resume":"On pèse 200 g d'eau puis on ajoute 20 g de sucre : la balance indique 220 g avant comme après la dissolution. Le sucre dissous n'a pas disparu, et la masse du mélange est la somme des masses.","motsCles":["masse","conservation de la masse","balance","dissolution","mélange","sucre","eau"]} */
(function(){
const R={}; let manActive=false, manN=4, manStir=true, curN=4, curStir=true;
const C={water:"#BFE0F7",waterD:"#4A90D9",ink:"#1E2430",or:"#E07A1F",gr:"#2E8B57",bl:"#2563A8",red:"#C0392B"};
const EAU=200, MORC=5;                       // exemple : 200 g d'eau ; 1 morceau de sucre = 5 g
const nb=s=>s.replace(/(\d) g\b/g,"$1\u00a0g");
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
/* balance + verre d'eau + morceaux de sucre (origine = centre du plateau) */
function mkRig(a,parent,tx,ty,sc){ const {el}=a; const g=el("g",{transform:`translate(${tx},${ty}) scale(${sc})`},parent);
  el("rect",{x:-260,y:22,width:520,height:128,rx:20,fill:"#E9EDF2",stroke:"#8C96A6","stroke-width":4},g);
  el("rect",{x:-220,y:0,width:440,height:24,rx:8,fill:"#C9CFD8",stroke:"#8C96A6","stroke-width":3},g);
  el("rect",{x:-170,y:46,width:300,height:78,rx:8,fill:"#1E2A20"},g);
  g.disp=el("text",{x:110,y:106,"text-anchor":"end","font-size":58,"font-weight":800,fill:"#7CFF8A","font-family":"Consolas,monospace"},g);
  g.water=el("rect",{x:-79,y:0,width:158,height:0,fill:C.water},g);
  g.dots=[...Array(60)].map((_,i)=>el("circle",{r:5,fill:"#fff",stroke:C.or,"stroke-width":2},g));
  g.cubes=[...Array(10)].map(()=>el("rect",{x:-19,y:-19,width:38,height:38,rx:4,fill:"#fff",stroke:"#9AA3B2","stroke-width":3},g));
  el("path",{d:"M-90,-240 L-80,0 L80,0 L90,-240",fill:"none",stroke:"#7E9BB3","stroke-width":5,"stroke-linejoin":"round"},g);
  g.stream=el("rect",{x:-6,y:-440,width:12,height:0,fill:C.waterD},g);
  g.spoon=el("g",{},g); el("path",{d:"M0,-330 L0,-62",stroke:"#8C96A6","stroke-width":9,"stroke-linecap":"round"},g.spoon); el("ellipse",{cx:0,cy:-52,rx:16,ry:11,fill:"#8C96A6"},g.spoon);
  g.upd=o=>{ const w=o.w===undefined?1:o.w, dis=o.dis||0, n=o.n||0;
    g.water.setAttribute("y",-190*w); g.water.setAttribute("height",190*w+.01); g.water.setAttribute("fill",dis>.5?"#D7ECFA":C.water);
    const st=o.stream||0; a.op(g.stream,st); g.stream.setAttribute("height",Math.max(0,440-190*w));
    g.cubes.forEach((c,i)=>{ const f=o.fall?o.fall(i):1; const vis=i<n&&f>0&&dis<.98; a.op(c,vis?1:0); const row=Math.floor(i/3), col=i%3; const yr=-19-row*38, xr=(col-1)*40; const fe=a.ease(f);
      const s=1-dis*.96; a.tr(c,xr,a.lerp(-330,yr,fe),s); });
    const cnt=Math.min(60,n*6); g.dots.forEach((d,i)=>{ a.op(d,i<cnt&&dis>0?dis:0); a.set(d,{cx:-68+rnd(i,1)*136+Math.sin((o.ph||0)*30+i)*2,cy:-175+rnd(i,2)*155+Math.cos((o.ph||0)*27+i)*2}); });
    a.op(g.spoon,o.spoon||0); a.tr(g.spoon,Math.sin((o.ph||0)*50)*34,0);
    g.disp.textContent=Math.round(o.read||0)+" g"; a.cls(g.disp,"glow",!!o.glow); };
  return g; }

Anim.run({
  titre:"La masse se conserve : eau et sucre",
  sousTitre:"Sciences et technologie · CM1-CM2 · La matière",
  matiere:"sciences", badge:"Sciences", manipDes:5, manipJusqua:5,
  accroche:"On dissout du sucre dans l'eau : la balance indique-t-elle plus, moins, ou pareil ?",
  init(a){
    const {el}=a;
    /* ---------- scène principale : balance, verre, panneau des masses ---------- */
    const L=a.layer("L"); R.L=L; R.rig=mkRig(a,L,560,690,1);
    R.tare=el("text",{x:560,y:880,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"Tare faite : la balance ne compte pas le verre vide"},L);
    R.pnl=el("g",{},L); el("rect",{x:900,y:80,width:660,height:400,rx:18,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.pnl);
    el("text",{x:930,y:126,"font-size":24,fill:"#4A5468",text:"Masses (valeurs d'exemple)"},R.pnl);
    R.l1=el("text",{x:930,y:228,"font-size":42,"font-weight":800,fill:C.bl},R.pnl);
    R.l2=el("text",{x:930,y:306,"font-size":38,"font-weight":800,fill:C.or},R.pnl);
    R.ln=el("line",{x1:930,y1:336,x2:1530,y2:336,stroke:C.ink,"stroke-width":3},R.pnl);
    R.l3=el("text",{x:930,y:396,"font-size":42,"font-weight":800,fill:C.gr},R.pnl);
    R.nt=el("text",{x:930,y:452,"font-size":26,"font-weight":600,fill:C.ink},R.pnl);
    R.st=el("text",{x:930,y:176,"font-size":26,"font-weight":700,fill:"#4A5468"},R.pnl);
    R.ph1=a.photo(L,{id:"s-e4-balance-cuisine",x:1060,y:565,w:400,h:200,cap:"Une balance de cuisine",rot:-2});
    /* ---------- zoom sur les particules (étape 4) ---------- */
    const Z=a.layer("Z"); R.Z=Z; const zx=1230, zy=290, zr=200;
    el("line",{x1:640,y1:540,x2:zx-zr*.8,y2:zy+zr*.55,stroke:"#9AA3B2","stroke-width":2,"stroke-dasharray":"8 6"},Z);
    el("circle",{cx:zx,cy:zy,r:zr,fill:"#EAF4FB",stroke:"#7E9BB3","stroke-width":5},Z);
    el("clipPath",{id:"zc4"},Z).appendChild(el("circle",{cx:zx,cy:zy,r:zr-4}));
    const zg=el("g",{"clip-path":"url(#zc4)"},Z);
    R.wp=[...Array(70)].map((_,i)=>{ const c=el("circle",{r:10,fill:"#7FB8E6"},zg); c._x=zx-zr+rnd(i,3)*2*zr; c._y=zy-zr+rnd(i,4)*2*zr; return c; });
    R.sp=[...Array(20)].map((_,i)=>{ const c=el("circle",{r:11,fill:"#fff",stroke:C.or,"stroke-width":3},zg); c._cx=zx-50+(i%5)*22; c._cy=zy-40+Math.floor(i/5)*22; c._x=zx-zr*.85+rnd(i,7)*zr*1.7; c._y=zy-zr*.85+rnd(i,8)*zr*1.7; return c; });
    el("circle",{cx:960,cy:545,r:10,fill:"#7FB8E6"},Z); el("text",{x:978,y:553,"font-size":22,fill:C.ink,text:"particule d'eau"},Z);
    el("circle",{cx:1230,cy:545,r:11,fill:"#fff",stroke:C.or,"stroke-width":3},Z); el("text",{x:1248,y:553,"font-size":22,fill:C.ink,text:"particule de sucre"},Z);
    R.bar=el("g",{},Z); const BX=940, BW=600, bw1=BW*EAU/(EAU+20), bw2=BW-bw1;
    R.b1=el("rect",{x:BX,y:610,width:bw1,height:50,rx:6,fill:C.waterD},R.bar); R.b2=el("rect",{x:BX+bw1,y:610,width:bw2,height:50,rx:6,fill:C.or},R.bar);
    el("text",{x:BX+bw1/2,y:644,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#fff",text:"eau : 200 g"},R.bar);
    el("text",{x:BX+BW,y:600,"text-anchor":"end","font-size":24,"font-weight":800,fill:C.or,text:"sucre : 20 g"},R.bar);
    el("text",{x:BX+BW/2,y:716,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.gr,text:"200 g + 20 g = 220 g"},R.bar);
    /* ---------- avant / après (étape 5) ---------- */
    const K=a.layer("K"); R.K=K;
    R.rA=mkRig(a,K,400,560,.85); R.rB=mkRig(a,K,1200,560,.85);
    [[400,"AVANT de remuer","le sucre est au fond",C.or],[1200,"APRÈS avoir remué","le sucre est dissous",C.bl]].forEach(([x,t1,t2,c])=>{ el("text",{x,y:170,"text-anchor":"middle","font-size":38,"font-weight":800,fill:c,text:t1},K); el("text",{x,y:216,"text-anchor":"middle","font-size":28,"font-weight":600,fill:C.ink,text:t2},K); });
    R.eq=el("text",{x:800,y:578,"text-anchor":"middle","font-size":130,"font-weight":800,fill:C.gr,text:"="},K);
    R.kT=el("text",{x:800,y:800,"text-anchor":"middle","font-size":40,"font-weight":800,fill:C.gr,text:"La balance indique la même masse !"},K);
    /* ---------- manipulation ---------- */
    a.manip.innerHTML=`Sucre : <button data-a="moins" aria-label="un morceau de moins">− 1 morceau</button> <b id="mN" style="min-width:36px;text-align:center">4</b> <button data-a="plus" aria-label="un morceau de plus">+ 1 morceau</button> <button data-a="stir" id="mS">Remuer</button> <button data-a="zero">à zéro</button>`;
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ if(!manActive){ manActive=true; manN=curN; manStir=curStir; } const k=b.dataset.a;
      if(k==="plus"&&manN<10){ manN++; manStir=false; } else if(k==="moins"&&manN>0){ manN--; } else if(k==="stir"){ manStir=true; } else if(k==="zero"){ manN=0; manStir=false; }
      a.redraw(); });
    /* ---------- idée fausse ---------- */
    R.myth=a.layer("myth"); R.mc=a.myth(R.myth,900,90,660,nb("Le sucre a disparu : le verre pèse donc moins que 220 g."),nb("Non : le sucre est dissous, il n'a pas disparu. Ses particules sont mélangées à l'eau. La masse du mélange est la somme des masses : 200 g + 20 g = 220 g."));
    /* ---------- synthèse ---------- */
    R.syn=a.layer("syn"); el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},R.syn);
    el("text",{x:800,y:78,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink,text:"À retenir"},R.syn);
    R.pts=[["Quand le sucre se dissout, il ne disparaît pas : il est dispersé dans l'eau.",C.bl],["La masse du mélange est la somme des masses : 200 g d'eau + 20 g de sucre = 220 g, avant comme après.",C.or],["La masse se conserve quand rien n'entre ni ne sort du récipient.",C.gr]].map(([tx,c],i)=>{
      const g=el("g",{},R.syn); const y=140+i*210; el("rect",{x:60,y,width:930,height:170,rx:18,fill:"#fff",stroke:c,"stroke-width":4},g); el("circle",{cx:120,cy:y+85,r:34,fill:c},g); el("text",{x:120,y:y+98,"text-anchor":"middle","font-size":38,"font-weight":800,fill:"#fff",text:i+1},g);
      const t=el("text",{x:180,y:y+62,"font-size":28,"font-weight":600,fill:C.ink},g); a.wrap(t,nb(tx),50,1.2); return g; });
    R.ph2=a.photo(R.syn,{id:"s-e4-sucre-dissolution",x:1060,y:230,w:440,h:300,cap:"Du sucre dans l'eau",rot:2});
  },
  reset(a){ [R.L,R.Z,R.K,R.myth,R.syn,R.ph1,R.ph2].forEach(e=>a.op(e,0)); },
  etapes:[
  { titre:"On pèse l'eau", duree:8000,
    legende:"On verse de l'eau dans un verre posé sur la balance : elle indique 200 g. C'est la masse de l'eau, car on a fait la tare pour ne pas compter le verre.",
    voix:"Posons un verre sur une balance et faisons la tare : la balance ne compte pas le verre. Versons de l'eau. La balance indique deux cents grammes : c'est la masse de l'eau. Prévoyez : si on ajoute vingt grammes de sucre, que va indiquer la balance ?",
    anim(t,a){ const s=a.seg; const w=s(t,.08,.55); pose(a,{w,stream:s(t,.08,.12)*(1-s(t,.52,.58)),read:EAU*w,p1:s(t,.55,.7),ph1:s(t,.65,.85),st:"Avant d'ajouter du sucre"}); } },
  { titre:"On ajoute 20 g de sucre", duree:11000,
    legende:"On laisse tomber 4 morceaux de sucre de 5 g dans l'eau, sans remuer. La balance monte : 205 g, 210 g, 215 g, puis 220 g. Elle compte aussi le sucre.",
    voix:"Laissons tomber quatre morceaux de sucre, de cinq grammes chacun, dans l'eau, sans remuer. À chaque morceau, la balance monte : deux cent cinq, deux cent dix, deux cent quinze, puis deux cent vingt grammes. La balance compte l'eau et le sucre : deux cents plus vingt, cela fait deux cent vingt grammes.",
    anim(t,a){ const s=a.seg; const fall=i=>s(t,.08+i*.17,.28+i*.17); let k=0; for(let i=0;i<4;i++) if(fall(i)>.92) k++; pose(a,{n:4,fall,read:EAU+MORC*k,p1:1,p2:s(t,.2,.35),p3:s(t,.8,.92),l2:"Sucre : 4 morceaux = 20 g",st:"On a ajouté le sucre, sans remuer"}); } },
  { titre:"On remue : le sucre se dissout", duree:12000,
    legende:"On remue : les morceaux se dissolvent et on ne les voit plus. Pourtant la balance affiche toujours 220 g : avant comme après avoir remué, la masse est la même.",
    voix:"Remuons maintenant. Les morceaux de sucre se dissolvent peu à peu, et on ne les voit plus. Mais regardez la balance : elle affiche toujours deux cent vingt grammes. Avant comme après avoir remué, la masse est la même. Le sucre n'a pas disparu.",
    anim(t,a){ const s=a.seg; const dis=s(t,.15,.7); pose(a,{n:4,dis,spoon:t>.08&&t<.78?1:0,ph:t,read:220,glow:t>.8,p1:1,p2:1,p3:1,l2:"Sucre : 4 morceaux = 20 g",note:s(t,.75,.9)?"Avant de remuer : 220 g · Après : 220 g":"",noteA:s(t,.75,.9),st:dis<.05?"Avant de remuer":dis<.95?"On remue…":"Après avoir remué"}); } },
  { titre:"Où est le sucre ? Dans l'eau !", duree:12000,
    legende:"Si on regarde de très près, les particules de sucre se sont dispersées entre celles de l'eau. Elles sont toujours là, avec leur masse : 200 g + 20 g = 220 g.",
    voix:"Regardons de très près, avec un microscope imaginaire. Les particules de sucre se sont détachées et dispersées entre les particules d'eau. Elles sont trop petites pour être vues, mais elles sont toujours là, avec leur masse. L'eau pèse deux cents grammes, le sucre vingt grammes : le mélange pèse deux cent vingt grammes.",
    anim(t,a){ const s=a.seg; pose(a,{n:4,dis:1,read:220,p1:0,zoom:s(t,0,.12),spread:s(t,.12,.6),bar:s(t,.62,.85)}); } },
  { titre:"Avant, après : même masse", duree:10000,
    legende:"On compare les deux balances : avant de remuer, 220 g ; après avoir remué, 220 g. La masse n'a pas changé : la masse se conserve.",
    voix:"Comparons. Avant de remuer, le sucre est au fond du verre : la balance indique deux cent vingt grammes. Après avoir remué, le sucre est dissous : la balance indique encore deux cent vingt grammes. La masse n'a pas changé : on dit que la masse se conserve.",
    anim(t,a){ const s=a.seg; pose(a,{cmp:1,cA:s(t,0,.2),cB:s(t,.3,.5),eq:s(t,.6,.75),kT:s(t,.78,.92)}); } },
  { titre:"À vous : ajoutez du sucre", duree:16000,
    legende:"À vous : ajoutez ou retirez des morceaux de sucre (5 g chacun), remuez ou non, et lisez la balance. Prévoyez la valeur avant de regarder !",
    voix:"À vous de jouer ! Ajoutez des morceaux de sucre, cinq grammes chacun, avec les boutons. Remuez, ou ne remuez pas. Avant de lire la balance, essayez de prévoir ce qu'elle va indiquer. Qu'est-ce qui change quand on remue ? Prenez votre temps.",
    anim(t,a){ const s=a.seg; if(t<.02) manActive=false;
      let n,dis; if(manActive){ n=manN; dis=manStir?1:0; } else { n=t<.1?0:Math.min(4,1+Math.floor((t-.1)/.1)); dis=s(t,.62,.9); }
      const f=manActive?(()=>1):(i=>s(t,.1+i*.1,.2+i*.1)); curN=n; curStir=dis>=.5;
      pose(a,{n,dis,fall:f,read:EAU+MORC*n,spoon:(!manActive&&dis>0&&dis<1)?1:0,ph:t,man:1,p1:1,p2:1,p3:1,glow:false,
        l2:n?`Sucre : ${n} morceau${n>1?"x":""} × 5 g = ${MORC*n} g`:"Pas encore de sucre",l3:`200 g + ${MORC*n} g = ${EAU+MORC*n} g`,st:n?(dis>=.5?"Le sucre est dissous : on ne le voit plus":"Le sucre est au fond du verre"):"Seulement de l'eau"});
      const mn=document.getElementById("mN"); if(mn) mn.textContent=n; } },
  { titre:"Idée fausse : le sucre a disparu ?", duree:11000,
    legende:"Si le sucre avait vraiment disparu, la balance indiquerait moins de 220 g. Or elle indique 220 g : le sucre est toujours là, dissous dans l'eau.",
    voix:"On croit parfois que le sucre disparaît quand il se dissout, et que le verre devient plus léger. C'est faux ! La balance indique toujours deux cent vingt grammes. Le sucre est dissous dans l'eau : il n'a pas disparu, et sa masse non plus.",
    anim(t,a){ const s=a.seg; pose(a,{n:4,dis:1,read:220,glow:false,myth:s(t,.2,.4),p1:0}); a.cls(R.mc.faux,"pulse",t>.5); } },
  { titre:"À retenir", duree:9000,
    legende:"Le sucre dissous n'a pas disparu ; la masse du mélange est la somme des masses (200 g + 20 g = 220 g) ; la masse se conserve si rien n'entre ni ne sort.",
    voix:"À retenir. Un : quand le sucre se dissout, il ne disparaît pas, il est dispersé dans l'eau. Deux : la masse du mélange est la somme des masses, deux cents grammes plus vingt grammes égalent deux cent vingt grammes, avant comme après. Trois : la masse se conserve quand rien n'entre ni ne sort du récipient.",
    anim(t,a){ const s=a.seg; pose(a,{syn:1}); R.pts.forEach((g,i)=>a.op(g,s(t,.1+i*.22,.3+i*.22))); a.op(R.ph2,s(t,.75,.95)); } },
  ]
});
function pose(a,o){ const d=k=>o[k]||0, op=a.op;
  op(R.syn,o.syn?1:0); if(o.syn){ [R.L,R.Z,R.K,R.myth].forEach(e=>op(e,0)); return; } op(R.ph2,0);
  op(R.K,o.cmp?1:0); op(R.L,o.cmp?0:1); op(R.Z,d("zoom")>0?1:0);
  if(o.cmp){ R.rA.upd({n:4,dis:0,read:220,w:1}); R.rB.upd({n:4,dis:1,read:220,w:1}); op(R.rA,d("cA")); op(R.rB,d("cB")); op(R.eq,d("eq")); op(R.kT,d("kT")); return; }
  R.rig.upd(o); op(R.ph1,d("ph1")); op(R.tare,1);
  // panneau
  const pn=d("p1")||d("p2")||d("p3")||o.man; const showPnl=!(o.zoom>0)&&!o.myth&&(o.p1!==undefined&&o.p1>0);
  op(R.pnl,showPnl?1:0); R.l1.textContent="Eau : 200 g"; op(R.l1,d("p1")); R.l2.textContent=o.l2||"Sucre : 4 morceaux = 20 g"; op(R.l2,d("p2")||(o.man?1:0)); R.l3.textContent=o.l3||"Balance : 220 g"; op(R.l3,d("p3")); op(R.ln,d("p3")||(o.man?1:0)); R.st.textContent=o.st||""; op(R.st,o.st?1:0);
  R.nt.textContent=o.note||""; op(R.nt,o.noteA!==undefined?o.noteA:0);
  // zoom
  const z=d("zoom"), sp=d("spread"); op(R.Z,z>0?1:0); if(z>0){ R.wp.forEach((c,i)=>a.set(c,{cx:c._x+Math.sin(sp*25+i)*4,cy:c._y+Math.cos(sp*23+i)*4})); R.sp.forEach((c,i)=>{ const v=a.clamp(sp*1.5-(i/20)*.5,0,1); a.set(c,{cx:a.lerp(c._cx,c._x,a.ease(v))+Math.sin(sp*25+i)*3,cy:a.lerp(c._cy,c._y,a.ease(v))+Math.cos(sp*22+i)*3}); }); op(R.bar,d("bar")); R.b1.setAttribute("opacity",1); }
  // idée fausse
  op(R.myth,d("myth")); if(d("myth")>0){ op(R.pnl,0); }
}
})();
